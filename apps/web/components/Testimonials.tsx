const testimonials = [
  {
    quote:
      "I was paying $189/month for QuickBooks Plus. Moved to TrueBooks and it's $29/month. My books are cleaner than they've ever been and I actually understand my reports now.",
    name: "Sarah K.",
    role: "Owner, Kelsey's Bakery",
    revenue: "$340K/yr",
    avatar: "SK",
    stars: 5,
    color: "bg-pink-100 text-pink-700",
  },
  {
    quote:
      "After Wave withdrew money from my account and support vanished, I needed something I could actually trust. TrueBooks's support team replied in 90 seconds. NINETY SECONDS.",
    name: "Marcus T.",
    role: "Freelance Contractor",
    revenue: "$180K/yr",
    avatar: "MT",
    stars: 5,
    color: "bg-blue-100 text-blue-700",
  },
  {
    quote:
      "The QuickBooks import was magic. Everything — invoices, customers, all five years of transactions — was there. Verified and live in one afternoon. I cried a little.",
    name: "Jennifer R.",
    role: "Owner, JR Consulting LLC",
    revenue: "$520K/yr",
    avatar: "JR",
    stars: 5,
    color: "bg-green-100 text-green-700",
  },
  {
    quote:
      "Xero's pricing was insane. TrueBooks does everything I need for $19/month. The reconciliation actually makes sense and the cash flow chart finally shows me the truth.",
    name: "David C.",
    role: "Owner, Cedar Hill Plumbing",
    revenue: "$680K/yr",
    avatar: "DC",
    stars: 5,
    color: "bg-orange-100 text-orange-700",
  },
  {
    quote:
      "My accountant was skeptical. After one quarter she said the reports were cleaner than what she gets from QuickBooks clients. I take that as a massive win.",
    name: "Priya S.",
    role: "Founder, Digital Lane Studio",
    revenue: "$290K/yr",
    avatar: "PS",
    stars: 5,
    color: "bg-purple-100 text-purple-700",
  },
  {
    quote:
      "The AI agent auto-categorized 94% of my transactions. I reconcile my whole month in about 8 minutes now. This used to take me an entire Sunday afternoon.",
    name: "Tom A.",
    role: "Owner, Anchor Auto Repair",
    revenue: "$780K/yr",
    avatar: "TA",
    stars: 5,
    color: "bg-yellow-100 text-yellow-700",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Real customers
          </p>
          <h2 className="mt-3 section-title">
            Business owners who made the switch
          </h2>
          <p className="mt-4 section-subtitle max-w-xl mx-auto">
            All under $1M revenue. All done with overpaying for tools that
            don't work.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <StarRating count={t.stars} />
              <p className="flex-1 text-slate-700 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${t.color}`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t.role} · {t.revenue}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate rating */}
        <div className="mt-12 flex items-center justify-center gap-3 text-slate-600">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="h-5 w-5 fill-yellow-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="font-semibold text-slate-900">4.9 / 5</span>
          <span>from 2,400+ verified reviews</span>
        </div>
      </div>
    </section>
  );
}
