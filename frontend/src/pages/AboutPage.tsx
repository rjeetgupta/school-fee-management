import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Target, Eye, HeartHandshake } from "lucide-react";

const VALUES = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To provide a nurturing, disciplined environment where every child from Class 1 to Class 5 builds a strong foundation for lifelong learning.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "To be recognized as a school where academic excellence, character, and curiosity grow hand in hand.",
  },
  {
    icon: HeartHandshake,
    title: "Our Values",
    text: "Respect, integrity, and community — for students, teachers, and parents alike, in every interaction on and off campus.",
  },
];

export function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="bg-navy text-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
              About Us
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold">
              Twenty-seven years of shaping confident, curious learners.
            </h1>
            <p className="mt-4 max-w-2xl text-white/70">
              Greenwood Public School has served the Ranchi community since 1998, offering a
              close-knit primary education experience for Classes 1 through 5.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="site-card p-6">
                <value.icon className="text-gold-dark" size={26} />
                <h2 className="mt-4 font-display text-lg font-semibold text-navy">
                  {value.title}
                </h2>
                <p className="mt-2 text-sm text-ink-soft">{value.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-paper-line bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="font-display text-2xl font-bold text-navy">
              A modern administration behind a traditional school
            </h2>
            <p className="mt-4 text-ink-soft">
              Behind our classrooms is a fee management system that keeps every family's
              records accurate and accessible — monthly dues tracked individually, online
              payments processed securely through Razorpay, and a complete history available
              to both students and administrators at any time.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
