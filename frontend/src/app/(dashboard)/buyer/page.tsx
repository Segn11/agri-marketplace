"use client";

import { useState, useEffect } from "react";
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
  ShieldCheck,
  Award,
  ChevronRight,
  Truck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BuyerOrder {
  id: string;
  productName: string;
  farmerName: string;
  cooperative: string;
  farmerPhone: string;
  farmerLocation: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  deliveryPreference: string;
  status: "PENDING" | "ACCEPTED" | "READY" | "COMPLETED" | "CANCELLED";
  assayGrade: string;
  createdAt: string;
  note?: string;
}

const DEFAULT_ORDERS: BuyerOrder[] = [
  {
    id: "ord-201",
    productName: "Export Grade Pure White Teff (Magna)",
    farmerName: "Gemechu Desta",
    cooperative: "Oda Gida Agricultural Farmers Union",
    farmerPhone: "0911876543",
    farmerLocation: "Debre Birhan Mandi Terminal",
    quantity: 5,
    unit: "Quintal (100kg)",
    totalPrice: 47000,
    deliveryPreference: "PICKUP",
    status: "ACCEPTED",
    assayGrade: "Grade 1 (99.2% Purity)",
    createdAt: "Today, 10:30 AM",
  },
  {
    id: "ord-202",
    productName: "Fresh Red Bombay Cooking Onions",
    farmerName: "Chala Tolosa",
    cooperative: "Meki-Batu Vegetable Growers Union",
    farmerPhone: "0914567890",
    farmerLocation: "Adama Wholesale Mandi",
    quantity: 200,
    unit: "KG",
    totalPrice: 17000,
    deliveryPreference: "FREIGHT",
    status: "COMPLETED",
    assayGrade: "Export Quality Grade 1",
    createdAt: "Oct 16, 2026",
  },
  {
    id: "ord-203",
    productName: "Sidama Washed Specialty Green Coffee Beans",
    farmerName: "Wondwossen Bekele",
    cooperative: "Sidama Organic Coffee Producers Union",
    farmerPhone: "0912345678",
    farmerLocation: "Hawassa Central Dry Port",
    quantity: 2,
    unit: "Bag (60kg)",
    totalPrice: 57000,
    deliveryPreference: "PICKUP",
    status: "PENDING",
    assayGrade: "Q1 Specialty Grade (SCA 87.5)",
    createdAt: "Today, 12:15 PM",
  },
];

