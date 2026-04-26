import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TrueBooks — Our mission",
  description: "We built TrueBooks because small business owners deserve bookkeeping software that actually works.",
};

const values = [
  {
    title: "Reliability above all",
    description:
      "We built TrueBooks after watching hundreds of small business owners lose sleep over broken reconciliations, data discrepancies, and books they couldn't trust. We obsess over data integrity. Every transaction is validated. Every balance is checked. Your books will always be right.",
    icon: "🛡️",
  },
  {
    title: "Support is a feature, not an afterthought",
    description:
      "The #1 complaint about QuickBooks, Wave, and Xero isn't price — it's that support vanishes when something breaks. We made real human support a core product feature. Our bookkeeping experts are in your chat within 2 minutes.",
    icon: "💬",
  },
  {
    title: "Honest pricing, always",
    description:
      "QuickBooks raised prices 40% in two years. We don't do that. Your price is locked when you sign up. We've never raised prices on existing customers and we never will. When we add features, you get them at your current rate.",
    icon: "💚",
  },
  {
    title: "Built for small businesses, period",
    description:
      "QuickBooks is built for large enterprises and CPAs. TrueBooks is built for the $0–$1M business owner who needs clean books, clear reports, and a tool they can trust — not 200 features they'll never use.",
    icon: "🎯",
  },
];

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-24">
        {/* Hero */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-slate-900">
            We built TrueBooks because
            <br />
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              small businesses deserve better.
            </span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            After reading thousands of Reddit posts, G2 reviews, and support
            tickets, the problem was clear: small business owners are paying
            more every year for tools that still don't fully work — and getting
            zero support when something breaks.
          </p>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            TrueBooks is our answer. Reliable. Fast. Supported by real humans.
            Priced fairly. Always.
          </p>
        </div>

        {/* Values */}
        <div className="mt-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
              >
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-slate-900">{v.title}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mt-20 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            The TrueBooks team
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            We're a team of engineers, accountants, and small business owners
            who got fed up with the status quo. We believe the best bookkeeping
            tool isn't the one with the most features — it's the one you can
            trust to always be right.
          </p>
          <p className="mt-4 text-slate-600">
            Questions?{" "}
            <a
              href="mailto:hello@truebooks.io"
              className="text-brand-600 underline"
            >
              hello@truebooks.io
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
