import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-gold">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-14 text-center">
        <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
          Ready to check your fee status?
        </h2>
        <p className="max-w-md text-sm text-navy/80">
          Log in with your Student ID and Date of Birth to view your dues and pay online in
          under a minute.
        </p>
        <Link
          to="/student-login"
          className="inline-flex items-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-soft"
        >
          Go to Student Portal <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
