"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, CreditCard, Users, Shield, Bell, Building } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");

  const tabs = [
    { id: "company", label: "Company", icon: Building },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "team", label: "Team", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account and organization</p>
      </div>

      <div className="flex gap-1 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "company" && (
        <div className="card p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Company Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Company name", value: "Acme LLC", type: "text" },
              { label: "Business email", value: "billing@acme.com", type: "email" },
              { label: "Phone", value: "+1 (555) 234-5678", type: "tel" },
              { label: "Tax ID (EIN)", value: "12-3456789", type: "text" },
              { label: "Address", value: "123 Main St, San Francisco, CA", type: "text" },
              { label: "Currency", value: "USD", type: "text" },
            ].map((field) => (
              <div key={field.label}>
                <label className="label">{field.label}</label>
                <input type={field.type} defaultValue={field.value} className="input" />
              </div>
            ))}
          </div>
          <div>
            <label className="label">Fiscal year start</label>
            <select className="input max-w-xs">
              <option value="1">January (most common)</option>
              <option value="4">April</option>
              <option value="7">July</option>
              <option value="10">October</option>
            </select>
          </div>
          <button onClick={() => toast.success("Settings saved.")} className="btn-primary">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="card p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Billing & Subscription</h2>
          <div className="rounded-xl bg-brand-50 border border-brand-100 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-800">Pro Plan</p>
              <p className="text-xs text-brand-600">$49/month · Renews May 1, 2026</p>
            </div>
            <button className="btn-secondary text-sm py-2">Change plan</button>
          </div>
          <div className="rounded-xl border border-slate-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium">Visa ending in 4242</p>
                <p className="text-xs text-slate-400">Expires 12/27</p>
              </div>
            </div>
            <button className="text-sm text-brand-600 hover:text-brand-700">Update</button>
          </div>
          <p className="text-xs text-slate-400">
            30-day money-back guarantee. Cancel anytime. Your data is always exportable.
          </p>
        </div>
      )}

      {activeTab === "team" && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Team Members</h2>
            <button className="btn-primary text-sm py-2">Invite member</button>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { name: "Jane Doe (You)", email: "jane@acme.com", role: "Owner", initials: "JD" },
              { name: "Sarah Accountant", email: "sarah@cpa.com", role: "Accountant (read-only)", initials: "SA" },
            ].map((member) => (
              <div key={member.email} className="flex items-center gap-4 py-3">
                <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700">
                  {member.initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.email}</p>
                </div>
                <span className="badge badge-slate">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === "notifications" || activeTab === "security") && (
        <div className="card p-12 text-center text-slate-400">
          <p className="text-sm">Coming soon — we're building this now.</p>
        </div>
      )}
    </div>
  );
}
