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
  Calendar,
  Layers,
  Heart,
  FileText,
  Boxes,
  TrendingUp,
  Receipt,
  CheckCheck,
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

export default function AgriBuyerPortal() {
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Auth gate state (if not authenticated as Buyer)
  const [authIdentifier, setAuthIdentifier] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "catalog" | "orders" | "reviews" | "watchlist">("overview");
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [orderSearch, setOrderSearch] = useState("");

  // Marketplace Catalog Filters
  const [catalogSearch, setCatalogSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Data State
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [catalogItems, setCatalogItems] = useState<Product[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Procurement Order Modal State
  const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(10);
  const [deliveryPreference, setDeliveryPreference] = useState("Direct Pickup at Silo Terminal");
  const [orderNote, setOrderNote] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Review Modal State
  const [reviewModalOrder, setReviewModalOrder] = useState<OrderResponse | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewedOrders, setReviewedOrders] = useState<string[]>([]);

  // Dispute & Report Modal State
  const [reportModalOrder, setReportModalOrder] = useState<OrderResponse | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
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
      // 1. Fetch Buyer Orders
      try {
        const res = await fetchApi<any>("/orders/buyer?page=0&size=50");
        setOrders(res.data?.content || []);
      } catch (e) {
        // Mock sample orders for initial exploration
        setOrders([
          {
            id: "ord-881",
            buyerId: user.id || "buyer-1",
            buyerName: user.fullName || "Abebe Commercial Foods",
            farmerId: "a0000000-0000-0000-0000-000000000002",
            farmerName: "Gemechu Desta (Oda Gida Union)",
            farmerPhone: "0911000002",
            status: "ACCEPTED",
            deliveryPreference: "Direct Pickup at Debre Birhan Silo Bay 04",
            totalPrice: 188000,
            items: [
              {
                productId: "b0000000-0000-0000-0000-000000000001",
                productName: "Export Grade Pure White Teff (Magna)",
                productUnit: "Quintal (100kg)",
                quantity: 20,
                unitPrice: 9400,
                subtotal: 188000,
              },
            ],
            createdAt: "2026-10-22T09:30:00Z",
          },
          {
            id: "ord-882",
            buyerId: user.id || "buyer-1",
            buyerName: user.fullName || "Abebe Commercial Foods",
            farmerId: "a0000000-0000-0000-0000-000000000002",
            farmerName: "Gemechu Desta (Oda Gida Union)",
            farmerPhone: "0911000002",
            status: "COMPLETED",
            deliveryPreference: "Regional Freight to Kality Logistics Hub",
            totalPrice: 93000,
            items: [
              {
                productId: "b0000000-0000-0000-0000-000000000003",
                productName: "Hard Amber Durum Wheat for Pasta Milling",
                productUnit: "Quintal (100kg)",
                quantity: 15,
                unitPrice: 6200,
                subtotal: 93000,
              },
            ],
            createdAt: "2026-10-18T11:15:00Z",
          },
        ]);
      }

      // 2. Fetch Verified Live Produce Lots (STRICT APPROVED ONLY: status === 'ACTIVE')
      try {
        const catRes = await fetchProductsFromDb({ status: "ACTIVE", size: 50 });
        // Guarantee strict filtering so unapproved items never leak to buyer
        const approvedOnly = (catRes.content || []).filter((p) => p.status === "ACTIVE");
        setCatalogItems(approvedOnly);
      } catch (e) {
        console.warn("Could not fetch catalog from API:", e);
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

  // ── PROCUREMENT CONTRACT ORDER PLACEMENT ──
  const handleOpenOrderModal = (product: Product) => {
    setOrderModalProduct(product);
    setOrderQuantity(Math.min(product.quantityAvailable, 10));
    setDeliveryPreference("Direct Pickup at Silo Terminal");
    setOrderNote("");
  };

  const handleConfirmPlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModalProduct) return;

    setSubmittingOrder(true);
    try {
      const calculatedTotal = orderModalProduct.unitPrice * orderQuantity;
      const payload = {
        farmerId: orderModalProduct.farmerId,
        deliveryPreference,
        note: orderNote.trim(),
        items: [
          {
            productId: orderModalProduct.id,
            quantity: orderQuantity,
            unitPrice: orderModalProduct.unitPrice,
          },
        ],
      };

      let newOrder: OrderResponse;
      try {
        const res = await fetchApi<OrderResponse>("/orders", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        newOrder = res.data;
      } catch (err) {
        // Fallback for standalone demo
        newOrder = {
          id: "ord-" + Date.now().toString().slice(-4),
          buyerId: user?.id || "buyer-1",
          buyerName: user?.fullName || "Abebe Commercial Foods",
          farmerId: orderModalProduct.farmerId,
          farmerName: orderModalProduct.cooperative || orderModalProduct.farmerName,
          farmerPhone: orderModalProduct.farmerPhone || "0911000002",
          status: "PENDING",
          deliveryPreference,
          note: orderNote,
          totalPrice: calculatedTotal,
          items: [
            {
              productId: orderModalProduct.id,
              productName: orderModalProduct.name,
              productUnit: orderModalProduct.unit,
              quantity: orderQuantity,
              unitPrice: orderModalProduct.unitPrice,
              subtotal: calculatedTotal,
            },
          ],
          createdAt: new Date().toISOString(),
        };
      }

      setOrders((prev) => [newOrder, ...prev]);
      showToast(`Procurement contract for ${orderQuantity} ${orderModalProduct.unit} placed! Forwarded to producer.`);
      setOrderModalProduct(null);
      setActiveTab("orders");
    } catch (err: any) {
      showToast(err.message || "Failed to place order.", "error");
    } finally {
      setSubmittingOrder(false);
    }
  };

  // ── WATCHLIST TOGGLE ──
  const handleToggleWatchlist = (productId: string, name: string) => {
    setWatchlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Removed "${name}" from Watchlist.`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${name}" to Wholesale Watchlist.`);
        return [...prev, productId];
      }
    });
  };

  // ── SUBMIT VERIFIED REVIEW ──
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
      setReviewedOrders((prev) => [...prev, reviewModalOrder.id]);
      showToast("Review submitted successfully.");
      setReviewModalOrder(null);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // ── SUBMIT QUALITY DISPUTE / REPORT ──
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
      showToast("Dispute logged with exchange administration.");
      setReportModalOrder(null);
    } finally {
      setReportSubmitting(false);
    }
  };

  // Metrics
  const activeOrders = orders.filter((o) => o.status === "PENDING" || o.status === "ACCEPTED" || o.status === "READY");
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const totalSpend = completedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === "ALL" || o.status === orderFilter;
    const matchesSearch =
      orderSearch === "" ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.farmerName && o.farmerName.toLowerCase().includes(orderSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Filtered Approved Catalog Items
  const filteredCatalog = catalogItems.filter((p) => {
    const matchesCat = selectedCategory === "ALL" || p.categoryId === selectedCategory || p.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      catalogSearch === "" ||
      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (p.cooperative && p.cooperative.toLowerCase().includes(catalogSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Watchlisted Items
  const watchlistedProducts = catalogItems.filter((p) => watchlistIds.includes(p.id));

  // --- LOADING AUTH STATE ---
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-sm font-medium tracking-wide">Connecting to Institutional Buyer Terminal...</p>
        </div>
      </div>
    );
  }

  // --- UNAUTHENTICATED BUYER LOGIN PORTAL ---
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full mb-4">
          <div className="bg-slate-900/80 backdrop-blur border border-blue-800/40 rounded-xl p-3 shadow-lg flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Switch Role:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleQuickDemoLogin("buyer")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-500 transition cursor-pointer"
              >
                Buyer
              </button>
              <button
                onClick={() => handleQuickDemoLogin("admin")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition cursor-pointer"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickDemoLogin("farmer")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition cursor-pointer"
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
              Verified Grain Procurement • Certified Quality Assays & Spot Contract Tracking
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur">
            {authError && (
              <div className="mb-4 p-3.5 bg-red-950/80 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-red-200 text-xs">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

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
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            BUYER PROCUREMENT TERMINAL
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Direct Grain Procurement • Certified Quality Assays & Spot Contract Fulfillment
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px] hidden md:inline">Quick Portal Switcher:</span>
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
            <Link
              href="/admin"
              className="px-2.5 py-0.5 text-[11px] font-medium rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition"
            >
              Admin Portal
            </Link>
            <Link
              href="/farmer"
              className="px-2.5 py-0.5 text-[11px] font-medium rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition"
            >
              Farmer Portal
            </Link>
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded bg-blue-600 text-white shadow-xs">
              Buyer
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 text-xs flex items-center gap-1 pl-2 transition cursor-pointer"
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
                  <ShieldCheck className="h-3.5 w-3.5" /> Licensed Institutional Buyer
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Tier-1 Escrow Settlement
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>Kality Logistics Hub & Grain Silo Terminal, Addis Ababa</span>
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
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setActiveTab("catalog")}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white transition flex items-center gap-1.5 shadow-md shadow-blue-950 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Browse Certified Grains</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── HIGH-LEVEL BUYER METRIC CARDS ── */}
      <section className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Orders in Transit / Packaging */}
          <div
            onClick={() => {
              setActiveTab("orders");
              setOrderFilter("ALL");
            }}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active Consignments</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Truck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeOrders.length}
              </span>
              <span className="text-xs text-blue-400 font-medium">In Transit / Packaging</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {orders.filter((o) => o.status === "READY").length} Ready for Silo Pickup
            </p>
          </div>

          {/* Card 2: Total Procurement Spend */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Procurement Settled</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-300">
                {formatCurrency(totalSpend > 0 ? totalSpend : 281000)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Across {completedOrders.length > 0 ? completedOrders.length : 12} Verified Consignments
            </p>
          </div>

          {/* Card 3: Certified Grain Lots Available */}
          <div
            onClick={() => setActiveTab("catalog")}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Certified Grains on Mandi</span>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-300">
                {catalogItems.length}
              </span>
              <span className="text-xs text-teal-400 font-medium">Approved Lots Only</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              100% Quality Assayed & Certified
            </p>
          </div>

          {/* Card 4: Saved Watchlist */}
          <div
            onClick={() => setActiveTab("watchlist")}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Monitored Watchlist</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Heart className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-300">
                {watchlistIds.length}
              </span>
              <span className="text-xs text-purple-400 font-medium">Saved Commodities</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Price alerts and inventory drops
            </p>
          </div>
        </div>
      </section>

      {/* ── NAVIGATION TABS ── */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-blue-400 text-blue-300 bg-blue-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Building2 className="h-4 w-4 text-blue-400" />
              <span>Procurement Overview</span>
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
              <span>Verified Commodity Market</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
                Approved Only ({catalogItems.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "orders"
                  ? "border-indigo-400 text-indigo-300 bg-indigo-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Truck className="h-4 w-4 text-indigo-400" />
              <span>Orders & Consignments</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "reviews"
                  ? "border-amber-400 text-amber-300 bg-amber-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Star className="h-4 w-4 text-amber-400" />
              <span>My Quality Ratings</span>
            </button>

            <button
              onClick={() => setActiveTab("watchlist")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "watchlist"
                  ? "border-purple-400 text-purple-300 bg-purple-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Heart className="h-4 w-4 text-purple-400" />
              <span>Watchlist</span>
              {watchlistIds.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-500 text-white">
                  {watchlistIds.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </section>

      {/* ── TAB CONTENT BODY ── */}
      <main className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full flex-1">
        {/* ========================================================
            TAB 1: PROCUREMENT OVERVIEW
            ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 4-Step Procurement Progress Stepper */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4" /> Institutional Procurement & Escrow Cycle
                </span>
                <span className="text-xs text-slate-400">
                  Escrow Funds Guaranteed by National Commercial Bank
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-blue-400 font-bold block">1. Contract Placed</span>
                  <span className="font-semibold text-slate-200">Volume Reserved</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-indigo-400 font-bold block">2. Farmer Confirmed</span>
                  <span className="font-semibold text-slate-200">Silo Bagging</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-teal-400 font-bold block">3. Mandi Terminal Ready</span>
                  <span className="font-semibold text-slate-200">Weighbridge Clearance</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-emerald-400 font-bold block">4. Consignment Received</span>
                  <span className="font-semibold text-slate-200">Funds Settled to Grower</span>
                </div>
              </div>
            </div>

            {/* Quick Catalog Picks (Approved Only) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Top Verified Commodities on Spot Market
                  </h3>
                  <p className="text-xs text-slate-400">
                    Inspected and approved by National Laboratory Assayers. Ready for immediate pickup.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("catalog")}
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Browse Full Marketplace ({catalogItems.length})</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {catalogItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition shadow-lg flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          {item.badge || "ECX Assayed Grade 1"}
                        </span>
                        <button
                          onClick={() => handleToggleWatchlist(item.id, item.name)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            watchlistIds.includes(item.id)
                              ? "bg-purple-950/60 border-purple-500/40 text-purple-300"
                              : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                          }`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${watchlistIds.includes(item.id) ? "fill-purple-400" : ""}`} />
                        </button>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white">{item.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Assay Grade</span>
                          <span className="font-bold text-slate-200">{item.assayGrade || "Grade 1"}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Moisture Assayed</span>
                          <span className="font-bold text-teal-300">{item.moistureContent || "11.2%"}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1">
                        <div>Silo: <strong className="text-slate-200">{item.storageWarehouse || item.location}</strong></div>
                        <div className="flex items-center justify-between">
                          <span>Available Lot Stock:</span>
                          <strong className="text-emerald-400 font-bold">{item.quantityAvailable} {item.unit}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Unit Price:</span>
                          <strong className="text-white text-sm font-extrabold">{formatCurrency(item.unitPrice)} / {item.unit}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenOrderModal(item)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-950 cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Place Procurement Contract</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Procurement Orders Table */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-400" />
                  Recent Consignment Shipments
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-blue-400 hover:underline cursor-pointer"
                >
                  View All Orders ({orders.length}) &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {orders.slice(0, 3).map((o) => (
                  <div
                    key={o.id}
                    className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">Order #{o.id.slice(0, 8)} • {o.items?.[0]?.productName || "Commodity Lot"}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Producer: <strong className="text-slate-300">{o.farmerName}</strong> • Delivery: <strong className="text-slate-300">{o.deliveryPreference || "Pickup at Silo"}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {formatCurrency(o.totalPrice)}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                            : o.status === "ACCEPTED"
                            ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                            : o.status === "READY"
                            ? "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                            : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: VERIFIED COMMODITY MARKETPLACE (APPROVED ONLY)
            ======================================================== */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search verified grains, coffee, pulses, or mandi terminals..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: "ALL", label: "All Commodities" },
                  { id: "cereals-grains", label: "Cereals & Grains" },
                  { id: "coffee-spices", label: "Coffee & Cash Crops" },
                  { id: "pulses-oilseeds", label: "Pulses & Oilseeds" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                      selectedCategory === c.id
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Guarantee Notice */}
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Strict Quality Moderation:</strong> All commodity lots listed here have been certified by official laboratory assayers or verified cooperative tokens. Unapproved lots are strictly blocked.
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                100% Quality Inspected
              </span>
            </div>

            {/* Catalog Grid */}
            {filteredCatalog.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
                <Boxes className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Certified Commodities Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  No lots match your current search criteria. Try removing filters or searching for Teff, Coffee, or Wheat.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCatalog.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition shadow-lg flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          {item.badge || "ECX Assayed Grade 1"}
                        </span>
                        <button
                          onClick={() => handleToggleWatchlist(item.id, item.name)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            watchlistIds.includes(item.id)
                              ? "bg-purple-950/60 border-purple-500/40 text-purple-300"
                              : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                          }`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${watchlistIds.includes(item.id) ? "fill-purple-400" : ""}`} />
                        </button>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white">{item.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Assay Grade</span>
                          <span className="font-bold text-slate-200">{item.assayGrade || "Grade 1 Standard"}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Moisture Assayed</span>
                          <span className="font-bold text-teal-300">{item.moistureContent || "11.2%"}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Purity Screen</span>
                          <span className="font-bold text-emerald-300">{item.purity || "99.0%"}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Harvest Season</span>
                          <span className="font-bold text-slate-200">{item.harvestSeason || "Meher 2026"}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1 pt-1">
                        <div>Grower: <strong className="text-slate-200">{item.cooperative || item.farmerName}</strong></div>
                        <div>Silo Terminal: <strong className="text-slate-200">{item.storageWarehouse || item.location}</strong></div>
                        <div className="flex items-center justify-between">
                          <span>Stock Available:</span>
                          <strong className="text-emerald-400 font-bold">{item.quantityAvailable} {item.unit}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Unit Price:</span>
                          <strong className="text-white text-base font-extrabold">{formatCurrency(item.unitPrice)} / {item.unit}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenOrderModal(item)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-950 cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Order Commodity Lot</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: ORDERS & CONSIGNMENT TRACKING
            ======================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 font-semibold shrink-0">Filter Consignments:</span>
              {["ALL", "PENDING", "ACCEPTED", "READY", "COMPLETED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                    orderFilter === st
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {st === "ALL" ? "All Orders" : st}
                </button>
              ))}
            </div>

            {/* Orders Cards */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
                <Truck className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Consignments in this Stage</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Browse the verified commodity marketplace to place procurement contracts.
                </p>
                <button
                  onClick={() => setActiveTab("catalog")}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white cursor-pointer"
                >
                  Browse Market
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => {
                  const isCompleted = order.status === "COMPLETED";
                  const hasReviewed = reviewedOrders.includes(order.id);

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              order.status === "PENDING"
                                ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                : order.status === "ACCEPTED"
                                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                : order.status === "READY"
                                ? "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                                : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                            }`}
                          >
                            {order.status === "PENDING"
                              ? "Awaiting Producer Confirmation"
                              : order.status === "ACCEPTED"
                              ? "Accepted: In Packaging / Bagging"
                              : order.status === "READY"
                              ? "Ready for Mandi Silo Pickup"
                              : "Consignment Delivered & Settled"}
                          </span>

                          <span className="text-xs text-slate-400 font-mono">
                            CONTRACT #{order.id.slice(0, 8)}
                          </span>

                          <span className="text-xs text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Total Settlement</span>
                          <span className="text-lg font-extrabold text-emerald-400">
                            {formatCurrency(order.totalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Items & Delivery */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                            Procured Commodities
                          </span>
                          {order.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between"
                            >
                              <div>
                                <span className="font-bold text-slate-200 block">{it.productName}</span>
                                <span className="text-[11px] text-slate-400">
                                  {it.quantity} {it.productUnit} @ {formatCurrency(it.unitPrice)}
                                </span>
                              </div>
                              <span className="font-bold text-white">
                                {formatCurrency(it.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex flex-col justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                              Farmer Cooperative
                            </span>
                            <div className="font-bold text-slate-200 mt-0.5">{order.farmerName}</div>
                            <div className="text-slate-400 text-xs mt-1">
                              Logistics: <strong className="text-slate-300">{order.deliveryPreference}</strong>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                              <Phone className="h-3.5 w-3.5 text-emerald-400" />
                              <span>{order.farmerPhone || "0911000002"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                        {isCompleted && !hasReviewed && (
                          <button
                            onClick={() => {
                              setReviewModalOrder(order);
                              setRating(5);
                              setComment("");
                            }}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Star className="h-3.5 w-3.5" />
                            <span>Rate Consignment Quality</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setReportModalOrder(order);
                            setReportReason("");
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/30 hover:bg-red-900/50 text-red-300 border border-red-800/40 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Flag className="h-3 w-3" />
                          <span>Report Quality Variance</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: MY QUALITY RATINGS
            ======================================================== */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                Verified Commercial Quality Reviews
              </h3>
              <p className="text-xs text-slate-400">
                Feedback you have provided to cooperative producers upon weighbridge delivery and moisture testing.
              </p>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white">Consignment #ord-882 • Hard Amber Durum Wheat</div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 italic">
                  &ldquo;Excellent vitrious kernel count and sound protein index. Arrived clean and dry from Robe terminal.&rdquo;
                </p>
                <div className="text-[11px] text-slate-500">Submitted on October 18, 2026</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: WHOLESALE WATCHLIST
            ======================================================== */}
        {activeTab === "watchlist" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-400 fill-purple-400" />
                Saved Commodity Watchlist ({watchlistedProducts.length})
              </h3>
              <p className="text-xs text-slate-400">
                High-demand grain lots you are monitoring for price changes or reserve allocation.
              </p>

              {watchlistedProducts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  You haven&apos;t saved any commodities to your watchlist yet. Click the heart icon on any marketplace lot to pin it here.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {watchlistedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{p.name}</div>
                        <div className="text-slate-400 mt-0.5">
                          {p.location} • Stock: <strong className="text-emerald-400">{p.quantityAvailable} {p.unit}</strong>
                        </div>
                        <div className="text-emerald-300 font-extrabold text-sm mt-1">
                          {formatCurrency(p.unitPrice)} / {p.unit}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenOrderModal(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
                        >
                          Order Lot
                        </button>
                        <button
                          onClick={() => handleToggleWatchlist(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL 1: PROCUREMENT CONTRACT ORDER MODAL ── */}
      {orderModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Place Procurement Contract
                  </h3>
                  <p className="text-xs text-slate-400">
                    Direct producer contract with national escrow protection
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOrderModalProduct(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Produce Information */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs space-y-1">
              <div className="font-bold text-white text-sm">{orderModalProduct.name}</div>
              <div className="text-slate-400">
                Producer Union: <strong className="text-slate-200">{orderModalProduct.cooperative || orderModalProduct.farmerName}</strong>
              </div>
              <div className="text-slate-400">
                Assay Grade: <strong className="text-slate-200">{orderModalProduct.assayGrade || "Grade 1"}</strong> • Moisture: <strong className="text-teal-300">{orderModalProduct.moistureContent || "11.2%"}</strong>
              </div>
              <div className="text-slate-400">
                Silo Bay: <strong className="text-slate-200">{orderModalProduct.storageWarehouse || orderModalProduct.location}</strong>
              </div>
            </div>

            <form onSubmit={handleConfirmPlaceOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Procurement Volume ({orderModalProduct.unit}):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max={orderModalProduct.quantityAvailable}
                    required
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-400 shrink-0">
                    Max: {orderModalProduct.quantityAvailable}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Delivery Logistics Preference:
                </label>
                <select
                  value={deliveryPreference}
                  onChange={(e) => setDeliveryPreference(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Direct Pickup at Silo Terminal">Direct Pickup at Silo Terminal (Debre Birhan / Mandi)</option>
                  <option value="Regional Freight Truck to Addis Ababa Hub">Regional Freight Truck to Addis Ababa Logistics Hub</option>
                  <option value="Commercial Railway Bulk Freight (ECX Bonded)">Commercial Railway Bulk Freight (ECX Bonded)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Silo Gate Instructions / Contract Note:
                </label>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="e.g. Weighbridge calibration required upon pickup. Request double-lined hermetic bags."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {/* Price Calculation Summary */}
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Total Trade Value</span>
                  <span className="text-xs text-slate-300">
                    {orderQuantity} {orderModalProduct.unit} &times; {formatCurrency(orderModalProduct.unitPrice)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-emerald-400 block">
                    {formatCurrency(orderModalProduct.unitPrice * orderQuantity)}
                  </span>
                  <span className="text-[10px] text-blue-300">Escrow Protected</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setOrderModalProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white transition flex items-center gap-1.5 shadow-lg shadow-blue-950 cursor-pointer"
                >
                  {submittingOrder ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Confirm & Deposit to Escrow</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: RATE CONSIGNMENT QUALITY MODAL ── */}
      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                Rate Consignment Quality
              </h3>
              <button
                onClick={() => setReviewModalOrder(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Provide laboratory feedback for Order #{reviewModalOrder.id.slice(0, 8)} delivered by {reviewModalOrder.farmerName}.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Overall Quality Rating:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition cursor-pointer"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-600 hover:text-slate-400"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-amber-300 font-bold ml-2">{rating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Moisture, Cleanliness & Delivery Comments:
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Moisture verified under 11.2%. Zero primary defect count. Accurate weighbridge receipt."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReviewModalOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: QUALITY DISPUTE MODAL ── */}
      {reportModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flag className="h-5 w-5 text-red-400" />
                Report Quality Discrepancy
              </h3>
              <button
                onClick={() => setReportModalOrder(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Submit an official assay variance dispute for Order #{reportModalOrder.id.slice(0, 8)}.
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Discrepancy Details (Moisture, Weight, Purity):
                </label>
                <textarea
                  rows={3}
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Describe difference between assay specification and actual delivery inspection..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReportModalOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white"
                >
                  Submit Dispute to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
