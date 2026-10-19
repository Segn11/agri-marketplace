"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, PhoneCall, ChevronDown, User, ShieldCheck, ArrowRight, PlusCircle } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* ── TOP NAVY STRIP (AgriBazaar Signature) ── */}
      <div className="agri-topbar text-xs py-2 px-4 sm:px-8 border-b border-blue-900/40">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <Link href="/register" className="font-semibold uppercase tracking-wider text-amber-300 hover:text-white transition">
              Partner With Us
            </Link>
            <span className="hidden sm:inline text-blue-300">|</span>
            <span className="hidden sm:inline text-blue-100 font-medium">
              National Integrated Agritech & Commodity Trading Platform
            </span>
          </div>

          {/* Search in topbar */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Explore trades by commodities and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-1 rounded bg-white text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <Link href={`/products?q=${searchQuery}`}>
                <Search className="h-3.5 w-3.5 text-slate-600 absolute right-2.5 top-2 cursor-pointer hover:text-red-600" />
              </Link>
            </div>

            <Link href="/farmer" className="hidden lg:inline text-white hover:text-amber-300 font-medium whitespace-nowrap">
              Create Your Trade
            </Link>
            <span className="hidden lg:inline text-blue-400">|</span>
            <Link href="/register" className="text-white hover:text-amber-300 font-semibold whitespace-nowrap">
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVIGATION HEADER ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto flex h-18 items-center justify-between px-4 sm:px-8 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="h-10 w-10 rounded-full bg-agriRed flex items-center justify-center text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-6 h-6">
                <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9A9 9 0 0 1 3 11c0-4.97 4.03-9 9-9z" />
                <path d="M12 7c-2 2-3 4-3 6a3 3 0 0 0 6 0c0-2-1-4-3-6z" fill="currentColor" opacity="0.9" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
                agri<span className="text-agriRed">bazaar</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                Integrated Agritech Platform
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-agriRed transition">About agribazaar</Link>
            <Link href="/products" className="hover:text-agriRed transition">Our Products</Link>
            <Link href="/#services" className="hover:text-agriRed transition">Our Services</Link>
            <Link href="/products" className="hover:text-agriRed transition font-semibold text-agriRed">
              Live Trades / Mandi
            </Link>
            <Link href="/farmer" className="hover:text-agriRed transition">Farmer Hub</Link>
            <Link href="/buyer" className="hover:text-agriRed transition">Buyer Portal</Link>
            <Link href="/admin" className="hover:text-agriRed transition">Admin</Link>
          </nav>

          {/* Auth Action */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link href="/farmer">
              <button className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-agriNavy-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded transition">
                <PlusCircle className="h-3.5 w-3.5 text-agriRed" />
                Sell Harvest
              </button>
            </Link>
            <Link href="/login">
              <button className="btn-agri-red px-6 py-2 rounded text-sm font-semibold shadow-sm">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">About agribazaar</Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">Our Products & Harvests</Link>
          <Link href="/#services" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">Our Services</Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-agriRed font-semibold">Live Trades</Link>
          <Link href="/farmer" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">Farmer Hub</Link>
          <Link href="/buyer" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">Buyer Orders</Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800 font-medium">Admin</Link>
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-1/2">
              <button className="w-full btn-agri-red py-2 rounded text-xs font-semibold">Login</button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-1/2">
              <button className="w-full bg-slate-900 text-white py-2 rounded text-xs font-semibold">Register</button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
