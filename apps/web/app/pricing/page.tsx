import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Transparent, no surprises",
  description: "TrueBooks plans start at $19/mo. 3-5x cheaper than QuickBooks with better reliability and real human support.",
};

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-16">
        <Pricing />
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}
