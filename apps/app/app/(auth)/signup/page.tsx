"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const planNames: Record<string, string> = {
  starter: "Starter — $19/mo",
  pro: "Pro — $49/mo",
  business: "Business — $99/mo",
};

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "pro";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { ...form, plan });
      localStorage.setItem("tb_token", data.access_token);
      toast.success("Account created! Let's get your books set up.");
      router.push("/onboarding");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">TrueBooks</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Start your free 14-day trial
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Selected plan */}
        <div className="mb-4 rounded-xl bg-brand-50 border border-brand-100 px-4 py-3 flex items-center gap-2 text-sm text-brand-700">
          <CheckCircle2 className="h-4 w-4 text-brand-500" />
          <span>
            Selected plan:{" "}
            <strong>{planNames[plan] || "Pro — $49/mo"}</strong>
          </span>
          <Link
            href="#pricing"
            className="ml-auto text-xs underline text-brand-600"
          >
            Change
          </Link>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Your name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={update("name")}
                  className="input"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="label">Company name</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={update("company")}
                  className="input"
                  placeholder="Acme LLC"
                />
              </div>
            </div>

            <div>
              <label className="label">Work email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={update("email")}
                className="input"
                placeholder="jane@acme.com"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={form.password}
                onChange={update("password")}
                className="input"
                placeholder="Min. 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create free account"
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-2">
            {[
              "14-day free trial, no credit card",
              "Free QuickBooks data migration",
              "Real human support from day 1",
            ].map((p) => (
              <div key={p} className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-500" />
                {p}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
