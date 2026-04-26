import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TrueBooks — Bookkeeping Small Businesses Actually Trust",
    template: "%s | TrueBooks",
  },
  description:
    "Switch from QuickBooks in one day. Reliable invoicing, expenses, reconciliation, and cash flow — with real human support. Starting at $19/mo.",
  keywords: [
    "bookkeeping software",
    "small business accounting",
    "QuickBooks alternative",
    "invoicing",
    "expense tracking",
    "cash flow",
    "reconciliation",
  ],
  authors: [{ name: "TrueBooks" }],
  creator: "TrueBooks",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://truebooks.io",
    title: "TrueBooks — Bookkeeping Small Businesses Actually Trust",
    description:
      "Switch from QuickBooks in one day. Never worry about your books again.",
    siteName: "TrueBooks",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrueBooks — Bookkeeping Small Businesses Actually Trust",
    description:
      "Switch from QuickBooks in one day. Never worry about your books again.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
