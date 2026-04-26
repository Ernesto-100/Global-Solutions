"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const historicalData = [
  { month: "Nov", balance: 28500, forecast: null },
  { month: "Dec", balance: 39600, forecast: null },
  { month: "Jan", balance: 47900, forecast: null },
  { month: "Feb", balance: 61000, forecast: null },
  { month: "Mar", balance: 72500, forecast: null },
  { month: "Apr", balance: 86800, forecast: null },
];

const forecastData = [
  { month: "May", balance: null, forecast: 91200, low: 84000, high: 98000 },
  { month: "Jun", balance: null, forecast: 96800, low: 87000, high: 107000 },
  { month: "Jul", balance: null, forecast: 103500, low: 90000, high: 117000 },
  { month: "Aug", balance: null, forecast: 108200, low: 91000, high: 126000 },
];

const allData = [...historicalData, ...forecastData];

const insights = [
  {
    type: "positive",
    title: "Strong cash position",
    description:
      "Your cash balance has grown 205% in 6 months. At current burn rate you have 11 months of runway.",
    icon: CheckCircle2,
    color: "text-green-600 bg-green-50 border-green-100",
  },
  {
    type: "warning",
    title: "Large payroll outflow upcoming",
    description:
      "Payroll ($12,800) processes May 15. Ensure receivables from Acme Corp are collected before then.",
    icon: AlertCircle,
    color: "text-yellow-600 bg-yellow-50 border-yellow-100",
  },
  {
    type: "positive",
    title: "3 invoices due this month",
    description:
      "Expected inflows: $8,500 (Acme), $3,200 (Bright Ideas), $5,400 (Everest) = $17,100",
    icon: TrendingUp,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
];

const upcomingItems = [
  { date: "May 1", description: "Rent payment", amount: -2400, type: "expense" },
  { date: "May 4", description: "Invoice INV-0051 due (Acme Corp)", amount: 8500, type: "income" },
  { date: "May 5", description: "Software subscriptions (Stripe, AWS, Figma)", amount: -387, type: "expense" },
  { date: "May 10", description: "Invoice INV-0050 due (Bright Ideas)", amount: 3200, type: "income" },
  { date: "May 15", description: "Payroll run", amount: -12800, type: "expense" },
  { date: "May 20", description: "Invoice INV-0047 due (Everest Group)", amount: 5400, type: "income" },
];

export default function CashFlowPage() {
  const [forecastMonths, setForecastMonths] = useState(4);

  const currentBalance = 86800;
  const projectedBalance = 108200;
  const projectedChange = projectedBalance - currentBalance;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cash Flow Forecast</h1>
          <p className="mt-1 text-sm text-slate-500">
            Know exactly where your money is going — before it gets there
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Forecast:</span>
          {[3, 4, 6].map((m) => (
            <button
              key={m}
              onClick={() => setForecastMonths(m)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                forecastMonths === m
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {m}mo
            </button>
          ))}
        </div>
      </div>

      {/* Key stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card">
          <p className="text-xs text-slate-500">Current Cash Balance</p>
          <p className="mt-2 text-3xl font-bold font-mono text-slate-900">
            {formatCurrency(currentBalance)}
          </p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +19.7% this month
          </p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-500">Projected Balance (4 months)</p>
          <p className="mt-2 text-3xl font-bold font-mono text-brand-700">
            {formatCurrency(projectedBalance)}
          </p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +{formatCurrency(projectedChange)} expected
          </p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-500">Months of Runway</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">11.2 mo</p>
          <p className="text-xs text-slate-500 mt-1">
            At $24,600/mo burn rate
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-700">
            Cash Balance — Historical & Forecast
          </h2>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />
              Actual
            </span>
            <span className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-brand-300 border-2 border-dashed border-brand-300" />
              Forecast
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4 text-xs text-brand-600 bg-brand-50 rounded-lg px-3 py-1.5 w-fit">
          <Zap className="h-3 w-3" />
          AI-powered forecast using your income patterns and known upcoming expenses
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={allData}>
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#86efac" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            <ReferenceLine x="Apr" stroke="#64748b" strokeDasharray="4 4" label={{ value: "Today", position: "top", fontSize: 11, fill: "#94a3b8" }} />
            <Area type="monotone" dataKey="balance" name="Actual balance" stroke="#16a34a" strokeWidth={2.5} fill="url(#balGrad)" connectNulls={false} />
            <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#86efac" strokeWidth={2} strokeDasharray="6 3" fill="url(#forecastGrad)" connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI Insights */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            AI Cash Flow Insights
          </h2>
          <div className="space-y-3">
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div
                  key={insight.title}
                  className={`flex gap-3 rounded-xl border p-4 ${insight.color}`}
                >
                  <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{insight.title}</p>
                    <p className="text-xs mt-0.5 leading-relaxed opacity-80">
                      {insight.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming cash events */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Upcoming Cash Events
          </h2>
          <div className="space-y-2">
            {upcomingItems.map((item) => (
              <div
                key={`${item.date}-${item.description}`}
                className="flex items-center gap-3 rounded-xl border border-slate-50 bg-slate-50/60 px-4 py-2.5"
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                    item.type === "income" ? "bg-green-500" : "bg-red-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-500">{item.date}</p>
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {item.description}
                  </p>
                </div>
                <span
                  className={`font-mono text-sm font-bold ${
                    item.amount >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.amount >= 0 ? "+" : ""}
                  {formatCurrency(Math.abs(item.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
