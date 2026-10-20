"use client";

import { useState, useEffect, useMemo } from "react";
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
  SlidersHorizontal,
  ArrowUpDown,
  Truck,
  RotateCcw,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { fetchProductsFromDb, fetchCategoriesFromDb } from "@/lib/commodities";
import { useCart } from "@/context/CartContext";
import { Product, Category } from "@/types";
import { fetchApi } from "@/lib/api";

const REGIONAL_LOCATIONS = [
  "All Locations",
  "Nekemte Central Market",
  "Bako Agricultural Center",
  "Gimbi Coffee Depot",
  "Gutin Farmers Union",
  "Dembi Dolo Terminal",
  "Arjo Grain Depot",
  "Sire Farmers Center",
  "Debre Birhan Mandi Terminal",
];

export default function AgriMarketplacePage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters (FR-3.1, FR-3.2)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sorting (FR-3.3)
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "rating">("newest");

  // Pagination (FR-3.6)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Instant Order Modal (FR-4.1)
  const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [deliveryPreference, setDeliveryPreference] = useState<"PICKUP" | "FREIGHT">("PICKUP");
  const [orderNote, setOrderNote] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Load categories from database
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

  // Load products from database
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProductsFromDb({
          q: searchTerm.trim() || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          size: 50,
        });
        setProducts(response.content || []);
      } catch (err: any) {
        console.error("Database fetch failed:", err);
        setError("Unable to connect to database or backend server. Please verify Spring Boot API is running.");
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

  // Client-side filtering & sorting
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Location filter
        if (selectedLocation !== "All Locations") {
          const locMatch = p.location?.toLowerCase().includes(selectedLocation.toLowerCase());
          if (!locMatch) return false;
        }
        // Min Price
        if (minPrice !== "" && p.unitPrice < Number(minPrice)) {
          return false;
        }
        // Max Price
        if (maxPrice !== "" && p.unitPrice > Number(maxPrice)) {
          return false;
        }
        // In Stock Only
        if (inStockOnly && (p.quantityAvailable <= 0 || p.status === "OUT_OF_STOCK")) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.unitPrice - b.unitPrice;
        if (sortBy === "price_desc") return b.unitPrice - a.unitPrice;
        if (sortBy === "rating") return (b.averageRating || 5) - (a.averageRating || 5);
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [products, selectedLocation, minPrice, maxPrice, inStockOnly, sortBy]);

  // Paginated items
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(start, start + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLocation("All Locations");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModalProduct) return;

    if (orderQuantity > orderModalProduct.quantityAvailable) {
      setOrderError(`Quantity exceeds available stock. Maximum available is ${orderModalProduct.quantityAvailable} ${orderModalProduct.unit}.`);
      return;
    }

    setOrderSubmitting(true);
    setOrderError(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setOrderError("Please sign in with a Buyer account to place an order.");
      setOrderSubmitting(false);
      return;
    }

    try {
      await fetchApi("/orders", {
        method: "POST",
        body: JSON.stringify({
          productId: orderModalProduct.id,
          quantity: orderQuantity,
          note: orderNote,
          deliveryPreference,
        }),
      });

      setOrderSuccess(true);
      setTimeout(() => {
        setOrderModalProduct(null);
        setOrderSuccess(false);
        setOrderNote("");
        setOrderQuantity(1);
      }, 2000);
    } catch (err: any) {
      setOrderError(err.message || "Failed to place order. Ensure you are signed in as a Buyer.");
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#1c4482] transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-bold text-slate-900">Agricultural Commodity Marketplace</span>
        </div>

        {/* Top Banner */}
        <div className="bg-gradient-to-r from-[#1c4482] via-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800">
              Direct Farmer & Buyer Marketplace &bull; Nekemte & Regional Hubs
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
              Browse & Compare Agricultural Produce
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1.5 leading-relaxed">
              Find fresh crops, cereals, coffee, and livestock products directly from local farmers without intermediary markups. Orders are placed online with payment and delivery arranged directly.
            </p>
          </div>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input (FR-3.1) */}
            <div className="relative w-full md:w-96">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search products by crop name, farmer, or keyword..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Sort Dropdown (FR-3.3) */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs">
              <label className="font-bold text-slate-600 flex items-center gap-1 shrink-0">
                <ArrowUpDown className="h-3.5 w-3.5 text-[#1c4482]" />
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {(searchTerm || selectedCategory !== "all" || selectedLocation !== "All Locations" || minPrice !== "" || maxPrice !== "" || inStockOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold transition flex items-center gap-1"
                  title="Reset all filters"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── FILTER SIDEBAR (FR-3.2) ── */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-[#1c4482]" />
                  Filters
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  {filteredAndSortedProducts.length} lots found
                </span>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Commodity Category</label>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategory("all"); setCurrentPage(1); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedCategory === "all"
                        ? "bg-[#1c4482] text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.slug); setCurrentPage(1); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedCategory === cat.slug
                          ? "bg-[#1c4482] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter (FR-3.2: Nekemte and regional communities) */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  Location / Market
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {REGIONAL_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter (FR-3.2) */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Price Range (ETB)</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value === "" ? "" : Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value === "" ? "" : Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Availability Filter (FR-3.2) */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="rounded text-[#1c4482] focus:ring-blue-500 h-4 w-4"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* ── PRODUCT LISTINGS GRID (FR-3.4) ── */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="min-h-[50vh] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 p-12">
                <Loader2 className="h-8 w-8 text-[#1c4482] animate-spin mb-2" />
                <p className="text-xs text-slate-500 font-semibold">Loading verified crop listings from database...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-700">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-xs font-bold">{error}</p>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Agricultural Lots Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search keywords, location filter, or price parameters to discover available produce.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedProducts.map((product) => {
                  const isOutOfStock = product.quantityAvailable <= 0 || product.status === "OUT_OF_STOCK";

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Image & Badges */}
                        <div className="h-44 bg-slate-100 relative overflow-hidden group">
                          <img
                            src={
                              product.imageUrls?.[0] ||
                              "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2.5 left-2.5 bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                            {product.categoryName}
                          </span>
                          {isOutOfStock ? (
                            <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                              Out of Stock
                            </span>
                          ) : (
                            <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                              In Stock
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-2">
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-bold text-slate-900 text-sm hover:text-[#1c4482] transition line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="font-semibold text-slate-800">{product.farmerName}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                            <span className="truncate">{product.location}</span>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>

                          {/* Price & Stock Display (FR-3.4, FR-3.5) */}
                          <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Price</span>
                              <span className="text-base font-extrabold text-[#1c4482]">
                                {formatCurrency(product.unitPrice)}
                              </span>
                              <span className="text-[10px] text-slate-500"> / {product.unit}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Available</span>
                              <span className="text-xs font-bold text-slate-700">
                                {product.quantityAvailable} {product.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setOrderModalProduct(product);
                            setOrderQuantity(1);
                            setOrderError(null);
                          }}
                          disabled={isOutOfStock}
                          className="w-full bg-[#1c4482] hover:bg-blue-900 text-white py-2 rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Order Direct
                        </button>

                        <button
                          onClick={() => {
                            addToCart({
                              productId: product.id,
                              name: product.name,
                              categoryName: product.categoryName,
                              unitPrice: product.unitPrice,
                              unit: product.unit,
                              quantity: 1,
                              farmerName: product.farmerName,
                              location: product.location,
                              maxQuantity: product.quantityAvailable,
                              image: product.imageUrls?.[0],
                            });
                          }}
                          disabled={isOutOfStock}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 disabled:opacity-40"
                          title="Add to procurement cart"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          <span>+ Cart</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── PAGINATION CONTROLS (FR-3.6) ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 font-semibold px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── INSTANT ORDER PLACEMENT MODAL (FR-4.1) ── */}
        {orderModalProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
              <button
                onClick={() => setOrderModalProduct(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>

              <h3 className="text-lg font-bold text-slate-900">
                Direct Order Placement
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ordering from farmer: <strong>{orderModalProduct.farmerName}</strong>
              </p>

              {orderSuccess ? (
                <div className="my-8 text-center space-y-2">
                  <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Order Placed Successfully!</h4>
                  <p className="text-xs text-slate-500">
                    The farmer has been notified. You can track this order in your Buyer Portal.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} className="mt-4 space-y-3.5 text-xs">
                  {orderError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{orderError}</span>
                    </div>
                  )}

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">{orderModalProduct.name}</div>
                    <div className="flex justify-between text-slate-600">
                      <span>Unit Price:</span>
                      <strong className="text-[#1c4482]">{formatCurrency(orderModalProduct.unitPrice)} / {orderModalProduct.unit}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Available Stock:</span>
                      <strong>{orderModalProduct.quantityAvailable} {orderModalProduct.unit}</strong>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Order Quantity ({orderModalProduct.unit})
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={orderModalProduct.quantityAvailable}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Delivery / Pickup Preference
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryPreference("PICKUP")}
                        className={`py-2 px-3 rounded-lg font-bold border transition ${
                          deliveryPreference === "PICKUP"
                            ? "bg-[#1c4482] text-white border-[#1c4482]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Farmer Pickup
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryPreference("FREIGHT")}
                        className={`py-2 px-3 rounded-lg font-bold border transition ${
                          deliveryPreference === "FREIGHT"
                            ? "bg-[#1c4482] text-white border-[#1c4482]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Truck Delivery
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Optional Note for Farmer
                    </label>
                    <textarea
                      rows={2}
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Specify preferred pickup time, delivery depot, or packing details..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-[11px] text-amber-800 leading-relaxed">
                    <strong>Version 1 Scope:</strong> Payment and delivery are coordinated directly with the farmer once accepted. The farmer&apos;s phone number will be revealed in your Buyer Portal upon order acceptance.
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Total Amount</span>
                      <span className="text-base font-extrabold text-[#1c4482]">
                        {formatCurrency(orderModalProduct.unitPrice * orderQuantity)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderModalProduct(null)}
                        className="px-3 py-2 text-slate-600 font-bold hover:text-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={orderSubmitting}
                        className="bg-[#1c4482] hover:bg-blue-900 text-white font-bold px-5 py-2 rounded-xl shadow-xs transition"
                      >
                        {orderSubmitting ? "Placing Order..." : "Confirm Order"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
