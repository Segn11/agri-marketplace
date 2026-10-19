"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { fetchApi } from "@/lib/api";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState<"PICKUP" | "FREIGHT">("PICKUP");
  const [logisticsNote, setLogisticsNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [placedOrderIds, setPlacedOrderIds] = useState<string[]>([]);

  const freightCost = deliveryMethod === "FREIGHT" ? 1200 : 0;
  const grandTotal = subtotal + freightCost;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage("");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setErrorMessage("Please sign in with a Buyer account to submit database orders.");
      setIsSubmitting(false);
      return;
    }

    try {
      const orderIds: string[] = [];
      // Submit orders for each commodity item to the real Spring Boot API
      for (const item of cart) {
        const res = await fetchApi<{ id: string }>("/orders", {
          method: "POST",
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
            deliveryPreference: deliveryMethod,
            note: logisticsNote,
          }),
        });
        if (res.data?.id) {
          orderIds.push(res.data.id);
        }
      }

      setPlacedOrderIds(orderIds);
      clearCart();
      setOrderComplete(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit procurement orders. Ensure you are signed in as a Buyer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-teal-600 transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-teal-600 transition">Commodity Exchange</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-bold text-slate-800">Procurement Cart & Settlement</span>
        </div>

        {orderComplete ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-lg space-y-5 my-8">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-9 w-9" />
            </div>

            {placedOrderIds.length > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                <span>Database Orders Placed: {placedOrderIds.length}</span>
              </div>
            )}

            <h2 className="text-2xl font-black text-slate-900">
              Procurement Order Placed!
            </h2>

            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Your trade orders have been submitted to the database in <strong>PENDING</strong> status. Funds are safeguarded in AgriPay Escrow and the cooperative sellers have been notified.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Settlement Status:</span>
                <strong className="text-teal-700">Protected in Escrow</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Database Sync:</span>
                <strong className="text-slate-800">Confirmed</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/buyer"
                className="flex-1 btn-brand py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                Track Live Order Status &rarr;
              </Link>
              <Link
                href="/products"
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl text-xs font-bold flex items-center justify-center transition"
              >
                Continue Trading
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm space-y-4 my-12">
            <div className="h-20 w-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              You haven't added any commodity lots to your procurement order. Explore live mandi trades and verified cooperative lots from the database.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 btn-brand px-6 py-3 rounded-xl text-xs font-bold shadow-sm"
            >
              Browse Commodity Listings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start justify-between gap-3 text-xs text-red-700">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-900">Order Submission Failed</p>
                      <p className="mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                  {errorMessage.includes("sign in") && (
                    <Link
                      href="/login"
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold flex items-center gap-1.5 flex-shrink-0"
                    >
                      <LogIn className="h-3.5 w-3.5" /> Sign In
                    </Link>
                  )}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-teal-600" />
                    Selected Commodity Lots ({totalItems} total units)
                  </h1>
                  <button
                    onClick={clearCart}
                    className="text-xs font-semibold text-slate-400 hover:text-red-600 transition"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="h-16 w-16 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-3xl flex-shrink-0">
                          🌾
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {item.categoryName}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm mt-1">{item.name}</h3>
                          <p className="text-xs text-slate-500">
                            Seller: <strong className="text-slate-800">{item.farmerName}</strong> &bull; {item.location}
                          </p>
                          {item.assayGrade && (
                            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                              QC Assay: {item.assayGrade}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 transition"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxQuantity}
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 transition disabled:opacity-40"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[100px]">
                          <span className="text-base font-black text-slate-900 block">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatCurrency(item.unitPrice)}/{item.unit}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-slate-400 hover:text-red-600 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery / Logistics Options */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-teal-600" />
                  Select Logistics & Delivery Protocol
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setDeliveryMethod("PICKUP")}
                    className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition ${
                      deliveryMethod === "PICKUP"
                        ? "border-teal-600 bg-teal-50/40"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">Mandi Warehouse Pickup</span>
                      <span className="text-xs font-extrabold text-emerald-700">FREE</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Buyer arranges transport directly from the certified terminal silo bay upon acceptance.
                    </p>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod("FREIGHT")}
                    className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition ${
                      deliveryMethod === "FREIGHT"
                        ? "border-teal-600 bg-teal-50/40"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">Cooperative Freight Dispatch</span>
                      <span className="text-xs font-extrabold text-slate-900">+ETB 1,200</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Cooperative schedules certified heavy trucking to buyer milling facility or depot.
                    </p>
                  </label>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Logistics / Handling Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={logisticsNote}
                    onChange={(e) => setLogisticsNote(e.target.value)}
                    placeholder="Provide gate entry instructions, preferred receiving hours, or warehouse bay specifications."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Settlement Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 sticky top-28">
                <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Trade Escrow Settlement
                </h3>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Commodities Subtotal</span>
                    <strong className="text-slate-900">{formatCurrency(subtotal)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Logistics / Freight</span>
                    <strong className="text-slate-900">
                      {freightCost === 0 ? "FREE (Pickup)" : formatCurrency(freightCost)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>AgriPay Escrow Protection</span>
                    <span>100% Free Guarantee</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Settlement</span>
                    <span className="text-2xl font-black text-slate-900">{formatCurrency(grandTotal)}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">VAT Included</span>
                </div>

                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-start gap-2 text-[11px] text-teal-900 leading-relaxed">
                  <ShieldCheck className="h-4 w-4 text-teal-700 flex-shrink-0 mt-0.5" />
                  <span>
                    Your funds are locked safely in Escrow. Payment is only released to the cooperative when you inspect and accept the physical shipment.
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full btn-brand py-3.5 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition"
                >
                  {isSubmitting ? "Locking Escrow Order..." : "Confirm & Place Procurement Order"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
