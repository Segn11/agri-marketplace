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
  ShieldCheck,
  Award,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AgriBuyerDashboard() {
  const [reviewModalOrder, setReviewModalOrder] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewedOrders, setReviewedOrders] = useState<string[]>([]);

  const [orders, setOrders] = useState([
    {
      id: "ord-201",
      productName: "Premium White Teff (Magna Grade 1)",
      farmerName: "Gemechu Desta",
      cooperative: "Oda Gida Agricultural Union",
      farmerPhone: "0911876543",
      farmerLocation: "East Highland Market",
      quantity: 2,
      unit: "Quintal",
      totalPrice: 18800,
      deliveryPreference: "PICKUP",
      status: "ACCEPTED",
      assayGrade: "A+ (99.2% Purity)",
      createdAt: "Yesterday, 2:30 PM",
    },
    {
      id: "ord-202",
      productName: "Fresh Red Cooking Onions",
      farmerName: "Chala Tolosa",
      cooperative: "Valley Green Farmer Union",
      farmerPhone: "0922334455",
      farmerLocation: "Central River Basin",
      quantity: 50,
      unit: "KG",
      totalPrice: 4250,
      deliveryPreference: "FARMER_DELIVERY",
      status: "COMPLETED",
      assayGrade: "Fresh Harvest QC Assured",
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
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-8">
        {/* ── TOP BANNER ── */}
        <div
          className="text-white p-8 sm:p-10 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, #041d1c 0%, #073330 50%, #0a4843 100%)' }}
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-900/80 text-teal-200 border border-teal-500/30 px-3 py-1 rounded text-xs font-semibold mb-3">
              <ShoppingCart className="h-3.5 w-3.5 text-amber-400" />
              <span>AgriMarket Buyer & Procurement Center</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Commodity Purchase Orders
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Track live trade execution, coordinate delivery with verified grower cooperatives, and submit post-handover quality assay ratings.
            </p>
          </div>

          <Link href="/products">
            <button className="btn-brand px-6 py-3 rounded text-sm font-semibold flex items-center justify-center gap-2 shadow-md">
              <ShoppingCart className="h-4 w-4" />
              Procure More Lots
            </button>
          </Link>
        </div>

        {/* ── ORDERS LIST ── */}
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="agri-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{ord.productName}</h3>
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded ${
                      ord.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : ord.status === "ACCEPTED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Seller: <strong className="text-slate-900">{ord.farmerName}</strong> ({ord.cooperative}) &bull; Quantity:{" "}
                  <strong>{ord.quantity} {ord.unit}</strong> &bull; Ordered: <span>{ord.createdAt}</span>
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                  <span>QC Lab Assay: <strong className="text-slate-700">{ord.assayGrade}</strong></span>
                </div>

                {ord.status !== "PENDING" ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Direct Grower Phone Line: <strong>{ord.farmerPhone}</strong></span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    Farmer direct contact will be disclosed immediately upon order acceptance.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-4 lg:pt-0">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Settlement</span>
                  <span className="text-2xl font-black text-slate-900">{formatCurrency(ord.totalPrice)}</span>
                </div>

                {ord.status === "COMPLETED" && (
                  <div>
                    {reviewedOrders.includes(ord.id) ? (
                      <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded border border-emerald-200">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" /> QC Feedback Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => setReviewModalOrder(ord)}
                        className="btn-amber text-xs px-4 py-2.5 rounded font-semibold flex items-center gap-1.5 shadow-sm"
                      >
                        <Star className="h-3.5 w-3.5 fill-white" />
                        Rate Quality & Handover
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
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
                      Procured from {reviewModalOrder.farmerName}
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
                      Assay & Quality Feedback
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Moisture level and bag purity strictly aligned with the lab assay certificate."
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
