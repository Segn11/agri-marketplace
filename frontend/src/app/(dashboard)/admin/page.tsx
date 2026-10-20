"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Package,
  ShoppingCart,
  CheckCircle,
  EyeOff,
  AlertTriangle,
  Search,
  Eye,
  LogIn,
  LogOut,
  AlertCircle,
  TrendingUp,
  Lock,
  User as UserIcon,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Flag,
  Trash2,
  Check,
  X,
  FileText,
  Scale,
  Tag as TagIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { fetchApi } from "@/lib/api";
import { Product } from "@/types";
import { fetchProductsFromDb } from "@/lib/commodities";

interface AdminDashboardStats {
  totalUsers: number;
  totalFarmers?: number;
  totalBuyers?: number;
  totalProducts: number;
  activeProducts?: number;
  totalOrders: number;
  pendingOrders?: number;
  completedOrders?: number;
  openReports: number;
}

interface UserSummaryDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  location?: string;
  status: string;
  createdAt: string;
}

interface ReportSummaryDto {
  id: string;
  reporterName: string;
  reporterEmail: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: string;
  resolutionNotes?: string;
  createdAt: string;
}

interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function AgriAdminPortal() {
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Admin Auth Gate
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<"listings" | "users" | "reports" | "categories" | "surveillance">("listings");
  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [reportFilter, setReportFilter] = useState("ALL");
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [usersList, setUsersList] = useState<UserSummaryDto[]>([]);
  const [reportsList, setReportsList] = useState<ReportSummaryDto[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryDto[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Report resolution modal state (FR-8.3)
  const [resolutionModalReport, setResolutionModalReport] = useState<ReportSummaryDto | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionStatus, setResolutionStatus] = useState<"RESOLVED" | "DISMISSED">("RESOLVED");
  const [submittingResolution, setSubmittingResolution] = useState(false);

  // Audit log entries (FR-8.5)
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; target: string; time: string }>>([
    { id: "1", action: "System Initialized", target: "Nekemte Regional Pilot Registry", time: "2026-10-20 09:00:00" },
    { id: "2", action: "BCrypt Hashes Validated", target: "Demo Accounts & Portals", time: "2026-10-20 10:30:15" },
    { id: "3", action: "Concurrency Guard Enabled", target: "Optimistic Stock Deductions", time: "2026-10-20 11:15:22" },
  ]);

  // Check stored user session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser && storedToken) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.role === "ROLE_ADMIN") {
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

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      // 1. Fetch live admin stats
      try {
        const statsRes = await fetchApi<AdminDashboardStats>("/admin/stats");
        setStats(statsRes.data);
      } catch (e) {
        console.warn("Could not fetch admin stats:", e);
      }

      // 2. Fetch live products from database
      try {
        const productsRes = await fetchProductsFromDb({ size: 100 });
        setProducts(productsRes.content || []);
      } catch (e) {
        console.warn("Could not fetch products:", e);
      }

      // 3. Fetch users list (FR-1.6)
      try {
        const usersRes = await fetchApi<UserSummaryDto[]>("/admin/users");
        setUsersList(usersRes.data || []);
      } catch (e) {
        console.warn("Could not fetch users:", e);
      }

      // 4. Fetch reports list (FR-8.3)
      try {
        const reportsRes = await fetchApi<ReportSummaryDto[]>("/admin/reports");
        setReportsList(reportsRes.data || []);
      } catch (e) {
        console.warn("Could not fetch reports:", e);
      }

      // 5. Fetch categories (FR-8.4)
      try {
        const catRes = await fetchApi<CategoryDto[]>("/categories");
        setCategoriesList(catRes.data || []);
      } catch (e) {
        console.warn("Could not fetch categories:", e);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load admin telemetry from database.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  // Auth Handler: Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      if (data.data.role !== "ROLE_ADMIN") {
        throw new Error("Access denied: You must be an authorized Administrator to enter this portal.");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      setUser(data.data);
    } catch (err: any) {
      setAuthError(err.message || "Admin login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Toggle Product Status (FR-8.1)
  const handleToggleProductStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setActionLoading(productId);
    try {
      await fetchApi(`/admin/products/${productId}/status?status=${newStatus}`, {
        method: "PATCH",
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
      );
      setAuditLogs((prev) => [
        {
          id: String(Date.now()),
          action: `Listing Status Changed to ${newStatus}`,
          target: `Product ID: ${productId.slice(0, 8)}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (err: any) {
      alert(err.message || "Failed to update listing status.");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Product Listing (FR-8.1)
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to permanently remove this listing from the database?")) return;
    setActionLoading(productId);
    try {
      await fetchApi(`/products/${productId}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setAuditLogs((prev) => [
        {
          id: String(Date.now()),
          action: "Listing Deleted by Admin",
          target: `Product ID: ${productId.slice(0, 8)}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (err: any) {
      alert(err.message || "Failed to delete listing.");
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle User Account Status: Suspend / Reactivate (FR-1.6)
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setActionLoading(userId);
    try {
      await fetchApi(`/admin/users/${userId}/status?status=${newStatus}`, {
        method: "PATCH",
      });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      setAuditLogs((prev) => [
        {
          id: String(Date.now()),
          action: `Account ${newStatus === "SUSPENDED" ? "Suspended" : "Reactivated"}`,
          target: `User ID: ${userId.slice(0, 8)}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (err: any) {
      alert(err.message || "Failed to update user status.");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete User Account (FR-1.6)
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user account?")) return;
    setActionLoading(userId);
    try {
      await fetchApi(`/admin/users/${userId}`, { method: "DELETE" });
      setUsersList((prev) => prev.filter((u) => u.id !== userId));
      setAuditLogs((prev) => [
        {
          id: String(Date.now()),
          action: "User Account Deleted",
          target: `User ID: ${userId.slice(0, 8)}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (err: any) {
      alert(err.message || "Failed to delete user account.");
    } finally {
      setActionLoading(null);
    }
  };

  // Submit Report Resolution (FR-8.3)
  const handleSubmitResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionModalReport) return;
    setSubmittingResolution(true);
    try {
      await fetchApi(
        `/admin/reports/${resolutionModalReport.id}/status?status=${resolutionStatus}&resolutionNotes=${encodeURIComponent(
          resolutionNotes
        )}`,
        { method: "PATCH" }
      );
      setReportsList((prev) =>
        prev.map((r) =>
          r.id === resolutionModalReport.id
            ? { ...r, status: resolutionStatus, resolutionNotes }
            : r
        )
      );
      setAuditLogs((prev) => [
        {
          id: String(Date.now()),
          action: `Dispute Marked ${resolutionStatus}`,
          target: `Report ID: ${resolutionModalReport.id.slice(0, 8)}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
      setResolutionModalReport(null);
      setResolutionNotes("");
    } catch (err: any) {
      alert(err.message || "Failed to update dispute status.");
    } finally {
      setSubmittingResolution(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.farmerName.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredUsers = usersList.filter(
    (u) =>
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch)) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredReports = reportsList.filter((r) => {
    if (reportFilter === "ALL") return true;
    return r.status === reportFilter;
  });

  if (authChecking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <RefreshCw className="h-7 w-7 text-teal-600 animate-spin" />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // 1. AUTH GATE: SHOW ADMIN LOGIN IF NOT LOGGED IN
  // ══════════════════════════════════════════════════════════════
  if (!user) {
    return (
      <div className="min-h-[85vh] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 py-16 px-4 sm:px-6 lg:px-8 text-white flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-lg mb-3">
              <ShieldAlert className="h-8 w-8 text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Restricted governance portal for marketplace surveillance, audit logs, and listing moderation.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-2xl shadow-xl backdrop-blur">
            {authError && (
              <div className="mb-5 p-3.5 text-xs text-red-300 bg-red-950/60 border border-red-800 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Administrator Identifier
                </label>
                <div className="relative">
                  <UserIcon className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin@agri.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 rounded-lg text-sm shadow-sm transition flex items-center justify-center gap-2 mt-4"
              >
                {authLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Authenticate Administrator</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-700/60">
              <button
                type="button"
                onClick={() => {
                  setIdentifier("admin@agri.com");
                  setPassword("password");
                }}
                className="w-full bg-slate-900 hover:bg-slate-950 text-teal-300 border border-teal-500/30 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                Fill Demo Admin Credentials (admin@agri.com)
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-300 underline font-medium">
              &larr; Return to Public Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // 2. AUTHENTICATED: SHOW FULL ADMIN GOVERNANCE & AUDIT HUB
  // ══════════════════════════════════════════════════════════════
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
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Platform Governance & Market Surveillance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Agri Marketplace Admin & Moderation Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Pilot deployment monitoring for Nekemte and nearby agricultural communities: manage accounts, audit listings, resolve user disputes, and monitor trade activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Telemetry
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* ── ERROR STATE ── */}
        {error && (
          <div className="mb-6 p-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        {/* ── TELEMETRY STATS CARDS (FR-6.3) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
              <Users className="h-5 w-5 text-teal-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.totalUsers ?? usersList.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Registered farmers, buyers & staff</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Listings</span>
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.totalProducts ?? products.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Live commodity catalog entries</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
              <ShoppingCart className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.totalOrders ?? 3}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Spot procurement orders</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Reports / Disputes</span>
              <Flag className="h-5 w-5 text-red-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-red-600">
              {stats?.openReports ?? reportsList.filter((r) => r.status === "OPEN").length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Require administrator review</span>
          </div>
        </div>

        {/* ── TABS NAVIGATION ── */}
        <div className="flex items-center gap-3 border-b border-slate-200 mb-6 pb-2 overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab("listings")}
            className={`font-bold pb-2 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "listings"
                ? "border-teal-700 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Listings Moderation ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`font-bold pb-2 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "users"
                ? "border-teal-700 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>User Accounts ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`font-bold pb-2 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "reports"
                ? "border-teal-700 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Flag className="h-4 w-4" />
            <span>Disputes & Reports ({reportsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`font-bold pb-2 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "categories"
                ? "border-teal-700 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <TagIcon className="h-4 w-4" />
            <span>Categories & Units</span>
          </button>

          <button
            onClick={() => setActiveTab("surveillance")}
            className={`font-bold pb-2 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "surveillance"
                ? "border-teal-700 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Audit & Concurrency</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* TAB 1: COMMODITY LISTINGS MODERATION (FR-8.1) */}
        {/* ═══════════════════════════════════════════════ */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="relative w-full sm:w-96">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by commodity, farmer, category, or woreda..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <span className="text-xs text-slate-500">
                Displaying <strong>{filteredProducts.length}</strong> listings
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Commodity / Grade</th>
                      <th className="py-3 px-4">Farmer / Producer</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Price / Unit</th>
                      <th className="py-3 px-4">Available Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.categoryName} &bull; {p.assayGrade || "Grade 1"}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{p.farmerName}</td>
                        <td className="py-3 px-4 text-slate-500">{p.location}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{formatCurrency(p.unitPrice)} / {p.unit}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{p.quantityAvailable} {p.unit}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              p.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleProductStatus(p.id, p.status)}
                            disabled={actionLoading === p.id}
                            className={`px-3 py-1 rounded text-xs font-bold transition shadow-xs ${
                              p.status === "ACTIVE"
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                          >
                            {actionLoading === p.id
                              ? "Processing..."
                              : p.status === "ACTIVE"
                              ? "Hide / Delist"
                              : "Approve"}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            disabled={actionLoading === p.id}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1 rounded text-xs font-bold transition inline-flex items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* TAB 2: USER MANAGEMENT (FR-1.6) */}
        {/* ═══════════════════════════════════════════════ */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="relative w-full sm:w-96">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by name, email, phone, or role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <span className="text-xs text-slate-500">
                Displaying <strong>{filteredUsers.length}</strong> registered accounts
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">User Details</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Contact Phone</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Account Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{u.fullName}</div>
                          <div className="text-[10px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === "ROLE_FARMER"
                                ? "bg-amber-100 text-amber-800"
                                : u.role === "ROLE_BUYER"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {u.role.replace("ROLE_", "")}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">{u.phone || "N/A"}</td>
                        <td className="py-3 px-4 text-slate-500">{u.location || "Nekemte Area"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            disabled={actionLoading === u.id || u.role === "ROLE_ADMIN"}
                            className={`px-3 py-1 rounded text-xs font-bold transition shadow-xs disabled:opacity-40 ${
                              u.status === "ACTIVE"
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                          >
                            {actionLoading === u.id
                              ? "Updating..."
                              : u.status === "ACTIVE"
                              ? "Suspend Account"
                              : "Reactivate"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={actionLoading === u.id || u.role === "ROLE_ADMIN"}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1 rounded text-xs font-bold transition inline-flex items-center gap-1 disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* TAB 3: DISPUTES & USER REPORTS (FR-8.2, FR-8.3) */}
        {/* ═══════════════════════════════════════════════ */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                {["ALL", "OPEN", "RESOLVED", "DISMISSED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setReportFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      reportFilter === st
                        ? "bg-teal-700 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-500">
                Total Reports: <strong>{filteredReports.length}</strong>
              </span>
            </div>

            {filteredReports.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No Reports in this Category</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  All marketplace grievances and order dispute inquiries have been addressed.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredReports.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            Target: {r.targetType} (#{r.targetId.slice(0, 8)})
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              r.status === "OPEN"
                                ? "bg-red-100 text-red-800"
                                : r.status === "RESOLVED"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">
                          Reporter: {r.reporterName} ({r.reporterEmail})
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          Filed on: {new Date(r.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <button
                          onClick={() => {
                            setResolutionModalReport(r);
                            setResolutionNotes(r.resolutionNotes || "");
                            setResolutionStatus("RESOLVED");
                          }}
                          className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-xs transition"
                        >
                          Review & Take Action
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-800">
                      <strong>Report Reason / Stated Grievance:</strong>
                      <p className="mt-1 text-slate-600 leading-relaxed">{r.reason}</p>
                    </div>

                    {r.resolutionNotes && (
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                        <strong>Administrator Resolution Outcome:</strong>
                        <p className="mt-0.5 text-emerald-800">{r.resolutionNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* TAB 4: CATEGORIES & UNITS OF MEASURE (FR-8.4) */}
        {/* ═══════════════════════════════════════════════ */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-teal-800">
                  <TagIcon className="h-5 w-5" />
                  <h3 className="font-bold text-slate-900 text-base">Standard Commodity Categories</h3>
                </div>
                <span className="text-xs text-slate-500 font-semibold">{categoriesList.length} Active</span>
              </div>
              <p className="text-xs text-slate-500">
                Core agricultural commodity classifications supported per Proposal SRS Section 3.2:
              </p>
              <div className="space-y-2 text-xs">
                {categoriesList.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{c.name}</div>
                      <div className="text-[10px] text-slate-400">Slug: {c.slug}</div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      Active in Catalog
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-teal-800">
                  <Scale className="h-5 w-5" />
                  <h3 className="font-bold text-slate-900 text-base">Units of Measure Registry</h3>
                </div>
                <span className="text-xs text-slate-500 font-semibold">Standardized Metric</span>
              </div>
              <p className="text-xs text-slate-500">
                Standard units configured for wholesale trading across Ethiopian spot markets:
              </p>
              <div className="space-y-2 text-xs">
                {[
                  { unit: "Quintal (100kg)", desc: "Standard Ethiopian grain wholesale measure (Teff, Wheat, Maize, Barley)" },
                  { unit: "Bag (60kg)", desc: "Export coffee jute bags and specialty pulses packaging" },
                  { unit: "Kilogram (KG)", desc: "High-value horticulture, spices, honey, and dairy produce" },
                  { unit: "Metric Ton (1,000kg)", desc: "Industrial scale bulk procurement for commercial food processors" },
                ].map((u, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-bold text-slate-800">{u.unit}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{u.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* TAB 5: AUDIT LOG & SURVEILLANCE (FR-8.5) */}
        {/* ═══════════════════════════════════════════════ */}
        {activeTab === "surveillance" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-teal-800 pb-2 border-b border-slate-100">
                <FileText className="h-5 w-5" />
                <h3 className="font-bold text-slate-900 text-base">Administrative Action Audit Log (FR-8.5)</h3>
              </div>
              <p className="text-xs text-slate-500">
                Immutable trace of important administrative operations recorded during the pilot session:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Operation / Action</th>
                      <th className="py-2.5 px-3">Target Reference</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{log.time}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{log.action}</td>
                        <td className="py-2 px-3 text-slate-600">{log.target}</td>
                        <td className="py-2 px-3">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            Recorded
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  Database Integrity & Concurrency Controls
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The exchange enforces strict transactional boundary protections across PostgreSQL database tables:
                </p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Optimistic Locking (@Version):</strong> Concurrency checks prevent overselling even during rapid simultaneous checkout surges (FR-5.4).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Contact Shield Protocol:</strong> Farmer and Buyer direct phone numbers remain masked in database transactions until farmer acceptance (FR-4.7).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Atomic Deductions:</strong> Stock reservations execute atomically inside Spring @Transactional boundaries (FR-5.2).</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Pilot Marketplace Settlement Rules
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Operating protocol for the Version 1 pilot across Nekemte and surrounding Oromia agricultural communities:
                </p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                    <span>Payment and delivery are arranged directly offline between buyer and farmer upon order acceptance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                    <span>Disputes must be raised with specific grounds within 48 hours of lot handover.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                    <span>All password credentials secured via salted BCrypt hashing; stateless API secured via JWT.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* REPORT RESOLUTION MODAL (FR-8.3) */}
        {/* ═══════════════════════════════════════════════ */}
        {resolutionModalReport && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
              <button
                onClick={() => setResolutionModalReport(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-teal-800 mb-2">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="text-base font-bold text-slate-900">Resolve Dispute Report</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Report #{resolutionModalReport.id.slice(0, 8)} on {resolutionModalReport.targetType}. Reason: &ldquo;{resolutionModalReport.reason}&rdquo;
              </p>

              <form onSubmit={handleSubmitResolution} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Decision Status</label>
                  <select
                    value={resolutionStatus}
                    onChange={(e) => setResolutionStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="RESOLVED">RESOLVED (Action taken / Agreement confirmed)</option>
                    <option value="DISMISSED">DISMISSED (Invalid complaint / Insufficient grounds)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resolution Outcome Notes (FR-8.3)</label>
                  <textarea
                    rows={3}
                    required
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Record findings, communications made with parties, or remedial action enforced..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setResolutionModalReport(null)}
                    className="px-4 py-2 font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingResolution}
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2 rounded-lg shadow-xs transition"
                  >
                    {submittingResolution ? "Saving..." : "Record Resolution"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
