"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Users,
  DollarSign,
  ShieldCheck,
  Zap,
  MessageCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  Bot,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Simulated agent status data
const AGENT_STATUSES = [
  {
    name: "CEOAgent",
    role: "Strategic orchestrator",
    status: "running",
    runs: 4,
    errors: 0,
    uptime: 86400,
    health: 100,
    lastAction: "Completed strategic decision cycle",
    model: "claude-sonnet-4-6",
  },
  {
    name: "BookkeepingAgent",
    role: "Financial accuracy & automation",
    status: "running",
    runs: 288,
    errors: 0,
    uptime: 86400,
    health: 100,
    lastAction: "Auto-categorized 14 transactions",
    model: "claude-haiku-4-5",
  },
  {
    name: "SupportAgent",
    role: "24/7 live chat support",
    status: "running",
    runs: 1440,
    errors: 2,
    uptime: 86390,
    health: 99,
    lastAction: "Responded to support ticket #4821",
    model: "claude-sonnet-4-6",
  },
  {
    name: "InsightsAgent",
    role: "Financial intelligence & forecasting",
    status: "running",
    runs: 24,
    errors: 0,
    uptime: 86400,
    health: 100,
    lastAction: "Generated cash flow forecast for 2,400 businesses",
    model: "claude-sonnet-4-6",
  },
  {
    name: "FeedbackAgent",
    role: "Voice of the customer",
    status: "running",
    runs: 1,
    errors: 0,
    uptime: 86400,
    health: 100,
    lastAction: "Generated weekly product intelligence report",
    model: "claude-sonnet-4-6",
  },
  {
    name: "QAAgent",
    role: "Data integrity & reliability",
    status: "running",
    runs: 24,
    errors: 0,
    uptime: 86400,
    health: 100,
    lastAction: "Integrity check: 100% passed",
    model: "claude-haiku-4-5",
  },
  {
    name: "GrowthAgent",
    role: "Metrics, churn, conversion",
    status: "running",
    runs: 1,
    errors: 0,
    uptime: 86400,
    health: 98,
    lastAction: "Identified 2 high-churn-risk accounts",
    model: "claude-sonnet-4-6",
  },
];

const mrrData = [
  { date: "Nov", mrr: 12800 },
  { date: "Dec", mrr: 18400 },
  { date: "Jan", mrr: 24200 },
  { date: "Feb", mrr: 31600 },
  { date: "Mar", mrr: 39800 },
  { date: "Apr", mrr: 48200 },
];

const topMetrics = [
  { label: "MRR", value: "$48,200", change: "+$1,800 today", icon: DollarSign, color: "text-green-400" },
  { label: "Active Customers", value: "2,400", change: "+14 this week", icon: Users, color: "text-blue-400" },
  { label: "System Health", value: "98/100", change: "All systems OK", icon: ShieldCheck, color: "text-green-400" },
  { label: "Support CSAT", value: "4.6/5", change: "Avg response: 87s", icon: MessageCircle, color: "text-purple-400" },
  { label: "Trial Conv.", value: "22%", change: "Target: 28%", icon: TrendingUp, color: "text-yellow-400" },
  { label: "API Uptime", value: "99.97%", change: "This month", icon: Activity, color: "text-green-400" },
];

