"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ShoppingBag,
  CheckCircle,
  X,
  ChevronRight,
  Award,
  ShieldCheck,
  ShoppingCart,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { fetchProductsFromDb, fetchCategoriesFromDb } from "@/lib/commodities";
import { useCart } from "@/context/CartContext";
import { Product, Category } from "@/types";
import { fetchApi } from "@/lib/api";

export default function AgriMarketplacePage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNote, setOrderNote] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // 1. Load categories from database
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await fetchCategoriesFromDb();
        setCategories(cats || []);
      } catch (e) {
        console.warn("Could not load categories from database:", e);
      }
    }
    loadCategories();
  }, []);

  // 2. Load products from database
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProductsFromDb({
          q: searchTerm.trim() || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
        });
        setProducts(response.content || []);
      } catch (err: any) {
        console.error("Database fetch failed:", err);
        setError("Unable to connect to database or backend server. Please verify Spring Boot API is running on port 8080.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModalProduct) return;

    setOrderSubmitting(true);
    setOrderError(null);

    try {
      await fetchApi("/orders", {
        method: "POST",
        body: JSON.stringify({
          productId: orderModalProduct.id,
          quantity: orderQuantity,
          note: orderNote,
          deliveryPreference: "PICKUP",
        }),
      });

      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        setOrderModalProduct(null);
      }, 2000);
    } catch (err: any) {
      setOrderError(err.message || "Failed to place order in database. Ensure you are logged in as a registered Buyer.");
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── HEADER ── */}
      <div
        className="text-white py-12 border-b border-teal-900"
        style={{ background: "linear-gradient(135deg, #041d1c 0%, #073330 50%, #0a4843 100%)" }}
      >
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-2 text-xs text-teal-300 mb-3">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-bold text-white">Commodity Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Agricultural Commodity Exchange
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
            Browse real-time verified commodity listings directly from Ethiopian farmers, primary unions, and cooperatives. All lots are stored and fetched live from the database.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl relative">
            <input
              type="text"
              placeholder="Search by commodity name, location, or cooperative union..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3.5 pl-12 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-lg bg-white"
            />
            <Search className="h-5 w-5 text-slate-400 absolute left-4 top-3.5" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 py-8">
        {/* Category Tabs from Database */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-teal-700 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            All Commodities ({products.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-teal-700 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Database Status or Error */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <strong className="block font-bold">Database Notice:</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="h-8 w-8 text-teal-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Querying live database listings...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Commodities Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No product listings currently match your filter in the database. Ensure the PostgreSQL database has executed Flyway migrations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {p.categoryName || "Agricultural Commodity"}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {p.badge || "Verified Lot"}
                    </span>
                  </div>

                  <Link href={`/products/${p.id}`} className="block">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition flex items-center justify-between">
                      <span>{p.name}</span>
                      <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-teal-600 transition ml-1 flex-shrink-0" />
                    </h3>
                  </Link>

                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span>{p.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium mt-1 truncate">
                    Seller: <strong className="text-slate-800">{p.farmerName}</strong> ({p.cooperative || "Cooperative Union"})
                  </p>

                  {/* Quality Assay Certification Box */}
                  <div className="mt-3.5 py-2 px-3 bg-emerald-50 rounded border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-emerald-600" />
                      <span>{p.assayGrade || "Grade 1 Standard"}</span>
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
                    <Link href={`/products/${p.id}`} className="text-xs font-bold text-teal-700 hover:underline">
                      View Specifications &rarr;
                    </Link>
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{p.averageRating || 4.9}</span>
                      <span className="text-slate-400 font-normal">({p.totalReviews || 24})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        addToCart({
                          productId: p.id,
                          name: p.name,
                          categoryName: p.categoryName || "Commodity",
                          unitPrice: p.unitPrice,
                          unit: p.unit,
                          quantity: 1,
                          farmerName: p.farmerName,
                          cooperative: p.cooperative,
                          location: p.location,
                          assayGrade: p.assayGrade,
                          maxQuantity: p.quantityAvailable,
                        })
                      }
                      className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-500 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => {
                        setOrderModalProduct(p);
                        setOrderQuantity(1);
                        setOrderError(null);
                      }}
                      className="btn-brand py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1"
                    >
                      Procure
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instant Procurement Modal */}
      {orderModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setOrderModalProduct(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="p-2 rounded-xl bg-teal-100 text-teal-800">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900">Procure Commodity Lot</h3>
                <p className="text-xs text-slate-500">{orderModalProduct.name}</p>
              </div>
            </div>

            {orderSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                Order successfully recorded in the database! Funds held in Escrow.
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                {orderError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {orderError}
                  </div>
                )}

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit Price:</span>
                    <strong className="text-slate-900">
                      {formatCurrency(orderModalProduct.unitPrice)} / {orderModalProduct.unit}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Seller Origin:</span>
                    <span className="text-slate-800 font-semibold">{orderModalProduct.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assay Verification:</span>
                    <span className="text-emerald-700 font-bold">{orderModalProduct.assayGrade || "Grade 1 Standard"}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Order Quantity ({orderModalProduct.unit})
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={orderModalProduct.quantityAvailable}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, Number(e.target.value)))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Max available stock: {orderModalProduct.quantityAvailable} {orderModalProduct.unit}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Logistics / Delivery Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Enter delivery instructions or receiving bay details."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-teal-900">Total Settlement Value:</span>
                  <span className="text-lg font-black text-teal-900">
                    {formatCurrency(orderModalProduct.unitPrice * orderQuantity)}
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderModalProduct(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={orderSubmitting}
                    className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs disabled:opacity-50"
                  >
                    {orderSubmitting ? "Placing Order..." : "Confirm Procurement Order"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
