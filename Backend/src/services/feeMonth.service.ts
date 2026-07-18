import { feeMonthRepository } from "@repositories/feeMonth.repository";
import { studentRepository } from "@repositories/student.repository";
import { ApiError } from "@utils/ApiError";
import { getMonthKey, getNextMonthKey } from "@utils/month";
import { FeeMonthDocument } from "@models/feeMonth.model";
import { FeeMonthStatus, FeeMonthSummary, ApplyPaymentResult } from "@app-types/feeMonth.types";

// Hard cap on how many months a single backfill call will generate, so a
// corrupted/very old createdAt date can never cause a runaway loop.
const MAX_BACKFILL_MONTHS = 240; // 20 years

class FeeMonthService {
  /**
   * Idempotently ensures a fee record exists for `month` (defaults to the
   * current month). Safe to call repeatedly — e.g. once per login, or via a
   * scheduled job — it will never create a duplicate for the same month
   * because of the unique (student, month) index as a backstop.
   *
   * Design note (carry-forward): each month keeps its OWN record and its own
   * remaining due; nothing is merged into the new month's `monthlyAmount`.
   * "Carrying forward" is realized at payment time — applyPayment() always
   * settles the OLDEST unpaid month first (FIFO) — and at read time —
   * getFeeSummary() sums every unpaid month regardless of how old it is.
   * This keeps every month individually auditable, per Business Rule 8
   * (reports are based on payment/month records, not a collapsed total).
   */
  async generateMonthlyFee(studentId: string, month: string = getMonthKey()): Promise<FeeMonthDocument> {
    const existing = await feeMonthRepository.findByStudentAndMonth(studentId, month);
    if (existing) {
      return existing;
    }

    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw ApiError.notFound("Student not found");
    }

    const monthlyAmount =
      (student.tuitionFee ?? 0) + (student.hostelFee ?? 0) + (student.miscellaneousFee ?? 0);

