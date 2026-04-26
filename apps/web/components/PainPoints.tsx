const complaints = [
  {
    quote:
      "QuickBooks raised prices AGAIN. I'm paying $189/mo now for a tool that still crashes when I reconcile.",
    source: "r/QuickBooks",
    avatar: "SB",
    color: "bg-red-100 text-red-700",
  },
  {
    quote:
      "Wave withdrew $4,000 from my bank account without permission. Their support never responded.",
    source: "r/waveapps",
    avatar: "JM",
    color: "bg-orange-100 text-orange-700",
  },
  {
    quote:
      "Xero is way too expensive. I run a solo practice and the whole package is laughably overpriced.",
    source: "r/smallbusiness",
    avatar: "TK",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    quote:
      "I wish I had never used Wave. 2-year review: abysmal support, security concerns, bugs that never get fixed.",
    source: "r/waveapps",
    avatar: "RL",
    color: "bg-red-100 text-red-700",
  },
];

const realProblems = [
  {
    title: "You're paying more every year for a tool that still doesn't work",
    description:
      "QuickBooks raised prices 40% in two years while adding zero new functionality. Xero plans go up quarterly. You're locked in because switching feels terrifying.",
    icon: "💸",
  },
  {
    title: "When something breaks, you're on your own",
    description:
      "Support tickets that take 5 business days. Chatbots that loop you in circles. No human, no phone, no answers — while your books are broken and tax season approaches.",
    icon: "🆘",
  },
  {
    title: "The data integrity terror",
    description:
      "Reconciliation that doesn't balance. Transactions that duplicate. Reports that show different numbers than your bank. You don't trust your own books anymore.",
    icon: "🔥",
  },
];

export default function PainPoints() {
  return (
    <section className="py-20 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
            The real problem
          </p>
          <h2 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            It's not just the price.
            <br />
            <span className="text-brand-400">It's the broken trust.</span>
          </h2>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
            Thousands of small business owners on Reddit, forums, and review
            sites say the same thing:
          </p>
          <blockquote className="mt-6 text-2xl font-medium italic text-slate-300 border-l-4 border-brand-500 pl-6 text-left max-w-3xl mx-auto">
            "I'm paying more every year for a tool that still doesn't fully work
            for me, and support is useless when something breaks."
          </blockquote>
        </div>

        {/* Reddit-style complaint cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {complaints.map((c) => (
            <div
              key={c.quote}
              className="rounded-2xl bg-slate-800/60 border border-slate-700 p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${c.color}`}
                >
                  {c.avatar}
                </div>
                <span className="text-xs text-slate-400">{c.source}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "{c.quote}"
              </p>
            </div>
          ))}
        </div>

        {/* Three real problems */}
        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {realProblems.map((p) => (
            <div key={p.title} className="flex flex-col gap-4">
              <div className="text-4xl">{p.icon}</div>
              <h3 className="text-lg font-bold text-white">{p.title}</h3>
              <p className="text-slate-400 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        {/* Transition statement */}
        <div className="mt-16 text-center">
          <div className="inline-block rounded-2xl bg-brand-900/40 border border-brand-700 px-8 py-6">
            <p className="text-xl font-semibold text-brand-300">
              TrueBooks was built to solve all three — at once.
            </p>
            <p className="mt-2 text-slate-400">
              One tool. Reliable data. Real support. Honest pricing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
