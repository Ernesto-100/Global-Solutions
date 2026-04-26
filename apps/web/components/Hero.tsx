import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  ShieldCheck,
  Zap,
  HeadphonesIcon,
} from "lucide-react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

const trustSignals = [
  "No credit card required",
  "14-day free trial",
  "Cancel anytime",
];

const quickWins = [
  { icon: ShieldCheck, text: "Bank-grade data reliability" },
  { icon: Zap, text: "Instant, snappy interface" },
  { icon: HeadphonesIcon, text: "Real humans on support" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-24 pb-16 sm:pt-32 sm:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-[500px] w-[500px] rounded-full bg-brand-100 opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-[400px] w-[400px] rounded-full bg-brand-50 opacity-60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Pill badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            <Star className="h-3.5 w-3.5 fill-brand-500 text-brand-500" />
            Rated #1 QuickBooks alternative by small business owners
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Switch from QuickBooks{" "}
            <span className="gradient-text">in one day.</span>
            <br />
            Never worry about your
            <br />
            books again.
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600 leading-relaxed">
            TrueBooks is the fast, reliable bookkeeping tool built for small
            businesses under $1M revenue. Invoicing, expenses, reconciliation,
            and cash flow — done right, with real human support when you need it.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`${APP_URL}/signup`}
              className="btn-primary text-base py-3.5 px-8"
            >
              Start free — 14 days
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#how-it-works" className="btn-secondary text-base py-3.5 px-8">
              See how it works
            </a>
          </div>

          {/* Trust signals */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {trustSignals.map((signal) => (
              <span
                key={signal}
                className="flex items-center gap-1.5 text-sm text-slate-500"
              >
                <CheckCircle2 className="h-4 w-4 text-brand-500" />
                {signal}
              </span>
            ))}
          </div>

          {/* Quick wins */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {quickWins.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center justify-center gap-3 rounded-2xl bg-white border border-slate-100 px-6 py-4 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Social proof numbers */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-slate-100 pt-10">
            {[
              { stat: "2,400+", label: "businesses switched" },
              { stat: "99.97%", label: "uptime guaranteed" },
              { stat: "< 2 min", label: "avg support response" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-slate-900">{stat}</div>
                <div className="mt-1 text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
