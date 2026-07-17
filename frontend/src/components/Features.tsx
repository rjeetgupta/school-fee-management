import { ReceiptText, CalendarClock, ShieldCheck, Smartphone } from "lucide-react";

const FEATURES = [
  {
    icon: Smartphone,
    title: "Pay Fees Online, Anytime",
    description:
      "Students pay securely via UPI, debit card, credit card, or net banking through Razorpay — no campus visit required.",
  },
  {
    icon: CalendarClock,
    title: "Month-by-Month Clarity",
    description:
      "Fees are tracked one month at a time. Miss a month, and it simply carries forward — nothing is ever lost or overlooked.",
  },
  {
    icon: ReceiptText,
    title: "Complete Payment History",
    description:
      "Every deposit — online or in-person — is receipted and visible in your account, whenever you need to look back.",
  },
  {
    icon: ShieldCheck,
    title: "Secure, Role-Based Access",
    description:
      "Students see only their own records. Administrators manage the full student register and fee collection.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-dark">
          Fee Management, Simplified
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold text-navy">
          Built for students, parents, and administrators alike
        </h2>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="site-card fade-up p-6">
            <feature.icon className="text-gold-dark" size={26} />
            <h3 className="mt-4 font-display text-lg font-semibold text-navy">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
