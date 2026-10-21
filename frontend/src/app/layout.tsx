import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AgriCopilotWidget } from "@/components/ai/AgriCopilotWidget";

export const metadata: Metadata = {
  title: "Agri Marketplace | Leading Integrated Agricultural Marketplace & Commodity Exchange",
  description: "Agri Marketplace is the leading digital agricultural marketplace connecting farmers and cooperatives directly with millers, commercial traders, and buyers with certified quality grading and trade escrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-teal-600 selection:text-white">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <AgriCopilotWidget />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
