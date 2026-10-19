"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Award,
  Star,
  CheckCircle,
  ShoppingBag,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  ShoppingCart,
  Boxes,
  Truck,
  FileText,
  Lock,
  Plus,
  Minus,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getStoredProducts, INITIAL_PRODUCTS } from "@/lib/commodities";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "cooperative" | "escrow">("specs");

  useEffect(() => {
    const all = getStoredProducts();
    const found = all.find((p) => p.id === productId) || INITIAL_PRODUCTS[0];
    setProduct(found);
    if (found?.minOrderQuantity) {
      setQuantity(found.minOrderQuantity);
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        categoryName: product.categoryName,
        unitPrice: product.unitPrice,
        unit: product.unit,
        quantity: quantity,
        farmerName: product.farmerName,
        cooperative: product.cooperative,
        location: product.location,
        assayGrade: product.assayGrade,
        maxQuantity: product.quantityAvailable,
      },
      quantity
    );
  };

  const handleInstantOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderModalOpen(false);
      setOrderSuccess(false);
      router.push("/buyer");
    }, 1800);
  };

  const related = INITIAL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-teal-600 transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-teal-600 transition">Commodities</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-400">{product.categoryName}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-bold text-slate-800 truncate max-w-xs">{product.name}</span>
        </div>

        {/* ── TOP COMMODITY DETAIL CARD ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
            {/* Visual Showcase (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl bg-gradient-to-tr from-teal-900 to-slate-900 aspect-4/3 flex flex-col justify-between p-6 text-white overflow-hidden shadow-inner">
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-teal-500/30 text-teal-200 border border-teal-400/30 backdrop-blur-xs">
                    {product.categoryName}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-amber-400 text-slate-900 shadow-xs">
                    {product.badge || "Verified Spot Lot"}
                  </span>
                </div>

                <div className="text-center my-auto py-8">
                  <span className="text-6xl select-none">🌾</span>
                  <h3 className="text-xl font-extrabold mt-3 text-white drop-shadow-sm">{product.name}</h3>
                  <p className="text-xs text-teal-200 mt-1">{product.location}</p>
                </div>

                <div className="z-10 flex items-center justify-between text-[11px] text-slate-300 pt-3 border-t border-white/10">
                  <span>Assay Grade: <strong className="text-white">{product.assayGrade}</strong></span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Tested Lot
                  </span>
                </div>
              </div>

              {/* Quality certification highlights */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Moisture Ratio</span>
                  <p className="font-bold text-slate-800 mt-0.5">{product.moistureContent || "11.5% Certified"}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assay Purity</span>
                  <p className="font-bold text-emerald-700 mt-0.5">{product.purity || "99.0% Pure Grain"}</p>
                </div>
              </div>
            </div>

            {/* Product Specifications & Order Box (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle className="h-3.5 w-3.5" /> Direct Cooperative Listing
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold ml-2">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span>{product.averageRating || 4.9}</span>
                    <span className="text-slate-400 font-normal">({product.totalReviews || 64} trade reviews)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h1>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span>Mandi Location: <strong className="text-slate-700">{product.location}</strong></span>
                </div>

                <div className="mt-2 text-xs text-slate-600">
                  Seller: <strong className="text-slate-900">{product.farmerName}</strong> &bull;{" "}
                  <span className="text-teal-700 font-semibold">{product.cooperative || "Agricultural Producers Union"}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {product.description}
                </p>

                {/* Spot Price and Stock Box */}
                <div className="mt-6 p-5 rounded-2xl bg-teal-50/60 border border-teal-200 flex flex-wrap items-baseline justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800">
                      Standardized Spot Trading Rate
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-3xl font-black text-slate-900">
                        {formatCurrency(product.unitPrice)}
                      </span>
                      <span className="text-xs font-bold text-slate-500">/{product.unit}</span>
                    </div>
                    <span className="text-[11px] text-teal-700 font-medium block mt-1">
                      Min Order Quantity: {product.minOrderQuantity || 1} {product.unit}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Available Stock
                    </span>
                    <p className="text-xl font-extrabold text-emerald-800">
                      {product.quantityAvailable} {product.unit}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Atomic Inventory Locked
                    </span>
                  </div>
                </div>

                {/* Quantity Adjustment */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      Procure Quantity ({product.unit})
                    </label>
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => setQuantity(Math.max(product.minOrderQuantity || 1, quantity - 1))}
                        className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 transition"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min={product.minOrderQuantity || 1}
                        max={product.quantityAvailable}
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.min(
                              product.quantityAvailable,
                              Math.max(product.minOrderQuantity || 1, parseInt(e.target.value) || 1)
                            )
                          )
                        }
                        className="w-16 text-center font-bold text-sm text-slate-900 focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.quantityAvailable, quantity + 1))}
                        className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-5">
                    <span className="text-xs text-slate-500 block">Total Escrow Estimate:</span>
                    <span className="text-xl font-black text-slate-900">
                      {formatCurrency(product.unitPrice * quantity)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border-2 border-teal-600 hover:bg-teal-50 text-teal-800 py-3.5 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <ShoppingCart className="h-4 w-4 text-teal-600" />
                  Add to Procurement Cart
                </button>

                <button
                  onClick={() => setOrderModalOpen(true)}
                  className="flex-1 btn-brand py-3.5 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Instant Procure / Place Bid
                </button>
              </div>
            </div>
          </div>

          {/* ── DETAIL SPECIFICATION TABS ── */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 sm:px-10 py-6">
            <div className="flex items-center gap-4 border-b border-slate-200 pb-3 mb-6">
              <button
                onClick={() => setActiveTab("specs")}
                className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition ${
                  activeTab === "specs"
                    ? "border-teal-600 text-teal-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Lot Specifications
              </button>
              <button
                onClick={() => setActiveTab("cooperative")}
                className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition ${
                  activeTab === "cooperative"
                    ? "border-teal-600 text-teal-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Producer & Cooperative Verification
              </button>
              <button
                onClick={() => setActiveTab("escrow")}
                className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition ${
                  activeTab === "escrow"
                    ? "border-teal-600 text-teal-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                AgriPay Escrow Guarantee
              </button>
            </div>

            {activeTab === "specs" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 font-semibold block">Harvest Season</span>
                  <span className="font-bold text-slate-900 mt-1 block">{product.harvestSeason || "Meher Season 2026"}</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 font-semibold block">Moisture Assay Standard</span>
                  <span className="font-bold text-slate-900 mt-1 block">{product.moistureContent || "11.2% Laboratory Tested"}</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 font-semibold block">Clean Seed Purity</span>
                  <span className="font-bold text-slate-900 mt-1 block">{product.purity || "99.2% Certified Clean"}</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 font-semibold block">Storage Warehouse</span>
                  <span className="font-bold text-slate-900 mt-1 block">{product.storageWarehouse || "WDRA Scientific Storage Bay #4"}</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 font-semibold block">Assaying Authority</span>
                  <span className="font-bold text-slate-900 mt-1 block">ISO 9001:2015 Third Party Lab Assayed</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 font-semibold block">Delivery Lead Time</span>
                  <span className="font-bold text-slate-900 mt-1 block">Instant Mandi Pickup / 48hr Freight</span>
                </div>
              </div>
            )}

            {activeTab === "cooperative" && (
              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                    {product.farmerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{product.farmerName}</h4>
                    <p className="text-slate-500">{product.cooperative || "Agricultural Primary Cooperative Union"}</p>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed pt-2">
                  Verified grower operating across 240 hectares of rainfed & irrigated farmland. Registered with the National Agricultural Cooperative Syndicate since 2021 with over 180 successful completed trades.
                </p>
              </div>
            )}

            {activeTab === "escrow" && (
              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-teal-800 font-bold">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  <span>100% Buyer Protection & Transparent Settlement</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Funds are safely locked in an escrow account upon order confirmation. Payment is only released to the seller after the buyer completes on-site quality inspection and signs the handover certificate. If the lot fails moisture or grade assays, the order can be rejected with immediate refund.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── RELATED COMMODITIES ── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Similar Commodity Lots</h3>
            <Link href="/products" className="text-xs font-bold text-teal-700 hover:underline">
              View All Exchange &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="agri-card p-5 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.categoryName}
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {item.assayGrade}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-teal-700 transition">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{item.location}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-900">{formatCurrency(item.unitPrice)}</span>
                  <span className="text-xs font-semibold text-teal-700">View Specs &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── INSTANT ORDER MODAL ── */}
        {orderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative border border-slate-200 overflow-hidden">
              <div className="h-1.5 w-full bg-teal-600" />
              <div className="p-7">
                {orderSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="h-14 w-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Trade Order Initiated!</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Your trade order has been created in <strong>PENDING</strong> status. Funds are protected in AgriPay Escrow and the cooperative seller has been alerted for handover.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInstantOrder} className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {product.categoryName}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-2">{product.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Seller: {product.farmerName} &bull; {product.location}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[10px] block">Spot Rate</span>
                        <span className="text-sm font-bold text-slate-900">{formatCurrency(product.unitPrice)}/{product.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 font-bold uppercase text-[10px] block">Procuring Units</span>
                        <span className="text-sm font-bold text-emerald-700">{quantity} {product.unit}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Logistics / Delivery Preference
                      </label>
                      <textarea
                        rows={2}
                        value={deliveryNote}
                        onChange={(e) => setDeliveryNote(e.target.value)}
                        placeholder="e.g. Schedule warehouse pickup at Silo bay or direct factory transit."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Total Settlement</span>
                        <p className="text-2xl font-black text-slate-900">
                          {formatCurrency(product.unitPrice * quantity)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderModalOpen(false)}
                          className="px-4 py-2.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-brand px-6 py-2.5 rounded text-sm font-semibold shadow-sm"
                        >
                          Confirm & Lock Escrow
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
