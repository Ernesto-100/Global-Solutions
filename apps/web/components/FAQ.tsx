"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How long does the QuickBooks migration really take?",
    a: "For most businesses, the automated import takes 5–10 minutes. We pull your chart of accounts, all transactions, customers, vendors, and opening balances. A migration specialist then reviews everything and schedules a 30-minute call to confirm everything is correct before you go live. Total time: usually one business day.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data is yours. When you cancel you get a full export in CSV, QBO, and JSON formats within 24 hours. We store your data for 90 days post-cancellation so you can re-export if needed. We never hold your data hostage.",
  },
  {
    q: "Can my accountant access TrueBooks?",
    a: "Yes. You can invite your accountant as a team member with read-only or full access. We also generate accountant-ready reports (trial balance, journal entries, etc.) that CPAs love. Many of our users say their accountant specifically asked them to stay on TrueBooks.",
  },
  {
    q: "What if I have more than one business?",
    a: "Business plan includes multi-entity management with a single login. Each entity gets its own set of books, reports, and bank connections, but you can switch between them instantly and run consolidated reports.",
  },
  {
    q: "Is TrueBooks safe for my financial data?",
    a: "Bank-grade security throughout. AES-256 encryption at rest, TLS 1.3 in transit, SOC 2 Type II certified, and we never store your bank credentials (we use Plaid for read-only bank connections). Every change has an immutable audit trail.",
  },
  {
    q: "What if I run into a bug or something breaks?",
    a: "Open live chat. A real bookkeeping expert (not a bot) picks up within 2 minutes on Pro/Business plans. We also have a public status page so you always know the system state, and we auto-notify you of any issues before you notice them.",
  },
  {
    q: "Do you raise prices on existing customers?",
    a: "No. Your price is locked when you sign up. When we release new features, existing customers get them at their current rate. We've never retroactively raised prices and we never will — it's core to who we are.",
  },
  {
    q: "What's the difference from QuickBooks Online?",
    a: "Reliability: no broken reconciliations. Speed: everything loads in under 200ms. Support: real humans, not bots. Price: 3–5x cheaper for equivalent features. And we specifically built for businesses under $1M — QuickBooks is built for accountants and large enterprises; you pay for features you'll never use.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100">
      <button
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base font-semibold text-slate-900">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="pb-5 text-slate-600 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Questions
          </p>
          <h2 className="mt-3 section-title">Everything you want to know</h2>
          <p className="mt-4 section-subtitle">
            Still unsure? Jump into live chat — we're there in under 2 minutes.
          </p>
        </div>

        <div className="mt-12">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
