import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Search, Banknote, Pencil } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useStudentSearch } from "@/hooks/useStudents";
import { useDepositFee, useUpdateDeposit, usePaymentsByStudent } from "@/hooks/usePayments";
import { useAdminFeeSummary } from "@/hooks/useFeeMonths";
import {
  depositFormSchema,
  depositFormDefaults,
} from "@/validations/payment.schema";
import type { DepositFormValues } from "@/validations/payment.schema";
import { PAYMENT_MODES } from "@/types/payment";
import { extractErrorMessage } from "@/lib/api";

export function FeeDepositDialog() {
  const isOpen = useUIStore((s) => s.isDepositDialogOpen);
  const depositTargetStudent = useUIStore((s) => s.depositTargetStudent);
  const paymentBeingEdited = useUIStore((s) => s.paymentBeingEdited);
  const selectDepositStudent = useUIStore((s) => s.selectDepositStudent);
  const clearDepositStudent = useUIStore((s) => s.clearDepositStudent);
  const startEditDeposit = useUIStore((s) => s.startEditDeposit);
  const cancelEditDeposit = useUIStore((s) => s.cancelEditDeposit);
  const closeDepositDialog = useUIStore((s) => s.closeDepositDialog);

  const [searchInput, setSearchInput] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const searchResult = useStudentSearch(searchInput, searchTriggered);
  const paymentHistory = usePaymentsByStudent(depositTargetStudent?._id ?? null);
  const feeSummary = useAdminFeeSummary(depositTargetStudent?._id ?? null);

  const depositFee = useDepositFee();
  const updateDeposit = useUpdateDeposit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema) as never,
    defaultValues: depositFormDefaults,
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setSearchInput("");
    setSearchTriggered(false);
    reset(depositFormDefaults);
    closeDepositDialog();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTriggered(true);
  };

  const handlePickStudent = (student: NonNullable<typeof searchResult.data>["items"][number]) => {
    selectDepositStudent(student);
  };

  const beginEditDeposit = (paymentId: string, currentAmount: number, currentMode: string, currentRemarks?: string) => {
    startEditDeposit(paymentId);
    reset({
      amount: currentAmount,
      paymentMode: currentMode as DepositFormValues["paymentMode"],
      remarks: currentRemarks ?? "",
    });
  };

  const onDepositSubmit = (values: DepositFormValues) => {
    if (!depositTargetStudent) return;

    if (paymentBeingEdited) {
      updateDeposit.mutate(
        { paymentId: paymentBeingEdited, values },
        {
          onSuccess: () => {
            cancelEditDeposit();
            reset(depositFormDefaults);
          },
        }
      );
    } else {
      depositFee.mutate(
        { studentId: depositTargetStudent._id, values },
        {
          onSuccess: () => {
            reset(depositFormDefaults);
          },
        }
      );
    }
  };

  const isSubmitting = depositFee.isPending || updateDeposit.isPending;
  const mutationError = depositFee.error ?? updateDeposit.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        aria-label="Close"
        onClick={handleClose}
        className="absolute inset-0 bg-[color:var(--color-ink)]/30"
      />
      <div className="drawer-enter relative flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-sm border border-[color:var(--color-paper-line)] bg-[color:var(--color-paper)] p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-[color:var(--color-gold-dark)]">
              Fee Collection
            </p>
            <h2 className="font-display text-xl font-semibold">Deposit Fee</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="rounded-sm p-1 text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper-line)]/40"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step 1: find the student */}
        {!depositTargetStudent && (
          <>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setSearchTriggered(false);
                }}
                placeholder="Admission no., name, or mobile number"
                className="w-full rounded-sm border border-[color:var(--color-paper-line)] bg-white px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-sm bg-[color:var(--color-gold)] px-3.5 py-2 text-sm font-medium text-white hover:bg-[color:var(--color-gold-dark)]"
              >
                <Search size={15} /> Find
              </button>
            </form>

            <div className="mt-4">
              {searchTriggered && searchResult.isLoading && (
                <p className="font-mono text-xs text-[color:var(--color-ink-soft)]">Searching…</p>
              )}

              {searchTriggered && searchResult.isError && (
                <p className="text-sm text-[color:var(--color-danger)]">
                  {extractErrorMessage(searchResult.error)}
                </p>
              )}

              {searchTriggered &&
                searchResult.data &&
                searchResult.data.items.length === 0 && (
                  <p className="font-mono text-xs text-[color:var(--color-ink-soft)]">
                    No matching student found.
                  </p>
                )}

              {searchTriggered && searchResult.data && searchResult.data.items.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {searchResult.data.items.map((student) => (
                    <li key={student._id}>
                      <button
                        type="button"
                        onClick={() => handlePickStudent(student)}
                        className="flex w-full items-center justify-between rounded-sm border border-[color:var(--color-paper-line)] bg-white px-3 py-2 text-left text-sm hover:border-[color:var(--color-gold)]"
                      >
                        <span>
                          <span className="font-medium">{student.studentName}</span>{" "}
                          <span className="font-mono text-xs text-[color:var(--color-ink-soft)]">
                            ({student.admissionNumber}) · Class {student.class}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* Step 2: student found — show details, due, deposit form, and history */}
        {depositTargetStudent && (
          <div className="flex flex-col gap-4">
            <div className="rounded-sm border border-[color:var(--color-paper-line)] bg-white/60 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{depositTargetStudent.studentName}</p>
                  <p className="font-mono text-xs text-[color:var(--color-ink-soft)]">
                    {depositTargetStudent.admissionNumber} · Class {depositTargetStudent.class}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearDepositStudent}
                  className="font-mono text-xs text-[color:var(--color-gold-dark)] underline"
                >
                  Change
                </button>
              </div>
              <div className="mt-2 flex justify-between font-mono text-sm tabular-figures">
                <span className="text-[color:var(--color-ink-soft)]">
                  Total Fee ₹{(depositTargetStudent.totalFee ?? 0).toLocaleString("en-IN")}
                </span>
                <span className="font-semibold text-[color:var(--color-danger)]">
                  {feeSummary.isLoading
                    ? "Loading due…"
                    : `Due ₹${(feeSummary.data?.totalDue ?? 0).toLocaleString("en-IN")}`}
                </span>
              </div>
              {feeSummary.data && feeSummary.data.pendingMonthsCount > 0 && (
                <p className="mt-1 text-right font-mono text-xs text-[color:var(--color-ink-soft)]">
                  {feeSummary.data.pendingMonthsCount} month(s) pending
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit(onDepositSubmit)} className="flex flex-col gap-3">
              <p className="font-mono text-xs uppercase tracking-wide text-[color:var(--color-ink-soft)]">
                {paymentBeingEdited ? "Correct Deposit Amount" : "Deposit Amount"}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <label className="mb-1 block font-mono text-xs text-[color:var(--color-ink-soft)]">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("amount")}
                    className="w-full rounded-sm border border-[color:var(--color-paper-line)] bg-white px-3 py-2 text-sm"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-xs text-[color:var(--color-danger)]">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="mb-1 block font-mono text-xs text-[color:var(--color-ink-soft)]">
                    Mode *
                  </label>
                  <select
                    {...register("paymentMode")}
                    className="w-full rounded-sm border border-[color:var(--color-paper-line)] bg-white px-3 py-2 text-sm"
                  >
                    {PAYMENT_MODES.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-mono text-xs text-[color:var(--color-ink-soft)]">
                  Remarks
                </label>
                <input
                  type="text"
                  {...register("remarks")}
                  placeholder="Optional"
                  className="w-full rounded-sm border border-[color:var(--color-paper-line)] bg-white px-3 py-2 text-sm"
                />
              </div>

              {mutationError && (
                <p className="rounded-sm bg-[color:var(--color-danger)]/10 px-3 py-2 text-sm text-[color:var(--color-danger)]">
                  {extractErrorMessage(mutationError)}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-[color:var(--color-gold)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--color-gold-dark)] disabled:opacity-50"
                >
                  <Banknote size={15} />
                  {isSubmitting
                    ? "Saving…"
                    : paymentBeingEdited
                      ? "Save Correction"
                      : "Deposit Fee"}
                </button>
                {paymentBeingEdited && (
                  <button
                    type="button"
                    onClick={() => {
                      cancelEditDeposit();
                      reset(depositFormDefaults);
                    }}
                    className="rounded-sm border border-[color:var(--color-paper-line)] px-4 py-2 text-sm text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper-line)]/30"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Payment history with per-row "Update Deposit" to correct a wrong entry */}
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-[color:var(--color-ink-soft)]">
                Payment History
              </p>
              {paymentHistory.isLoading && (
                <p className="font-mono text-xs text-[color:var(--color-ink-soft)]">Loading…</p>
              )}
              {paymentHistory.data && paymentHistory.data.length === 0 && (
                <p className="font-mono text-xs text-[color:var(--color-ink-soft)]">
                  No deposits yet.
                </p>
              )}
              {paymentHistory.data && paymentHistory.data.length > 0 && (
                <ul className="flex flex-col gap-1.5">
                  {paymentHistory.data.map((p) => (
                    <li
                      key={p._id}
                      className="ledger-rule flex items-center justify-between py-1.5 text-sm"
                    >
                      <span className="font-mono text-xs text-[color:var(--color-ink-soft)]">
                        {p.receiptNumber} · {new Date(p.paymentDate).toLocaleDateString("en-IN")} ·{" "}
                        {p.paymentMode ?? p.status} · {p.channel}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="font-mono tabular-figures">
                          ₹{p.amount.toLocaleString("en-IN")}
                        </span>
                        {p.status === "Success" && (
                          <button
                            type="button"
                            onClick={() =>
                              beginEditDeposit(p._id, p.amount, p.paymentMode ?? "Cash", p.remarks)
                            }
                            aria-label={`Update deposit ${p.receiptNumber}`}
                            className="rounded-sm p-1 text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper-line)]/40 hover:text-[color:var(--color-ink)]"
                          >
                            <Pencil size={13} />
                          </button>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
