"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const bankTransactions = [
  { id: "b1", date: "2026-04-25", description: "Stripe Payout", amount: 4200 },
  { id: "b2", date: "2026-04-24", description: "AWS Charge", amount: -312.44 },
  { id: "b3", date: "2026-04-23", description: "Staples POS", amount: -87.32 },
  { id: "b4", date: "2026-04-22", description: "Payroll Direct Deposit", amount: -12800 },
  { id: "b5", date: "2026-04-22", description: "Chase Transfer", amount: -5000 },
  { id: "b6", date: "2026-04-20", description: "Client ACH Payment", amount: 3200 },
];

const bookTransactions = [
  { id: "t1", date: "2026-04-25", description: "Stripe Payment — Client A", amount: 4200, bankId: "b1" },
  { id: "t2", date: "2026-04-24", description: "AWS — EC2 Instances", amount: -312.44, bankId: "b2" },
  { id: "t3", date: "2026-04-23", description: "Office supplies — Staples", amount: -87.32, bankId: "b3" },
  { id: "t4", date: "2026-04-22", description: "Payroll — April W2", amount: -12800, bankId: "b4" },
  { id: "t5", date: "2026-04-22", description: "Owner transfer", amount: -5000, bankId: null },
  { id: "t6", date: "2026-04-20", description: "Bright Ideas LLC — Invoice 0050", amount: 3200, bankId: "b6" },
];

type MatchState = "matched" | "unmatched" | "flagged";

export default function ReconciliationPage() {
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(true);
  const [matches, setMatches] = useState<Record<string, string | null>>({
    t1: "b1",
    t2: "b2",
    t3: "b3",
    t4: "b4",
    t5: null,
    t6: "b6",
  });

  const matchedCount = Object.values(matches).filter(Boolean).length;
  const unmatchedCount = Object.values(matches).filter((v) => v === null).length;
  const accuracy = Math.round((matchedCount / bookTransactions.length) * 100);

  async function runReconciliation() {
    setRunning(true);
    await new Promise((r) => setTimeout(r, 1800));
    setRan(true);
    setRunning(false);
    toast.success(`Reconciliation complete — ${accuracy}% matched!`);
  }

  function getState(bookId: string): MatchState {
    if (!ran) return "unmatched";
    const bankId = matches[bookId];
    if (bankId) return "matched";
    return "flagged";
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bank Reconciliation</h1>
          <p className="mt-1 text-sm text-slate-500">
            Match your bank statements with your books
          </p>
        </div>
        <button
          onClick={runReconciliation}
          disabled={running}
          className="btn-primary"
        >
          {running ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Reconciling…
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Run Reconciliation
            </>
          )}
        </button>
      </div>

      {/* Score card */}
      {ran && (
        <div
          className={`rounded-2xl border p-6 flex items-center gap-6 ${
            accuracy >= 95
              ? "border-green-200 bg-green-50"
              : accuracy >= 80
              ? "border-yellow-200 bg-yellow-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black ${
              accuracy >= 95
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {accuracy}%
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-slate-900">
              {accuracy >= 95
                ? "Excellent! Your books are in great shape."
                : "A few items need your attention."}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {matchedCount} of {bookTransactions.length} transactions matched ·{" "}
              {unmatchedCount} unmatched
            </p>
          </div>
          <ShieldCheck
            className={`h-10 w-10 ${
              accuracy >= 95 ? "text-green-500" : "text-yellow-500"
            }`}
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Bank balance", value: "$42,712.24", color: "text-slate-900" },
          { label: "Book balance", value: "$42,712.24", color: "text-slate-900" },
          { label: "Difference", value: "$0.00", color: "text-green-600" },
          { label: "Unmatched items", value: unmatchedCount.toString(), color: unmatchedCount > 0 ? "text-yellow-600" : "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`mt-2 text-2xl font-bold font-mono ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Side-by-side matching */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Book transactions */}
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50">
            <h2 className="text-sm font-semibold text-slate-700">
              Your Books (TrueBooks)
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {bookTransactions.map((tx) => {
              const state = getState(tx.id);
              return (
                <div
                  key={tx.id}
                  className={`flex items-center gap-3 px-5 py-3 text-sm ${
                    state === "matched"
                      ? "bg-green-50/40"
                      : state === "flagged"
                      ? "bg-yellow-50/40"
                      : ""
                  }`}
                >
                  {state === "matched" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  ) : state === "flagged" ? (
                    <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-slate-200 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-slate-400">
                      {formatDate(tx.date, "MMM d")}
                    </p>
                  </div>
                  <span
                    className={`font-mono font-semibold ${
                      tx.amount >= 0 ? "text-green-600" : "text-slate-700"
                    }`}
                  >
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bank transactions */}
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50">
            <h2 className="text-sm font-semibold text-slate-700">
              Bank Statement (Chase Business)
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {bankTransactions.map((tx) => {
              const isMatched = Object.values(matches).includes(tx.id);
              return (
                <div
                  key={tx.id}
                  className={`flex items-center gap-3 px-5 py-3 text-sm ${
                    isMatched ? "bg-green-50/40" : ""
                  }`}
                >
                  {isMatched ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-slate-400">
                      {formatDate(tx.date, "MMM d")}
                    </p>
                  </div>
                  <span
                    className={`font-mono font-semibold ${
                      tx.amount >= 0 ? "text-green-600" : "text-slate-700"
                    }`}
                  >
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unmatched items action */}
      {unmatchedCount > 0 && (
        <div className="card p-5 border-yellow-200 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  {unmatchedCount} transaction{unmatchedCount > 1 ? "s" : ""} need
                  your attention
                </p>
                <p className="text-xs text-yellow-600 mt-0.5">
                  "Owner transfer" on Apr 22 doesn't match any bank entry.
                  Review and manually match or create an adjustment entry.
                </p>
              </div>
            </div>
            <button className="btn-secondary text-sm py-2">
              Review <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
