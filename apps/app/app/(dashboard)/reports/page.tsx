"use client";

import { useState } from "react";
import {
  Download,
  BarChart3,
  TrendingUp,
  DollarSign,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const monthlyData = [
  { month: "Nov", revenue: 28400, expenses: 18200, profit: 10200 },
  { month: "Dec", revenue: 32100, expenses: 21000, profit: 11100 },
  { month: "Jan", revenue: 27800, expenses: 19500, profit: 8300 },
  { month: "Feb", revenue: 35200, expenses: 22300, profit: 12900 },
  { month: "Mar", revenue: 31600, expenses: 20100, profit: 11500 },
  { month: "Apr", revenue: 38900, expenses: 24600, profit: 14300 },
];

const plStatement = [
  { category: "Revenue", items: [
    { label: "Service Revenue", amount: 35400 },
    { label: "Product Sales", amount: 3500 },
  ]},
  { category: "Cost of Goods Sold", items: [
    { label: "Contractor Costs", amount: -8200 },
  ]},
  { category: "Operating Expenses", items: [
    { label: "Payroll", amount: -12800 },
    { label: "Software & SaaS", amount: -3100 },
    { label: "Rent", amount: -2400 },
    { label: "Marketing", amount: -1800 },
    { label: "Office Supplies", amount: -300 },
  ]},
];

const reports = [
  {
    id: "pl",
    name: "Profit & Loss",
    description: "Income, expenses, and net profit",
    icon: TrendingUp,
    period: "April 2026",
  },
  {
    id: "bs",
    name: "Balance Sheet",
    description: "Assets, liabilities, and equity",
    icon: DollarSign,
    period: "As of Apr 30",
  },
  {
    id: "cf",
    name: "Cash Flow Statement",
    description: "Operating, investing, and financing",
    icon: BarChart3,
    period: "April 2026",
  },
  {
    id: "ar",
    name: "Accounts Receivable",
    description: "Outstanding invoices and aging",
    icon: FileText,
    period: "Current",
  },
];

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState("pl");
  const [period, setPeriod] = useState("april-2026");

  const totalRevenue = plStatement
    .find((s) => s.category === "Revenue")!
    .items.reduce((s, i) => s + i.amount, 0);

  const totalExpenses = plStatement
    .filter((s) => s.category !== "Revenue")
    .flatMap((s) => s.items)
    .reduce((s, i) => s + i.amount, 0);

  const netProfit = totalRevenue + totalExpenses;
  const margin = ((netProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tax-ready financial reports, always up to date
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input py-2 text-sm"
          >
            <option value="april-2026">April 2026</option>
            <option value="q1-2026">Q1 2026</option>
            <option value="ytd-2026">YTD 2026</option>
            <option value="fy-2025">FY 2025</option>
          </select>
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Report tabs */}
      <div className="flex gap-2 flex-wrap">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              onClick={() => setActiveReport(r.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                activeReport === r.id
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {r.name}
            </button>
          );
        })}
      </div>

      {activeReport === "pl" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* P&L Summary */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-5">
                P&L Summary — April 2026
              </h2>
              {plStatement.map((section) => (
                <div key={section.category} className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {section.category}
                  </p>
                  {section.items.map((item) => (
                    <div key={item.label} className="flex justify-between text-sm py-1">
                      <span className="text-slate-600">{item.label}</span>
                      <span
                        className={`font-mono font-semibold ${
                          item.amount >= 0 ? "text-green-600" : "text-slate-800"
                        }`}
                      >
                        {formatCurrency(Math.abs(item.amount))}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1 flex justify-between text-sm font-semibold">
                    <span className="text-slate-700">
                      Total {section.category}
                    </span>
                    <span className="font-mono">
                      {formatCurrency(
                        Math.abs(section.items.reduce((s, i) => s + i.amount, 0))
                      )}
                    </span>
                  </div>
                </div>
              ))}

              <div className="border-t-2 border-slate-200 mt-2 pt-3">
                <div className="flex justify-between text-base font-bold">
                  <span>Net Profit</span>
                  <span className="font-mono text-green-600">
                    {formatCurrency(netProfit)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Profit margin: {margin}%
                </p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-5">
                Revenue vs Expenses (6 months)
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-5">
                Net Profit Trend
              </h2>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                  <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: "#16a34a" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeReport !== "pl" && (
        <div className="card p-12 text-center">
          <BarChart3 className="mx-auto h-10 w-10 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            {reports.find((r) => r.id === activeReport)?.name} report
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Loading {period} data…
          </p>
        </div>
      )}
    </div>
  );
}
