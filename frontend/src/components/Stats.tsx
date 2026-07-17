const STATS = [
  { value: "500+", label: "Students Enrolled" },
  { value: "25+", label: "Dedicated Teachers" },
  { value: "5", label: "Grade Levels" },
  { value: "27", label: "Years of Excellence" },
];

export function Stats() {
  return (
    <section className="border-b border-paper-line bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-3xl font-bold text-navy">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
