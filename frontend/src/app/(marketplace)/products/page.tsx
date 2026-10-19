"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Tag,
  ArrowUpDown,
  SlidersHorizontal,
  CheckCircle,
  X,
  Star,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [orderModalProduct, setOrderModalProduct] = useState<any | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNote, setOrderNote] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const mockProducts = [
    {
      id: "p1",
      name: "Premium White Teff (Magna)",
      category: "cereals-grains",
      categoryName: "Cereals & Grains",
      description: "First-grade organic high-purity White Teff freshly harvested from highland fields.",
      unitPrice: 9400,
      unit: "Quintal (100kg)",
      quantityAvailable: 45,
      location: "East Highland Zone",
      farmerName: "Gemechu Desta",
      farmerRating: 4.9,
      totalReviews: 28,
      status: "ACTIVE",
    },
    {
      id: "p2",
      name: "Fresh Red Cooking Onions",
      category: "vegetables",
      categoryName: "Vegetables",
      description: "Crisp, dry, high-grade red onions suited for commercial kitchen and bulk household use.",
      unitPrice: 85,
      unit: "KG",
      quantityAvailable: 1200,
      location: "Central River Basin",
      farmerName: "Chala Tolosa",
      farmerRating: 4.8,
      totalReviews: 42,
      status: "ACTIVE",
    },
    {
      id: "p3",
      name: "Organic Forest Coffee (Wollega Grade 1)",
      category: "coffee-spices",
      categoryName: "Coffee & Spices",
      description: "Naturally dried specialty Arabica beans handpicked in highland shade groves.",
      unitPrice: 420,
      unit: "KG",
      quantityAvailable: 350,
      location: "Western Forest District",
      farmerName: "Tigist Bekele",
      farmerRating: 5.0,
      totalReviews: 19,
      status: "ACTIVE",
    },
    {
      id: "p4",
      name: "Fresh Hass Avocados",
      category: "fruits",
      categoryName: "Fruits",
      description: "Creamy, naturally grown export-grade avocados ready for immediate dispatch.",
      unitPrice: 90,
      unit: "KG",
      quantityAvailable: 500,
      location: "Southern Fruit Belt",
      farmerName: "Abebe Megersa",
      farmerRating: 4.7,
      totalReviews: 15,
      status: "ACTIVE",
    },
    {
      id: "p5",
      name: "Highland Wheat Grain",
      category: "cereals-grains",
      categoryName: "Cereals & Grains",
      description: "Clean, dry, plump wheat kernel suitable for flour milling and baking.",
      unitPrice: 4800,
      unit: "Quintal (100kg)",
      quantityAvailable: 80,
      location: "Northern Plateau",
      farmerName: "Dinkisa Lema",
      farmerRating: 4.6,
      totalReviews: 9,
      status: "ACTIVE",
    },
    {
      id: "p6",
      name: "Organic Garlic Bulbs",
      category: "coffee-spices",
      categoryName: "Coffee & Spices",
      description: "Aromatic, potent high-oil garlic freshly harvested and well-cured.",
      unitPrice: 220,
      unit: "KG",
      quantityAvailable: 280,
      location: "Highland Foothills",
      farmerName: "Meron Assefa",
      farmerRating: 4.9,
      totalReviews: 31,
      status: "ACTIVE",
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl shadow-soft mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Live Produce Exchange
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Agricultural Marketplace
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Compare harvest prices directly from farmers across all regions. Enjoy atomic stock tracking and direct grower coordination.
          </p>
        </div>

        {/* Quick Search */}
        <div className="flex items-center gap-2.5 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by produce or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Filter Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {[
          { label: "All Harvests", value: "all" },
          { label: "🌾 Cereals & Grains", value: "cereals-grains" },
          { label: "🥦 Vegetables", value: "vegetables" },
          { label: "🥑 Fruits & Orchards", value: "fruits" },
          { label: "☕ Coffee & Spices", value: "coffee-spices" },
          { label: "🫘 Pulses & Seeds", value: "pulses-oilseeds" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedCategory(tab.value)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition shadow-xs ${
              selectedCategory === tab.value
                ? "bg-brand-700 text-white shadow-glow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-brand-500 hover:text-brand-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Produce Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="group rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft hover:shadow-soft-lg hover:border-brand-500/60 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200/60">
                  {product.categoryName}
                </span>
                <span className="text-xs text-slate-500 flex items-center font-medium">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                  {product.location}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition">
                {product.name}
              </h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              {/* Price & Stock Display */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-brand-700 tracking-tight">
                    {formatCurrency(product.unitPrice)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-1">/ {product.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">
                    Stock: {product.quantityAvailable} {product.unit}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium">Grower: <strong className="text-slate-800">{product.farmerName}</strong></span>
                <div className="flex items-center gap-1 text-harvest-600 font-bold">
                  <Star className="h-3.5 w-3.5 fill-harvest-500 text-harvest-500" />
                  <span>{product.farmerRating}</span>
                  <span className="text-slate-400 font-normal">({product.totalReviews})</span>
                </div>
              </div>

              <Button
                size="md"
                onClick={() => {
                  setOrderModalProduct(product);
                  setOrderQuantity(1);
                }}
                className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold shadow-sm"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Order Produce
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 mt-6">
          <p className="text-slate-500 font-medium">No produce matches your current filter.</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Order Modal */}
      {orderModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setOrderModalProduct(null)}
              className="absolute right-5 top-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            {orderSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-14 w-14 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Order Placed!</h3>
                <p className="text-sm text-slate-500">
                  Your order is now in <strong>PENDING</strong> status. The farmer has been notified and you will receive their direct phone contact as soon as they accept.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-5">
                <div>
                  <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                    {orderModalProduct.categoryName}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                    {orderModalProduct.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Sold by {orderModalProduct.farmerName} &bull; {orderModalProduct.location}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500">Price per unit:</span>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(orderModalProduct.unitPrice)} / {orderModalProduct.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500">Available:</span>
                    <p className="text-sm font-bold text-brand-700">
                      {orderModalProduct.quantityAvailable} {orderModalProduct.unit}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Quantity to order ({orderModalProduct.unit})
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={orderModalProduct.quantityAvailable}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Delivery / Pickup Preference & Note
                  </label>
                  <textarea
                    rows={2}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="e.g. Pickup on Saturday morning, or prefer delivery to warehouse."
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">Total Price:</span>
                    <p className="text-2xl font-black text-brand-700">
                      {formatCurrency(orderModalProduct.unitPrice * orderQuantity)}
                    </p>
                  </div>
                  <Button type="submit" size="lg" className="bg-brand-700 hover:bg-brand-800 text-white font-semibold">
                    Confirm Order
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