export default function AgriBuyerDashboard() {
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [reviewModalOrder, setReviewModalOrder] = useState<BuyerOrder | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewedOrders, setReviewedOrders] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("agri_buyer_orders");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOrders([...parsed, ...DEFAULT_ORDERS]);
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }
    setOrders(DEFAULT_ORDERS);
  }, []);

  const handleCancelOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "CANCELLED" as const } : o))
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewModalOrder) {
      setReviewedOrders([...reviewedOrders, reviewModalOrder.id]);
      setReviewModalOrder(null);
      setComment("");
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case "PENDING":
        return 1;
      case "ACCEPTED":
        return 2;
      case "READY":
        return 3;
      case "COMPLETED":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-8">
        {/* ── TOP BANNER ── */}
        <div
          className="text-white p-8 sm:p-10 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{ background: "linear-gradient(135deg, #041d1c 0%, #073330 50%, #0a4843 100%)" }}
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-900/80 text-teal-200 border border-teal-500/30 px-3 py-1 rounded text-xs font-semibold mb-3">
              <ShoppingCart className="h-3.5 w-3.5 text-amber-400" />
              <span>Agri Marketplace Buyer & Procurement Center</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Commodity Purchase Orders & Tracking
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Track live trade execution, inspect quality certificates, coordinate logistics with grower cooperatives, and submit post-handover ratings.
            </p>
          </div>

          <Link href="/products">
            <button className="btn-brand px-6 py-3 rounded text-sm font-semibold flex items-center justify-center gap-2 shadow-md">
              <ShoppingCart className="h-4 w-4" />
              Procure More Lots
            </button>
          </Link>
        </div>

        {/* ── ORDERS LIST WITH TRACKING TIMELINES ── */}
        <div className="space-y-6">
          {orders.map((ord) => {
            const step = getStatusStep(ord.status);
            return (
              <div key={ord.id} className="agri-card p-6 sm:p-7 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Lot #{ord.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded ${
                          ord.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.status === "READY"
                            ? "bg-amber-100 text-amber-800"
                            : ord.status === "ACCEPTED"
                            ? "bg-blue-100 text-blue-800"
                            : ord.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {ord.status}
                      </span>
                      <span className="text-xs text-slate-400">&bull; Ordered: {ord.createdAt}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">{ord.productName}</h3>

                    <p className="text-xs text-slate-600 mt-1">
                      Grower Cooperative: <strong className="text-slate-900">{ord.farmerName}</strong> ({ord.cooperative}) &bull;{" "}
                      Volume: <strong>{ord.quantity} {ord.unit}</strong>
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <Award className="h-3.5 w-3.5 text-emerald-600" />
                      <span>QC Assay: <strong className="text-slate-700">{ord.assayGrade}</strong></span>
                      <span>&bull;</span>
                      <span>Delivery: <strong>{ord.deliveryPreference === "FREIGHT" ? "Cooperative Trucking" : "Mandi Pickup"}</strong></span>
                    </div>
                  </div>

                  <div className="text-left lg:text-right flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Settlement Value</span>
                      <span className="text-2xl font-black text-slate-900">{formatCurrency(ord.totalPrice)}</span>
                      <span className="text-[10px] text-teal-700 font-semibold block">AgriPay Escrow Protected</span>
                    </div>

                    {ord.status === "PENDING" && (
                      <button
                        onClick={() => handleCancelOrder(ord.id)}
                        className="mt-2 text-xs font-semibold text-red-600 hover:underline"
                      >
                        Cancel Trade Order
                      </button>
                    )}
                  </div>
                </div>

                {/* ── PROGRESS TRACKING TIMELINE ── */}
                {ord.status !== "CANCELLED" && (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {/* Step 1 */}
                      <div className="space-y-1">
                        <div
                          className={`h-2 rounded-full ${
                            step >= 1 ? "bg-teal-600" : "bg-slate-200"
                          }`}
                        />
                        <span className="font-bold text-[11px] text-slate-800 block">1. Placed</span>
                        <span className="text-[10px] text-slate-400 block">Awaiting Acceptance</span>
                      </div>

                      {/* Step 2 */}
                      <div className="space-y-1">
                        <div
                          className={`h-2 rounded-full ${
                            step >= 2 ? "bg-teal-600" : "bg-slate-200"
                          }`}
                        />
                        <span className="font-bold text-[11px] text-slate-800 block">2. Accepted</span>
                        <span className="text-[10px] text-slate-400 block">Farmer Confirmed</span>
                      </div>

                      {/* Step 3 */}
                      <div className="space-y-1">
                        <div
                          className={`h-2 rounded-full ${
                            step >= 3 ? "bg-teal-600" : "bg-slate-200"
                          }`}
                        />
                        <span className="font-bold text-[11px] text-slate-800 block">3. Ready</span>
                        <span className="text-[10px] text-slate-400 block">Silo Bay / Staged</span>
                      </div>

                      {/* Step 4 */}
                      <div className="space-y-1">
                        <div
                          className={`h-2 rounded-full ${
                            step >= 4 ? "bg-teal-600" : "bg-slate-200"
                          }`}
                        />
                        <span className="font-bold text-[11px] text-slate-800 block">4. Completed</span>
                        <span className="text-[10px] text-slate-400 block">Escrow Released</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Direct Contact & QC Review Action */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  {ord.status !== "PENDING" && ord.status !== "CANCELLED" ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Direct Cooperative Contact Line: <strong>{ord.farmerPhone}</strong></span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      Direct contact will be unlocked immediately upon order confirmation.
                    </p>
                  )}

                  {ord.status === "COMPLETED" && (
                    <div>
                      {reviewedOrders.includes(ord.id) ? (
                        <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="h-4 w-4 mr-1.5" /> Quality Feedback Submitted
                        </span>
                      ) : (
                        <button
                          onClick={() => setReviewModalOrder(ord)}
                          className="btn-amber text-xs px-4 py-2.5 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <Star className="h-3.5 w-3.5 fill-white" />
                          Rate Quality & Handover
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── REVIEW MODAL ── */}
        {reviewModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl relative border border-slate-200 overflow-hidden">
              <div className="h-1.5 w-full bg-teal-600" />
              <div className="p-7">
                <button
                  onClick={() => setReviewModalOrder(null)}
                  className="absolute right-5 top-5 p-1 rounded text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Verified Trade Rating
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">
                      Review {reviewModalOrder.productName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Procured from {reviewModalOrder.farmerName} ({reviewModalOrder.cooperative})
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Quality Rating (1 to 5 Stars)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`h-7 w-7 ${
                              s <= rating ? "fill-amber-500 text-amber-500" : "text-slate-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Assay & Inspection Feedback
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Moisture level, kernel purity, and packaging strictly matched laboratory assay specifications."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-brand py-2.5 rounded text-sm font-semibold shadow-sm"
                  >
                    Submit Verified Rating
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
