"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ShoppingBag,
  CheckCircle,
  X,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronRight,
  Award,
  ShieldCheck,
  Building2,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AgriMarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderModalProduct, setOrderModalProduct] = useState<any | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNote, setOrderNote] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const mockProducts = [
    {
      id: "p1", name: "Premium White Teff (Magna Grade 1)", category: "cereals-grains",
      categoryName: "Cereals & Grains",
      description: "First-grade organic high-purity White Teff freshly harvested from highland fields.",
      unitPrice: 9400, unit: "Quintal (100kg)", quantityAvailable: 45,
      location: "East Highland Mandi", farmerName: "Gemechu Desta",
      cooperative: "Oda Gida Agricultural Union",
      farmerRating: 4.9, totalReviews: 28, assayGrade: "A+ (99.2% Purity)", badge: "Live Auction", status: "ACTIVE",
    },
    {
      id: "p2", name: "Fresh Red Cooking Onions (Export Grade)", category: "vegetables",
      categoryName: "Vegetables",
      description: "Crisp, dry, high-grade red onions suited for commercial kitchen and bulk institutional use.",
      unitPrice: 85, unit: "KG", quantityAvailable: 1200,
      location: "Central River Basin", farmerName: "Chala Tolosa",
      cooperative: "Valley Green Farmer Union",
      farmerRating: 4.8, totalReviews: 42, assayGrade: "Fresh Harvest QC Assured", badge: "Spot Trade", status: "ACTIVE",
    },
    {
      id: "p3", name: "Organic Forest Coffee (Wollega Grade 1)", category: "coffee-spices",
      categoryName: "Coffee & Spices",
      description: "Naturally dried specialty Arabica beans handpicked in highland shade groves.",
      unitPrice: 420, unit: "KG", quantityAvailable: 350,
      location: "Western Forest District", farmerName: "Tigist Bekele",
      cooperative: "Highland Forest Organic Growers",
      farmerRating: 5.0, totalReviews: 19, assayGrade: "Specialty Grade 1 (SCA 86+)", badge: "Specialty", status: "ACTIVE",
    },
    {
      id: "p4", name: "Fresh Hass Avocados (Export Grade)", category: "fruits",
      categoryName: "Fruits & Orchards",
      description: "Creamy, naturally grown export-grade avocados ready for immediate dispatch.",
      unitPrice: 90, unit: "KG", quantityAvailable: 500,
      location: "Southern Fruit Belt", farmerName: "Abebe Megersa",
      cooperative: "Southern Fruit Growers Association",
      farmerRating: 4.7, totalReviews: 15, assayGrade: "Export Standard (Class 1)", badge: "Export Lot", status: "ACTIVE",
    },
    {
      id: "p5", name: "Highland Durum Wheat Grain", category: "cereals-grains",
      categoryName: "Cereals & Grains",
      description: "Clean, dry, plump wheat kernel suitable for flour milling, bakeries, and pasta production.",
      unitPrice: 4800, unit: "Quintal (100kg)", quantityAvailable: 80,
      location: "Northern Plateau Mandi", farmerName: "Dinkisa Lema",
      cooperative: "Plateau Grain Producers",
      farmerRating: 4.6, totalReviews: 9, assayGrade: "13.5% Protein Certified", badge: "Mill Lot", status: "ACTIVE",
    },
    {
      id: "p6", name: "Organic High-Potency Garlic Bulbs", category: "coffee-spices",
      categoryName: "Coffee & Spices",
      description: "Aromatic, potent high-oil garlic freshly harvested, well-cured, and graded.",
      unitPrice: 220, unit: "KG", quantityAvailable: 280,
      location: "Highland Foothills", farmerName: "Meron Assefa",
      cooperative: "Foothills Spice Co-op",
      farmerRating: 4.9, totalReviews: 31, assayGrade: "Grade A Cured", badge: "Direct Spot", status: "ACTIVE",
    },
  ];

  const filtered = mockProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setOrderModalProduct(null);
    }, 2000);
  };

  const categoryTabs = [
    { label: "All Commodities", value: "all", icon: "🌍" },
    { label: "Cereals & Grains", value: "cereals-grains", icon: "🌾" },
    { label: "Vegetables", value: "vegetables", icon: "🥦" },
    { label: "Fruits & Orchards", value: "fruits", icon: "🥑" },
    { label: "Coffee & Spices", value: "coffee-spices", icon: "☕" },
    { label: "Pulses & Seeds", value: "pulses-oilseeds", icon: "🫘" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── AGRIMARKET PRODUCE EXCHANGE HEADER ── */}
      <div
        className="text-white py-12 border-b border-teal-900"
        style={{ background: 'linear-gradient(135deg, #041d1c 0%, #073330 50%, #0a4843 100%)' }}
      >
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-teal-900/80 text-teal-200 border border-teal-500/30 px-3 py-1 rounded text-xs font-semibold mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AgriMarket Produce Exchange & Spot Market</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Commodity Trades & Live Market Listings
            </h1>

            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Procure standardized produce lots directly from verified farmer cooperatives. Backed by third-party quality assay certifications, atomic stock locking, and instant escrow settlement.
            </p>

            {/* Search Input Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-2xl">
              <div className="relative flex-1 w-full">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by commodity, market location, or grower cooperative..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                />
              </div>
              <button className="w-full sm:w-auto btn-brand px-6 py-2.5 rounded text-sm font-semibold flex items-center justify-center gap-2 shadow-sm">
                <Search className="h-4 w-4" />
                Search Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMMODITY CATEGORY SELECTOR STRIP ── */}
      <div className="bg-white border-b border-slate-200 sticky top-[72px] z-20 shadow-xs">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {categoryTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedCategory(tab.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === tab.value
                    ? "btn-brand shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── COMMODITY LOTS GRID ── */}
      <div className="container mx-auto px-4 sm:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-medium text-slate-500">
            Showing <strong className="text-slate-900">{filtered.length}</strong> live commodity trades
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              100% Quality Assured
            </span>
            <span className="flex items-center gap-1">
              <Award className="h-4 w-4 text-amber-600" />
              Atomic Stock Lock
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="agri-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {p.categoryName}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">{p.name}</h3>

                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span>{p.location}</span>
                </div>

                <p className="text-xs text-slate-600 font-medium mt-1 truncate">
                  Seller: <strong className="text-slate-800">{p.farmerName}</strong> ({p.cooperative})
                </p>

                {/* Quality Assay Certification Box */}
                <div className="mt-3.5 py-2 px-3 bg-emerald-50 rounded border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-emerald-600" />
                    <span>{p.assayGrade}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.2 rounded font-bold">
                    LAB TESTED
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">{formatCurrency(p.unitPrice)}</span>
                    <span className="text-[11px] font-medium text-slate-400 ml-1">/{p.unit}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 block">{p.quantityAvailable} {p.unit}</span>
                    <span className="text-[10px] text-slate-400">Available Stock</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Seller Rating:</span>
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{p.farmerRating}</span>
                    <span className="text-slate-400 font-normal">({p.totalReviews} trades)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setOrderModalProduct(p);
                    setOrderQuantity(1);
                    setOrderNote("");
                    setOrderSuccess(false);
                  }}
                  className="w-full btn-brand py-2.5 rounded text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Place Bid / Order Trade
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AGRIMARKET ORDER & BID MODAL ── */}
      {orderModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative border border-slate-200 overflow-hidden">
            <div className="h-1.5 w-full bg-teal-600" />
            <div className="p-7">
              <button
                onClick={() => setOrderModalProduct(null)}
                className="absolute right-5 top-5 p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

              {orderSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="h-14 w-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Trade Order Initiated!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Your trade order has been created in <strong>PENDING</strong> status. Funds are protected in AgriMarket Escrow and the seller has been notified for handover.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {orderModalProduct.categoryName}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">{orderModalProduct.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Seller: {orderModalProduct.farmerName} &bull; {orderModalProduct.location}
                    </p>
                  </div>

                  <div className="p-3.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Spot Rate</span>
                      <p className="text-base font-bold text-slate-900">
                        {formatCurrency(orderModalProduct.unitPrice)} <span className="text-xs font-normal text-slate-500">/{orderModalProduct.unit}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Available Stock</span>
                      <p className="text-sm font-bold text-emerald-700">
                        {orderModalProduct.quantityAvailable} {orderModalProduct.unit}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Quantity ({orderModalProduct.unit})
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={orderModalProduct.quantityAvailable}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Logistics / Delivery Preference
                    </label>
                    <textarea
                      rows={2}
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="e.g. Need direct delivery to factory warehouse or scheduled pickup."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Total Settlement</span>
                      <p className="text-2xl font-black text-slate-900">
                        {formatCurrency(orderModalProduct.unitPrice * orderQuantity)}
                      </p>
                    </div>
                    <button type="submit" className="btn-brand px-6 py-2.5 rounded text-sm font-semibold shadow-sm">
                      Confirm Trade
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
