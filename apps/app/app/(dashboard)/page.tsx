"use client";

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

// Mock data — replaced by API calls in production
const cashFlowData = [
  { month: "Nov", income: 28400, expenses: 18200 },
  { month: "Dec", income: 32100, expenses: 21000 },
  { month: "Jan", income: 27800, expenses: 19500 },
  { month: "Feb", income: 35200, expenses: 22300 },
  { month: "Mar", income: 31600, expenses: 20100 },
  { month: "Apr", income: 38900, expenses: 24600 },
];

const recentTransactions = [
  {
    id: "1",
    description: "Stripe Payment — Client A",
    amount: 4200,
    date: "2026-04-25",
    category: "Sales Revenue",
    status: "categorized",
  },
  {
    id: "2",
    description: "AWS — Monthly Invoice",
    amount: -312.44,
    date: "2026-04-24",
    category: "Software & SaaS",
    status: "categorized",
  },
  {
    id: "3",
    description: "Office Supplies — Staples",
    amount: -87.32,
    date: "2026-04-23",
    category: "Office Supplies",
    status: "categorized",
  },
  {
    id: "4",
    description: "Chase Bank Transfer",
    amount: -5000,
    date: "2026-04-22",
    category: null,
    status: "uncategorized",
  },
  {
    id: "5",
    description: "Payroll — April W2",
    amount: -12800,
    date: "2026-04-22",
    category: "Payroll",
    status: "categorized",
  },
];

const alerts = [
  {
    type: "warning",
    message: "1 transaction needs categorization",
    href: "/expenses",
  },
  {
    type: "info",
    message: "Invoice #0047 is overdue by 3 days",
    href: "/invoices",
  },
  {
    type: "success",
    message: "April reconciliation: 98.4% matched",
    href: "/reconciliation",
  },
];

const stats = [
  {
    label: "Total Revenue (Apr)",
    value: 38900,
    change: +12.4,
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Total Expenses (Apr)",
    value: 24600,
    change: +8.2,
    icon: TrendingDown,
    color: "text-red-500",
    bg: "bg-red-50",
    negative: true,
  },
  {
    label: "Net Profit (Apr)",
    value: 14300,
    change: +19.1,
    icon: TrendingUp,
    color: "text-brand-600",
    bg: "bg-brand-50",
  },
  {
    label: "Outstanding Invoices",
    value: 18400,
    change: -5.3,
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
    isCurrency: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good morning, Jane</h1>
          <p className="mt-1 text-sm text-slate-500">
            Here's your financial snapshot for today — April 26, 2026
          </p>
        </div>
        <Link href="/reconciliation" className="btn-secondary text-sm">
          <RefreshCw className="h-4 w-4" />
          Reconcile now
        </Link>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-3">
          {alerts.map((alert) => (
            <Link
              key={alert.message}
              href={alert.href}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all hover:shadow-sm ${
                alert.type === "warning"
                  ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                  : alert.type === "info"
                  ? "border-blue-200 bg-blue-50 text-blue-800"
                  : "border-green-200 bg-green-50 text-green-800"
              }`}
            >
              {alert.type === "warning" ? (
                <AlertCircle className="h-4 w-4 shrink-0" />
              ) : alert.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <Clock className="h-4 w-4 shrink-0" />
              )}
              {alert.message}
              <ArrowUpRight className="ml-auto h-3 w-3" />
            </Link>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {formatCurrency(stat.value)}
              </p>
              <p
                className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                  (stat.change > 0 && !stat.negative) ||
                  (stat.change < 0 && stat.negative)
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {stat.change > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(stat.change)}% vs last month
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cash flow chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Cash Flow — Last 6 Months
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Income vs Expenses
              </p>
            </div>
            <Link
              href="/cashflow"
              className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Full forecast <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cashFlowData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#16a34a"
                strokeWidth={2}
                fill="url(#incomeGrad)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#expGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense breakdown */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            Top Expense Categories
          </h2>
          <p className="text-xs text-slate-500 mb-5">April 2026</p>
          <div className="space-y-3">
            {[
              { category: "Payroll", amount: 12800, pct: 52 },
              { category: "Software & SaaS", amount: 3100, pct: 13 },
              { category: "Rent", amount: 2400, pct: 10 },
              { category: "Marketing", amount: 1800, pct: 7 },
              { category: "Other", amount: 4500, pct: 18 },
            ].map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">
                    {item.category}
                  </span>
                  <span className="text-slate-500">
                    {formatCurrency(item.amount, "USD", true)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <h2 className="text-base font-semibold text-slate-900">
            Recent Transactions
          </h2>
          <Link
            href="/expenses"
            className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-50">
              <tr>
                <th className="table-header">Description</th>
                <th className="table-header">Date</th>
                <th className="table-header">Category</th>
                <th className="table-header text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      {tx.status === "uncategorized" && (
                        <AlertCircle className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                      )}
                      <span className="font-medium">{tx.description}</span>
                    </div>
                  </td>
                  <td className="table-cell text-slate-500">
                    {formatDate(tx.date, "MMM d")}
                  </td>
                  <td className="table-cell">
                    {tx.category ? (
                      <span className="badge badge-slate">{tx.category}</span>
                    ) : (
                      <span className="badge badge-yellow">Uncategorized</span>
                    )}
                  </td>
                  <td
                    className={`table-cell text-right font-mono font-semibold ${
                      tx.amount >= 0 ? "text-green-600" : "text-slate-900"
                    }`}
                  >
                    {formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
