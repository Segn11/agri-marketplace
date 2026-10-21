"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Sprout, ShoppingCart, LogOut, User as UserIcon, Sparkles } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full shadow-xs bg-white">
      {/* ── TOP ROYAL NAVY BLUE STRIP (AGRIBAZAAR SIGNATURE) ── */}
      <div className="bg-[#1c4482] text-white text-xs py-2 px-4 sm:px-8 border-b border-blue-900/40">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-6">
            <Link
              href="/register"
              className="font-bold tracking-wider text-white hover:text-amber-300 transition text-[11px] uppercase"
            >
              PARTNER WITH US
            </Link>
            <span className="hidden sm:inline text-blue-300/40">|</span>
            <span className="hidden sm:inline text-blue-100/80 font-normal text-[11px]">
              National Integrated Agritech Commodity Platform & Direct Trade Exchange
            </span>
          </div>

          {/* Search bar inside header top strip */}
          <div className="flex items-center gap-5 w-full md:w-auto justify-end">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Explore trades by commodities and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="w-full pl-3 pr-8 py-1.5 rounded bg-white text-slate-800 placeholder:text-slate-400 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <Link href={`/products?q=${encodeURIComponent(searchQuery)}`}>
                <Search className="h-3.5 w-3.5 text-slate-500 absolute right-2.5 top-2.5 cursor-pointer hover:text-blue-700" />
              </Link>
            </div>

            <Link
              href="/products"
              className="text-white hover:text-amber-200 font-semibold text-xs whitespace-nowrap hidden sm:inline"
            >
              Create Your Trade
            </Link>

            {user ? (
              <Link
                href={
                  user.role === "ROLE_ADMIN"
                    ? "/admin"
                    : user.role === "ROLE_FARMER"
                    ? "/farmer"
                    : "/buyer"
                }
                className="text-amber-300 hover:text-white font-semibold text-xs whitespace-nowrap flex items-center gap-1 transition"
              >
                <UserIcon className="h-3.5 w-3.5" />
                {user.fullName || user.email}
              </Link>
            ) : (
              <Link
                href="/register"
                className="text-white hover:text-amber-200 font-semibold text-xs underline whitespace-nowrap"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN NAVIGATION BAR ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto flex h-18 items-center justify-between px-4 sm:px-8 py-3">
          {/* AgriBazaar-style circular badge logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="h-10 w-10 rounded-full bg-[#d81b60] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-slate-900 leading-none lowercase">
                agri<span className="text-[#1c4482]">marketplace</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
                Integrated Agritech Exchange
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-[#1c4482] transition">About agrimarket</Link>
            <Link href="/#services" className="hover:text-[#1c4482] transition">Our Products</Link>
            <Link href="/#all-services" className="hover:text-[#1c4482] transition">Our Services</Link>
            <Link href="/products" className="font-semibold text-[#1c4482] hover:text-blue-800 transition">Trades</Link>
            <Link
              href="/assistant"
              className="inline-flex items-center gap-1.5 font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 px-2.5 py-1 rounded-full transition text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span>AI Advisor</span>
              <span className="bg-teal-600 text-white text-[9px] px-1 py-0.2 rounded font-extrabold uppercase">RAG</span>
            </Link>
            {user && (
              <Link
                href={
                  user.role === "ROLE_ADMIN"
                    ? "/admin"
                    : user.role === "ROLE_FARMER"
                    ? "/farmer"
                    : "/buyer"
                }
                className="font-bold text-[#1c4482] hover:text-[#d81b60] transition flex items-center gap-1.5"
              >
                {user.role === "ROLE_ADMIN" && "Admin Portal"}
                {user.role === "ROLE_FARMER" && "Farmer Portal"}
                {user.role === "ROLE_BUYER" && "Buyer Portal"}
              </Link>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3.5">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-xl text-slate-700 hover:text-[#1c4482] hover:bg-slate-100 transition"
              title="View Procurement Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d81b60] text-white font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={
                    user.role === "ROLE_ADMIN"
                      ? "/admin"
                      : user.role === "ROLE_FARMER"
                      ? "/farmer"
                      : "/buyer"
                  }
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <UserIcon className="h-3.5 w-3.5 text-[#1c4482]" />
                  My Portal
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-[#d81b60] hover:bg-[#c2185b] text-white px-7 py-2 rounded-lg text-sm font-semibold shadow-xs transition">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d81b60] text-white font-bold text-[10px] h-4 w-4 rounded-full flex items-center justify-center">
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">About agrimarket</Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#1c4482] font-bold">Commodity Trades</Link>
          <Link
            href="/assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-1 text-teal-700 font-bold"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>AI Advisor & RAG Hub</span>
          </Link>
          <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">Procurement Cart ({totalItems})</Link>
          {user && (
            <Link
              href={
                user.role === "ROLE_ADMIN"
                  ? "/admin"
                  : user.role === "ROLE_FARMER"
                  ? "/farmer"
                  : "/buyer"
              }
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 px-3 bg-blue-50 text-[#1c4482] font-bold rounded"
            >
              Go to {user.role === "ROLE_ADMIN" ? "Admin" : user.role === "ROLE_FARMER" ? "Farmer" : "Buyer"} Portal
            </Link>
          )}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            {user ? (
              <button onClick={handleLogout} className="w-full bg-red-50 text-red-700 py-2 rounded-lg text-xs font-semibold">
                Sign Out ({user.fullName || user.email})
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-1/2">
                  <button className="w-full bg-[#d81b60] text-white py-2 rounded-lg text-xs font-semibold">Login</button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-1/2">
                  <button className="w-full bg-[#1c4482] text-white py-2 rounded-lg text-xs font-semibold">Register</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
