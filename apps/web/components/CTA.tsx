import { ArrowRight, CheckCircle2 } from "lucide-react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

export default function CTA() {
  return (
    <section className="py-24 bg-brand-600">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
          Your books should give you peace of mind,
          <br />
          not a headache.
        </h2>
        <p className="mt-6 text-xl text-brand-100 leading-relaxed max-w-2xl mx-auto">
          Join 2,400+ small business owners who switched from QuickBooks, Wave,
          and Xero — and never looked back. 14-day free trial, no credit card.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`${APP_URL}/signup`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-lg hover:bg-brand-50 transition-colors"
          >
            Start your free 14-day trial
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="mailto:hello@truebooks.io"
            className="inline-flex items-center gap-2 text-base font-medium text-brand-200 hover:text-white transition-colors"
          >
            Talk to a human first
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            "14-day free trial",
            "Free migration from QuickBooks",
            "Real human support from day one",
            "Cancel anytime — no lock-in",
          ].map((point) => (
            <span
              key={point}
              className="flex items-center gap-2 text-sm text-brand-200"
            >
              <CheckCircle2 className="h-4 w-4 text-brand-300" />
              {point}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
