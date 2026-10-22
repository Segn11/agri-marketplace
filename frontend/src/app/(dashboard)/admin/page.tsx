"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Package,
  ShoppingCart,
  CheckCircle2,
  XCircle,
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
  Building2,
  Clock,
  Phone,
  MapPin,
  Award,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { fetchApi } from "@/lib/api";
import { Product } from "@/types";
import { fetchProductsFromDb } from "@/lib/commodities";

interface AdminDashboardStats {
  totalUsers: number;
  totalFarmers: number;
  totalBuyers: number;
  totalProducts: number;
  activeProducts: number;
  pendingProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
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
  isVerified?: boolean;
  farmName?: string;
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

  // Admin Auth Gate State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"approvals" | "listings" | "users" | "reports" | "surveillance">("approvals");
  const [approvalSubTab, setApprovalSubTab] = useState<"produce" | "kyc">("produce");

  // Search & Filter States
  const [productSearch, setProductSearch] = useState("");
  const [productStatusFilter, setProductStatusFilter] = useState("ALL");
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [reportFilter, setReportFilter] = useState("ALL");

  // Data States
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [usersList, setUsersList] = useState<UserSummaryDto[]>([]);
  const [reportsList, setReportsList] = useState<ReportSummaryDto[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryDto[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Report Resolution Modal State
  const [resolutionModalReport, setResolutionModalReport] = useState<ReportSummaryDto | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionStatus, setResolutionStatus] = useState<"RESOLVED" | "DISMISSED">("RESOLVED");
  const [submittingResolution, setSubmittingResolution] = useState(false);

  // Produce Inspection Modal State
  const [inspectModalProduct, setInspectModalProduct] = useState<Product | null>(null);

  // Audit Logs (Real-time admin actions)
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; target: string; time: string; type: string }>>([
    { id: "1", action: "System Gateway Initialized", target: "ECX Mandi Interop Service", time: "10:15 AM", type: "system" },
    { id: "2", action: "Security Hash Check Passed", target: "Trader Master Directory", time: "10:45 AM", type: "security" },
    { id: "3", action: "Assay Rules Synchronized", target: "Moisture & Purity Grading Engine", time: "11:20 AM", type: "compliance" },
  ]);

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
      // 1. Fetch Admin Stats
      try {
        const statsRes = await fetchApi<AdminDashboardStats>("/admin/stats");
        setStats(statsRes.data);
      } catch (e) {
        console.warn("Could not fetch admin stats from API:", e);
      }

      // 2. Fetch all products (status=ALL)
      try {
        const productsRes = await fetchProductsFromDb({ status: "ALL", size: 100 });
        setProducts(productsRes.content || []);
      } catch (e) {
        console.warn("Could not fetch products from API:", e);
      }

      // 3. Fetch users list
      try {
        const usersRes = await fetchApi<UserSummaryDto[]>("/admin/users");
        setUsersList(usersRes.data || []);
      } catch (e) {
        console.warn("Could not fetch users from API:", e);
      }

      // 4. Fetch reports list
      try {
        const reportsRes = await fetchApi<ReportSummaryDto[]>("/admin/reports");
        setReportsList(reportsRes.data || []);
      } catch (e) {
        console.warn("Could not fetch reports from API:", e);
      }

