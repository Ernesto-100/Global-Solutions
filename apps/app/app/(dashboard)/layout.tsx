"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  Receipt,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Download,
  MessageCircle,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  HelpCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/reconciliation", label: "Reconciliation", icon: RefreshCw },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/cashflow", label: "Cash Flow", icon: TrendingUp },
  { href: "/import", label: "Import / Export", icon: Download },
  { href: "/support", label: "Support", icon: MessageCircle },
];

const bottomNav = [
  { href: "/settings", label: "Settings", icon: Settings },
];

function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col bg-slate-100 border-r border-slate-200",
        mobile && "fixed inset-y-0 left-0 z-50 shadow-2xl"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-slate-900">TrueBooks</span>
        </Link>
        {mobile && (
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* AI Agent status badge */}
      <div className="mx-3 mt-3 flex items-center gap-2 rounded-xl bg-brand-50 border border-brand-100 px-3 py-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100">
          <Zap className="h-3 w-3 text-brand-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-brand-700">AI Agent Active</p>
          <p className="text-[10px] text-brand-500">Auto-categorizing transactions</p>
        </div>
        <div className="ml-auto h-2 w-2 rounded-full bg-green-400 animate-pulse" />
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn("sidebar-link", active && "active")}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && (
                <ChevronRight className="ml-auto h-3 w-3 text-brand-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-3 border-t border-slate-200 space-y-1">
        {bottomNav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="sidebar-link"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
        <button className="sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-700">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar mobile onClose={() => setSidebarOpen(false)} />
        </>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <button
            className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition-colors">
              <HelpCircle className="h-5 w-5" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
              JD
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
