import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Features } from "@/components/Features";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
