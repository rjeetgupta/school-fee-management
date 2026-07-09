import { useUIStore } from "@/store/useUIStore";
import { useDeleteStudent } from "@/hooks/useStudents";
import { extractErrorMessage } from "@/lib/api";

export function DeleteConfirmDialog() {
  const studentPendingDelete = useUIStore((s) => s.studentPendingDelete);
  const cancelDelete = useUIStore((s) => s.cancelDelete);
  const deleteStudent = useDeleteStudent();

  if (!studentPendingDelete) return null;

  const handleConfirm = () => {
    deleteStudent.mutate(studentPendingDelete._id, {
      onSuccess: () => cancelDelete(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        aria-label="Close"
        onClick={cancelDelete}
        className="absolute inset-0 bg-[color:var(--color-ink)]/30"
      />
      <div className="relative w-full max-w-sm rounded-sm border border-[color:var(--color-paper-line)] bg-[color:var(--color-paper)] p-6 shadow-xl">
        <p className="font-mono text-xs uppercase tracking-wide text-[color:var(--color-stamp-due)]">
          Remove Entry
        </p>
        <h2 className="mt-1 font-display text-lg font-semibold">
          Delete {studentPendingDelete.studentName}?
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">
          This removes admission no. {studentPendingDelete.admissionNumber} from the register.
          This cannot be undone.
        </p>

        {deleteStudent.isError && (
          <p className="mt-3 rounded-sm bg-[color:var(--color-stamp-due)]/10 px-3 py-2 text-sm text-[color:var(--color-stamp-due)]">
            {extractErrorMessage(deleteStudent.error)}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleteStudent.isPending}
            className="flex-1 rounded-sm bg-[color:var(--color-stamp-due)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {deleteStudent.isPending ? "Deleting…" : "Delete"}
          </button>
          <button
            type="button"
            onClick={cancelDelete}
            className="rounded-sm border border-[color:var(--color-paper-line)] px-4 py-2 text-sm text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper-line)]/30"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
