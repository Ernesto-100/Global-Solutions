"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Send, Save, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

function newItem(): LineItem {
  return { id: crypto.randomUUID(), description: "", qty: 1, rate: 0 };
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    client: "",
    clientEmail: "",
    invoiceNumber: "INV-0052",
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    notes: "",
    paymentTerms: "net30",
  });
  const [items, setItems] = useState<LineItem[]>([newItem()]);
  const [taxRate, setTaxRate] = useState(0);

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.rate, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  function updateItem(id: string, field: keyof LineItem, value: string | number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function removeItem(id: string) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleSave(send = false) {
    if (!form.client || items.some((i) => !i.description)) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      // API call would go here
      await new Promise((r) => setTimeout(r, 800));
      toast.success(send ? "Invoice sent!" : "Invoice saved as draft.");
      router.push("/invoices");
    } catch {
      toast.error("Failed to save invoice.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/invoices" className="btn-secondary py-2 px-3">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">New Invoice</h1>
            <p className="text-sm text-slate-500">{form.invoiceNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="btn-secondary"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="btn-primary"
          >
            <Send className="h-4 w-4" />
            Send Invoice
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client info */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Bill To
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Client Name *</label>
                <input
                  type="text"
                  required
                  value={form.client}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, client: e.target.value }))
                  }
                  className="input"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="label">Client Email</label>
                <input
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, clientEmail: e.target.value }))
                  }
                  className="input"
                  placeholder="billing@acme.com"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Invoice Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">Invoice #</label>
                <input
                  type="text"
                  value={form.invoiceNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, invoiceNumber: e.target.value }))
                  }
                  className="input font-mono"
                />
              </div>
              <div>
                <label className="label">Issue Date</label>
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, issueDate: e.target.value }))
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="label">Payment Terms</label>
                <select
                  value={form.paymentTerms}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, paymentTerms: e.target.value }))
                  }
                  className="input"
                >
                  <option value="immediate">Due on receipt</option>
                  <option value="net15">Net 15</option>
                  <option value="net30">Net 30</option>
                  <option value="net60">Net 60</option>
                </select>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Line Items
            </h2>
            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Description of service"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      className="input text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(item.id, "qty", parseFloat(e.target.value) || 0)
                      }
                      className="input text-sm text-center"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(item.id, "rate", parseFloat(e.target.value) || 0)
                      }
                      className="input text-sm text-right font-mono"
                    />
                  </div>
                  <div className="col-span-1 text-right font-mono text-sm font-semibold text-slate-700">
                    {formatCurrency(item.qty * item.rate)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="p-1 text-slate-300 hover:text-red-500 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setItems((prev) => [...prev, newItem()])}
                className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 mt-2"
              >
                <Plus className="h-4 w-4" />
                Add line item
              </button>
            </div>

            {/* Totals */}
            <div className="mt-6 border-t border-slate-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-mono font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Tax (
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-12 border-b border-slate-300 bg-transparent text-center focus:outline-none focus:border-brand-500"
                  />
                  %)
                </span>
                <span className="font-mono font-semibold">
                  {formatCurrency(tax)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-2">
                <span>Total</span>
                <span className="font-mono text-brand-700">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card p-6">
            <label className="label">Notes / Payment Instructions</label>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              className="input h-24 resize-none"
              placeholder="Payment instructions, thank you note, or any other details…"
            />
          </div>
        </div>

        {/* Sidebar summary */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Invoice Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Client</span>
                <span className="font-medium">
                  {form.client || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Line items</span>
                <span className="font-medium">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-mono font-medium">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax</span>
                <span className="font-mono font-medium">
                  {formatCurrency(tax)}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="font-mono text-brand-700">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-brand-50 border-brand-100">
            <h3 className="text-sm font-semibold text-brand-800 mb-2">
              Auto-reminders enabled
            </h3>
            <p className="text-xs text-brand-600 leading-relaxed">
              TrueBooks will automatically send a payment reminder 3 days before
              due date and again when overdue. No more chasing clients manually.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
