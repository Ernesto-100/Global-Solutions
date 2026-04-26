"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Upload,
  Zap,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  Receipt,
} from "lucide-react";
import { formatCurrency, formatDate, TRANSACTION_CATEGORIES } from "@/lib/utils";
import { toast } from "sonner";

const mockExpenses = [
  {
    id: "exp-001",
    description: "AWS — EC2 Instances",
    amount: 312.44,
    date: "2026-04-24",
    category: "Software & SaaS",
    vendor: "Amazon Web Services",
    aiCategorized: true,
    receipt: true,
  },
  {
    id: "exp-002",
    description: "Office supplies",
    amount: 87.32,
    date: "2026-04-23",
    category: "Office Supplies",
    vendor: "Staples",
    aiCategorized: true,
    receipt: false,
  },
  {
    id: "exp-003",
    description: "Chase Bank Transfer",
    amount: 5000,
    date: "2026-04-22",
    category: null,
    vendor: "Chase Bank",
    aiCategorized: false,
    receipt: false,
  },
  {
    id: "exp-004",
    description: "Payroll — April",
    amount: 12800,
    date: "2026-04-22",
    category: "Payroll",
    vendor: "Gusto",
    aiCategorized: true,
    receipt: true,
  },
  {
    id: "exp-005",
    description: "Team dinner — client meeting",
    amount: 234.80,
    date: "2026-04-20",
    category: "Business Meals",
    vendor: "The Capital Grille",
    aiCategorized: true,
    receipt: false,
  },
  {
    id: "exp-006",
    description: "Figma Pro",
    amount: 45.00,
    date: "2026-04-18",
    category: "Software & SaaS",
    vendor: "Figma",
    aiCategorized: true,
    receipt: true,
  },
];

export default function ExpensesPage() {
  const [search, setSearch] = useState("");
  const [expenses, setExpenses] = useState(mockExpenses);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const uncategorizedCount = expenses.filter((e) => !e.category).length;

  function updateCategory(id: string, category: string) {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, category } : e))
    );
    setEditingCategory(null);
    toast.success("Category updated.");
  }

  const filtered = expenses.filter(
    (e) =>
      search === "" ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.vendor.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpend = expenses.reduce((s, e) => s + e.amount, 0);
  const aiCategorizedCount = expenses.filter((e) => e.aiCategorized).length;
  const aiAccuracy = Math.round((aiCategorizedCount / expenses.length) * 100);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and categorize your business expenses
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Upload className="h-4 w-4" />
            Upload Receipt
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* AI banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100">
          <Zap className="h-4 w-4 text-brand-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-brand-800">
            AI Auto-Categorization: {aiAccuracy}% accuracy this month
          </p>
          <p className="text-xs text-brand-600 mt-0.5">
            {aiCategorizedCount} of {expenses.length} transactions categorized automatically
            {uncategorizedCount > 0 &&
              ` · ${uncategorizedCount} need your review`}
          </p>
        </div>
        {uncategorizedCount > 0 && (
          <span className="badge badge-yellow">
            {uncategorizedCount} to review
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card">
          <p className="text-xs text-slate-500">Total spend (Apr)</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalSpend)}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-500">Largest category</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">Payroll</p>
          <p className="text-xs text-slate-500 mt-0.5">52% of spend</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-500">Receipts missing</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {expenses.filter((e) => !e.receipt).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search expenses or vendors…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-slate-100 bg-slate-50/50">
            <tr>
              <th className="table-header">Description</th>
              <th className="table-header">Vendor</th>
              <th className="table-header">Date</th>
              <th className="table-header">Category</th>
              <th className="table-header">Receipt</th>
              <th className="table-header text-right">Amount</th>
              <th className="table-header" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((expense) => (
              <tr
                key={expense.id}
                className={`hover:bg-slate-50/60 transition-colors ${
                  !expense.category ? "bg-yellow-50/40" : ""
                }`}
              >
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    {!expense.category ? (
                      <AlertCircle className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                    ) : expense.aiCategorized ? (
                      <Zap className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                    ) : null}
                    <span className="font-medium text-slate-800">
                      {expense.description}
                    </span>
                  </div>
                </td>
                <td className="table-cell text-slate-500">{expense.vendor}</td>
                <td className="table-cell text-slate-500">
                  {formatDate(expense.date, "MMM d")}
                </td>
                <td className="table-cell">
                  {editingCategory === expense.id ? (
                    <select
                      autoFocus
                      className="input text-xs py-1.5"
                      defaultValue={expense.category || ""}
                      onBlur={() => setEditingCategory(null)}
                      onChange={(e) =>
                        updateCategory(expense.id, e.target.value)
                      }
                    >
                      <option value="">Select category…</option>
                      {TRANSACTION_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setEditingCategory(expense.id)}
                      className={`badge ${
                        expense.category ? "badge-slate" : "badge-yellow"
                      } cursor-pointer hover:opacity-80`}
                    >
                      {expense.category || "Click to categorize"}
                    </button>
                  )}
                </td>
                <td className="table-cell">
                  {expense.receipt ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <button className="text-xs text-slate-400 hover:text-brand-600 underline">
                      + Add
                    </button>
                  )}
                </td>
                <td className="table-cell text-right font-mono font-bold text-slate-900">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="table-cell">
                  <button className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
