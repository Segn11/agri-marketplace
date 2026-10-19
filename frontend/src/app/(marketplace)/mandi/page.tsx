"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  MapPin,
  Calendar,
  AlertCircle,
  Building2,
  Layers,
  Sparkles,
  CheckCircle,
  Bell,
  RefreshCw,
} from "lucide-react";
import { ETHIOPIA_MANDI_RATES, MandiRate } from "@/lib/ethiopia-data";
import { formatCurrency } from "@/lib/utils";

export default function MandiRatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [alertPhone, setAlertPhone] = useState<string>("");
  const [alertSubmitted, setAlertSubmitted] = useState<boolean>(false);

  const categories = [
    { id: "ALL", name: "All Categories" },
    { id: "Cereals & Grains", name: "Cereals & Grains" },
    { id: "Coffee & Spices", name: "Coffee & Spices" },
    { id: "Pulses & Oilseeds", name: "Pulses & Oilseeds" },
    { id: "Vegetables & Horticulture", name: "Vegetables & Horticulture" },
  ];

  const regions = [
    "ALL",
    "Addis Ababa",
    "Oromia",
    "Amhara",
    "Sidama",
    "Central Ethiopia / SNNP",
    "Tigray",
  ];

  const filteredRates = ETHIOPIA_MANDI_RATES.filter((rate) => {
    const matchesCat = selectedCategory === "ALL" || rate.category === selectedCategory;
    const matchesReg = selectedRegion === "ALL" || rate.region === selectedRegion;
    const matchesSearch =
      rate.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rate.marketHub.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesReg && matchesSearch;
  });

  const handleSubscribeAlerts = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertPhone) return;
    setAlertSubmitted(true);
    setTimeout(() => {
      setAlertSubmitted(false);
      setAlertPhone("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-teal-600 transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-bold text-slate-800">Ethiopian Mandi & ECX Market Rates</span>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 p-8 sm:p-12 text-white shadow-xl overflow-hidden mb-10">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Live Regional Mandi Rates • Ethiopian Commodity Exchange (ECX)
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Transparent Mandi Rates for <span className="text-emerald-400">Every Ethiopian Hub</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Real-time daily modal prices, market arrivals, and price deltas aggregated from Kality Central, Adama, Hawassa, Jimma, Gondar, and regional cooperative distribution centers.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5 text-teal-400" /> Hourly Field Synced
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-amber-400" /> 8 Central Mandi Terminals
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> WDRA Assayed Standards
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search crop name (Teff, Coffee, Wheat...) or Mandi hub..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Region selector */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r === "ALL" ? "All Regions (National)" : r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? "bg-teal-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mandi Rates Table / Cards */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Official Ethiopian Commodity Price Board
              </h2>
              <p className="text-xs text-slate-500">
                Showing {filteredRates.length} active market quotes across verified regional terminal hubs
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              Go to Spot Trading Marketplace <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-3.5 px-6">Commodity & Grade</th>
                  <th className="py-3.5 px-6">Mandi Terminal Hub</th>
                  <th className="py-3.5 px-6">Today's Modal Price</th>
                  <th className="py-3.5 px-6">Day High / Low</th>
                  <th className="py-3.5 px-6">24h Net Trend</th>
                  <th className="py-3.5 px-6">Arrival Volume</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredRates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                      No Mandi rates found matching your filter criteria. Try selecting another region or commodity.
                    </td>
                  </tr>
                ) : (
                  filteredRates.map((rate) => (
                    <tr key={rate.id} className="hover:bg-teal-50/40 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 group-hover:text-teal-700 transition">
                          {rate.commodity}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {rate.category} • {rate.unit}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                          {rate.marketHub}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 inline-block mt-0.5">
                          {rate.region}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-base font-black text-slate-900">
                          {formatCurrency(rate.modalPrice)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Prev: {formatCurrency(rate.yesterdayPrice)}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-xs text-slate-700 font-medium">
                          <span className="text-emerald-700 font-bold">{formatCurrency(rate.maxPrice)}</span> /{" "}
                          <span className="text-slate-500">{formatCurrency(rate.minPrice)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">High / Low range</div>
                      </td>

                      <td className="py-4 px-6">
                        {rate.trend === "up" && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                            <TrendingUp className="h-3 w-3" />
                            +{rate.changePercentage}%
                          </div>
                        )}
                        {rate.trend === "down" && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-bold text-xs border border-red-200">
                            <TrendingDown className="h-3 w-3" />
                            {rate.changePercentage}%
                          </div>
                        )}
                        {rate.trend === "flat" && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                            Steady
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 text-xs">{rate.dailyArrivals}</div>
                        <div className="text-[10px] text-slate-400">{rate.lastUpdated}</div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/products?q=${encodeURIComponent(rate.commodity)}`}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs"
                        >
                          Trade Now
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SMS / Telegram Mandi Price Alerts Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 rounded-3xl p-8 sm:p-10 text-white border border-teal-800/40 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
              <Bell className="h-3.5 w-3.5" /> Free Daily Price Dispatch
            </div>
            <h3 className="text-2xl font-black text-white">
              Receive Daily Ethiopian Mandi Rates on Your Phone
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Subscribe to morning SMS alerts with official market opening rates for your preferred woredas and crops.
            </p>
          </div>

          <form onSubmit={handleSubscribeAlerts} className="w-full md:w-auto flex flex-col sm:flex-row gap-2 shrink-0">
            <input
              type="tel"
              placeholder="e.g. 0911 234 567"
              value={alertPhone}
              onChange={(e) => setAlertPhone(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-800/90 border border-teal-800 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 w-full sm:w-64"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-sm whitespace-nowrap"
            >
              {alertSubmitted ? "✓ Subscribed!" : "Subscribe Alerts"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
