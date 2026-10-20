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
  LogOut,
  User as UserIcon,
  Lock,
  Building2,
  RefreshCw,
  Sparkles,
  PhoneCall,
  Search,
  ShieldAlert,
  Flag,
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
  status: "PENDING" | "ACCEPTED" | "READY" | "COMPLETED" | "CANCELLED" | "REJECTED";
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

export default function AgriBuyerPortal() {
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Auth Gate states (if not authenticated as Buyer)
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authIdentifier, setAuthIdentifier] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [regData, setRegData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    location: "Kality Logistics Park, Addis Ababa",
    companyName: "Abebe Commercial Foods",
  });

  // Buyer Dashboard states
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewModalOrder, setReviewModalOrder] = useState<OrderResponse | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewedOrders, setReviewedOrders] = useState<string[]>([]);

  // Dispute & Report Modal state (FR-8.2, Appendix A.3)
  const [reportModalOrder, setReportModalOrder] = useState<OrderResponse | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState("");

  // Check stored user session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser && storedToken) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.role === "ROLE_BUYER") {
            setUser(parsed);
          } else {
            setUser(null);
          }
        } catch (e) {
          console.error(e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthChecking(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetchApi<PagedOrderResponse>("/orders/buyer?page=0&size=50");
      setOrders(res.data?.content || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders from database.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user, loadOrders]);

  // Auth Handler: Buyer Login
  const handleBuyerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: authIdentifier, password: authPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      if (data.data.role !== "ROLE_BUYER") {
        throw new Error("This account is registered as " + data.data.role.replace("ROLE_", "") + ". Please login with a Buyer account, or register as a Buyer below.");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      setUser(data.data);
    } catch (err: any) {
      setAuthError(err.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth Handler: Buyer Register
  const handleBuyerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...regData,
          role: "ROLE_BUYER",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      setUser(data.data);
    } catch (err: any) {
      setAuthError(err.message || "Buyer registration failed");
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

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

  const handleReportOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalOrder) return;
    setReportSubmitting(true);
    setReportError("");
    try {
      await fetchApi("/reports", {
        method: "POST",
        body: JSON.stringify({
          targetType: "ORDER",
          targetId: reportModalOrder.id,
          reason: reportReason,
        }),
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportModalOrder(null);
        setReportSuccess(false);
        setReportReason("");
      }, 1500);
    } catch (err: any) {
      setReportError(err.message || "Failed to submit dispute report.");
    } finally {
      setReportSubmitting(false);
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

  if (authChecking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <RefreshCw className="h-7 w-7 text-blue-600 animate-spin" />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // 1. AUTH GATE: SHOW BUYER LOGIN / REGISTER IF NOT LOGGED IN
  // ══════════════════════════════════════════════════════════════
  if (!user) {
    return (
      <div className="min-h-[85vh] bg-gradient-to-b from-blue-50/50 via-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#1c4482] to-blue-600 text-white shadow-lg mb-3">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Buyer & Procurement Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Institutional sourcing for millers, food manufacturers, export brokers, and retail supermarket distributors.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-200/80 p-1 rounded-xl mb-6 text-xs font-bold">
            <button
              onClick={() => { setAuthTab("login"); setAuthError(""); }}
              className={`flex-1 py-2.5 rounded-lg transition ${
                authTab === "login"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In to Buyer Portal
            </button>
            <button
              onClick={() => { setAuthTab("register"); setAuthError(""); }}
              className={`flex-1 py-2.5 rounded-lg transition ${
                authTab === "register"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Register as Commercial Buyer
            </button>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* ── TAB: BUYER LOGIN ── */}
          {authTab === "login" && (
            <div className="bg-white p-7 sm:p-9 rounded-2xl border border-slate-200 shadow-sm">
              <form onSubmit={handleBuyerLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number or Email
                  </label>
                  <div className="relative">
                    <UserIcon className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={authIdentifier}
                      onChange={(e) => setAuthIdentifier(e.target.value)}
                      placeholder="e.g. 0911000003 or buyer@agri.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#1c4482] hover:bg-blue-900 text-white font-bold py-2.5 rounded-lg text-sm shadow-sm transition flex items-center justify-center gap-2 mt-2"
                >
                  {authLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Enter Buyer Portal</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo 1-Click Credentials Button */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setAuthIdentifier("buyer@agri.com");
                    setAuthPassword("password");
                  }}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  Fill Demo Buyer Account (buyer@agri.com)
                </button>
              </div>
            </div>
          )}

          {/* ── TAB: BUYER REGISTRATION ── */}
          {authTab === "register" && (
            <div className="bg-white p-7 sm:p-9 rounded-2xl border border-slate-200 shadow-sm">
              <form onSubmit={handleBuyerRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Procurement Officer / Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.fullName}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                    placeholder="e.g. Abebe Kebede"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      placeholder="0911000003"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="procurement@foodsplc.com"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company / Trade Entity Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.companyName}
                    onChange={(e) => setRegData({ ...regData, companyName: e.target.value })}
                    placeholder="e.g. Abebe Commercial Foods PLC"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Warehouse / Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.location}
                    onChange={(e) => setRegData({ ...regData, location: e.target.value })}
                    placeholder="e.g. Kality Logistics Park, Addis Ababa"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#1c4482] hover:bg-blue-900 text-white font-bold py-2.5 rounded-lg text-sm shadow-sm transition flex items-center justify-center gap-2 mt-3"
                >
                  {authLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Complete Buyer Registration</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="mt-8 text-center text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-700 underline font-medium">
              &larr; Back to National Agricultural Exchange
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // 2. AUTHENTICATED: SHOW FULL BUYER PROCUREMENT & TRACKING HUB
  // ══════════════════════════════════════════════════════════════
  const activeOrdersCount = orders.filter((o) => o.status === "PENDING" || o.status === "ACCEPTED" || o.status === "READY").length;
  const completedOrdersCount = orders.filter((o) => o.status === "COMPLETED").length;
  const totalSpent = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-8">
        {/* ── TOP BANNER ── */}
        <div
          className="text-white p-7 sm:p-9 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{ background: "linear-gradient(135deg, #041d1c 0%, #073330 50%, #0a4843 100%)" }}
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-900/80 text-teal-200 border border-teal-500/30 px-3 py-1 rounded text-xs font-semibold mb-3">
              <ShoppingCart className="h-3.5 w-3.5 text-amber-400" />
              <span>Commercial Procurement & Order Tracking Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user.fullName || "Buyer"}&apos;s Procurement Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track live purchase orders directly from the database, view disclosed farmer coordinates upon confirmation, and submit verified trade feedback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/products">
              <button className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition">
                <Search className="h-4 w-4" />
                Procure More Lots
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* ── METRIC STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Purchase Orders</span>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">{orders.length}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Lifetime placed lots</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In-Fulfillment Lots</span>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-700">{activeOrdersCount}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Pending, accepted & dispatch</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Deliveries</span>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-700">{completedOrdersCount}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Fulfilled & verified trades</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Volume Procured</span>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1c4482]">{formatCurrency(totalSpent)}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Direct cooperative settlement</span>
          </div>
        </div>

        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Querying orders from database...</p>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs max-w-lg mx-auto my-8 space-y-4">
            <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              You haven't placed any commodity orders in the exchange yet. Browse live listings from verified producers and place your first procurement order.
            </p>
            <Link
              href="/products"
              className="bg-[#1c4482] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
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
                <div key={ord.id} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-6 shadow-xs hover:border-blue-200 transition">
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
                            <span className="italic">Note: &ldquo;{ord.note}&rdquo;</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-start lg:items-end justify-between">
                      <span className="text-xs text-slate-400">Total Settlement Value</span>
                      <span className="text-2xl font-black text-slate-900">
                        {formatCurrency(ord.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* ── 4-STEP VISUAL PROGRESSION ── */}
                  {ord.status !== "CANCELLED" ? (
                    <div className="bg-slate-50/80 rounded-xl p-4 sm:p-6 border border-slate-100">
                      <div className="grid grid-cols-4 gap-2 relative">
                        <div className="absolute top-4 left-[12%] right-[12%] h-0.5 bg-slate-200 -z-0">
                          <div
                            className="h-full bg-teal-600 transition-all duration-500"
                            style={{
                              width:
                                step === 1
                                  ? "0%"
                                  : step === 2
                                  ? "33%"
                                  : step === 3
                                  ? "66%"
                                  : "100%",
                            }}
                          ></div>
                        </div>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center z-10">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                              step >= 1
                                ? "bg-teal-600 text-white ring-4 ring-teal-50"
                                : "bg-white border border-slate-300 text-slate-400"
                            }`}
                          >
                            {step > 1 ? <CheckCircle2 className="h-4 w-4" /> : "1"}
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 mt-2">Order Placed</span>
                          <span className="text-[10px] text-slate-400">Awaiting Acceptance</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center z-10">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                              step >= 2
                                ? "bg-teal-600 text-white ring-4 ring-teal-50"
                                : "bg-white border border-slate-300 text-slate-400"
                            }`}
                          >
                            {step > 2 ? <CheckCircle2 className="h-4 w-4" /> : "2"}
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 mt-2">Accepted</span>
                          <span className="text-[10px] text-slate-400">Direct Contact Revealed</span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center z-10">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                              step >= 3
                                ? "bg-teal-600 text-white ring-4 ring-teal-50"
                                : "bg-white border border-slate-300 text-slate-400"
                            }`}
                          >
                            {step > 3 ? <CheckCircle2 className="h-4 w-4" /> : "3"}
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 mt-2">Ready</span>
                          <span className="text-[10px] text-slate-400">Pickup / Dispatch</span>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center text-center z-10">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                              step >= 4
                                ? "bg-emerald-600 text-white ring-4 ring-emerald-50"
                                : "bg-white border border-slate-300 text-slate-400"
                            }`}
                          >
                            {step === 4 ? <CheckCircle2 className="h-4 w-4" /> : "4"}
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 mt-2">Completed</span>
                          <span className="text-[10px] text-slate-400">Lot Verified</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>This order was cancelled. Stock has been atomically restored to available database inventory.</span>
                    </div>
                  )}

                  {/* ── REVEALED CONTACT INFORMATION ── */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                    <div>
                      {step >= 2 ? (
                        <div className="flex items-center gap-2 text-xs text-slate-700 bg-emerald-50 text-emerald-900 border border-emerald-200 px-3.5 py-2 rounded-lg">
                          <Phone className="h-4 w-4 text-emerald-600" />
                          <span>
                            <strong>Direct Farmer Contact:</strong> {ord.farmerName} &bull;{" "}
                            <a href={`tel:${ord.farmerPhone || "0911000002"}`} className="font-bold underline text-emerald-800">
                              {ord.farmerPhone || "0911000002"}
                            </a>
                          </span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Farmer phone contact is masked until the producer accepts this order.</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {ord.status === "PENDING" && (
                        <button
                          onClick={() => handleCancelOrder(ord.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
                        >
                          Cancel Order
                        </button>
                      )}

                      {ord.status !== "PENDING" && ord.status !== "CANCELLED" && (
                        <button
                          onClick={() => {
                            setReportModalOrder(ord);
                            setReportReason("");
                            setReportError("");
                          }}
                          className="text-xs font-semibold text-slate-500 hover:text-red-600 transition flex items-center gap-1 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-red-200"
                        >
                          <Flag className="h-3.5 w-3.5" />
                          <span>Raise Dispute</span>
                        </button>
                      )}

                      {ord.status === "COMPLETED" && (
                        <button
                          onClick={() => setReviewModalOrder(ord)}
                          disabled={reviewedOrders.includes(ord.id)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            reviewedOrders.includes(ord.id)
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-[#1c4482] hover:bg-blue-900 text-white shadow-xs"
                          }`}
                        >
                          <Star className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                          <span>{reviewedOrders.includes(ord.id) ? "Review Submitted" : "Leave Review"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── REVIEW MODAL ── */}
        {reviewModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setReviewModalOrder(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-900">Review Your Procurement</h3>
              <p className="text-xs text-slate-500 mt-1">
                Rate your transaction with <strong>{reviewModalOrder.farmerName}</strong> for Order #{reviewModalOrder.id.slice(0, 8)}.
              </p>

              {reviewSuccess ? (
                <div className="my-8 text-center space-y-2">
                  <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Thank You!</h4>
                  <p className="text-xs text-slate-500">Your verified review has been submitted to the database.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="mt-5 space-y-4">
                  {reviewError && (
                    <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                      {reviewError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Quality & Handover Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`h-7 w-7 ${
                              star <= rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Comment</label>
                    <textarea
                      rows={3}
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Comment on commodity moisture, seed purity, bagging, and delivery promptness..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setReviewModalOrder(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="btn-brand px-5 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      {reviewSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── DISPUTE & REPORT MODAL (FR-8.2, Appendix A.3) ── */}
        {reportModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
              <button
                onClick={() => setReportModalOrder(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-red-600 mb-2">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="text-lg font-bold text-slate-900">Raise Trade Dispute</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Flag an issue with Order <strong>#{reportModalOrder.id.slice(0, 8)}</strong> with seller <strong>{reportModalOrder.farmerName}</strong> to the platform administrator.
              </p>

              {reportSuccess ? (
                <div className="my-6 text-center space-y-2">
                  <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Dispute Submitted</h4>
                  <p className="text-xs text-slate-500">The platform administrator will review this report and resolve with both parties.</p>
                </div>
              ) : (
                <form onSubmit={handleReportOrder} className="space-y-4">
                  {reportError && (
                    <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                      {reportError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Dispute Category</label>
                    <select
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      defaultValue=""
                    >
                      <option value="" disabled>Choose primary issue...</option>
                      <option value="Quality mismatch (moisture / grade not as described)">Quality mismatch (moisture / grade not as described)</option>
                      <option value="Quantity shortfall during physical handover">Quantity shortfall during physical handover</option>
                      <option value="Seller unresponsive at disclosed phone coordinates">Seller unresponsive at disclosed phone coordinates</option>
                      <option value="Logistical or pickup warehouse dispute">Logistical or pickup warehouse dispute</option>
                      <option value="Other grievance">Other grievance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Explanation</label>
                    <textarea
                      rows={3}
                      required
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Describe the discrepancy, communications attempted with the farmer, or delivery problem..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setReportModalOrder(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reportSubmitting || !reportReason.trim()}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-xs transition disabled:opacity-50"
                    >
                      {reportSubmitting ? "Submitting..." : "Submit to Administrator"}
                    </button>
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
