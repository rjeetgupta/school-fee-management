import { useUIStore } from "@/store/useUIStore";

export function SearchBar() {
  const search = useUIStore((s) => s.search);
  const classFilter = useUIStore((s) => s.classFilter);
  const sectionFilter = useUIStore((s) => s.sectionFilter);
  const setSearch = useUIStore((s) => s.setSearch);
  const setClassFilter = useUIStore((s) => s.setClassFilter);
  const setSectionFilter = useUIStore((s) => s.setSectionFilter);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search admission no., name, email, mobile…"
          className="w-full rounded-sm border border-paper-line bg-white/60 px-3 py-2 text-sm text-ink placeholder:text-ink-soft focus:bg-white"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="class-filter" className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Class
          </label>
          <input
            id="class-filter"
            type="text"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            placeholder="All"
            className="w-16 rounded-sm border border-paper-line bg-white/60 px-2 py-2 text-sm focus:bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="section-filter" className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Section
          </label>
          <input
            id="section-filter"
            type="text"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            placeholder="All"
            className="w-16 rounded-sm border border-paper-line bg-white/60 px-2 py-2 text-sm focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
}
