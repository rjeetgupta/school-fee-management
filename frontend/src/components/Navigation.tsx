import { Link } from "react-router";
import { BookText } from "lucide-react";

export function Navigation() {
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <BookText size={22} className="text-brass-dark" />
          <span className="font-display text-lg font-semibold text-ink">
            Fee Register
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-ink"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="rounded-sm bg-brass px-4 py-2 font-mono text-xs uppercase tracking-wide text-white hover:bg-brass-dark"
          >
            Administrator Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
