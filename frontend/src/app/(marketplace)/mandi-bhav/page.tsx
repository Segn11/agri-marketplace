"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Building2,
  Package,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getMandiPrices } from "@/lib/agribazaar";
import { MandiPrice } from "@/types";

export default function MandiBhavPage() {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const loadPrices = async () => {
    try {
      setRefreshing(true);
      const data = await getMandiPrices();
      setPrices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const regions = ["ALL", ...Array.from(new Set(prices.map((p) => p.stateRegion)))];

  const filtered = prices.filter((item) => {
    const matchesSearch =
      item.commodityName.toLowerCase().includes(search.toLowerCase()) ||
      item.mandiMarket.toLowerCase().includes(search.toLowerCase()) ||
      (item.variety && item.variety.toLowerCase().includes(search.toLowerCase()));
    const matchesRegion = selectedRegion === "ALL" || item.stateRegion === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-[#1c4482] via-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-400/10 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <Store className="w-3.5 h-3.5" />
              <span>AgriBazaar Intelligence • Pillar 4</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Mandi Bhav — Real-Time Commodity Price Intelligence
            </h1>
            <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
              Official wholesale terminal spot rates, price spreads (Min / Max / Modal), and arrival volumes across 7 major agricultural mandis. Directly sourced from platform transactions and physical market surveys to empower farmers with fair price discovery.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-blue-200">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Recorded: Today
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Database-Verified Spot Trades
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-blue-300" /> 7 Key Mandi Terminals
              </span>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by commodity (Teff, Coffee, Wheat) or Mandi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4482]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    selectedRegion === reg
                      ? "bg-white text-[#1c4482] shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {reg === "ALL" ? "All Regions" : reg}
                </button>
              ))}
            </div>

            <button
              onClick={loadPrices}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Mandi Bhav Cards Grid */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <RefreshCw className="w-8 h-8 animate-spin text-[#1c4482] mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Loading live Mandi Bhav terminal prices...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">No mandi rates match your filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const spread = item.maxPrice - item.minPrice;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all p-6 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Commodity & Trend Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          {item.variety || "Spot Lot"}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mt-1 group-hover:text-[#1c4482] transition-colors">
                          {item.commodityName}
                        </h3>
                      </div>
                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.trend === "UP"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.trend === "DOWN"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.trend === "UP" && <TrendingUp className="w-3.5 h-3.5" />}
                        {item.trend === "DOWN" && <TrendingDown className="w-3.5 h-3.5" />}
                        {item.trend === "STABLE" && <Minus className="w-3.5 h-3.5" />}
                        <span>{item.trend === "UP" ? "Bullish" : item.trend === "DOWN" ? "Softening" : "Stable"}</span>
                      </div>
                    </div>

                    {/* Mandi Terminal & Region */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">{item.mandiMarket}</span>
                      <span>({item.stateRegion})</span>
                    </div>

                    {/* Modal Benchmark Box */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-1">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Modal Wholesale Benchmark
                      </div>
                      <div className="text-2xl font-black text-[#1c4482]">
                        {formatCurrency(item.modalPrice)}{" "}
                        <span className="text-xs font-normal text-slate-500">/ {item.unit}</span>
                      </div>
                    </div>

                    {/* Price Spread: Min vs Max */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                        <span className="text-slate-500 block">Day Min</span>
                        <span className="font-bold text-emerald-800 text-sm">
                          {formatCurrency(item.minPrice)}
                        </span>
                      </div>
                      <div className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                        <span className="text-slate-500 block">Day Max</span>
                        <span className="font-bold text-blue-800 text-sm">
                          {formatCurrency(item.maxPrice)}
                        </span>
                      </div>
                    </div>

                    {/* Volume Arrival & Spread */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        Arrivals: <strong className="text-slate-700 font-semibold">{item.arrivalVolumeQuintals.toLocaleString()} Quintals</strong>
                      </span>
                      <span>
                        Spread: <strong className="text-slate-700 font-semibold">{formatCurrency(spread)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* CTA link to view matching trades */}
                  <div className="pt-5 mt-4 border-t border-slate-100">
                    <Link
                      href={`/products?q=${encodeURIComponent(item.commodityName)}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-100 hover:bg-[#1c4482] hover:text-white text-[#1c4482] font-bold text-xs transition duration-150"
                    >
                      <span>Explore Active Trades for this Commodity</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
