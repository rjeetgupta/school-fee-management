import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}