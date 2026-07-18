import { useUIStore } from "@/store/useUIStore";
import { useStudents } from "@/hooks/useStudents";
import { SearchBar } from "@/components/SearchBar";
import { LedgerTable } from "@/components/LedgerTable";
import { Pagination } from "@/components/Pagination";
import { extractErrorMessage } from "@/lib/api";

export function StudentsManagementPage() {
  const search = useUIStore((s) => s.search);
  const classFilter = useUIStore((s) => s.classFilter);
  const sectionFilter = useUIStore((s) => s.sectionFilter);
  const page = useUIStore((s) => s.page);
  const limit = useUIStore((s) => s.limit);
  const setPage = useUIStore((s) => s.setPage);

  const { data, isLoading, isError, error } = useStudents({
    search: search || undefined,
    class: classFilter || undefined,
    section: sectionFilter || undefined,
    page,
    limit,
  });

  return (
    <div className="site-card p-5">
      <SearchBar />

      <div className="mt-5">
        {isError ? (
          <div className="rounded-sm bg-danger/10 px-4 py-6 text-center text-sm text-danger">
            Couldn't load the register. {extractErrorMessage(error)}
            <br />
            <span className="font-mono text-xs">
              Is the backend running at the configured VITE_API_BASE_URL?
            </span>
          </div>
        ) : (
          <LedgerTable
            students={data?.items ?? []}
            isLoading={isLoading}
            page={data?.page ?? page}
            limit={data?.limit ?? limit}
          />
        )}
      </div>

      {data && (
        <div className="mt-4">
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
