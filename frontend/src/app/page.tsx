"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  MapPin,
  Sparkles,
  ShoppingBag,
  Leaf,
  Scale,
  Award,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const categories = [
    {
      name: "Cereals & Grains",
      slug: "cereals-grains",
      items: "Teff, Wheat, Barley, Maize, Sorghum",
      icon: "🌾",
      count: "140+ Listings",
      bgColor: "bg-amber-50 border-amber-200/60 text-amber-900",
    },
    {
      name: "Fresh Vegetables",
      slug: "vegetables",
      items: "Red Onions, Tomatoes, Potatoes, Cabbage",
      icon: "🥦",
      count: "95+ Listings",
      bgColor: "bg-emerald-50 border-emerald-200/60 text-emerald-900",
    },
    {
      name: "Fruits & Orchards",
      slug: "fruits",
      items: "Avocados, Mangoes, Bananas, Citrus",
      icon: "🥑",
      count: "70+ Listings",
      bgColor: "bg-lime-50 border-lime-200/60 text-lime-900",
    },
    {
      name: "Pulses & Oilseeds",
      slug: "pulses-oilseeds",
      items: "Red Beans, Chickpeas, Lentils, Sesame",
      icon: "🫘",
      count: "60+ Listings",
      bgColor: "bg-orange-50 border-orange-200/60 text-orange-900",
    },
    {
      name: "Specialty Coffee & Spices",
      slug: "coffee-spices",
      items: "Highland Arabica, Ginger, Korarima, Garlic",
      icon: "☕",
      count: "85+ Listings",
      bgColor: "bg-stone-100 border-stone-200/80 text-stone-900",
    },
    {
      name: "Dairy & Livestock",
      slug: "dairy-poultry",
      items: "Pure Butter, Fresh Honey, Eggs, Dairy",
      icon: "🍯",
      count: "45+ Listings",
      bgColor: "bg-yellow-50 border-yellow-200/60 text-yellow-900",
    },
  ];

  const featuredProduce = [
    {
      id: "p1",
      name: "White Magna Teff (Grade 1)",
      category: "Cereals & Grains",
      farmerName: "Gemechu Desta",
      farmName: "Oda Gida Farm",
      farmerRating: 4.9,
      unitPrice: 9400,
      unit: "Quintal (100kg)",
      quantityAvailable: 60,
      location: "East Highland Zone",
      badge: "Organic Certified",
    },
    {
      id: "p2",
      name: "Fresh Red Cooking Onions",
      category: "Vegetables",
      farmerName: "Chala Tolosa",
      farmName: "Valley Green Gardens",
      farmerRating: 4.8,
      unitPrice: 85,
      unit: "KG",
      quantityAvailable: 1500,
      location: "River Basin District",
      badge: "Freshly Harvested",
    },
    {
      id: "p3",
      name: "Sun-Dried Arabica Coffee Beans",
      category: "Coffee & Spices",
      farmerName: "Tigist Bekele",
      farmName: "Highland Forest Cooperative",
      farmerRating: 5.0,
      unitPrice: 420,
      unit: "KG",
      quantityAvailable: 400,
      location: "Southern Slopes",
      badge: "Specialty Grade",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-brand-300/20 via-emerald-200/30 to-harvest-200/20 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 shadow-sm text-xs font-semibold text-brand-800">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              <span>National Agricultural Marketplace</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-normal">Direct Farm-to-Buyer Connections</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Fresh Farm Produce,{" "}
              <span className="bg-gradient-to-r from-brand-700 via-brand-600 to-emerald-500 bg-clip-text text-transparent">
                Direct From The Grower
              </span>
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Say goodbye to middlemen and inflated prices. Trade crops, grains, and fresh harvests directly with verified regional farmers through guaranteed stock tracking.
            </p>

            {/* Ultra Modern Search & Filter Console */}
            <div className="pt-4 max-w-3xl mx-auto">
              <div className="glass-panel p-2.5 sm:p-3 rounded-2xl shadow-soft-lg flex flex-col md:flex-row items-center gap-2.5">
                <div className="flex items-center flex-1 w-full px-3 py-2 bg-slate-50/70 rounded-xl border border-slate-200/70 focus-within:bg-white focus-within:border-brand-500 transition">
                  <Search className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search Teff, Coffee, Fresh Onions, Avocado..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                </div>

                <div className="w-full md:w-48 px-3 py-2 bg-slate-50/70 rounded-xl border border-slate-200/70">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Farming Zones</option>
                    <option value="central">Central High Plateau</option>
                    <option value="western">Western Fertile Basin</option>
                    <option value="eastern">Eastern Rift Valley</option>
                    <option value="southern">Southern Highlands</option>
                  </select>
                </div>

                <Link href={`/products?q=${searchQuery}`} className="w-full md:w-auto">
                  <Button size="lg" className="w-full md:w-auto bg-brand-700 hover:bg-brand-800 text-white shadow-glow-sm font-semibold">
                    Search Harvest
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>

              {/* Quick tags */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-400">Popular:</span>
                {["White Teff", "Red Onions", "Sun-Dried Coffee", "Highland Barley", "Hass Avocados"].map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?q=${tag}`}
                    className="px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-700 transition shadow-xs"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Key Trust Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-200/60 max-w-4xl mx-auto">
              <div className="p-4 rounded-xl glass-panel text-left">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">500+</span>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Verified Farmers</p>
              </div>
              <div className="p-4 rounded-xl glass-panel text-left">
                <span className="text-2xl sm:text-3xl font-extrabold text-brand-700">1,200+</span>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Tons Harvest Traded</p>
              </div>
              <div className="p-4 rounded-xl glass-panel text-left">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</span>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Direct Farm Price</p>
              </div>
              <div className="p-4 rounded-xl glass-panel text-left">
                <span className="text-2xl sm:text-3xl font-extrabold text-harvest-600">0%</span>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Middlemen Fees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Browse Catalog</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Explore By Crop Category</h2>
            <p className="text-sm text-slate-500 mt-1">Sourced fresh from certified regional harvest locations.</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-bold text-brand-700 hover:text-brand-800 group"
          >
            Browse all harvests
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group p-6 rounded-2xl glass-panel hover:bg-white hover:border-brand-500 hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {cat.count}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{cat.items}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-700">
                <span>View listings</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Produce Showcase */}
      <section className="py-16 bg-white/60 border-y border-slate-200/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-harvest-600">Fresh Today</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Featured Farm Harvests</h2>
              <p className="text-sm text-slate-500 mt-1">Available for immediate booking and delivery arrangement.</p>
            </div>
            <Link href="/products">
              <Button variant="outline" size="sm" className="font-semibold text-slate-700">
                View All Available Stock
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProduce.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft hover:shadow-soft-lg hover:border-brand-500/50 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-brand-800 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">
                      {p.category}
                    </span>
                    <span className="text-xs font-semibold text-harvest-800 bg-harvest-100 px-2.5 py-0.5 rounded-full">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-700 transition">
                    {p.name}
                  </h3>

                  <div className="mt-3 flex items-center text-xs text-slate-500 gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{p.location}</span>
                    <span>•</span>
                    <span className="text-slate-700 font-medium">{p.farmName}</span>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-brand-700 tracking-tight">
                        {formatCurrency(p.unitPrice)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium ml-1">/ {p.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-600 block">
                        Stock: {p.quantityAvailable} {p.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-harvest-500" />
                    <span className="text-xs font-bold text-slate-800">{p.farmerRating}</span>
                    <span className="text-[11px] text-slate-400">Farmer Trust</span>
                  </div>

                  <Link href="/products">
                    <Button size="sm" className="bg-brand-700 hover:bg-brand-800 text-white font-semibold">
                      Order Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-Column Audience Section */}
      <section className="py-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Platform Ecosystem</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Built For Both Sides Of The Harvest
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Whether you cultivate crops or procure for businesses and households, AgriMarket makes agricultural trade seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Farmer Card */}
          <div className="rounded-3xl border border-brand-200/80 bg-gradient-to-br from-brand-50/60 to-white p-8 sm:p-10 shadow-soft flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-glow-sm mb-6">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Are You A Farmer Or Cooperative?</h3>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Take control of your harvests. Set your own fair prices without broker exploitation, manage available stock in real-time, and get notified immediately when buyers place an order.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  Free product listing with multi-image support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  Anti-overselling atomic stock reservation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  Direct buyer phone contacts upon order acceptance
                </li>
              </ul>
            </div>

            <Link href="/register" className="mt-8">
              <Button size="lg" className="w-full sm:w-auto bg-brand-700 hover:bg-brand-800 text-white font-semibold">
                Start Selling Your Harvest
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Buyer Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50/70 to-white p-8 sm:p-10 shadow-soft flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-soft mb-6">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Are You A Buyer Or Business?</h3>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Find the freshest farm harvests at origin prices. Compare produce listings across multiple farming communities, monitor order status, and coordinate pickup or delivery smoothly.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  Transparent regional price comparison
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  Real-time status updates: Pending, Accepted, Ready
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  Verified review ratings from completed orders
                </li>
              </ul>
            </div>

            <Link href="/products" className="mt-8">
              <Button size="lg" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                Explore All Produce
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
