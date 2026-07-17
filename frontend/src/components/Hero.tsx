import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
          Gyan Jyoti Public School · Est. 1998
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          Where every student's journey is valued — and every fee, effortlessly managed.
        </h1>
        <p className="mt-5 max-w-xl text-white/70">
          A warm, disciplined learning environment for Classes 1 through 5, paired with a
          fee management system that keeps parents, students, and administrators in sync.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link to="/student-login" className="btn-primary">
            Student Portal <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary">
            Administrator Portal
          </Link>
        </div>
      </div>
    </section>
  );
}
