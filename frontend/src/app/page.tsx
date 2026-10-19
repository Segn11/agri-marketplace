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
  Zap,
  BarChart3,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Cereals & Grains", slug: "cereals-grains", items: "Teff, Wheat, Barley, Maize, Sorghum", icon: "🌾", count: 140 },
    { name: "Fresh Vegetables", slug: "vegetables", items: "Red Onions, Tomatoes, Potatoes, Cabbage", icon: "🥦", count: 95 },
    { name: "Fruits & Orchards", slug: "fruits", items: "Avocados, Mangoes, Bananas, Citrus", icon: "🥑", count: 70 },
    { name: "Pulses & Oilseeds", slug: "pulses-oilseeds", items: "Red Beans, Chickpeas, Lentils, Sesame", icon: "🫘", count: 60 },
    { name: "Coffee & Spices", slug: "coffee-spices", items: "Highland Arabica, Ginger, Korarima, Garlic", icon: "☕", count: 85 },
    { name: "Dairy & Livestock", slug: "dairy-poultry", items: "Pure Butter, Fresh Honey, Eggs, Dairy", icon: "🍯", count: 45 },
  ];

  const featuredProduce = [
    {
      id: "p1", name: "White Magna Teff (Grade 1)", category: "Cereals & Grains",
      farmerName: "Gemechu Desta", farmName: "Oda Gida Cooperative", farmerRating: 4.9,
      unitPrice: 9400, unit: "Quintal", quantityAvailable: 60,
      location: "East Highland Zone", badge: "Organic",
    },
    {
      id: "p2", name: "Fresh Red Cooking Onions", category: "Vegetables",
      farmerName: "Chala Tolosa", farmName: "Valley Green Gardens", farmerRating: 4.8,
      unitPrice: 85, unit: "KG", quantityAvailable: 1500,
      location: "River Basin District", badge: "Fresh Harvest",
    },
    {
      id: "p3", name: "Sun-Dried Arabica Coffee", category: "Coffee & Spices",
      farmerName: "Tigist Bekele", farmName: "Highland Forest Cooperative", farmerRating: 5.0,
      unitPrice: 420, unit: "KG", quantityAvailable: 400,
      location: "Western Highlands", badge: "Specialty Grade",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden hero-mesh pt-10 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-36">
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-brand-400/10 via-emerald-300/15 to-harvest-300/10 blur-[80px] rounded-full -z-10 pointer-events-none animate-float" />
        <div className="absolute bottom-[-40px] right-[-100px] w-[300px] h-[300px] bg-gradient-to-br from-brand-500/8 to-emerald-400/6 blur-[60px] rounded-full -z-10 pointer-events-none animate-float-delayed" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/80 backdrop-blur-md px-5 py-2 shadow-sm border border-brand-200/50 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="live-beacon absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              <span className="text-brand-800">Live Marketplace</span>
              <span className="h-3 w-px bg-slate-300" />
              <span className="text-slate-500 font-medium">500+ Active Farmers Trading Now</span>
            </div>

            {/* Primary Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.08] text-slate-900">
              Trade Fresh Harvest{" "}
              <br className="hidden sm:block" />
              <span className="text-shimmer">
                Direct From The Grower
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-500 leading-relaxed">
              Zero middlemen. Transparent pricing. Atomic stock tracking. Connect directly with verified agricultural producers across all farming regions.
            </p>

            {/* Search Console */}
            <div className="pt-2 max-w-3xl mx-auto">
              <div className="glass-panel p-2 sm:p-2.5 rounded-2xl flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center flex-1 w-full px-4 py-2.5 bg-white/80 rounded-xl border border-slate-200/80 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <Search className="h-[18px] w-[18px] text-slate-400 mr-2.5 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search Teff, Coffee, Onions, Avocado..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                </div>
                <Link href={`/products?q=${searchQuery}`} className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto btn-primary-gradient text-white font-semibold px-7 py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5">
                    Search Harvest
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>

              {/* Quick Tags */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Popular:</span>
                {["White Teff", "Red Onions", "Sun-Dried Coffee", "Highland Barley", "Hass Avocados"].map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?q=${tag}`}
                    className="px-3 py-1 rounded-full bg-white/90 border border-slate-200/70 text-slate-600 font-medium hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50/50 transition-all shadow-xs"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-14 max-w-4xl mx-auto">
            {[
              { label: "Verified Farmers", value: "500+", accent: "text-slate-900" },
              { label: "Tons Traded", value: "1,200+", accent: "text-shimmer" },
              { label: "Direct Farm Price", value: "100%", accent: "text-slate-900" },
              { label: "Middlemen Fees", value: "0%", accent: "text-harvest-600" },
            ].map((kpi, i) => (
              <div key={i} className="glass-panel rounded-2xl p-5 text-center">
                <span className={`text-3xl sm:text-4xl font-extrabold ${kpi.accent}`}>{kpi.value}</span>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CATEGORIES ═══════ */}
      <section className="py-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60 mb-3">
              <Sparkles className="h-3 w-3" /> Browse Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Explore By Crop Category</h2>
            <p className="text-sm text-slate-500 mt-1.5">Sourced fresh from certified regional harvest locations.</p>
          </div>
          <Link href="/products" className="inline-flex items-center text-sm font-bold text-brand-700 hover:text-brand-800 group">
            Browse all harvests
            <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="cat-card group p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {cat.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                    {cat.count}+ Listings
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{cat.items}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-brand-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View listings</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURED PRODUCE ═══════ */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-divider mb-16" />
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-harvest-700 bg-harvest-50 px-3 py-1 rounded-full border border-harvest-200/60 mb-3">
                <Zap className="h-3 w-3" /> Available Now
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Featured Farm Harvests</h2>
              <p className="text-sm text-slate-500 mt-1.5">Ready for immediate booking and delivery coordination.</p>
            </div>
            <Link href="/products">
              <Button variant="outline" size="sm" className="font-semibold">View All Stock</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProduce.map((p) => (
              <div key={p.id} className="produce-card group p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200/60">
                      {p.category}
                    </span>
                    <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-harvest-50 text-harvest-800 border border-harvest-200/60">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-700 transition">{p.name}</h3>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span>{p.location}</span>
                    <span className="h-3 w-px bg-slate-200" />
                    <span className="font-medium text-slate-700">{p.farmName}</span>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-black text-brand-700 tracking-tight">{formatCurrency(p.unitPrice)}</span>
                      <span className="text-xs font-medium text-slate-400 ml-1.5">/ {p.unit}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{p.quantityAvailable} {p.unit} avail.</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-harvest-500" />
                    <span className="text-sm font-black text-slate-800">{p.farmerRating}</span>
                    <span className="text-[11px] text-slate-400 font-medium">by {p.farmerName}</span>
                  </div>
                  <Link href="/products">
                    <button className="btn-primary-gradient text-white text-xs font-semibold px-5 py-2 rounded-xl">
                      Order Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FOR FARMERS & BUYERS ═══════ */}
      <section className="py-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60 mb-3">
            <Globe2 className="h-3 w-3" /> Platform Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built For Both Sides Of The Harvest
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Whether you grow crops or procure for businesses, AgriMarket makes trade seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Farmer */}
          <div className="rounded-3xl border border-brand-200/50 bg-gradient-to-br from-brand-50/40 via-white to-brand-50/30 p-8 sm:p-10 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white flex items-center justify-center shadow-glow-sm mb-8">
                <Leaf className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">For Farmers & Cooperatives</h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                Set your own fair prices, manage real-time stock inventory, and receive instant notifications when buyers place orders.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700 font-medium">
                {["Free product listings with multi-image support", "Anti-overselling atomic stock reservation", "Direct buyer phone on order acceptance"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/register" className="mt-8">
              <button className="btn-primary-gradient w-full sm:w-auto text-white font-semibold px-7 py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                Start Selling Your Harvest
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>

          {/* Buyer */}
          <div className="rounded-3xl border border-slate-200/60 bg-gradient-to-br from-slate-50/50 via-white to-slate-50/30 p-8 sm:p-10 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-600 text-white flex items-center justify-center shadow-soft mb-8">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">For Buyers & Businesses</h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                Find the freshest farm harvests at origin prices. Compare listings across multiple regions and coordinate delivery directly.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700 font-medium">
                {["Transparent regional price comparison", "Real-time status: Pending → Accepted → Ready", "Verified review ratings from completed orders"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/products" className="mt-8">
              <button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold px-7 py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition">
                Explore All Produce
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ TRUST BAR ═══════ */}
      <section className="py-12 border-t border-slate-200/60 bg-white/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Anti-Overselling Guard", desc: "Atomic inventory locks prevent duplicate stock sales with version-controlled transactions." },
              { icon: Scale, title: "Fair Price Discovery", desc: "Farmers control pricing. No hidden fees, commissions, or broker cuts. 100% direct margin." },
              { icon: BarChart3, title: "Verified Trust Ratings", desc: "Only verified buyers who completed orders can submit ratings, building authentic trust." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-5 rounded-2xl hover:bg-white/80 transition">
                <div className="h-11 w-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0 border border-brand-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
