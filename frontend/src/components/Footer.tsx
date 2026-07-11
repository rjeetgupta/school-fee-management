export function Footer() {
    return (
      <footer className="border-t border-paper-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono">
            © {new Date().getFullYear()} Fee Register · School Management System
          </span>
          <span className="font-mono uppercase tracking-wide">Module 1 &amp; 2 · Student &amp; Fee Management</span>
        </div>
      </footer>
    );
  }
  