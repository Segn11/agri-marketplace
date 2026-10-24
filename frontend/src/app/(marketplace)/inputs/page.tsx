"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Search,
  ShoppingCart,
  Filter,
  ArrowRight,
  Truck,
  Sparkles,
  Building2,
  Tag,
  Leaf,
  Layers,
  Check,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getInputProducts } from "@/lib/agribazaar";
import { InputProduct } from "@/types";

export default function InputMarketplacePage() {
  const [inputs, setInputs] = useState<InputProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [orderModalItem, setOrderModalItem] = useState<InputProduct | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const categories = [
    { key: "ALL", label: "All Inputs" },
    { key: "SEEDS", label: "Certified Seeds" },
    { key: "FERTILISERS", label: "Fertilisers (Urea / DAP)" },
    { key: "PESTICIDES", label: "Bio-Pesticides" },
    { key: "EQUIPMENT", label: "Irrigation & Tools" },
  ];

  useEffect(() => {
    getInputProducts(selectedCategory)
      .then((data) => setInputs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const filtered = inputs.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  const handleOpenOrder = (item: InputProduct) => {
    setOrderModalItem(item);
    setOrderQuantity(1);
    setOrderPlaced(false);
  };

  const handleConfirmOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderModalItem(null);
      setOrderPlaced(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-teal-800 via-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-400/10 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-700/80 border border-teal-400/30 text-teal-200 text-xs font-semibold tracking-wide uppercase">
              <Package className="w-3.5 h-3.5" />
              <span>AgriBazaar Core Module • Quality Farm Supplies</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Input Marketplace — Seeds, Fertilisers & Agri-Equipment
            </h1>
            <p className="text-teal-100 text-base sm:text-lg leading-relaxed">
              Procure certified high-yield hybrid seeds, subsidized granular Urea & DAP fertilisers, biological pest controls, and micro-irrigation kits directly from verified cooperative federations and licensed agricultural enterprises.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-teal-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Certified Authentic Lots
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-300" /> Direct Farm Delivery & Mandi Pickup
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-300" /> Subsidized Union Rates
              </span>
            </div>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search seeds, urea, pesticides, suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === c.key
                    ? "bg-teal-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 font-medium">Loading certified agricultural inputs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">No agricultural inputs found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all p-6 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                      {item.category}
                    </span>
                    {item.isOrganicCertified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Leaf className="w-3 h-3 text-emerald-600" />
                        Organic
                      </span>
                    )}
                    {item.badge && !item.isOrganicCertified && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Supplier */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.supplierName}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Price & Stock Box */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Direct Price
                      </span>
                      <div className="text-2xl font-black text-teal-900">
                        {formatCurrency(item.price)}{" "}
                        <span className="text-xs font-normal text-slate-500">/ {item.unit}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Stock
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {item.stockQuantity} Available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenOrder(item)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition duration-150 shadow-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Procure Input Lot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Procure Input Lot */}
        {orderModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {orderPlaced ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Input Order Confirmed!</h3>
                  <p className="text-xs text-slate-500">
                    Dispatched to {orderModalItem.supplierName}. You will receive delivery dispatch confirmation and tracking.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                        {orderModalItem.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {orderModalItem.name}
                      </h3>
                      <p className="text-xs text-slate-500">{orderModalItem.supplierName}</p>
                    </div>
                    <button
                      onClick={() => setOrderModalItem(null)}
                      className="text-slate-400 hover:text-slate-600 font-bold p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Order Volume ({orderModalItem.unit})
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                        className="w-10 h-10 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={orderModalItem.stockQuantity}
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24 text-center py-2 rounded-xl border border-slate-200 font-bold text-slate-900 text-base"
                      />
                      <button
                        onClick={() => setOrderQuantity(Math.min(orderModalItem.stockQuantity, orderQuantity + 1))}
                        className="w-10 h-10 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Total Purchase Amount:</span>
                    <span className="text-xl font-extrabold text-teal-800">
                      {formatCurrency(orderModalItem.price * orderQuantity)}
                    </span>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => setOrderModalItem(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmOrder}
                      className="flex-1 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs"
                    >
                      Confirm Direct Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
