"use client";

import Link from "next/link";
import { useState } from "react";
import { Sprout, ShoppingCart, User, PlusCircle, Search, Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-brand-500 text-white shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
            <Sprout className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="live-beacon absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500 border-2 border-white"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-700 transition">
              Agri<span className="text-brand-600">Market</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 -mt-0.5">
              Direct Farm Trading
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 p-1 bg-slate-100/70 rounded-full border border-slate-200/60 text-sm font-semibold text-slate-600">
          <Link
            href="/products"
            className="px-4 py-1.5 rounded-full hover:text-brand-700 hover:bg-white hover:shadow-sm transition duration-150"
          >
            Explore Marketplace
          </Link>
          <Link
            href="/farmer"
            className="px-4 py-1.5 rounded-full hover:text-brand-700 hover:bg-white hover:shadow-sm transition duration-150"
          >
            Farmer Portal
          </Link>
          <Link
            href="/buyer"
            className="px-4 py-1.5 rounded-full hover:text-brand-700 hover:bg-white hover:shadow-sm transition duration-150"
          >
            Buyer Orders
          </Link>
          <Link
            href="/admin"
            className="px-4 py-1.5 rounded-full hover:text-brand-700 hover:bg-white hover:shadow-sm transition duration-150"
          >
            Admin Hub
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center space-x-3">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-brand-700 font-semibold">
              <Search className="h-4 w-4 mr-1.5 text-slate-400" />
              Find Harvest
            </Button>
          </Link>

          <Link href="/farmer">
            <Button
              size="sm"
              className="bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 font-semibold shadow-none"
            >
              <PlusCircle className="h-4 w-4 mr-1.5" />
              List Produce
            </Button>
          </Link>

          <Link href="/login">
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm">
              <User className="h-4 w-4 mr-1.5" />
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
          >
            Explore Marketplace
          </Link>
          <Link
            href="/farmer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
          >
            Farmer Portal
          </Link>
          <Link
            href="/buyer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
          >
            Buyer Orders
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
          >
            Admin Hub
          </Link>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button size="md" className="w-full bg-slate-900 text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button size="md" variant="secondary" className="w-full">
                Register Account
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
