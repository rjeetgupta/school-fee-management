import { useState } from "react";
import { Link, useLocation } from "react-router";
import { GraduationCap, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-paper-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <GraduationCap size={26} className="text-navy" />
          <span className="font-display text-lg font-semibold text-navy">
            Gyan Jyoti Public School
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={
                "text-sm font-medium transition-colors " +
                (location.pathname === link.to
                  ? "text-navy"
                  : "text-ink-soft hover:text-navy")
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/student-login"
            className="rounded-md border border-navy px-4 py-2 text-sm font-semibold text-navy hover:bg-navy/5"
          >
            Student Login
          </Link>
          <Link to="/login" className="btn-primary text-sm px-4! py-2!">
            Admin Login
          </Link>
        </div>

        <button
          type="button"
          className="p-2 text-navy md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-paper-line bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-ink-soft"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/student-login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-md border border-navy px-4 py-2 text-center text-sm font-semibold text-navy"
            >
              Student Login
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="btn-primary text-sm"
            >
              Admin Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
