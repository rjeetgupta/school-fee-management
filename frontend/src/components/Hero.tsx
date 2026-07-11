import { Link } from "react-router";
import { ArrowRight, ReceiptText, CalendarClock, FileBarChart } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-dark">
        School Management System · Fee Management
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        Retire the paper register. Keep the discipline.
      </h1>
      <p className="mt-5 max-w-xl text-ink-soft">
        Manage student records, collect monthly fees, and track dues without a single
        crossed-out entry — one administrator, one register, always up to date.
      </p>

      <Link
        to="/login"
        className="mt-8 inline-flex items-center gap-2 rounded-sm bg-brass px-5 py-3 text-sm font-medium text-white hover:bg-brass-dark"
      >
        Login as Administrator <ArrowRight size={16} />
      </Link>

      <div className="mt-16 grid gap-6 border-t border-paper-line pt-10 sm:grid-cols-3">
        <div>
          <ReceiptText className="text-brass-dark" size={20} />
          <h3 className="mt-3 font-display text-lg font-semibold">Accurate Dues</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Every due is calculated from fees and payments — never a manually edited figure.
          </p>
        </div>
        <div>
          <CalendarClock className="text-brass-dark" size={20} />
          <h3 className="mt-3 font-display text-lg font-semibold">Full Payment History</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Every deposit is receipted and traceable, with corrections that stay auditable.
          </p>
        </div>
        <div>
          <FileBarChart className="text-brass-dark" size={20} />
          <h3 className="mt-3 font-display text-lg font-semibold">Instant Reports</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Collection and outstanding-fee reports, generated on demand — no register to tally.
          </p>
        </div>
      </div>
    </section>
  );
}
