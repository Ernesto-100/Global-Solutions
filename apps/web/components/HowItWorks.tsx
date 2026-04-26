const steps = [
  {
    step: "01",
    title: "Import your QuickBooks data",
    description:
      "Our 1-click QuickBooks import wizard pulls your chart of accounts, transactions, customers, and vendors. Takes under 10 minutes. We validate everything before we touch your live data.",
    callout: "Free migration assistance included on all plans",
    icon: "📥",
  },
  {
    step: "02",
    title: "Verify and go live",
    description:
      "Our onboarding specialist reviews your imported data, reconciles opening balances, and walks you through the dashboard. You don't go live until everything is correct.",
    callout: "Real human checks your data before you start",
    icon: "✅",
  },
  {
    step: "03",
    title: "Run your business, not your bookkeeping",
    description:
      "Send invoices, track expenses, and reconcile your bank in minutes per week. Our AI agent auto-categorizes 90% of transactions and flags anything unusual immediately.",
    callout: "< 30 minutes per week for most businesses",
    icon: "🚀",
  },
  {
    step: "04",
    title: "Grow with confidence",
    description:
      "Cash flow forecasts, P&L trends, and tax-ready reports are always up to date. At any moment you know exactly where your money is — and where it's going.",
    callout: "Tax-ready reports year-round, not just at year-end",
    icon: "📈",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            How it works
          </p>
          <h2 className="mt-3 section-title">
            From QuickBooks to TrueBooks
            <br />
            <span className="gradient-text">in one business day</span>
          </h2>
          <p className="mt-4 section-subtitle max-w-xl mx-auto">
            We've done this migration hundreds of times. Here's exactly what
            happens.
          </p>
        </div>

        <div className="mt-16 relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-brand-100 hidden lg:block lg:left-1/2" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div
                key={step.step}
                className={`relative flex gap-8 lg:gap-16 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center`}
              >
                {/* Content card */}
                <div className="flex-1 card">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{step.icon}</div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
                        Step {step.step}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-50 border border-brand-100 px-3 py-1.5 text-xs font-semibold text-brand-700">
                        {step.callout}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step number (center for desktop) */}
                <div className="hidden lg:flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white text-2xl font-black shadow-lg shadow-brand-600/30 z-10">
                  {i + 1}
                </div>

                {/* Empty space for other side */}
                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
