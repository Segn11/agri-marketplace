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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      farmerPhone: "0911876543", // revealed once accepted (FR-4.7)
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-3xl shadow-soft mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Consumer & Business Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            My Produce Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track order status from pending to completion. Contact farmers directly to coordinate delivery and submit verified reviews.
          </p>
        </div>

        <Link href="/products">
          <Button size="lg" className="bg-brand-700 hover:bg-brand-800 text-white font-semibold shadow-glow-sm">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Browse More Harvests
          </Button>
        </Link>
      </div>

      {/* Orders List */}
      <div className="space-y-5">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-slate-900">{ord.productName}</h3>
                <span
                  className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                    ord.status === "COMPLETED"
                      ? "bg-brand-100 text-brand-800"
                      : ord.status === "ACCEPTED"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {ord.status}
                </span>
              </div>

              <p className="text-xs text-slate-600">
                Farmer: <strong className="text-slate-900">{ord.farmerName}</strong> &bull; Quantity:{" "}
                <strong>{ord.quantity} {ord.unit}</strong> &bull; Placed: <span>{ord.createdAt}</span>
              </p>

              {ord.status !== "PENDING" && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-900 text-xs font-semibold">
                  <Phone className="h-3.5 w-3.5 text-brand-600" />
                  <span>Farmer Phone Line: <strong>{ord.farmerPhone}</strong></span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-4 lg:pt-0">
              <div className="text-left lg:text-right">
                <span className="text-xs text-slate-400 font-medium block">Total Amount</span>
                <span className="text-xl font-black text-brand-700">{formatCurrency(ord.totalPrice)}</span>
              </div>

              {ord.status === "COMPLETED" && (
                <div>
                  {reviewedOrders.includes(ord.id) ? (
                    <span className="text-xs font-bold text-brand-700 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Review Submitted
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setReviewModalOrder(ord)}
                      className="bg-harvest-500 hover:bg-harvest-600 text-white font-semibold shadow-xs"
                    >
                      <Star className="h-4 w-4 mr-1.5 fill-white text-white" />
                      Rate & Review
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setReviewModalOrder(null)}
              className="absolute right-5 top-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <form onSubmit={handleSubmitReview} className="space-y-5">
              <div>
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                  Verified Order Review
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Rate {reviewModalOrder.productName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sold by {reviewModalOrder.farmerName}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
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
                        className={`h-7 w-7 transition ${
                          s <= rating
                            ? "fill-harvest-500 text-harvest-500"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Feedback on Quality & Handover
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Produce was fresh, accurate weight, and farmer was very prompt to arrange pickup."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <Button type="submit" size="lg" className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold">
                Submit Verified Review
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
