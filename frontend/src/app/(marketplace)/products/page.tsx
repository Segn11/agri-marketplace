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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderModalProduct, setOrderModalProduct] = useState<any | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNote, setOrderNote] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const mockProducts = [
    {
      id: "p1", name: "Premium White Teff (Magna)", category: "cereals-grains",
      categoryName: "Cereals & Grains",
      description: "First-grade organic high-purity White Teff freshly harvested from highland fields.",
      unitPrice: 9400, unit: "Quintal (100kg)", quantityAvailable: 45,
      location: "East Highland Zone", farmerName: "Gemechu Desta",
      farmerRating: 4.9, totalReviews: 28, badge: "Organic", status: "ACTIVE",
    },
    {
      id: "p2", name: "Fresh Red Cooking Onions", category: "vegetables",
      categoryName: "Vegetables",
      description: "Crisp, dry, high-grade red onions suited for commercial kitchen and bulk household use.",
      unitPrice: 85, unit: "KG", quantityAvailable: 1200,
      location: "Central River Basin", farmerName: "Chala Tolosa",
      farmerRating: 4.8, totalReviews: 42, badge: "Fresh Harvest", status: "ACTIVE",
    },
    {
      id: "p3", name: "Organic Forest Coffee (Wollega Grade 1)", category: "coffee-spices",
      categoryName: "Coffee & Spices",
      description: "Naturally dried specialty Arabica beans handpicked in highland shade groves.",
      unitPrice: 420, unit: "KG", quantityAvailable: 350,
      location: "Western Forest District", farmerName: "Tigist Bekele",
      farmerRating: 5.0, totalReviews: 19, badge: "Specialty", status: "ACTIVE",
    },
    {
      id: "p4", name: "Fresh Hass Avocados", category: "fruits",
      categoryName: "Fruits & Orchards",
      description: "Creamy, naturally grown export-grade avocados ready for immediate dispatch.",
      unitPrice: 90, unit: "KG", quantityAvailable: 500,
      location: "Southern Fruit Belt", farmerName: "Abebe Megersa",
      farmerRating: 4.7, totalReviews: 15, badge: "Export Grade", status: "ACTIVE",
    },
    {
      id: "p5", name: "Highland Wheat Grain", category: "cereals-grains",
      categoryName: "Cereals & Grains",
      description: "Clean, dry, plump wheat kernel suitable for flour milling and baking.",
      unitPrice: 4800, unit: "Quintal (100kg)", quantityAvailable: 80,
      location: "Northern Plateau", farmerName: "Dinkisa Lema",
      farmerRating: 4.6, totalReviews: 9, badge: "Mill Grade", status: "ACTIVE",
    },
    {
      id: "p6", name: "Organic Garlic Bulbs", category: "coffee-spices",
      categoryName: "Coffee & Spices",
      description: "Aromatic, potent high-oil garlic freshly harvested and well-cured.",
      unitPrice: 220, unit: "KG", quantityAvailable: 280,
      location: "Highland Foothills", farmerName: "Meron Assefa",
      farmerRating: 4.9, totalReviews: 31, badge: "Premium", status: "ACTIVE",
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
    { label: "All Harvests", value: "all", icon: "🌍" },
    { label: "Cereals & Grains", value: "cereals-grains", icon: "🌾" },
    { label: "Vegetables", value: "vegetables", icon: "🥦" },
    { label: "Fruits & Orchards", value: "fruits", icon: "🥑" },
    { label: "Coffee & Spices", value: "coffee-spices", icon: "☕" },
    { label: "Pulses & Seeds", value: "pulses-oilseeds", icon: "🫘" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="hero-mesh border-b border-slate-200/50 py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-50/80 px-3 py-1.5 rounded-full border border-brand-200/60 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="live-beacon absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                  </span>
                  Live Produce Exchange
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                  Agricultural{" "}
                  <span className="text-shimmer">Marketplace</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl">
                  Compare harvest prices directly from verified farmers across all regions. Atomic stock tracking ensures zero overselling.
                </p>
              </div>

              {/* Search */}
              <div className="glass-panel p-2 rounded-2xl w-full lg:w-96 flex items-center gap-2">
                <div className="flex items-center flex-1 px-3 py-2 bg-white/80 rounded-xl border border-slate-200/80 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <Search className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search produce or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                </div>
                <button className="btn-primary-gradient text-white p-2.5 rounded-xl flex-shrink-0">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto mt-8 pb-1 scrollbar-none">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedCategory(tab.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === tab.value
                      ? "btn-primary-gradient text-white shadow-glow-sm"
                      : "bg-white text-slate-600 border border-slate-200/80 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50/50 shadow-xs"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-slate-500">
            <span className="text-slate-900 font-extrabold text-sm">{filtered.length}</span> harvest{filtered.length !== 1 ? "s" : ""} available
          </p>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200">
              <ArrowUpDown className="h-3.5 w-3.5" /> Sort
            </button>
            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="produce-card group p-6 flex flex-col justify-between"
            >
              <div>
                {/* Badge row */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200/60">
                    {product.categoryName}
                  </span>
                  <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-harvest-50 text-harvest-800 border border-harvest-200/50">
                    {product.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Location */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  {product.location}
                </div>

                {/* Price & Stock */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-brand-700 tracking-tight">
                      {formatCurrency(product.unitPrice)}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 ml-1">/ {product.unit}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
                      <span className="font-bold text-slate-700">{product.quantityAvailable}</span>
                      <span className="text-slate-400 font-medium">avail.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500">
                    by <strong className="text-slate-800">{product.farmerName}</strong>
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-harvest-600">
                    <Star className="h-3.5 w-3.5 fill-harvest-500 text-harvest-500" />
                    {product.farmerRating}
                    <span className="text-slate-400 font-normal">({product.totalReviews})</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setOrderModalProduct(product);
                    setOrderQuantity(1);
                    setOrderNote("");
                    setOrderSuccess(false);
                  }}
                  className="w-full btn-primary-gradient text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Order Produce
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white/80 rounded-3xl border border-slate-200/60 mt-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Search className="h-7 w-7" />
            </div>
            <p className="text-slate-500 font-semibold">No produce matches your search</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your keyword or category filter.</p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
              className="mt-4 text-xs font-bold text-brand-700 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {orderModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 relative overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-700 via-brand-500 to-brand-400" />

            <div className="p-7 sm:p-8">
              <button
                onClick={() => setOrderModalProduct(null)}
                className="absolute right-5 top-6 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>

              {orderSuccess ? (
                <div className="py-10 text-center space-y-3">
                  <div className="h-16 w-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto border border-brand-200/60">
                    <CheckCircle className="h-9 w-9" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Order Placed!</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Your order is now <strong className="text-amber-700">PENDING</strong>. The farmer will be notified and their contact will be revealed once accepted.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60">
                        {orderModalProduct.categoryName}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-2">{orderModalProduct.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      by {orderModalProduct.farmerName} &bull; {orderModalProduct.location}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price per unit</span>
                      <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                        {formatCurrency(orderModalProduct.unitPrice)} <span className="text-xs font-semibold text-slate-400">/ {orderModalProduct.unit}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available</span>
                      <p className="text-sm font-bold text-brand-700 mt-0.5">
                        {orderModalProduct.quantityAvailable} {orderModalProduct.unit}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Order Quantity ({orderModalProduct.unit})
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={orderModalProduct.quantityAvailable}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Delivery / Pickup Notes
                    </label>
                    <textarea
                      rows={2}
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="e.g. Pickup on Saturday morning, or prefer delivery to warehouse."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white transition resize-none"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Price</span>
                      <p className="text-2xl font-black text-brand-700">
                        {formatCurrency(orderModalProduct.unitPrice * orderQuantity)}
                      </p>
                    </div>
                    <button type="submit" className="btn-primary-gradient text-white font-semibold px-7 py-3 rounded-xl text-sm flex items-center gap-2">
                      Confirm Order
                      <ChevronRight className="h-4 w-4" />
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
