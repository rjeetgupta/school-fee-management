import { Pencil, Trash2, Banknote } from "lucide-react";
import type { Student } from "@/types/student";
import { StampBadge } from "@/components/StampBadge";
import { useUIStore } from "@/store/useUIStore";

interface LedgerTableProps {
  students: Student[];
  isLoading: boolean;
  page: number;
  limit: number;
}

export function LedgerTable({ students, isLoading, page, limit }: LedgerTableProps) {
  const openEditDrawer = useUIStore((s) => s.openEditDrawer);
  const requestDelete = useUIStore((s) => s.requestDelete);
  const openDepositDialog = useUIStore((s) => s.openDepositDialog);
  const selectDepositStudent = useUIStore((s) => s.selectDepositStudent);

  if (isLoading) {
    return (
      <div className="py-16 text-center font-mono text-sm text-ink-soft">
        Turning the ledger pages…
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-lg text-ink">No entries found.</p>
        <p className="mt-1 font-mono text-xs text-ink-soft">
          Add a student, or adjust your search and class filter.
        </p>
      </div>
    );
  }

  const handleDeposit = (student: Student) => {
    openDepositDialog();
    selectDepositStudent(student);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="ledger-rule text-left font-mono text-xs uppercase tracking-wide text-ink-soft">
            <th className="w-12 py-2 pr-2 font-normal">#</th>
            <th className="py-2 pr-4 font-normal">Adm. No.</th>
            <th className="py-2 pr-4 font-normal">Name</th>
            <th className="py-2 pr-4 font-normal">Class</th>
            <th className="py-2 pr-4 font-normal">Roll</th>
            <th className="py-2 pr-4 font-normal">Address</th>
            <th className="py-2 pr-4 text-right font-normal">Total Fee</th>
            <th className="py-2 pr-4 text-right font-normal">Due</th>
            <th className="py-2 pr-4 font-normal">Status</th>
            <th className="py-2 pr-2 text-right font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            const totalFee =
              student.totalFee ??
              (student.tuitionFee ?? 0) + (student.hostelFee ?? 0) + (student.miscellaneousFee ?? 0);
            const dueFee = student.dueFee ?? totalFee;
            const serial = (page - 1) * limit + index + 1;

            return (
              <tr key={student._id} className="ledger-rule group">
                <td className="py-2.5 pr-2 font-mono text-xs text-ink-soft">
                  {serial}
                </td>
                <td className="py-2.5 pr-4 font-mono tabular-figures">{student.admissionNumber}</td>
                <td className="py-2.5 pr-4">
                  <p className="font-medium">{student.studentName}</p>
                  <p className="text-xs text-ink-soft">{student.fatherName}</p>
                </td>
                <td className="py-2.5 pr-4">{student.class}</td>
                <td className="py-2.5 pr-4 font-mono tabular-figures">{student.rollNumber}</td>
                <td className="py-2.5 pr-4 font-mono tabular-figures">{student.address}</td>
                <td className="py-2.5 pr-4 text-right font-mono tabular-figures">
                  ₹{totalFee.toLocaleString("en-IN")}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono tabular-figures">
                  <span
                    className={
                      dueFee > 0
                        ? "font-semibold text-stamp-due"
                        : "text-stamp-paid"
                    }
                  >
                    ₹{dueFee.toLocaleString("en-IN")}
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  <StampBadge status={student.status} />
                </td>
                <td className="py-2.5 pr-2">
                  <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleDeposit(student)}
                      aria-label={`Deposit fee for ${student.studentName}`}
                      className="rounded-sm p-1.5 text-ink-soft hover:bg-brass/10 hover:text-brass-dark"
                    >
                      <Banknote size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditDrawer(student)}
                      aria-label={`Edit ${student.studentName}`}
                      className="rounded-sm p-1.5 text-ink-soft hover:bg-paper-line/40 hover:text-ink"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDelete(student)}
                      aria-label={`Delete ${student.studentName}`}
                      className="rounded-sm p-1.5 text-ink-soft hover:bg-stamp-due/10 hover:text-stamp-due"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
