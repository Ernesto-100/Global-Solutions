"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  BookOpen,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  timestamp: string;
  agentName?: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "system",
    content: "You're now connected to TrueBooks Support. Average response time: < 2 minutes.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    role: "agent",
    content:
      "Hi Jane! I'm Alex from the TrueBooks support team. How can I help you today? Whether it's a bookkeeping question, a technical issue, or help understanding a report — I'm here.",
    timestamp: new Date().toISOString(),
    agentName: "Alex",
  },
];

const quickReplies = [
  "How do I reconcile my bank account?",
  "My QuickBooks import has an issue",
  "I need to generate a tax report",
  "How do I add a team member?",
];

const resources = [
  { title: "QuickBooks Migration Guide", href: "#", time: "5 min read" },
  { title: "Bank Reconciliation Walkthrough", href: "#", time: "3 min read" },
  { title: "Understanding Your P&L Report", href: "#", time: "4 min read" },
  { title: "Setting Up Automatic Reminders", href: "#", time: "2 min read" },
];

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const content = text || input.trim();
    if (!content) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    // Simulate agent response (in production: WebSocket to agents service)
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const responses: Record<string, string> = {
      "How do I reconcile my bank account?":
        "Great question! Head to the Reconciliation tab in the left sidebar. TrueBooks will automatically match your transactions — for most businesses this takes about 5 minutes. If there are any mismatches, I'll flag them and explain what to do. Want me to walk you through it step by step?",
      "My QuickBooks import has an issue":
        "I'll help you sort that out right away. Can you tell me what error or issue you're seeing? Also, what format did you export from QuickBooks — QBO file, IIF, or CSV? In the meantime, I've flagged your account so our migration specialist Sarah will also review it within the hour.",
      "I need to generate a tax report":
        "Perfect timing — your books are already tax-ready! Go to Reports → select your period → click 'Export PDF'. Your accountant will get a clean P&L, Balance Sheet, and detailed transaction report. I can also email it directly to your CPA if you give me their email.",
      "How do I add a team member?":
        "Easy! Go to Settings → Team → Invite Member. You can set them as View Only, Editor, or Admin. Your accountant will love the read-only access — they get full reports without touching your live data.",
    };

    const agentReply: Message = {
      id: crypto.randomUUID(),
      role: "agent",
      content:
        responses[content] ||
        "Thanks for your message! I'm looking into that for you right now. I'll have an answer in just a moment — our AI is pulling the relevant information from your account.",
      timestamp: new Date().toISOString(),
      agentName: "Alex",
    };

    setMessages((prev) => [...prev, agentReply]);
    setSending(false);
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Support</h1>
        <p className="mt-1 text-sm text-slate-500">
          Real humans. Real answers. Under 2 minutes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat */}
        <div className="lg:col-span-2 card flex flex-col" style={{ height: "600px" }}>
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100">
                <Bot className="h-4 w-4 text-brand-600" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Alex — TrueBooks Support</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Online now · avg 90s response
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <Phone className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.role === "system" && (
                  <div className="text-center">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                      {msg.content}
                    </span>
                  </div>
                )}
                {msg.role === "agent" && (
                  <div className="flex gap-3 max-w-lg">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 mt-1">
                      <Bot className="h-3.5 w-3.5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">{msg.agentName}</p>
                      <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-sm text-slate-800 leading-relaxed">
                        {msg.content}
                      </div>
                      <p className="mt-1 text-[10px] text-slate-300">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                )}
                {msg.role === "user" && (
                  <div className="flex gap-3 max-w-lg ml-auto flex-row-reverse">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 mt-1">
                      <User className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <div className="rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-3 text-sm text-white leading-relaxed">
                        {msg.content}
                      </div>
                      <p className="mt-1 text-[10px] text-slate-300 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div className="flex gap-3 max-w-lg">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 mt-1">
                  <Bot className="h-3.5 w-3.5 text-brand-600" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3">
                  <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                  <span className="text-xs text-slate-400">Alex is typing…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length < 4 && (
            <div className="border-t border-slate-50 px-5 py-3">
              <p className="text-xs text-slate-400 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask anything about your books…"
                className="input flex-1"
                disabled={sending}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || sending}
                className="btn-primary py-2.5 px-4"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Support options */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Other ways to reach us
            </h2>
            <div className="space-y-3">
              {[
                { icon: Phone, label: "Phone Support", desc: "Pro & Business plans", badge: "< 5 min wait" },
                { icon: Mail, label: "Email Support", desc: "All plans", badge: "< 4 hours" },
                { icon: BookOpen, label: "Help Center", desc: "Self-serve articles", badge: "250+ guides" },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <div key={opt.label} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                      <Icon className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{opt.label}</p>
                      <p className="text-xs text-slate-400">{opt.desc}</p>
                    </div>
                    <span className="badge badge-green text-[10px]">{opt.badge}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Popular resources
            </h2>
            <div className="space-y-2">
              {resources.map((r) => (
                <a
                  key={r.title}
                  href={r.href}
                  className="flex items-center justify-between rounded-xl p-3 hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-sm text-slate-700 group-hover:text-brand-700">
                    {r.title}
                  </span>
                  <span className="text-xs text-slate-400">{r.time}</span>
                </a>
              ))}
            </div>
          </div>

          {/* SLA commitment */}
          <div className="card p-5 bg-brand-50 border-brand-100">
            <div className="flex gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-brand-800">
                Our support promise
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-brand-700">
              <li>• Live chat under 2 minutes (Pro+)</li>
              <li>• Phone under 5 minutes (Business)</li>
              <li>• Email under 4 hours (all plans)</li>
              <li>• Real humans only — no bots</li>
              <li>• Bookkeeping experts, not tier-1 scripts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
