"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  Phone,
  CheckCircle2,
  Clock,
  Package,
  X,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function BuyerDashboard() {
  const [reviewModalOrder, setReviewModalOrder] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewedOrders, setReviewedOrders] = useState<string[]>([]);

  const [orders, setOrders] = useState([
    {
      id: "ord-201",
      productName: "Premium White Teff (Magna)",
      farmerName: "Gemechu Desta",
      farmerPhone: "0911876543", // revealed once accepted
      farmerLocation: "East Highland Cooperative",
      quantity: 2,
      unit: "Quintal",
      totalPrice: 18800,
      deliveryPreference: "PICKUP",
      status: "ACCEPTED",
      createdAt: "Yesterday, 2:30 PM",
    },
    {
      id: "ord-202",
      productName: "Fresh Red Cooking Onions",
      farmerName: "Chala Tolosa",
      farmerPhone: "0922334455",
      farmerLocation: "Central River Basin",
      quantity: 50,
      unit: "KG",
      totalPrice: 4250,
      deliveryPreference: "FARMER_DELIVERY",
      status: "COMPLETED",
      createdAt: "Oct 12, 2026",
    },
  ]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewModalOrder) {
      setReviewedOrders([...reviewedOrders, reviewModalOrder.id]);
      setReviewModalOrder(null);
      setComment("");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-soft mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-brand-300/20 via-emerald-200/10 to-transparent rounded-bl-full pointer-events-none -z-10" />

        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60 mb-3">
            <ShoppingCart className="h-3.5 w-3.5" /> Buyer Order Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            My Produce Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Monitor real-time fulfillment status, connect directly with producers via phone, and review completed orders.
          </p>
        </div>

        <Link href="/products">
          <button className="btn-primary-gradient text-white font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-glow-sm">
            <ShoppingCart className="h-4 w-4" />
            Explore More Harvests
          </button>
        </Link>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="produce-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900">{ord.productName}</h3>
                <span
                  className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                    ord.status === "COMPLETED"
                      ? "bg-brand-50 text-brand-800 border border-brand-200"
                      : ord.status === "ACCEPTED"
                      ? "bg-blue-50 text-blue-800 border border-blue-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {ord.status}
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Farmer: <strong className="text-slate-800">{ord.farmerName}</strong> &bull; Quantity:{" "}
                <strong className="text-slate-800">{ord.quantity} {ord.unit}</strong> &bull; Ordered: <span>{ord.createdAt}</span>
              </p>

              {ord.status !== "PENDING" ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-200/70 text-brand-900 text-xs font-semibold">
                  <Phone className="h-3.5 w-3.5 text-brand-600" />
                  <span>Direct Farmer Phone Line: <strong>{ord.farmerPhone}</strong></span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  Farmer contact will be disclosed immediately upon order acceptance.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-4 lg:pt-0">
              <div className="text-left lg:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total</span>
                <span className="text-2xl font-black text-brand-700">{formatCurrency(ord.totalPrice)}</span>
              </div>

              {ord.status === "COMPLETED" && (
                <div>
                  {reviewedOrders.includes(ord.id) ? (
                    <span className="inline-flex items-center text-xs font-bold text-brand-700 bg-brand-50 px-3 py-2 rounded-xl border border-brand-200">
                      <CheckCircle2 className="h-4 w-4 mr-1.5" /> Review Submitted
                    </span>
                  ) : (
                    <button
                      onClick={() => setReviewModalOrder(ord)}
                      className="btn-primary-gradient text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Star className="h-3.5 w-3.5 fill-white" />
                      Rate & Review
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border border-slate-100 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-harvest-500 via-brand-500 to-brand-600" />

            <div className="p-7 sm:p-8">
              <button
                onClick={() => setReviewModalOrder(null)}
                className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-brand-700 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                    Verified Purchase Review
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                    Review {reviewModalOrder.productName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Purchased from {reviewModalOrder.farmerName}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-7 w-7 transition ${
                            s <= rating
                              ? "fill-harvest-500 text-harvest-500"
                              : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Feedback
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Produce was fresh, accurate weight, and farmer was prompt with handover."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition resize-none shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary-gradient text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-glow-sm"
                >
                  Submit Verified Review
                  <ChevronRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
