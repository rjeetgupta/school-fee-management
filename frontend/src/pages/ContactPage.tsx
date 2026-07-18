import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="bg-navy text-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
              Contact Us
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold">We'd love to hear from you</h1>
            <p className="mt-3 max-w-xl text-white/70">
              Questions about admissions, fees, or anything else — reach out and our office
              will get back to you.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="site-card p-6">
              <h2 className="font-display text-lg font-semibold text-navy">
                School Office
              </h2>
              <ul className="mt-4 flex flex-col gap-4 text-sm text-ink-soft">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-gold-dark" />
                  Ratu Road, Ranchi, Jharkhand, 834001
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0 text-gold-dark" />
                  +91 98765 43210
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-gold-dark" />
                  info@greenwoodschool.edu
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-gold-dark" />
                  Mon – Sat, 8:00 AM – 3:00 PM
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="site-card p-6">
              {submitted ? (
                <div className="py-10 text-center">
                  <h2 className="font-display text-xl font-semibold text-navy">
                    Thank you!
                  </h2>
                  <p className="mt-2 text-sm text-ink-soft">
                    Your message has been noted. Our office will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-ink-soft">
                        Your Name
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full rounded-md border border-paper-line px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-ink-soft">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        className="w-full rounded-md border border-paper-line px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink-soft">
                      Subject
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full rounded-md border border-paper-line px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink-soft">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full rounded-md border border-paper-line px-3 py-2 text-sm"
                    />
                  </div>
                  <button type="submit" className="btn-primary self-start">
                    Send Message <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