function StatusBadge({ status }: { status: string }) {
  const styles = {
    running: "bg-green-500/20 text-green-400 border border-green-500/30",
    idle: "bg-slate-700 text-slate-400 border border-slate-600",
    error: "bg-red-500/20 text-red-400 border border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status as keyof typeof styles] || styles.idle}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "running" ? "bg-green-400 animate-pulse" : "bg-slate-500"}`} />
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setLastRefresh(new Date());
    setRefreshing(false);
  }

  useEffect(() => {
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">TrueBooks Control Tower</h1>
            <p className="text-xs text-slate-400">Autonomous organization monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Global metrics */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-8">
        {topMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{m.label}</span>
                <Icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <p className="text-xl font-bold text-white">{m.value}</p>
              <p className="text-xs text-slate-500 mt-1">{m.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* MRR chart */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Monthly Recurring Revenue</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mrrData}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }} />
              <Area type="monotone" dataKey="mrr" name="MRR" stroke="#16a34a" strokeWidth={2} fill="url(#mrrGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* System health */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">System Health</h2>
          <div className="space-y-3">
            {[
              { label: "API Server", status: "ok", latency: "42ms" },
              { label: "Database", status: "ok", latency: "8ms" },
              { label: "Redis Cache", status: "ok", latency: "2ms" },
              { label: "AI Agents", status: "ok", latency: "87ms" },
              { label: "Email Service", status: "ok", latency: "—" },
              { label: "File Storage (S3)", status: "ok", latency: "—" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${s.status === "ok" ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
                  <span className="text-sm text-slate-400">{s.label}</span>
                </div>
                {s.latency !== "—" && (
                  <span className="text-xs font-mono text-slate-500">{s.latency}</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Overall Health</span>
              <span className="font-bold text-green-400">98/100</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div className="h-full w-[98%] rounded-full bg-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Agent status grid */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-5 w-5 text-brand-600" />
          <h2 className="text-base font-semibold text-white">
            Autonomous Agents ({AGENT_STATUSES.length} running)
          </h2>
          <span className="ml-2 rounded-full bg-green-500/20 border border-green-500/30 px-2 py-0.5 text-xs font-medium text-green-400">
            All systems operational
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {AGENT_STATUSES.map((agent) => (
            <div
              key={agent.name}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-brand-600" />
                    <span className="text-sm font-semibold text-white">{agent.name}</span>
                    <StatusBadge status={agent.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{agent.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Health</p>
                  <p className={`text-sm font-bold ${agent.health >= 99 ? "text-green-400" : agent.health >= 90 ? "text-yellow-400" : "text-red-400"}`}>
                    {agent.health}/100
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="rounded-lg bg-slate-800/60 p-2.5">
                  <p className="text-[10px] text-slate-500">Runs</p>
                  <p className="text-sm font-bold text-white">{agent.runs.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-slate-800/60 p-2.5">
                  <p className="text-[10px] text-slate-500">Errors</p>
                  <p className={`text-sm font-bold ${agent.errors === 0 ? "text-green-400" : "text-red-400"}`}>
                    {agent.errors}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/60 p-2.5">
                  <p className="text-[10px] text-slate-500">Uptime</p>
                  <p className="text-sm font-bold text-white">{Math.floor(agent.uptime / 3600)}h</p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-800/40 px-3 py-2">
                <p className="text-[10px] text-slate-500 mb-0.5">Last action</p>
                <p className="text-xs text-slate-300">{agent.lastAction}</p>
              </div>

              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[10px] text-slate-600">Model: {agent.model}</span>
                <span className="text-[10px] text-slate-600">
                  Error rate: {((agent.errors / Math.max(agent.runs, 1)) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback loop summary */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="h-4 w-4 text-brand-600" />
          <h2 className="text-sm font-semibold text-white">
            Feedback Loop — This Week
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "AI categorization accuracy",
              value: "94%",
              target: "95%",
              trend: "up",
              detail: "Target: 95%",
            },
            {
              title: "Support response time",
              value: "87s",
              target: "120s",
              trend: "good",
              detail: "Target: < 120s ✓",
            },
            {
              title: "Data integrity checks",
              value: "100%",
              target: "100%",
              trend: "good",
              detail: "0 failures this week",
            },
            {
              title: "Trial conversion rate",
              value: "22%",
              target: "28%",
              trend: "down",
              detail: "Gap: 6pp — Day 3 dropoff",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-slate-800/60 p-4">
              <p className="text-xs text-slate-400 mb-1">{item.title}</p>
              <p
                className={`text-2xl font-bold ${
                  item.trend === "good" || item.trend === "up"
                    ? "text-green-400"
                    : item.trend === "down"
                    ? "text-yellow-400"
                    : "text-white"
                }`}
              >
                {item.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
