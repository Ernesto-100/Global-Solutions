"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Send,
  Download,
  Eye,
  MoreHorizontal,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { formatCurrency, formatDate, INVOICE_STATUSES } from "@/lib/utils";

const mockInvoices = [
  {
    id: "INV-0051",
    client: "Acme Corp",
    amount: 8500,
    issued: "2026-04-20",
    due: "2026-05-04",
    status: "sent" as const,
  },
  {
    id: "INV-0050",
    client: "Bright Ideas LLC",
    amount: 3200,
    issued: "2026-04-15",
    due: "2026-04-29",
    status: "viewed" as const,
  },
  {
    id: "INV-0049",
    client: "Cedar Studio",
    amount: 12000,
    issued: "2026-04-10",
    due: "2026-04-24",
    status: "paid" as const,
  },
  {
    id: "INV-0048",
    client: "Delta Services",
    amount: 1750,
    issued: "2026-04-01",
    due: "2026-04-15",
    status: "overdue" as const,
  },
  {
    id: "INV-0047",
    client: "Everest Group",
    amount: 5400,
    issued: "2026-03-28",
    due: "2026-04-11",
    status: "overdue" as const,
  },
  {
    id: "INV-0046",
    client: "Falcon Media",
    amount: 920,
    issued: "2026-03-20",
    due: "2026-04-03",
    status: "paid" as const,
  },
];

const summaryStats = [
  { label: "Total outstanding", value: 20850, color: "text-slate-900" },
  { label: "Overdue", value: 7150, color: "text-red-600" },
  { label: "Paid this month", value: 12920, color: "text-green-600" },
  { label: "Avg days to pay", value: "11 days", color: "text-blue-600", raw: true },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockInvoices.filter((inv) => {
    const matchSearch =
      search === "" ||
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, send, and track your invoices
          </p>
        </div>
        <Link href="/invoices/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          New Invoice
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {summaryStats.map((s) => (
          <div key={s.label} className="stat-card">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`mt-2 text-2xl font-bold ${s.color}`}>
              {s.raw ? s.value : formatCurrency(s.value as number)}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoices or clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          {["all", "sent", "viewed", "paid", "overdue", "draft"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold capitalize transition-all ${
                statusFilter === s
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-slate-100 bg-slate-50/50">
            <tr>
              <th className="table-header">Invoice</th>
              <th className="table-header">Client</th>
              <th className="table-header">Issued</th>
              <th className="table-header">Due</th>
              <th className="table-header">Status</th>
              <th className="table-header text-right">Amount</th>
              <th className="table-header" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((inv) => {
              const statusInfo = INVOICE_STATUSES[inv.status];
              const isOverdue = inv.status === "overdue";
              return (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span className="font-mono text-sm font-semibold text-slate-800">
                        {inv.id}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell font-medium">{inv.client}</td>
                  <td className="table-cell text-slate-500">
                    {formatDate(inv.issued, "MMM d, yyyy")}
                  </td>
                  <td
                    className={`table-cell ${
                      isOverdue ? "text-red-600 font-semibold" : "text-slate-500"
                    }`}
                  >
                    {formatDate(inv.due, "MMM d, yyyy")}
                    {isOverdue && (
                      <span className="ml-1 text-xs text-red-500">(overdue)</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <span className={statusInfo.color}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="table-cell text-right font-mono font-bold text-slate-900">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="Preview"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {inv.status === "draft" && (
                        <button
                          title="Send"
                          className="rounded-lg p-1.5 text-brand-500 hover:bg-brand-50 hover:text-brand-700"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        title="Download PDF"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <FileText className="mx-auto h-8 w-8 mb-3" />
            <p className="text-sm">No invoices found</p>
          </div>
        )}
      </div>
    </div>
  );
}
