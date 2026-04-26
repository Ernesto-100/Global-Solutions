import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency = "USD",
  compact = false
): string {
  if (compact && Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string, fmt = "MMM d, yyyy"): string {
  try {
    return format(parseISO(dateString), fmt);
  } catch {
    return dateString;
  }
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

export function classifyAmount(amount: number) {
  return amount >= 0 ? "positive" : "negative";
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

export const INVOICE_STATUSES = {
  draft: { label: "Draft", color: "badge-slate" },
  sent: { label: "Sent", color: "badge-blue" },
  viewed: { label: "Viewed", color: "badge-yellow" },
  paid: { label: "Paid", color: "badge-green" },
  overdue: { label: "Overdue", color: "badge-red" },
  cancelled: { label: "Cancelled", color: "badge-slate" },
} as const;

export const TRANSACTION_CATEGORIES = [
  "Advertising & Marketing",
  "Bank Fees",
  "Business Meals",
  "Contractor Payments",
  "Equipment",
  "Insurance",
  "Interest Expense",
  "Legal & Professional",
  "Office Supplies",
  "Payroll",
  "Rent",
  "Sales Revenue",
  "Software & SaaS",
  "Travel",
  "Utilities",
  "Other Income",
  "Other Expense",
] as const;