      // 5. Fetch categories
      try {
        const catRes = await fetchApi<CategoryDto[]>("/categories");
        setCategoriesList(catRes.data || []);
      } catch (e) {
        console.warn("Could not fetch categories:", e);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load exchange telemetry.");
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
  const handleAdminLogin = async (e?: React.FormEvent, customIdent?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    const loginId = customIdent || identifier;
    const loginPass = customPass || password;

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

      if (data.data.role !== "ROLE_ADMIN") {
        throw new Error("Access denied: You must be an authorized Administrator to enter this portal.");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      setUser(data.data);
      showToast("Signed in successfully as Administrator.");
    } catch (err: any) {
      setAuthError(err.message || "Admin authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: "admin" | "farmer" | "buyer") => {
    if (role === "admin") {
      handleAdminLogin(undefined, "admin@agri.com", "password");
    } else if (role === "farmer") {
      window.location.href = "/farmer";
    } else {
      window.location.href = "/buyer";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Quality Approval: Approve Product Listing (Marks ACTIVE)
  const handleApproveProduct = async (productId: string, productName: string) => {
    setActionLoading(productId);
    try {
      await fetchApi(`/admin/products/${productId}/status?status=ACTIVE`, {
        method: "PATCH",
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: "ACTIVE" } : p))
      );
      setStats((prev) =>
        prev
          ? {
              ...prev,
              activeProducts: prev.activeProducts + 1,
              pendingProducts: Math.max(0, prev.pendingProducts - 1),
            }
          : null
      );
      setAuditLogs((prev) => [
        {
          id: String(Date.now()),
          action: "Produce Lot Quality Certified & Approved",
          target: `${productName} (ID: ${productId.slice(0, 8)})`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "approval",
        },
        ...prev,
      ]);
      showToast(`Approved "${productName}". The commodity is now live on the public market.`);
    } catch (err: any) {
      showToast(err.message || "Failed to approve listing.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Reject / Request Re-test for Product Listing
  const handleRejectProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to reject the listing "${productName}"?`)) return;
    setActionLoading(productId);
    try {
      await fetchApi(`/admin/products/${productId}/status?status=REJECTED`, {
        method: "PATCH",
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: "REJECTED" } : p))
      );
      setStats((prev) =>
        prev
          ? {
              ...prev,
              pendingProducts: Math.max(0, prev.pendingProducts - 1),
            }
          : null
      );
      setAuditLogs((prev) => [
        {
          id: String(Date.now()),
          action: "Produce Lot Rejected / Re-Assay Required",
          target: `${productName} (ID: ${productId.slice(0, 8)})`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "rejection",
        },
        ...prev,
      ]);
      showToast(`Rejected "${productName}". Producer notified to revise assay parameters.`, "error");
    } catch (err: any) {
      showToast(err.message || "Failed to reject listing.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle Active / Inactive for existing listing
  const handleToggleProductStatus = async (productId: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setActionLoading(productId);
    try {
      await fetchApi(`/admin/products/${productId}/status?status=${newStatus}`, {
        method: "PATCH",
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: newStatus as any } : p))
      );
      setAuditLogs((prev) => [
        {
          id: String(Date.now()),
          action: `Listing Status Changed to ${newStatus}`,
          target: `${name}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "status",
        },
        ...prev,
      ]);
      showToast(`Listing status updated to ${newStatus}.`);
    } catch (err: any) {
      showToast(err.message || "Failed to update listing status.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Listing
  const handleDeleteProduct = async (productId: string, name: string) => {
    if (!confirm(`Permanently remove "${name}" from the database? This action cannot be undone.`)) return;
    setActionLoading(productId);
    try {
      await fetchApi(`/products/${productId}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setAuditLogs((prev) => [
        {
          id: String(Date.now()),
          action: "Listing Deleted by Admin",
          target: `${name}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "deletion",
        },
        ...prev,
      ]);
      showToast(`Listing "${name}" was permanently removed.`);
    } catch (err: any) {
      showToast(err.message || "Failed to delete listing.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // KYC Verification for Farmers
  const handleVerifyFarmer = async (userId: string, isVerified: boolean, name: string) => {
    setActionLoading(userId);
    try {
      await fetchApi(`/admin/users/${userId}/verify?isVerified=${isVerified}`, {
        method: "PATCH",
      });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isVerified } : u))
      );
      setAuditLogs((prev) => [
        {
          id: String(Date.now()),
          action: isVerified ? "Farmer KYC Verified & Certified" : "Farmer KYC Revoked",
          target: `${name}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "kyc",
        },
        ...prev,
      ]);
      showToast(isVerified ? `Verified producer status granted to ${name}.` : `Verification revoked for ${name}.`);
    } catch (err: any) {
      showToast(err.message || "Failed to update KYC status.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Suspend / Reactivate User
  const handleToggleUserStatus = async (userId: string, currentStatus: string, name: string) => {
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
          action: `User Account ${newStatus === "ACTIVE" ? "Reactivated" : "Suspended"}`,
          target: `${name}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "user",
        },
        ...prev,
      ]);
      showToast(`User ${name} status set to ${newStatus}.`);
    } catch (err: any) {
      showToast(err.message || "Failed to update user status.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Resolve Report
  const handleResolveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionModalReport) return;
    setSubmittingResolution(true);
    try {
      const query = new URLSearchParams({
        status: resolutionStatus,
        resolutionNotes: resolutionNotes.trim(),
      });
      await fetchApi(`/admin/reports/${resolutionModalReport.id}/status?${query.toString()}`, {
        method: "PATCH",
      });
      setReportsList((prev) =>
        prev.map((r) =>
          r.id === resolutionModalReport.id
            ? { ...r, status: resolutionStatus, resolutionNotes: resolutionNotes.trim() }
            : r
        )
      );
      setAuditLogs((prev) => [
        {
          id: String(Date.now()),
          action: `Dispute Marked as ${resolutionStatus}`,
          target: `Report #${resolutionModalReport.id.slice(0, 8)}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "report",
        },
        ...prev,
      ]);
      showToast(`Dispute #${resolutionModalReport.id.slice(0, 8)} has been marked as ${resolutionStatus}.`);
      setResolutionModalReport(null);
      setResolutionNotes("");
    } catch (err: any) {
      showToast(err.message || "Failed to resolve report.", "error");
    } finally {
      setSubmittingResolution(false);
    }
  };

  // Filtered Lists
  const pendingProductsList = products.filter(
    (p) => p.status === "PENDING_APPROVAL" || p.status === "INACTIVE"
  );
  const pendingFarmersList = usersList.filter(
    (u) => u.role === "ROLE_FARMER" && !u.isVerified
  );

  const totalPendingApprovals = pendingProductsList.length + pendingFarmersList.length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      productSearch === "" ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.cooperative && p.cooperative.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesStatus =
      productStatusFilter === "ALL" || p.status === productStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      userSearch === "" ||
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch));
    const matchesRole =
      userRoleFilter === "ALL" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredReports = reportsList.filter((r) => {
    return reportFilter === "ALL" || r.status === reportFilter;
  });

  // Calculate platform metrics
  const activeProductsCount = stats?.activeProducts ?? products.filter((p) => p.status === "ACTIVE").length;
  const pendingProductsCount = stats?.pendingProducts ?? pendingProductsList.length;
  const totalUsersCount = stats?.totalUsers ?? usersList.length;
  const totalOrdersCount = stats?.totalOrders ?? 24;
  const openReportsCount = stats?.openReports ?? reportsList.filter((r) => r.status === "OPEN").length;

  // --- LOADING AUTH STATE ---
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm font-medium tracking-wide">Validating Security Credentials...</p>
        </div>
      </div>
    );
  }

  // --- UNAUTHENTICATED ADMIN LOGIN PORTAL ---
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
        {/* Top Quick Role Bar */}
        <div className="max-w-md mx-auto w-full mb-4">
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-3 shadow-lg flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Switch Role:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleQuickDemoLogin("admin")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-500 transition"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickDemoLogin("farmer")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
              >
                Farmer
              </button>
              <button
                onClick={() => handleQuickDemoLogin("buyer")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
              >
                Buyer
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-xl shadow-emerald-900/30 mb-4 ring-4 ring-emerald-500/20">
              <ShieldAlert className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Exchange Authority & Admin Portal
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              National Agricultural Commodity Exchange • Moderation & Quality Inspection
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur">
            {authError && (
              <div className="mb-4 p-3.5 bg-red-950/80 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-red-200 text-xs">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* One-Click Fast Admin Sign In */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("admin")}
                disabled={authLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                {authLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 text-emerald-200" />
                    <span>One-Click Login as Admin</span>
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

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Email or Phone
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@agri.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Security Passphrase
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
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
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Demo Master Credential:</span>
              <code className="text-emerald-400 font-mono font-semibold">admin@agri.com / password</code>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-6">
          Ethiopian Commodity Exchange (ECX) Standards Authority • High-Security Administration
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED ADMIN DASHBOARD ---
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
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ECX SYSTEM ONLINE
          </span>
          <span className="text-slate-400 hidden sm:inline">
            National Agricultural Exchange Command Center
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px] hidden md:inline">Quick Dashboard Switcher:</span>
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded bg-emerald-600 text-white shadow-xs">
              Admin
            </span>
            <Link
              href="/farmer"
              className="px-2.5 py-0.5 text-[11px] font-medium rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition"
            >
              Farmer
            </Link>
            <Link
              href="/buyer"
              className="px-2.5 py-0.5 text-[11px] font-medium rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition"
            >
              Buyer
            </Link>
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

      {/* ── MAIN EXECUTIVE HEADER ── */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-950">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Exchange Administration & Oversight
                  <span className="text-[11px] font-semibold tracking-normal px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Authority Gateway
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Logged in as <span className="text-slate-200 font-medium">{user.fullName || user.email}</span> (Chief Quality & Compliance Inspector)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
              <span>Sync Telemetry</span>
            </button>
            <Link
              href="/products"
              target="_blank"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Public Spot Market</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── METRIC TELEMETRY CARDS ── */}
      <section className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Pending Approvals (The Star Metric) */}
          <div
            onClick={() => {
              setActiveTab("approvals");
              setApprovalSubTab("produce");
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
              totalPendingApprovals > 0
                ? "bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-950/50"
                : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
            }`}
          >
            {totalPendingApprovals > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Approvals Queue</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                {totalPendingApprovals}
              </span>
              <span className="text-xs text-amber-400/80 font-medium">Awaiting Review</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              {pendingProductsList.length} Produce Lots • {pendingFarmersList.length} KYC
            </p>
          </div>

          {/* Card 2: Active Commodities */}
          <div
            onClick={() => setActiveTab("listings")}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Live Commodities</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeProductsCount}
              </span>
              <span className="text-xs text-emerald-400 font-medium">Spot Ready</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {products.length} Total Registered Lots
            </p>
          </div>

          {/* Card 3: Platform Traders */}
          <div
            onClick={() => setActiveTab("users")}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Exchange Traders</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {totalUsersCount}
              </span>
              <span className="text-xs text-blue-400 font-medium">Accounts</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Farmers, Buyers & Unions
            </p>
          </div>

          {/* Card 4: Orders Handled */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Contracts</span>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <ShoppingCart className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {totalOrdersCount}
              </span>
              <span className="text-xs text-teal-400 font-medium">Executed</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              National Grain Trade Flow
            </p>
          </div>

          {/* Card 5: Trade Disputes */}
          <div
            onClick={() => setActiveTab("reports")}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Trade Disputes</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Flag className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {openReportsCount}
              </span>
              <span className={`text-xs font-medium ${openReportsCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {openReportsCount > 0 ? "Pending Mediation" : "Clean Ledger"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Arbitration & Mediation
            </p>
          </div>
        </div>
      </section>

      {/* ── WORKFLOW TABS BAR ── */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("approvals")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "approvals"
                  ? "border-amber-400 text-amber-300 bg-amber-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Award className="h-4 w-4 text-amber-400" />
              <span>Approvals & Quality Certification</span>
              {totalPendingApprovals > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-slate-950">
                  {totalPendingApprovals}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("listings")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "listings"
                  ? "border-emerald-400 text-emerald-300 bg-emerald-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Package className="h-4 w-4 text-emerald-400" />
              <span>Listing Catalog Moderation</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "users"
                  ? "border-blue-400 text-blue-300 bg-blue-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Users className="h-4 w-4 text-blue-400" />
              <span>Trader & KYC Directory</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                {usersList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "reports"
                  ? "border-purple-400 text-purple-300 bg-purple-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Flag className="h-4 w-4 text-purple-400" />
              <span>Disputes & Arbitration</span>
              {openReportsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/30 text-purple-200">
                  {openReportsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("surveillance")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "surveillance"
                  ? "border-teal-400 text-teal-300 bg-teal-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <TrendingUp className="h-4 w-4 text-teal-400" />
              <span>Surveillance & Audit Trail</span>
            </button>
          </nav>
        </div>
      </section>

      {/* ── TAB CONTENT BODY ── */}
      <main className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full flex-1">
        {/* ========================================================
            TAB 1: APPROVALS & QUALITY CERTIFICATION WORKFLOW
            ======================================================== */}
        {activeTab === "approvals" && (
          <div className="space-y-6">
            {/* Context Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white">
                    National Quality Inspection & Producer Verification Queue
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Agricultural listings and farmer accounts must undergo official certification (moisture meter check, assay purity, and cooperative verification) before trading live on the market.
                  </p>
                </div>
              </div>

              {/* Subtab Toggle */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-auto border border-slate-700">
                <button
                  onClick={() => setApprovalSubTab("produce")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    approvalSubTab === "produce"
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Package className="h-3.5 w-3.5" />
                  <span>Produce Lots ({pendingProductsList.length})</span>
                </button>
                <button
                  onClick={() => setApprovalSubTab("kyc")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    approvalSubTab === "kyc"
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Farmer KYC ({pendingFarmersList.length})</span>
                </button>
              </div>
            </div>

            {/* Sub-Tab A: PRODUCE APPROVALS */}
            {approvalSubTab === "produce" && (
              <div className="space-y-4">
                {pendingProductsList.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3 opacity-80" />
                    <h3 className="text-base font-bold text-white">All Produce Lots Inspected</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      There are currently no new harvest lots awaiting quality inspection. When farmers submit new crop listings, they will appear here for one-click approval.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {pendingProductsList.map((product) => (
                      <div
                        key={product.id}
                        className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                      >
                        {/* Produce Details */}
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {product.status === "PENDING_APPROVAL" ? "Awaiting Quality Assay" : "Inactive Listing"}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              {product.categoryName || "Grains & Pulses"}
                            </span>
                            {product.badge && (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {product.badge}
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                              {product.name}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                              {product.description}
                            </p>
                          </div>

                          {/* Agricultural Assay Specs Strip */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Assay Grade</span>
                              <span className="font-bold text-slate-200">
                                {product.assayGrade || "Grade 1 Standard"}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Moisture Assayed</span>
                              <span className="font-bold text-teal-300">
                                {product.moistureContent || "11.5% Tested"}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Purity Screen</span>
                              <span className="font-bold text-emerald-300">
                                {product.purity || "99.0% Certified"}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Silo / Warehouse</span>
                              <span className="font-bold text-slate-200 truncate block">
                                {product.storageWarehouse || product.location}
                              </span>
                            </div>
                          </div>

                          {/* Grower & Pricing info */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                            <span className="flex items-center gap-1 text-slate-300">
                              <Building2 className="h-3.5 w-3.5 text-amber-400" />
                              <strong className="font-semibold">{product.cooperative || "Oromia Farmer Union"}</strong>
                            </span>
                            <span>•</span>
                            <span>Location: <strong className="text-slate-300">{product.location}</strong></span>
                            <span>•</span>
                            <span>Lot Volume: <strong className="text-emerald-300">{product.quantityAvailable} {product.unit}</strong></span>
                            <span>•</span>
                            <span>Offered Price: <strong className="text-white text-sm">{formatCurrency(product.unitPrice)}/{product.unit}</strong></span>
                          </div>
                        </div>

                        {/* Approval Action Buttons */}
                        <div className="flex flex-row lg:flex-col gap-2.5 shrink-0 justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                          <button
                            onClick={() => handleApproveProduct(product.id, product.name)}
                            disabled={actionLoading === product.id}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-950 transition flex items-center justify-center gap-1.5 cursor-pointer flex-1 lg:flex-none"
                          >
                            {actionLoading === product.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Approve & Release to Market</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => setInspectModalProduct(product)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer flex-1 lg:flex-none"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Inspect Assay Specs</span>
                          </button>

                          <button
                            onClick={() => handleRejectProduct(product.id, product.name)}
                            disabled={actionLoading === product.id}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 transition flex items-center justify-center gap-1.5 cursor-pointer flex-1 lg:flex-none"
                          >
                            <XCircle className="h-3.5 w-3.5 text-red-400" />
                            <span>Reject / Re-test</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab B: FARMER KYC VERIFICATIONS */}
            {approvalSubTab === "kyc" && (
              <div className="space-y-4">
                {pendingFarmersList.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
                    <ShieldCheck className="h-12 w-12 text-blue-400 mx-auto mb-3 opacity-80" />
                    <h3 className="text-base font-bold text-white">All Farmer KYC Profiles Verified</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      All registered agricultural producers and cooperative unions hold an active verified producer license.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pendingFarmersList.map((farmer) => (
                      <div
                        key={farmer.id}
                        className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition shadow-lg flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              KYC Audit Pending
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Registered: {new Date(farmer.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-base font-bold text-white">{farmer.fullName}</h4>
                            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                              <Building2 className="h-3.5 w-3.5" />
                              {farmer.farmName || "Primary Cooperative Union"}
                            </p>
                          </div>

                          <div className="space-y-1 text-xs text-slate-300 pt-1">
                            <p className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              <span>{farmer.location || "Oromia Regional State"}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              <span className="font-mono">{farmer.phone || "0911000000"}</span>
                            </p>
                            <p className="flex items-center gap-2 text-slate-400">
                              <span className="w-3.5 h-3.5 text-center font-bold">@</span>
                              <span>{farmer.email}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                          <button
                            onClick={() => handleVerifyFarmer(farmer.id, true, farmer.fullName)}
                            disabled={actionLoading === farmer.id}
                            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {actionLoading === farmer.id ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Verify Producer License</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: COMMODITY LISTINGS MODERATION
            ======================================================== */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            {/* Search and Status Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by commodity, variety, or warehouse..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-slate-400 font-semibold shrink-0">Filter Status:</span>
                {["ALL", "ACTIVE", "PENDING_APPROVAL", "INACTIVE", "OUT_OF_STOCK"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setProductStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                      productStatusFilter === status
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {status === "ALL" ? "All Lots" : status.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700/60">
                      <th className="py-3 px-4">Commodity Lot</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Moisture / Grade</th>
                      <th className="py-3 px-4">Location / Silo</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Unit Rate</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          No commodity listings found matching filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{p.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              ID: {p.id.slice(0, 8)} • {p.cooperative || "Independent Farmer"}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {p.categoryName || "Grains"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-200">{p.assayGrade || "Grade 1"}</div>
                            <div className="text-[10px] text-teal-400">{p.moistureContent || "11.5%"}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {p.location}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-200">
                            {p.quantityAvailable} {p.unit}
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-400">
                            {formatCurrency(p.unitPrice)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                p.status === "ACTIVE"
                                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                  : p.status === "PENDING_APPROVAL"
                                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                  : p.status === "OUT_OF_STOCK"
                                  ? "bg-slate-700 text-slate-300"
                                  : "bg-red-500/10 text-red-300 border border-red-500/20"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {p.status === "PENDING_APPROVAL" && (
                                <button
                                  onClick={() => handleApproveProduct(p.id, p.name)}
                                  disabled={actionLoading === p.id}
                                  title="Approve Listing"
                                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleToggleProductStatus(p.id, p.status, p.name)}
                                disabled={actionLoading === p.id}
                                title={p.status === "ACTIVE" ? "Deactivate" : "Activate"}
                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                  p.status === "ACTIVE"
                                    ? "bg-slate-800 hover:bg-slate-700 text-amber-400"
                                    : "bg-emerald-950 hover:bg-emerald-900 text-emerald-400"
                                }`}
                              >
                                {p.status === "ACTIVE" ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                disabled={actionLoading === p.id}
                                title="Delete Listing"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: TRADER & USER DIRECTORY
            ======================================================== */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search traders by name, email, or telephone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-slate-400 font-semibold shrink-0">Filter Role:</span>
                {["ALL", "ROLE_FARMER", "ROLE_BUYER", "ROLE_ADMIN"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                      userRoleFilter === role
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {role === "ALL" ? "All Traders" : role.replace("ROLE_", "")}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700/60">
                      <th className="py-3 px-4">Trader Name</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4">Region / Hub</th>
                      <th className="py-3 px-4">KYC / Verification</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No users found matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{u.fullName}</div>
                            {u.farmName && (
                              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {u.farmName}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.role === "ROLE_ADMIN"
                                  ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                                  : u.role === "ROLE_FARMER"
                                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                  : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                              }`}
                            >
                              {u.role.replace("ROLE_", "")}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">
                            <div>{u.phone || "N/A"}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {u.location || "Addis Ababa Hub"}
                          </td>
                          <td className="py-3 px-4">
                            {u.role === "ROLE_FARMER" ? (
                              u.isVerified ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1 w-fit">
                                  <ShieldCheck className="h-3 w-3" /> Verified Producer
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleVerifyFarmer(u.id, true, u.fullName)}
                                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition cursor-pointer flex items-center gap-1"
                                >
                                  <Clock className="h-3 w-3" /> Click to Verify
                                </button>
                              )
                            ) : (
                              <span className="text-slate-500 text-[11px]">N/A</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.status === "ACTIVE"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {u.role !== "ROLE_ADMIN" && (
                              <button
                                onClick={() => handleToggleUserStatus(u.id, u.status, u.fullName)}
                                disabled={actionLoading === u.id}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                  u.status === "ACTIVE"
                                    ? "bg-slate-800 hover:bg-red-950 text-red-400 border border-red-900/40"
                                    : "bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-900/40"
                                }`}
                              >
                                {u.status === "ACTIVE" ? "Suspend" : "Reactivate"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: DISPUTES & ARBITRATION
            ======================================================== */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Platform Contracts & Trade Disputes Mediation
              </h3>
              <div className="flex items-center gap-2">
                {["ALL", "OPEN", "RESOLVED", "DISMISSED"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setReportFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      reportFilter === f
                        ? "bg-purple-600 text-white"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredReports.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3 opacity-80" />
                <h4 className="text-base font-bold text-white">No Open Disputes</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  All trade transactions are proceeding without reported quality or delivery discrepancies.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredReports.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition shadow-lg flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            r.status === "OPEN"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {r.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Target: {r.targetType} #{r.targetId.slice(0, 8)}
                        </span>
                        <span className="text-xs text-slate-500">
                          Filed: {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-white">
                        Reason: {r.reason}
                      </h4>

                      <div className="text-xs text-slate-400">
                        Complainant: <strong className="text-slate-300">{r.reporterName}</strong> ({r.reporterEmail})
                      </div>

                      {r.resolutionNotes && (
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 mt-2">
                          <strong className="text-purple-300 block mb-0.5 font-semibold">Official Resolution:</strong>
                          {r.resolutionNotes}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center">
                      {r.status === "OPEN" && (
                        <button
                          onClick={() => setResolutionModalReport(r)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Scale className="h-3.5 w-3.5" />
                          <span>Arbitrate & Resolve</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 5: SURVEILLANCE & AUDIT TRAIL
            ======================================================== */}
        {activeTab === "surveillance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Regional Terminal Rates */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    ECX Mandi Spot Price Benchmarks
                  </h3>
                  <span className="text-[11px] text-slate-400">Live Terminal Feeds</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200">Magna White Teff (Grade 1)</div>
                      <div className="text-slate-400 text-[11px]">Debre Birhan Mandi Terminal</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">9,400 ETB / Qt</div>
                      <div className="text-[10px] text-slate-400">Base Trading Band</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200">Sidama Washed Specialty Coffee (Q1)</div>
                      <div className="text-slate-400 text-[11px]">Hawassa Central Export Terminal</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">28,500 ETB / Bag</div>
                      <div className="text-[10px] text-slate-400">Base Trading Band</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200">Bako Hybrid White Maize</div>
                      <div className="text-slate-400 text-[11px]">Nekemte Central Silo Hub</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">5,850 ETB / Qt</div>
                      <div className="text-[10px] text-slate-400">Base Trading Band</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time System Audit Trail */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    Security & Moderation Audit Trail
                  </h3>
                  <span className="text-[11px] text-slate-400">Immutable Ledger</span>
                </div>

                <div className="space-y-2.5">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{log.action}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{log.target}</div>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono shrink-0">
                        {log.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── ARBITRATION RESOLUTION MODAL ── */}
      {resolutionModalReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-400" />
                Arbitrate Dispute #{resolutionModalReport.id.slice(0, 8)}
              </h3>
              <button
                onClick={() => setResolutionModalReport(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p>Complainant: <strong>{resolutionModalReport.reporterName}</strong></p>
              <p>Issue: <strong className="text-amber-300">{resolutionModalReport.reason}</strong></p>
            </div>

            <form onSubmit={handleResolveReport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Arbitration Decision
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResolutionStatus("RESOLVED")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      resolutionStatus === "RESOLVED"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Uphold & Settle (Resolved)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolutionStatus("DISMISSED")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      resolutionStatus === "DISMISSED"
                        ? "bg-red-600 text-white shadow-xs"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Dismiss Claim</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Administrative Resolution Notes
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record settlement terms, compensation, or inspection verification outcome..."
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setResolutionModalReport(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingResolution}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {submittingResolution ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span>Record Official Ruling</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── INSPECT ASSAY SPECS MODAL ── */}
      {inspectModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Assay Inspection Certificate
                </h3>
                <p className="text-xs text-slate-400 font-mono">Lot ID: {inspectModalProduct.id}</p>
              </div>
              <button
                onClick={() => setInspectModalProduct(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="font-bold text-white text-sm">{inspectModalProduct.name}</div>
                <div className="text-slate-400 mt-0.5">{inspectModalProduct.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Assay Grade</span>
                  <span className="text-sm font-bold text-white">{inspectModalProduct.assayGrade || "Grade 1"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Moisture Assayed</span>
                  <span className="text-sm font-bold text-teal-300">{inspectModalProduct.moistureContent || "11.5%"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Purity Screen</span>
                  <span className="text-sm font-bold text-emerald-300">{inspectModalProduct.purity || "99.0%"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Harvest Season</span>
                  <span className="text-sm font-bold text-amber-300">{inspectModalProduct.harvestSeason || "Meher 2026"}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1">
                <div className="text-slate-400">Storage Silo: <strong className="text-white">{inspectModalProduct.storageWarehouse || inspectModalProduct.location}</strong></div>
                <div className="text-slate-400">Cooperative Union: <strong className="text-white">{inspectModalProduct.cooperative || "Primary Union"}</strong></div>
                <div className="text-slate-400">Available Volume: <strong className="text-emerald-400">{inspectModalProduct.quantityAvailable} {inspectModalProduct.unit}</strong></div>
                <div className="text-slate-400">Asked Price: <strong className="text-white">{formatCurrency(inspectModalProduct.unitPrice)} / {inspectModalProduct.unit}</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setInspectModalProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                Close
              </button>
              {inspectModalProduct.status === "PENDING_APPROVAL" && (
                <button
                  type="button"
                  onClick={() => {
                    handleApproveProduct(inspectModalProduct.id, inspectModalProduct.name);
                    setInspectModalProduct(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve & Release</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
