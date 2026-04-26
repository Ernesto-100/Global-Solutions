import {
  ShieldCheck,
  Zap,
  LayoutDashboard,
  HeadphonesIcon,
  FileText,
  Receipt,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Import,
  Bell,
  Lock,
} from "lucide-react";

const pillars = [
  {
    id: "reliability",
    icon: ShieldCheck,
    color: "text-green-600",
    bg: "bg-green-50",
    title: "Rock-solid reliability",
    tagline: "Your #1 differentiator",
    description:
      "Every transaction double-checked. Every reconciliation validated. Every report consistent with your bank — or we flag it immediately. Your books will always balance.",
    features: [
      "Automatic double-entry validation",
      "Real-time reconciliation alerts",
      "Full audit trail for every change",
      "Nightly automated backups (30-day retention)",
      "Zero data loss — guaranteed in SLA",
    ],
  },
  {
    id: "speed",
    icon: Zap,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    title: "Blazing fast, everywhere",
    tagline: "Massively underrated",
    description:
      "Every screen loads in under 200ms. Invoices send instantly. Expense categorization is immediate. You'll never wait for a spinner again.",
    features: [
      "Sub-200ms page loads",
      "Instant invoice generation",
      "Auto-categorize transactions in real time",
      "Offline-capable mobile app",
      "Live dashboard updates (no refresh needed)",
    ],
  },
  {
    id: "workflows",
    icon: LayoutDashboard,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Complete core workflows",
    tagline: "Not 'simplified to useless'",
    description:
      "Invoicing, expenses, reconciliation, and reporting — all done perfectly. Not a stripped-down version. Full professional features, zero bloat.",
    features: [
      "Professional invoices with auto-reminders",
      "Expense tracking + receipt capture",
      "Bank reconciliation wizard",
      "P&L, Balance Sheet, Cash Flow reports",
      "Multi-currency support",
    ],
  },
  {
    id: "support",
    icon: HeadphonesIcon,
    color: "text-purple-600",
    bg: "bg-purple-50",
    title: "Real human support",
    tagline: "Your unfair advantage",
    description:
      "Live chat staffed by real bookkeeping experts, not bots. Average response under 2 minutes. Migration help included. You are never alone with your books.",
    features: [
      "Live chat with real humans, 24/7",
      "< 2 minute average response time",
      "Free QuickBooks migration assistance",
      "Dedicated onboarding specialist",
      "Monthly check-in calls (Pro+)",
    ],
  },
];

const coreFeatures = [
  { icon: FileText, label: "Invoicing" },
  { icon: Receipt, label: "Expenses" },
  { icon: RefreshCw, label: "Reconciliation" },
  { icon: BarChart3, label: "Reports" },
  { icon: TrendingUp, label: "Cash Flow" },
  { icon: Import, label: "QB Import" },
  { icon: Bell, label: "Smart Alerts" },
  { icon: Lock, label: "Audit Trail" },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            The 4 pillars
          </p>
          <h2 className="mt-3 section-title">
            Built to win on what matters
          </h2>
          <p className="mt-4 section-subtitle max-w-2xl mx-auto">
            We didn't try to copy QuickBooks. We built exactly what small
            businesses need — nothing more, nothing less.
          </p>
        </div>

        {/* Core feature icons */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {coreFeatures.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-4 py-2.5"
            >
              <Icon className="h-4 w-4 text-brand-600" />
              <span className="text-sm font-medium text-slate-700">{label}</span>
            </div>
          ))}
        </div>

        {/* 4 pillars */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${pillar.bg}`}
                  >
                    <Icon className={`h-6 w-6 ${pillar.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      {pillar.tagline}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {pillar.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
