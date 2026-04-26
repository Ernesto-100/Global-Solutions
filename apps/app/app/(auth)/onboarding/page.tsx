"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Loader2, BookOpen } from "lucide-react";

const steps = [
  {
    id: "welcome",
    title: "Welcome to TrueBooks!",
    description: "Let's get your books set up in a few quick steps.",
  },
  {
    id: "source",
    title: "Where are you coming from?",
    description: "We'll tailor your setup experience.",
  },
  {
    id: "import",
    title: "Import your existing data",
    description: "Bring your history over — it takes 5-10 minutes.",
  },
  {
    id: "done",
    title: "You're all set!",
    description: "Your TrueBooks is ready to go.",
  },
];

const sources = [
  { id: "quickbooks", label: "QuickBooks Online", icon: "📊" },
  { id: "quickbooks-desktop", label: "QuickBooks Desktop", icon: "💼" },
  { id: "wave", label: "Wave Accounting", icon: "🌊" },
  { id: "xero", label: "Xero", icon: "🔵" },
  { id: "spreadsheet", label: "Spreadsheets / CSV", icon: "📋" },
  { id: "fresh", label: "Starting fresh", icon: "🌱" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  async function next() {
    if (step === steps.length - 2) {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      setLoading(false);
    }
    if (step === steps.length - 1) {
      router.push("/");
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">TrueBooks</span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? "bg-brand-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-slate-900">{steps[step].title}</h1>
          <p className="mt-2 text-slate-500">{steps[step].description}</p>

          {step === 0 && (
            <div className="mt-8 space-y-3">
              {[
                "Import your QuickBooks data in 10 minutes",
                "AI auto-categorizes your transactions",
                "Real human support from day 1",
                "14-day free trial — no credit card needed",
              ].map((p) => (
                <div key={p} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-500 shrink-0" />
                  <span className="text-sm text-slate-700">{p}</span>
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {sources.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSource(s.id)}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                    source === s.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-sm font-medium text-slate-700">{s.label}</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="mt-8">
              {source === "fresh" ? (
                <div className="rounded-xl bg-brand-50 border border-brand-100 p-6 text-center">
                  <p className="text-brand-700 font-medium">Starting fresh!</p>
                  <p className="text-sm text-brand-600 mt-1">
                    Your TrueBooks is ready. We'll walk you through creating
                    your first invoice.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
                    <p className="text-sm font-semibold text-slate-700">
                      How to export from {sources.find((s) => s.id === source)?.label}:
                    </p>
                    <ol className="mt-2 space-y-1.5 text-sm text-slate-600 list-decimal list-inside">
                      <li>Open your current accounting software</li>
                      <li>Go to Settings → Export Data (or Company → Export)</li>
                      <li>Choose QBO, IIF, or CSV format</li>
                      <li>Upload the file below</li>
                    </ol>
                  </div>
                  <p className="text-xs text-slate-500 text-center">
                    Need help? Our migration team will reach out within 2 hours.{" "}
                    <a href="/support" className="text-brand-600 underline">Chat with us</a>
                  </p>
                  <button className="btn-secondary w-full">
                    Upload my export file
                  </button>
                  <button
                    className="text-sm text-slate-400 hover:text-slate-600 w-full text-center"
                    onClick={next}
                  >
                    Skip for now, I'll do it later
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-slate-600">
                Your TrueBooks is ready. A migration specialist will reach out
                to confirm your data is correct.
              </p>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={next}
              disabled={(step === 1 && !source) || loading}
              className="btn-primary w-full py-3"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Setting up…</>
              ) : step === steps.length - 1 ? (
                <>Go to Dashboard <ArrowRight className="h-4 w-4" /></>
              ) : (
                <>Continue <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
