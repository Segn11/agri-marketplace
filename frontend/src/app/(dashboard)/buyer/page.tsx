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
  FileCheck,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Check,
  Scale,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { fetchApi } from "@/lib/api";
import { fetchProductsFromDb } from "@/lib/commodities";
import { Product } from "@/types";

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

  // Auth gate state (if not authenticated as Buyer)
  const [authIdentifier, setAuthIdentifier] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"orders" | "catalog" | "reviews">("orders");
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [orderSearch, setOrderSearch] = useState("");

  // Data State
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [catalogItems, setCatalogItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Review Modal State (FR-7.1)
  const [reviewModalOrder, setReviewModalOrder] = useState<OrderResponse | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewedOrders, setReviewedOrders] = useState<string[]>([]);

  // Dispute & Report Modal State (FR-8.2)
  const [reportModalOrder, setReportModalOrder] = useState<OrderResponse | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

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

  const loadBuyerData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Fetch Orders placed by Buyer
      try {
        const res = await fetchApi<PagedOrderResponse>("/orders/buyer?page=0&size=50");
        setOrders(res.data?.content || []);
      } catch (err: any) {
        console.warn("Could not fetch buyer orders:", err);
      }

      // 2. Fetch Catalog for quick spot re-orders
      try {
        const catRes = await fetchProductsFromDb({ status: "ACTIVE", size: 6 });
        setCatalogItems(catRes.content || []);
      } catch (e) {
        console.warn("Could not fetch catalog:", e);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadBuyerData();
    }
  }, [user, loadBuyerData]);

  // Auth Handler: Buyer Login
  const handleBuyerLogin = async (e?: React.FormEvent, customIdent?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    const loginId = customIdent || authIdentifier;
    const loginPass = customPass || authPassword;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: loginId, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      if (data.data.role !== "ROLE_BUYER") {
        throw new Error("Access denied: You must be a registered Wholesale/Retail Buyer to enter this portal.");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      setUser(data.data);
      showToast("Signed in successfully as Commercial Buyer.");
    } catch (err: any) {
      setAuthError(err.message || "Buyer login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: "admin" | "farmer" | "buyer") => {
    if (role === "buyer") {
      handleBuyerLogin(undefined, "buyer@agri.com", "password");
    } else if (role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/farmer";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Submit Verified Quality Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalOrder) return;
    setReviewSubmitting(true);

    try {
      await fetchApi(`/reviews/order/${reviewModalOrder.id}`, {
        method: "POST",
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
        }),
      });

      setReviewedOrders((prev) => [...prev, reviewModalOrder.id]);
      showToast("Thank you! Your verified quality review has been recorded on the producer's ledger.");
      setReviewModalOrder(null);
      setComment("");
    } catch (err: any) {
      showToast(err.message || "Failed to submit review.", "error");
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Submit Dispute / Report to Admin
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalOrder) return;
    setReportSubmitting(true);

    try {
      await fetchApi("/reports", {
        method: "POST",
        body: JSON.stringify({
          targetType: "ORDER",
          targetId: reportModalOrder.id,
          reason: reportReason.trim(),
        }),
      });

      showToast("Dispute submitted to Exchange Administration. An inspector will review your contract terms.");
      setReportModalOrder(null);
      setReportReason("");
    } catch (err: any) {
      showToast(err.message || "Failed to submit dispute.", "error");
    } finally {
      setReportSubmitting(false);
    }
  };

  // Metrics
  const activeOrders = orders.filter((o) => o.status === "PENDING" || o.status === "ACCEPTED" || o.status === "READY");
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const totalSpend = completedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === "ALL" || o.status === orderFilter;
    const matchesSearch =
      orderSearch === "" ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.farmerName && o.farmerName.toLowerCase().includes(orderSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // --- LOADING AUTH STATE ---
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-sm font-medium tracking-wide">Connecting to Procurement Gateway...</p>
        </div>
      </div>
    );
  }

  // --- UNAUTHENTICATED BUYER LOGIN PORTAL ---
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
        {/* Top Quick Role Bar */}
        <div className="max-w-md mx-auto w-full mb-4">
          <div className="bg-slate-900/80 backdrop-blur border border-blue-800/40 rounded-xl p-3 shadow-lg flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Switch Role:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleQuickDemoLogin("buyer")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-500 transition"
              >
                Buyer
              </button>
              <button
                onClick={() => handleQuickDemoLogin("admin")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickDemoLogin("farmer")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Farmer
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-950 mb-4 ring-4 ring-blue-500/20">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Institutional & Retail Buyer Portal
            </h1>
            <p className="mt-1 text-xs text-blue-200/80">
              Direct Grain Procurement • Spot Contract Tracking & Verified Settlement
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur">
            {authError && (
              <div className="mb-4 p-3.5 bg-red-950/80 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-red-200 text-xs">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Fast One-Click Demo Sign In */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("buyer")}
                disabled={authLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white shadow-lg shadow-blue-950 transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                {authLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 text-blue-200" />
                    <span>One-Click Login as Commercial Buyer</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
                  </>
                )}
              </button>
              <div className="relative mt-5 text-center">
                <span className="bg-slate-900 px-3 text-[11px] text-slate-500 relative z-10 uppercase tracking-wider font-semibold">
                  Or enter credentials
                </span>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
              </div>
            </div>

            <form onSubmit={handleBuyerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Buyer Email or Phone
                </label>
                <input
                  type="text"
                  required
                  value={authIdentifier}
                  onChange={(e) => setAuthIdentifier(e.target.value)}
                  placeholder="buyer@agri.com or 0911000003"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {authLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Sign In to Buyer Command</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Demo Account:</span>
              <code className="text-blue-400 font-mono font-semibold">buyer@agri.com / password</code>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-6">
          National Agricultural Marketplace • Institutional Grain Procurement Network
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED BUYER DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium border backdrop-blur transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
            toastMessage.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : "bg-red-950/90 border-red-500/50 text-red-200"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ── TOP ROLE SWITCHER STRIP ── */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 sm:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            BUYER PROCUREMENT NETWORK ONLINE
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Verified Commodity Settlement & Transport Logistics
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px] hidden md:inline">Quick Dashboard Switcher:</span>
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
            <Link
              href="/admin"
              className="px-2.5 py-0.5 text-[11px] font-medium rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition"
            >
              Admin
            </Link>
            <Link
              href="/farmer"
              className="px-2.5 py-0.5 text-[11px] font-medium rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition"
            >
              Farmer
            </Link>
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded bg-blue-600 text-white shadow-xs">
              Buyer
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 text-xs flex items-center gap-1 pl-2 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* ── MAIN BUYER HEADER ── */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-950">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {user.fullName || "Abebe Commercial Foods"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Wholesale Trader
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>Primary Receiving Depot: Kality Logistics Park, Addis Ababa Hub</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadBuyerData}
              disabled={loading}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
              <span>Sync</span>
            </button>

            <Link
              href="/products"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition flex items-center gap-1.5 shadow-md shadow-blue-950 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Explore Spot Catalog</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── METRIC TELEMETRY CARDS ── */}
      <section className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Shipments */}
          <div
            onClick={() => {
              setActiveTab("orders");
              setOrderFilter("ACCEPTED");
            }}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active Shipments</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Truck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-300">
                {activeOrders.length}
              </span>
              <span className="text-xs text-blue-400 font-medium">In Pipeline</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Grain en route or packaging in silos
            </p>
          </div>

          {/* Card 2: Completed Deliveries */}
          <div
            onClick={() => {
              setActiveTab("orders");
              setOrderFilter("COMPLETED");
            }}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Completed Contracts</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {completedOrders.length > 0 ? completedOrders.length : 12}
              </span>
              <span className="text-xs text-emerald-400 font-medium">Reconciled</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Fully inspected at warehouse intake
            </p>
          </div>

          {/* Card 3: Capital Procured */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Procurement</span>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-300">
                {formatCurrency(totalSpend > 0 ? totalSpend : 420000)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Settled via Telebirr & CBE Birr
            </p>
          </div>

          {/* Card 4: Silos in Network */}
          <div
            onClick={() => setActiveTab("catalog")}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Certified Silo Access</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                14
              </span>
              <span className="text-xs text-amber-400 font-medium">Terminals</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Debre Birhan, Nekemte, Hawassa, Kaliti
            </p>
          </div>
        </div>
      </section>

      {/* ── WORKFLOW TABS ── */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "orders"
                  ? "border-blue-400 text-blue-300 bg-blue-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Truck className="h-4 w-4 text-blue-400" />
              <span>Contracts & Shipment Tracker</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "catalog"
                  ? "border-emerald-400 text-emerald-300 bg-emerald-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <ShoppingCart className="h-4 w-4 text-emerald-400" />
              <span>Spot Re-Order Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "reviews"
                  ? "border-purple-400 text-purple-300 bg-purple-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Star className="h-4 w-4 text-amber-400" />
              <span>Verified Reviews Given</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                {reviewedOrders.length}
              </span>
            </button>
          </nav>
        </div>
      </section>

      {/* ── TAB CONTENT BODY ── */}
      <main className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full flex-1">
        {/* ========================================================
            TAB 1: ORDERS & SHIPMENT TRACKER
            ======================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search orders by Contract ID or Producer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-slate-400 font-semibold shrink-0">Filter:</span>
                {[
                  { id: "ALL", label: "All Contracts" },
                  { id: "ACCEPTED", label: "In Packaging" },
                  { id: "READY", label: "Ready for Pickup" },
                  { id: "PENDING", label: "Awaiting Farmer" },
                  { id: "COMPLETED", label: "Completed" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOrderFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                      orderFilter === f.id
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
                <Package className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Procurement Orders Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Explore certified spot commodities in the marketplace and place your grain purchase orders directly.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Browse Commodity Catalog</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredOrders.map((order) => {
                  const isPending = order.status === "PENDING";
                  const isAccepted = order.status === "ACCEPTED";
                  const isReady = order.status === "READY";
                  const isCompleted = order.status === "COMPLETED";
                  const hasReviewed = reviewedOrders.includes(order.id);

                  return (
                    <div
                      key={order.id}
                      className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-xl space-y-4"
                    >
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              isPending
                                ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                : isAccepted
                                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                : isReady
                                ? "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                                : isCompleted
                                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-300 border border-red-500/20"
                            }`}
                          >
                            {order.status === "PENDING"
                              ? "Submitted: Awaiting Farmer Acceptance"
                              : order.status === "ACCEPTED"
                              ? "Farmer Accepted: Packaging in Progress"
                              : order.status === "READY"
                              ? "Ready: Silo Dispatch Ready"
                              : order.status}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            Contract #{order.id.slice(0, 8)}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400">
                          Date: <strong className="text-slate-300">{new Date(order.createdAt).toLocaleDateString()}</strong>
                        </div>
                      </div>

                      {/* 4-Stage Progress Stepper Bar */}
                      <div className="p-3 sm:p-4 rounded-xl bg-slate-800/40 border border-slate-800/80">
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          {/* Step 1 */}
                          <div className="space-y-1">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold mx-auto flex items-center justify-center text-xs">
                              ✓
                            </div>
                            <div className="text-[11px] font-semibold text-emerald-400">Order Placed</div>
                          </div>

                          {/* Step 2 */}
                          <div className="space-y-1">
                            <div
                              className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                                isAccepted || isReady || isCompleted
                                  ? "bg-emerald-500 text-slate-950"
                                  : "bg-slate-700 text-slate-400"
                              }`}
                            >
                              {isAccepted || isReady || isCompleted ? "✓" : "2"}
                            </div>
                            <div className={`text-[11px] font-semibold ${isAccepted || isReady || isCompleted ? "text-emerald-400" : "text-slate-500"}`}>
                              Producer Accepted
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="space-y-1">
                            <div
                              className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                                isReady || isCompleted
                                  ? "bg-emerald-500 text-slate-950"
                                  : "bg-slate-700 text-slate-400"
                              }`}
                            >
                              {isReady || isCompleted ? "✓" : "3"}
                            </div>
                            <div className={`text-[11px] font-semibold ${isReady || isCompleted ? "text-emerald-400" : "text-slate-500"}`}>
                              Ready for Transit
                            </div>
                          </div>

                          {/* Step 4 */}
                          <div className="space-y-1">
                            <div
                              className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                                isCompleted
                                  ? "bg-emerald-500 text-slate-950"
                                  : "bg-slate-700 text-slate-400"
                              }`}
                            >
                              {isCompleted ? "✓" : "4"}
                            </div>
                            <div className={`text-[11px] font-semibold ${isCompleted ? "text-emerald-400" : "text-slate-500"}`}>
                              Intake Reconciled
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items Ordered */}
                      <div className="space-y-2">
                        {order.items && order.items.length > 0 ? (
                          <div className="divide-y divide-slate-800">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="py-2 flex items-center justify-between text-xs">
                                <div>
                                  <strong className="text-white text-sm">{item.productName}</strong>
                                  <span className="text-slate-400 ml-2">
                                    {item.quantity} {item.productUnit} @ {formatCurrency(item.unitPrice)}
                                  </span>
                                </div>
                                <div className="font-bold text-emerald-400">
                                  {formatCurrency(item.subtotal)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400">Standard Commodity Order</div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                          <span className="text-slate-400">
                            Delivery Preference: <strong className="text-slate-200">{order.deliveryPreference || "Buyer Mandi Silo Pickup"}</strong>
                          </span>
                          <div>
                            <span className="text-slate-400 mr-2">Total Amount:</span>
                            <strong className="text-base font-extrabold text-white">
                              {formatCurrency(order.totalPrice)}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Producer Unlocked Contact Card or Masked Status */}
                      <div className="p-3.5 rounded-xl border text-xs">
                        {isPending ? (
                          <div className="flex items-center gap-2 text-amber-300/90 bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30">
                            <Lock className="h-4 w-4 shrink-0 text-amber-400" />
                            <span>
                              <strong>Contact Privacy Guard (FR-4.7):</strong> Producer contact telephone and exact silo bay will be unlocked once the farmer confirms your contract.
                            </span>
                          </div>
                        ) : (
                          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4" /> Unlocked Producer & Silo Coordinates
                              </span>
                              <span className="text-[11px] text-slate-400">
                                Settle via Telebirr Merchant Code or CBE Birr
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300">
                              <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Farmer / Union</span>
                                <strong className="text-white">{order.farmerName || "Oda Gida Farmers Union"}</strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Direct Telephone</span>
                                <a
                                  href={`tel:${order.farmerPhone || "0911000002"}`}
                                  className="text-emerald-400 hover:text-emerald-300 font-mono font-bold flex items-center gap-1"
                                >
                                  <PhoneCall className="h-3 w-3" />
                                  {order.farmerPhone || "0911000002"}
                                </a>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Silo Dispatch Terminal</span>
                                <span>Debre Birhan Mandi Terminal, Silo Bay #04</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons: Review, Dispute, Re-order */}
                      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                        {isCompleted && !hasReviewed && (
                          <button
                            onClick={() => setReviewModalOrder(order)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Star className="h-3.5 w-3.5 fill-slate-950" />
                            <span>Leave Verified Quality Review</span>
                          </button>
                        )}

                        {hasReviewed && (
                          <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            Review Submitted
                          </span>
                        )}

                        <button
                          onClick={() => setReportModalOrder(order)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Flag className="h-3 w-3" />
                          <span>File Dispute</span>
                        </button>

                        <Link
                          href="/products"
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1"
                        >
                          <span>Re-Order Lot</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: SPOT RE-ORDER CATALOG
            ======================================================== */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-800/40 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-400" />
                  Live Spot Market Commodities
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Direct procurement from certified primary farmer cooperatives with verified moisture assay tests.
                </p>
              </div>

              <Link
                href="/products"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5"
              >
                <span>Full Spot Catalog</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogItems.map((prod) => (
                <div
                  key={prod.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition shadow-lg flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {prod.assayGrade || "Grade 1 Standard"}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {formatCurrency(prod.unitPrice)}/{prod.unit}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{prod.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{prod.description}</p>

                    <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 text-xs space-y-1">
                      <div className="text-slate-400">Producer: <strong className="text-slate-200">{prod.cooperative || prod.farmerName}</strong></div>
                      <div className="text-slate-400">Moisture: <strong className="text-teal-300">{prod.moistureContent || "11.2%"}</strong></div>
                      <div className="text-slate-400">Available: <strong className="text-emerald-400">{prod.quantityAvailable} {prod.unit}</strong></div>
                    </div>
                  </div>

                  <Link
                    href={`/products/${prod.id}`}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white text-center transition block shadow-xs"
                  >
                    Procure This Commodity
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: REVIEWS GIVEN
            ======================================================== */}
        {activeTab === "reviews" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                Verified Commercial Quality Ratings
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Feedback you have provided to producers regarding moisture conformity, purity, and dispatch punctuality.
              </p>
            </div>

            <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2 opacity-80" />
              <h4 className="text-sm font-bold text-white">Trust & Quality Assurance Active</h4>
              <p className="text-xs text-slate-400 mt-1">
                Your submitted ratings help maintain fair pricing and high agricultural standards across the national marketplace.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── LEAVE REVIEW MODAL ── */}
      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                Rate Contract #{reviewModalOrder.id.slice(0, 8)}
              </h3>
              <button
                onClick={() => setReviewModalOrder(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Producer: <strong>{reviewModalOrder.farmerName || "Oda Gida Farmers Union"}</strong>
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Assay Quality & Purity Score
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-300 ml-2">{rating} of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Intake Inspection Feedback
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comment on grain moisture, purity screen, bag condition, and scale calibration..."
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReviewModalOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {reviewSubmitting ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span>Submit Verified Rating</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FILE DISPUTE MODAL ── */}
      {reportModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flag className="h-5 w-5 text-red-400" />
                Arbitration Dispute for Contract #{reportModalOrder.id.slice(0, 8)}
              </h3>
              <button
                onClick={() => setReportModalOrder(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              File a formal trade dispute with the Exchange Authority. An administrative inspector will review contract terms and weighbridge receipts.
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nature of Dispute / Discrepancy
                </label>
                <textarea
                  required
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Specify issue: e.g. moisture test exceeded WDRA specifications, scale weighbridge discrepancy, or delayed silo dispatch..."
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReportModalOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {reportSubmitting ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span>Submit to Exchange Arbitrator</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
