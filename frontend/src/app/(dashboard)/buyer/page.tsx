"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  Phone,
  CheckCircle2,
  Clock,
  Package,
  X,
  Award,
  ChevronRight,
  Truck,
  ArrowRight,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { fetchApi } from "@/lib/api";

interface OrderItemDto {
  productId: string;
  productName: string;
  productUnit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface OrderResponse {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  status: "PENDING" | "ACCEPTED" | "READY" | "COMPLETED" | "CANCELLED";
  note?: string;
  deliveryPreference?: string;
  totalPrice: number;
  items: OrderItemDto[];
  createdAt: string;
}

interface PagedOrderResponse {
  content: OrderResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export default function AgriBuyerDashboard() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewModalOrder, setReviewModalOrder] = useState<OrderResponse | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewedOrders, setReviewedOrders] = useState<string[]>([]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("AUTH_REQUIRED");
      setLoading(false);
      return;
    }

    try {
      const res = await fetchApi<PagedOrderResponse>("/orders/buyer?page=0&size=20");
      setOrders(res.data?.content || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await fetchApi(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "CANCELLED",
          reason: "Cancelled by buyer via procurement dashboard",
        }),
      });
      loadOrders();
    } catch (err: any) {
      alert(err.message || "Could not cancel order.");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalOrder) return;

    setReviewSubmitting(true);
    setReviewError("");

    try {
      await fetchApi("/reviews", {
        method: "POST",
        body: JSON.stringify({
          orderId: reviewModalOrder.id,
          rating,
          comment,
        }),
      });
      setReviewedOrders((prev) => [...prev, reviewModalOrder.id]);
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewModalOrder(null);
        setReviewSuccess(false);
        setComment("");
      }, 1500);
    } catch (err: any) {
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
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
              Track live trade execution directly from the database, inspect orders, coordinate logistics with grower cooperatives, and submit post-handover ratings.
            </p>
          </div>

          <Link href="/products">
            <button className="btn-brand px-6 py-3 rounded text-sm font-semibold flex items-center justify-center gap-2 shadow-md">
              <ShoppingCart className="h-4 w-4" />
              Procure More Lots
            </button>
          </Link>
        </div>

        {/* ── AUTH REQUIRED STATE ── */}
        {error === "AUTH_REQUIRED" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm max-w-md mx-auto my-12 space-y-4">
            <div className="h-16 w-16 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto">
              <LogIn className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Sign In Required</h2>
            <p className="text-xs text-slate-500">
              Please sign in to your verified Buyer account to view and manage your orders from the database.
            </p>
            <Link
              href="/login"
              className="btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
            >
              Sign In to Your Account
            </Link>
          </div>
        )}

        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
            <p className="text-xs font-semibold text-slate-500">Querying orders from database...</p>
          </div>
        )}

        {/* ── GENERIC ERROR STATE ── */}
        {!loading && error && error !== "AUTH_REQUIRED" && (
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-lg mx-auto my-8">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">Database Order Lookup Notice</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">{error}</p>
            <button
              onClick={() => loadOrders()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm max-w-lg mx-auto my-8 space-y-4">
            <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              You haven't placed any commodity orders in the exchange yet. Browse live listings from verified producers and place your first procurement order.
            </p>
            <Link
              href="/products"
              className="btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
            >
              Explore Commodities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* ── ORDERS LIST WITH TRACKING TIMELINES ── */}
        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((ord) => {
              const step = getStatusStep(ord.status);
              const firstItem = ord.items?.[0];
              const totalItemsCount = ord.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

              return (
                <div key={ord.id} className="agri-card p-6 sm:p-7 space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          Order #{ord.id.slice(0, 8)}
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
                        <span className="text-xs text-slate-400">
                          &bull; Placed: {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">
                        {firstItem?.productName || "Commodity Procurement Lot"}
                        {ord.items && ord.items.length > 1 && (
                          <span className="text-xs font-normal text-slate-500 ml-2">
                            (+{ord.items.length - 1} other item{ord.items.length > 2 ? "s" : ""})
                          </span>
                        )}
                      </h3>

                      <p className="text-xs text-slate-600 mt-1">
                        Seller: <strong className="text-slate-900">{ord.farmerName}</strong> &bull;{" "}
                        Volume: <strong>{totalItemsCount} {firstItem?.productUnit || "Units"}</strong>
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Award className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Delivery: <strong>{ord.deliveryPreference === "FREIGHT" ? "Cooperative Trucking" : "Mandi Warehouse Pickup"}</strong></span>
                        {ord.note && (
                          <>
                            <span>&bull;</span>
                            <span className="italic">Note: "{ord.note}"</span>
                          </>
                        )}
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
                          <span className="text-[10px] text-slate-400 block">Pending Acceptance</span>
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
                          <span className="text-[10px] text-slate-400 block">Escrow Settled</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Direct Contact & QC Review Action */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    {ord.farmerPhone ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                        <Phone className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Cooperative Direct Line: <strong>{ord.farmerPhone}</strong></span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">
                        {ord.status === "PENDING"
                          ? "Direct farmer contact will be unlocked upon order confirmation."
                          : "Contact information verified with exchange."}
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
        )}

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

                {reviewSuccess ? (
                  <div className="py-6 text-center space-y-2">
                    <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-900">Review Submitted!</h3>
                    <p className="text-xs text-slate-500">Thank you for helping verify quality standards on the platform.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Verified Trade Rating
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-2">
                        Review {reviewModalOrder.items?.[0]?.productName || "Order"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Procured from {reviewModalOrder.farmerName}
                      </p>
                    </div>

                    {reviewError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                        {reviewError}
                      </div>
                    )}

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
                        placeholder="Detail moisture level, kernel purity, and packaging condition upon physical inspection."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="w-full btn-brand py-2.5 rounded text-sm font-semibold shadow-sm disabled:opacity-50"
                    >
                      {reviewSubmitting ? "Submitting to Database..." : "Submit Verified Rating"}
                    </button>
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