    try {
      return await feeMonthRepository.create({
        student: student._id,
        month,
        monthlyAmount,
        amountPaid: 0,
        status: FeeMonthStatus.PENDING,
      });
    } catch (error) {
      // Race: two callers generated the same month at once — the unique
      // index rejects the second insert. Fetch and return the winner.
      const winner = await feeMonthRepository.findByStudentAndMonth(studentId, month);
      if (winner) return winner;
      throw error;
    }
  }

  /**
   * Backfills every missing month from the student's admission date up to
   * and including the current month, then generates the current month if
   * it's still missing. This is what actually makes dues appear: without
   * calling this, no FeeMonth record is ever created and every read (due,
   * summary, history) looks empty. Called at the top of every read/write
   * entry point below so the ledger is always self-healing regardless of
   * whether a cron job or manual "generate" call has run.
   */
  private async ensureFeeMonthsUpToDate(studentId: string): Promise<void> {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw ApiError.notFound("Student not found");
    }

    const startMonth = getMonthKey(student.createdAt ?? new Date());
    const currentMonth = getMonthKey();

    let cursor = startMonth;
    let iterations = 0;

    while (iterations < MAX_BACKFILL_MONTHS) {
      // eslint-disable-next-line no-await-in-loop
      await this.generateMonthlyFee(studentId, cursor);

      if (cursor === currentMonth) break;
      cursor = getNextMonthKey(cursor);
      iterations += 1;
    }
  }

  async getFeeHistory(studentId: string): Promise<FeeMonthDocument[]> {
    await this.ensureFeeMonthsUpToDate(studentId);
    return feeMonthRepository.findAllByStudent(studentId);
  }

  /**
   * Everything a student/admin needs to see outstanding dues "at any time in
   * the future" (per the requirement): every unpaid or partially-paid month,
   * oldest first, plus the total.
   */
  async getFeeSummary(studentId: string): Promise<FeeMonthSummary> {
    await this.ensureFeeMonthsUpToDate(studentId);

    const pending = await feeMonthRepository.findPendingByStudent(studentId);

    const pendingMonths = pending.map((fm) => ({
      month: fm.month,
      monthlyAmount: fm.monthlyAmount,
      amountPaid: fm.amountPaid,
      due: fm.monthlyAmount - fm.amountPaid,
      status: fm.status,
    }));

    const totalDue = pendingMonths.reduce((sum, m) => sum + m.due, 0);

    return {
      student: studentId,
      totalDue,
      pendingMonthsCount: pendingMonths.length,
      pendingMonths,
    };
  }

  async getTotalDue(studentId: string): Promise<number> {
    await this.ensureFeeMonthsUpToDate(studentId);
    return feeMonthRepository.sumOutstandingByStudent(studentId);
  }

  /**
   * Applies a payment amount across the student's pending months, oldest
   * first (FIFO) — this IS the carry-forward mechanism: if a student pays
   * less than one month's fee, that month stays Partial/Pending and the next
   * payment continues settling it before touching newer months.
   *
   * Rejects (Business Rule 3) if amount exceeds total outstanding due —
   * advance payments are a future release, not handled here.
   */
  async applyPayment(studentId: string, amount: number): Promise<ApplyPaymentResult> {
    if (amount <= 0) {
      throw ApiError.badRequest("Amount must be greater than 0");
    }

    await this.ensureFeeMonthsUpToDate(studentId);

    const pendingMonths = await feeMonthRepository.findPendingByStudent(studentId);
    const totalDue = pendingMonths.reduce((sum, fm) => sum + (fm.monthlyAmount - fm.amountPaid), 0);

    if (amount > totalDue) {
      throw ApiError.badRequest(
        `Amount exceeds total outstanding due. Outstanding due is ${totalDue}.`
      );
    }

    let remaining = amount;
    const monthsUpdated: ApplyPaymentResult["monthsUpdated"] = [];

    for (const feeMonth of pendingMonths) {
      if (remaining <= 0) break;

      const dueForMonth = feeMonth.monthlyAmount - feeMonth.amountPaid;
      const amountApplied = Math.min(remaining, dueForMonth);
      const newAmountPaid = feeMonth.amountPaid + amountApplied;
      const newStatus =
        newAmountPaid >= feeMonth.monthlyAmount ? FeeMonthStatus.PAID : FeeMonthStatus.PARTIAL;

      await feeMonthRepository.updateById(feeMonth._id.toString(), {
        amountPaid: newAmountPaid,
        status: newStatus,
      });

      monthsUpdated.push({
        month: feeMonth.month,
        amountApplied,
        amountPaid: newAmountPaid,
        monthlyAmount: feeMonth.monthlyAmount,
        status: newStatus,
      });

      remaining -= amountApplied;
    }

    return {
      monthsUpdated,
      totalApplied: amount - remaining,
      remainingDue: totalDue - amount,
    };
  }

  /**
   * Reverses a payment's effect across months — oldest-affected-first undo,
   * mirroring applyPayment's FIFO order in reverse (newest paid month is
   * unwound first). Used when a payment is edited/deleted upstream so the
   * ledger can be reapplied cleanly (see payment.service.ts in a later pass).
   */
  async reversePayment(studentId: string, amount: number): Promise<void> {
    if (amount <= 0) return;

    const paidMonths = await feeMonthRepository.findAllByStudent(studentId);
    const affected = paidMonths
      .filter((fm) => fm.amountPaid > 0)
      .sort((a, b) => b.month.localeCompare(a.month)); // newest first

    let remaining = amount;

    for (const feeMonth of affected) {
      if (remaining <= 0) break;

      const reduceBy = Math.min(remaining, feeMonth.amountPaid);
      const newAmountPaid = feeMonth.amountPaid - reduceBy;
      const newStatus =
        newAmountPaid <= 0
          ? FeeMonthStatus.PENDING
          : newAmountPaid < feeMonth.monthlyAmount
            ? FeeMonthStatus.PARTIAL
            : FeeMonthStatus.PAID;

      await feeMonthRepository.updateById(feeMonth._id.toString(), {
        amountPaid: newAmountPaid,
        status: newStatus,
      });

      remaining -= reduceBy;
    }
  }
}

export const feeMonthService = new FeeMonthService();
