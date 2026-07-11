import { Link } from "react-router";
import { BookText } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export function Navigation() {
  const user = useAuthStore((user) => user.isAuthenticated);
  const clearAuth = useAuthStore((user) => user.clearAuth)

  const handleLogout = () => {
    console.log("Logout clicked")
    clearAuth()
  }
  console.log(user);
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <BookText
            size={22}
            className="text-brass-dark"
          />
          <span className="font-display text-lg font-semibold text-ink">
            Fee Register Management
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-ink"
          >
            Home
          </Link>
          {user ? (
            <Link to="/dashboard"
              className="rounded-sm bg-brass px-4 py-2 font-mono text-xs uppercase tracking-wide text-white hover:bg-brass-dark"
            >Dashboard</Link>
          ) : (
            <Link
              to="/login"
              className="rounded-sm bg-brass px-4 py-2 font-mono text-xs uppercase tracking-wide text-white hover:bg-brass-dark"
            >
              Administrator Login
            </Link>
          )}
          {
            user && <Link to="/"
              onClick={handleLogout}
              className="text-neutral-100 rounded-md bg-red-600 px-4 py-1.5"
            >
              Logout
            </Link>
          }
        </nav>
      </div>
    </header>
  );
}
