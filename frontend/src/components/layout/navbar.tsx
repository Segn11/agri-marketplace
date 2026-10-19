"use client";

import Link from "next/link";
import { Sprout, ShoppingCart, User, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-700 text-white shadow-sm">
            <Sprout className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-gray-900">AgriMarket</span>
            <span className="text-xs text-green-700 font-medium">Nekemte & Beyond</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/products" className="text-gray-700 hover:text-green-700 transition">
            Browse Market
          </Link>
          <Link href="/farmer" className="text-gray-700 hover:text-green-700 transition">
            Farmer Dashboard
          </Link>
          <Link href="/buyer" className="text-gray-700 hover:text-green-700 transition">
            My Orders
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Search className="h-4 w-4 mr-1.5" />
              Search
            </Button>
          </Link>

          <Link href="/farmer">
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Sell Produce
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-1.5" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
