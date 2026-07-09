import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between border-t border-[color:var(--color-paper-line)] pt-3 font-mono text-xs text-[color:var(--color-ink-soft)]">
      <span>
        Page {page} of {totalPages} · {total} {total === 1 ? "entry" : "entries"}
      </span>
      <div className="flex gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 rounded-sm px-2 py-1 disabled:opacity-30 hover:bg-[color:var(--color-paper-line)]/40 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={14} /> Prev
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 rounded-sm px-2 py-1 disabled:opacity-30 hover:bg-[color:var(--color-paper-line)]/40 disabled:hover:bg-transparent"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
