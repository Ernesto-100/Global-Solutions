import { CheckCircle2, ArrowRight } from "lucide-react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

const plans = [
  {
    name: "Starter",
    price: 19,
    description: "For freelancers and solo operators just getting started",
    highlight: false,
    features: [
      "Up to 100 transactions/month",
      "Invoicing & expense tracking",
      "Bank reconciliation",
      "P&L and balance sheet reports",
      "QuickBooks data import",
      "Email support (< 4 hr response)",
      "Mobile app",
    ],
    cta: "Start free trial",
    comparison: "vs $55/mo on QuickBooks Simple Start",
  },
  {
    name: "Pro",
    price: 49,
    description: "For growing businesses that need full visibility",
    highlight: true,
    badge: "Most popular",
    features: [
      "Unlimited transactions",
      "Everything in Starter",
      "Cash flow forecasting",
      "Multi-currency support",
      "AI auto-categorization",
      "Live chat support (< 2 min response)",
      "Dedicated onboarding specialist",
      "Tax-ready reports",
      "Receipt capture (OCR)",
      "Up to 3 team members",
    ],
    cta: "Start free trial",
    comparison: "vs $99/mo on QuickBooks Plus",
  },
  {
    name: "Business",
    price: 99,
    description: "For established businesses approaching $1M revenue",
    highlight: false,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Priority 24/7 phone + chat support",
      "Monthly check-in with bookkeeper",
      "Custom report builder",
      "API access",
      "Advanced audit trail",
      "Multi-entity management",
      "Dedicated account manager",
      "SLA: 99.99% uptime guarantee",
    ],
    cta: "Start free trial",
    comparison: "vs $189/mo on QuickBooks Advanced",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Pricing
          </p>
          <h2 className="mt-3 section-title">
            Transparent pricing.
            <br />
            <span className="gradient-text">No surprises. Ever.</span>
          </h2>
          <p className="mt-4 section-subtitle max-w-xl mx-auto">
            We don't raise prices on existing customers. We don't add paywalls
            to features you already use. And we don't do annual-only pricing.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-4 py-1.5 text-sm text-brand-700 font-medium">
            All plans include 14-day free trial · No credit card required
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl p-8 ${
                plan.highlight
                  ? "bg-brand-600 text-white shadow-2xl shadow-brand-600/30 scale-105"
                  : "bg-white border border-slate-100 shadow-sm"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-yellow-400 px-4 py-1 text-xs font-bold text-yellow-900">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3
                  className={`text-lg font-bold ${
                    plan.highlight ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    plan.highlight ? "text-brand-200" : "text-slate-500"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={`text-5xl font-extrabold ${
                      plan.highlight ? "text-white" : "text-slate-900"
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={plan.highlight ? "text-brand-200" : "text-slate-500"}
                  >
                    /mo
                  </span>
                </div>
                <p
                  className={`mt-1 text-xs ${
                    plan.highlight ? "text-brand-300 line-through" : "text-slate-400 line-through"
                  }`}
                >
                  {plan.comparison}
                </p>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className={`h-4 w-4 mt-0.5 shrink-0 ${
                        plan.highlight ? "text-brand-300" : "text-brand-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlight ? "text-brand-100" : "text-slate-700"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={`${APP_URL}/signup?plan=${plan.name.toLowerCase()}`}
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-semibold transition-all ${
                  plan.highlight
                    ? "bg-white text-brand-700 hover:bg-brand-50 shadow-lg"
                    : "bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-600/20"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Guarantee strip */}
        <div className="mt-12 rounded-2xl bg-white border border-slate-100 p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            30-day money-back guarantee. No questions asked.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            If TrueBooks isn't right for your business within 30 days, we'll
            refund you in full and help you export your data.
          </p>
        </div>
      </div>
    </section>
  );
}
