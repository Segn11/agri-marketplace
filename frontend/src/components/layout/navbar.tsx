"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Sprout, ShoppingCart, LogOut, User as UserIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const { totalItems, setIsCartDrawerOpen } = useCart();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* ── TOP FOREST-NIGHT STRIP ── */}
      <div className="topbar-strip text-xs py-2 px-4 sm:px-8 border-b border-teal-950/60">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <Link href="/register" className="font-semibold uppercase tracking-wider text-amber-400 hover:text-white transition">
              Partner With Us
            </Link>
            <span className="hidden sm:inline text-teal-700">|</span>
            <span className="hidden sm:inline text-slate-300 font-medium">
              National Integrated Agricultural Marketplace & Direct Trading Platform
            </span>
          </div>

          {/* Search in topbar */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Explore harvests by commodities and regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-1 rounded bg-slate-900/90 text-white placeholder:text-slate-400 border border-teal-800/60 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
              <Link href={`/products?q=${searchQuery}`}>
                <Search className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-2 cursor-pointer hover:text-teal-400" />
              </Link>
            </div>

            {user ? (
              <span className="text-amber-300 font-semibold text-xs whitespace-nowrap flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                {user.fullName || user.email}
              </span>
            ) : (
              <Link href="/register" className="text-white hover:text-amber-300 font-semibold whitespace-nowrap">
                Register
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN NAVIGATION HEADER ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto flex h-18 items-center justify-between px-4 sm:px-8 py-3.5">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-800 via-teal-600 to-emerald-500 text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Sprout className="h-6 w-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500 border-2 border-white"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                Agri<span className="text-teal-600">Marketplace</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">
                Agricultural Commodity Exchange
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs xl:text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-teal-600 transition">Home</Link>
            <Link href="/products" className="hover:text-teal-600 transition">Spot Trading</Link>
            <Link href="/mandi" className="hover:text-teal-600 transition text-amber-700 font-bold">Mandi Rates</Link>
            <Link href="/auctions" className="hover:text-teal-600 transition">e-Auctions</Link>
            <Link href="/storage" className="hover:text-teal-600 transition">Warehouse Silos</Link>
            <Link href="/quality" className="hover:text-teal-600 transition">Quality Assay</Link>
            <Link href="/buyer" className="hover:text-teal-600 transition">Buyer Tracking</Link>
          </nav>

          {/* Action buttons & Cart */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-xl text-slate-700 hover:text-teal-600 hover:bg-slate-100 transition"
              title="View Procurement Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 font-black text-[10px] h-5 w-5 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 px-3.5 py-2 rounded-lg transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            ) : (
              <Link href="/login">
                <button className="btn-brand px-5 py-2 rounded-lg text-sm font-semibold shadow-sm">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger & cart */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 font-bold text-[10px] h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">Home</Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-teal-700 font-bold">Spot Trading Marketplace</Link>
          <Link href="/mandi" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-amber-700 font-bold">Ethiopian Mandi Rates</Link>
          <Link href="/auctions" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">e-Auctions & Tenders</Link>
          <Link href="/storage" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">Warehouse Silos (e-NWR)</Link>
          <Link href="/quality" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">Quality Assay & ECX Grading</Link>
          <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">Shopping Cart ({totalItems})</Link>
          <Link href="/buyer" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">Buyer Order Tracking</Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">Admin Hub</Link>
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            {user ? (
              <button onClick={handleLogout} className="w-full bg-red-50 text-red-700 py-2 rounded-lg text-xs font-semibold">
                Sign Out ({user.fullName})
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-1/2">
                  <button className="w-full btn-brand py-2 rounded-lg text-xs font-semibold">Sign In</button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-1/2">
                  <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold">Register</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
