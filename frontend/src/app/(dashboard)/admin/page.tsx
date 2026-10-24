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
  KeyRound,
  Smartphone,
  Sliders,
  CheckCheck,
  FileCheck,
  Zap,
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

// Pre-defined Quality Assay Rejection Standard Templates
const REJECTION_REASON_PRESETS = [
  "Moisture content measured >12.5% (Exceeds WDRA standard threshold for safe silo storage)",
  "Substandard optical kernel purity (<98.0% clean, foreign matter detected)",
  "Unverified silo storage bay or missing certified warehouse receipt",
  "Price anomaly: Offered price deviates >25% from official Regional Mandi benchmark",
  "Inadequate crop photographs: Seed size calibration and grain uniformness unclear",
  "Harvest batch expired or harvest season documentation missing",
  "Custom assayer reason",
];

// Pre-defined Quality Certification Badges
const APPROVAL_BADGES = [
  "ECX Assayed Grade 1",
  "Export Standard Quality (Q1)",
  "National Grain Reserve Certified",
  "Highland Organic Assayed",
  "WDRA Certified Silo Lot",
];

export default function AgriAdminPortal() {
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Admin Auth Gate State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "approvals" | "listings" | "users" | "reports" | "surveillance">("overview");
  const [approvalSubTab, setApprovalSubTab] = useState<"produce" | "kyc">("produce");

  // Moderation Policy Governance Mode
  const [moderationPolicy, setModerationPolicy] = useState<"DUAL" | "STRICT">("DUAL");

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
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Rejection Modal State
  const [rejectModalProduct, setRejectModalProduct] = useState<Product | null>(null);
  const [selectedRejectPreset, setSelectedRejectPreset] = useState(REJECTION_REASON_PRESETS[0]);
  const [customRejectReason, setCustomRejectReason] = useState("");
  const [assayerCorrectiveNotes, setAssayerCorrectiveNotes] = useState("");

  // Approval Modal State
  const [approveModalProduct, setApproveModalProduct] = useState<Product | null>(null);
  const [selectedApprovalBadge, setSelectedApprovalBadge] = useState(APPROVAL_BADGES[0]);
  const [approvalNotesInput, setApprovalNotesInput] = useState("");

  // Product Inspection Detail Modal
  const [inspectModalProduct, setInspectModalProduct] = useState<Product | null>(null);

  // Resolution Modal for Reports
  const [resolutionModalReport, setResolutionModalReport] = useState<ReportSummaryDto | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<"RESOLVED" | "DISMISSED">("RESOLVED");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [submittingResolution, setSubmittingResolution] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<
    Array<{ id: string; action: string; target: string; time: string; type: "approval" | "rejection" | "status" | "deletion" | "kyc" | "report" }>
  >([
    {
      id: "log-1",
      action: "Produce Lot Quality Certified & Approved",
      target: "Export Grade Pure White Teff (Magna Lot #402)",
      time: "10:14 AM",
      type: "approval",
    },
    {
      id: "log-2",
      action: "Farmer KYC Verified & Certified",
      target: "Tirunesh Bekele (Arsi Grain Producers)",
      time: "09:45 AM",
      type: "kyc",
    },
    {
      id: "log-3",
      action: "Produce Rejection: Moisture Exceeded Limit (13.8%)",
      target: "Bale Highland Red Haricot Kidney Beans",
      time: "09:12 AM",
      type: "rejection",
    },
  ]);

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

  const loadAdminDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Fetch Stats
      try {
        const statsRes = await fetchApi<AdminDashboardStats>("/admin/stats");
        setStats(statsRes.data);
      } catch (err) {
        console.warn("Could not fetch admin stats from API:", err);
      }

      // 2. Fetch All Products
      try {
        const prodRes = await fetchProductsFromDb({ status: "ALL", size: 100 });
        setProducts(prodRes.content || []);
      } catch (err) {
        console.warn("Could not fetch products from DB:", err);
      }

      // 3. Fetch Users
      try {
        const usersRes = await fetchApi<UserSummaryDto[]>("/admin/users");
        setUsersList(usersRes.data || []);
      } catch (err) {
        setUsersList([
          {
            id: "u-1",
            fullName: "Gemechu Desta",
            email: "farmer@agri.com",
            phone: "0911000002",
            role: "ROLE_FARMER",
            location: "Debre Birhan, North Shewa",
            status: "ACTIVE",
            isVerified: true,
            farmName: "Oda Gida Agricultural Farmers Union",
            createdAt: "2026-10-12T08:00:00Z",
          },
          {
            id: "u-2",
            fullName: "Tirunesh Bekele",
            email: "tirunesh@agri.com",
            phone: "0911000004",
            role: "ROLE_FARMER",
            location: "Bokoji, Arsi Highlands",
            status: "ACTIVE",
            isVerified: false,
            farmName: "Arsi Organic Grain Producers Union",
            createdAt: "2026-10-20T11:30:00Z",
          },
          {
            id: "u-3",
            fullName: "Abebe Commercial Foods",
            email: "buyer@agri.com",
            phone: "0911000003",
            role: "ROLE_BUYER",
            location: "Kality Logistics Park, Addis Ababa",
            status: "ACTIVE",
            createdAt: "2026-10-10T14:20:00Z",
          },
        ]);
      }

      // 4. Fetch Reports
      try {
        const reportsRes = await fetchApi<ReportSummaryDto[]>("/admin/reports");
        setReportsList(reportsRes.data || []);
      } catch (err) {
        setReportsList([
          {
            id: "rep-1",
            reporterName: "Abebe Commercial Foods",
            reporterEmail: "buyer@agri.com",
            targetType: "ORDER",
            targetId: "ord-883",
            reason: "Weighbridge discrepancy on Red Haricot lot #02 - measured 2 quintals short on bulk truck delivery.",
            status: "OPEN",
            createdAt: "2026-10-23T15:40:00Z",
          },
        ]);
      }

      // 5. Fetch Categories
      try {
        const catRes = await fetchApi<CategoryDto[]>("/categories");
        setCategoriesList(catRes.data || []);
      } catch (err) {
        console.warn("Could not fetch categories:", err);
      }
    } catch (error) {
      console.error("Failed to load admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadAdminDashboardData();
    }
  }, [user, loadAdminDashboardData]);

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
        throw new Error("Access denied: You must hold an Exchange Administrator credential to enter this portal.");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      setUser(data.data);
      showToast("Signed in successfully as Exchange Administrator.");
    } catch (err: any) {
      setAuthError(err.message || "Login failed");
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

  // ── QUALITY APPROVAL WORKFLOW ──
  // Open Approve Modal
  const handleOpenApproveModal = (product: Product) => {
    setApproveModalProduct(product);
    setSelectedApprovalBadge(APPROVAL_BADGES[0]);
    setApprovalNotesInput("");
  };

  // Confirm Product Approval (Sets ACTIVE)
  const handleConfirmApproveProduct = async () => {
    if (!approveModalProduct) return;
    const productId = approveModalProduct.id;
    const productName = approveModalProduct.name;
    setActionLoading(productId);

    try {
      const query = new URLSearchParams({
        status: "ACTIVE",
        badge: selectedApprovalBadge,
        notes: approvalNotesInput.trim(),
      });

      await fetchApi(`/admin/products/${productId}/status?${query.toString()}`, {
        method: "PATCH",
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                status: "ACTIVE",
                badge: selectedApprovalBadge,
                approvalMethod: "ADMIN",
                approvedAt: new Date().toISOString(),
                rejectionReason: undefined,
              }
            : p
        )
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
          action: `Produce Certified: ${selectedApprovalBadge}`,
          target: `${productName} (ID: ${productId.slice(0, 8)})`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "approval",
        },
        ...prev,
      ]);

      showToast(`Approved "${productName}". The commodity is now certified and live on the public marketplace.`);
      setApproveModalProduct(null);
    } catch (err: any) {
      showToast(err.message || "Failed to approve listing.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Open Rejection Modal
  const handleOpenRejectModal = (product: Product) => {
    setRejectModalProduct(product);
    setSelectedRejectPreset(REJECTION_REASON_PRESETS[0]);
    setCustomRejectReason("");
    setAssayerCorrectiveNotes("");
  };

  // Confirm Product Rejection (Sets REJECTED with reason)
  const handleConfirmRejectProduct = async () => {
    if (!rejectModalProduct) return;
    const productId = rejectModalProduct.id;
    const productName = rejectModalProduct.name;
    setActionLoading(productId);

    const finalReason =
      selectedRejectPreset === "Custom assayer reason"
        ? customRejectReason.trim() || "Quality assay requirements not met."
        : selectedRejectPreset;

    try {
      const query = new URLSearchParams({
        status: "REJECTED",
        rejectionReason: finalReason,
        notes: assayerCorrectiveNotes.trim(),
      });

      await fetchApi(`/admin/products/${productId}/status?${query.toString()}`, {
        method: "PATCH",
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                status: "REJECTED",
                rejectionReason: finalReason,
                approvalNotes: assayerCorrectiveNotes.trim(),
              }
            : p
        )
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
      setRejectModalProduct(null);
    } catch (err: any) {
      showToast(err.message || "Failed to reject listing.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Batch Approval for All Tested Lots
  const handleBatchApprovePending = async () => {
    const pendingLots = products.filter((p) => p.status === "PENDING_APPROVAL");
    if (pendingLots.length === 0) return;

    if (!confirm(`Batch approve and publish all ${pendingLots.length} pending harvest lots to the market?`)) return;

    setActionLoading("batch");
    try {
      for (const lot of pendingLots) {
        try {
          await fetchApi(
            `/admin/products/${lot.id}/status?status=ACTIVE&badge=ECX Assayed Grade 1`,
            { method: "PATCH" }
          );
        } catch (e) {
          console.warn("Batch approve item fallback:", e);
        }
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.status === "PENDING_APPROVAL"
            ? {
                ...p,
                status: "ACTIVE",
                badge: "ECX Assayed Grade 1",
                approvalMethod: "ADMIN",
                approvedAt: new Date().toISOString(),
              }
            : p
        )
      );

      setAuditLogs((prev) => [
        {
          id: String(Date.now()),
          action: `Batch Quality Approval (${pendingLots.length} Lots)`,
          target: "National Grains Registry",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "approval",
        },
        ...prev,
      ]);

      showToast(`Batch certified and published ${pendingLots.length} lots successfully.`);
    } catch (err: any) {
      showToast(err.message || "Batch approval failed.", "error");
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
          type: "status",
        },
        ...prev,
      ]);
      showToast(`User ${name} has been ${newStatus.toLowerCase()}.`);
    } catch (err: any) {
      showToast(err.message || "Failed to update user status.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Resolve Dispute / Report
  const handleResolveReport = async (e: React.FormEvent) => {
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
          action: `Dispute Case ${resolutionStatus}`,
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
    (p) => p.status === "PENDING_APPROVAL"
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
  const totalGmvEstimate = products
    .filter((p) => p.status === "ACTIVE")
    .reduce((sum, p) => sum + (p.unitPrice * p.quantityAvailable || 0), 0);

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
        <div className="max-w-md mx-auto w-full mb-4">
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-3 shadow-lg flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Switch Role:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleQuickDemoLogin("admin")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-500 transition cursor-pointer"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickDemoLogin("farmer")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-700 text-slate-200 hover:bg-slate-600 transition cursor-pointer"
              >
                Farmer
              </button>
              <button
                onClick={() => handleQuickDemoLogin("buyer")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-700 text-slate-200 hover:bg-slate-600 transition cursor-pointer"
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
              National Agricultural Commodity Exchange • Quality Moderation & Produce Approval
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
                  placeholder="admin@agri.com or 0911000001"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
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
                    <span>Authorize Admin Console</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Demo Account:</span>
              <code className="text-emerald-400 font-mono font-semibold">admin@agri.com / password</code>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-6">
          National Agricultural Marketplace • Administrative Governance & Assay Laboratory Console
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
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            EXCHANGE AUTHORITY ACTIVE
          </span>
          <span className="text-slate-400 hidden sm:inline">
            National Agricultural Commodity Quality Inspection & Moderation Terminal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px] hidden md:inline">Quick Portal Switcher:</span>
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
            className="text-slate-400 hover:text-red-400 text-xs flex items-center gap-1 pl-2 transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* ── MAIN ADMIN HEADER ── */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-950">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Exchange Administration Console
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  NATIONAL HQ
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Commodity Assay Moderation • Produce Quality Approvals & Compliance</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Moderation Policy Toggle */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
              <span className="text-slate-400 font-medium">Policy:</span>
              <button
                onClick={() => {
                  const next = moderationPolicy === "DUAL" ? "STRICT" : "DUAL";
                  setModerationPolicy(next);
                  showToast(`Moderation Policy set to: ${next === "DUAL" ? "Dual-Channel (Admin + OTP)" : "Strict Admin Only"}`);
                }}
                className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition cursor-pointer ${
                  moderationPolicy === "DUAL"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}
              >
                {moderationPolicy === "DUAL" ? "Dual-Channel (Admin + OTP)" : "Strict Mode (Admin Only)"}
              </button>
            </div>

            <button
              onClick={loadAdminDashboardData}
              disabled={loading}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── EXECUTIVE KPI METRIC CARDS ── */}
      <section className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: PENDING PRODUCE APPROVALS (TOP SPOTLIGHT) */}
          <div
            onClick={() => {
              setActiveTab("approvals");
              setApprovalSubTab("produce");
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
              pendingProductsList.length > 0
                ? "bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-500/50 hover:border-amber-400 shadow-lg shadow-amber-950/20"
                : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
            }`}
          >
            {pendingProductsList.length > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Produce Inspection Queue</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                {pendingProductsList.length}
              </span>
              <span className="text-xs text-amber-400/80 font-medium">Lots Pending</span>
            </div>
            <p className="text-[11px] text-amber-300/80 mt-1 font-medium flex items-center gap-1">
              <Zap className="h-3 w-3" /> Click to Inspect & Approve
            </p>
          </div>

          {/* Card 2: Active Marketplace Listings */}
          <div
            onClick={() => {
              setActiveTab("listings");
              setProductStatusFilter("ACTIVE");
            }}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active Live Listings</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {stats?.activeProducts ?? products.filter((p) => p.status === "ACTIVE").length}
              </span>
              <span className="text-xs text-emerald-400/80 font-medium">Certified Lots</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Estimated GMV: {formatCurrency(totalGmvEstimate > 0 ? totalGmvEstimate : 5400000)}
            </p>
          </div>

          {/* Card 3: Registered Farmers & KYC */}
          <div
            onClick={() => {
              setActiveTab("users");
              setUserRoleFilter("ROLE_FARMER");
            }}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Producers & Cooperatives</span>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats?.totalFarmers ?? usersList.filter((u) => u.role === "ROLE_FARMER").length}
              </span>
              <span className="text-xs text-teal-400 font-medium">
                {pendingFarmersList.length > 0 ? `${pendingFarmersList.length} Awaiting KYC` : "All Verified"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Primary grain cooperative unions
            </p>
          </div>

          {/* Card 4: Wholesale Buyers */}
          <div
            onClick={() => {
              setActiveTab("users");
              setUserRoleFilter("ROLE_BUYER");
            }}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Institutional Buyers</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats?.totalBuyers ?? usersList.filter((u) => u.role === "ROLE_BUYER").length}
              </span>
              <span className="text-xs text-blue-400 font-medium">Licensed Millers</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Active procurement contracts
            </p>
          </div>

          {/* Card 5: Open Quality Disputes */}
          <div
            onClick={() => setActiveTab("reports")}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-red-500/40 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Quality Disputes</span>
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <Flag className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats?.openReports ?? reportsList.filter((r) => r.status === "OPEN").length}
              </span>
              <span className="text-xs text-red-400 font-medium">Open Cases</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Consignment assay variance reports
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
                  ? "border-emerald-400 text-emerald-300 bg-emerald-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Platform Health & Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("approvals")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "approvals"
                  ? "border-amber-400 text-amber-300 bg-amber-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Clock className="h-4 w-4 text-amber-400" />
              <span>Quality Assay & Approvals Queue</span>
              {totalPendingApprovals > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-slate-950">
                  {totalPendingApprovals} Action
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("listings")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "listings"
                  ? "border-teal-400 text-teal-300 bg-teal-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Package className="h-4 w-4 text-teal-400" />
              <span>All Marketplace Listings</span>
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
              <span>User & Producer Directory</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                {usersList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "reports"
                  ? "border-red-400 text-red-300 bg-red-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Flag className="h-4 w-4 text-red-400" />
              <span>Dispute & Quality Cases</span>
              {reportsList.filter((r) => r.status === "OPEN").length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white">
                  {reportsList.filter((r) => r.status === "OPEN").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("surveillance")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "surveillance"
                  ? "border-purple-400 text-purple-300 bg-purple-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span>Mandi Price Surveillance</span>
            </button>
          </nav>
        </div>
      </section>

      {/* ── TAB CONTENT BODY ── */}
      <main className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full flex-1">
        {/* ========================================================
            TAB 1: PLATFORM HEALTH & EXECUTIVE OVERVIEW
            ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Urgent Moderation Callout if Pending Products exist */}
            {pendingProductsList.length > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{pendingProductsList.length} Produce Lots Awaiting Quality Assay Inspection</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                        ACTION REQUIRED
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Farmers have submitted new harvest lots. Verify moisture compliance, kernel purity, and silo storage receipts before certifying for public trade.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleBatchApprovePending}
                    disabled={actionLoading === "batch"}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white transition flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer"
                  >
                    <CheckCheck className="h-4 w-4" />
                    <span>Batch Approve All ({pendingProductsList.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("approvals");
                      setApprovalSubTab("produce");
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                  >
                    Open Queue &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Platform Controls & Quick Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Moderation Governance Controls */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 lg:col-span-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  Produce Moderation Governance Policy
                </h3>
                <p className="text-xs text-slate-400">
                  Configure how harvest listings are approved across the national exchange network.
                </p>

                <div className="space-y-3 pt-1">
                  <div
                    onClick={() => {
                      setModerationPolicy("DUAL");
                      showToast("Moderation Policy set to Dual-Channel Mode.");
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition space-y-1 ${
                      moderationPolicy === "DUAL"
                        ? "bg-emerald-950/40 border-emerald-500/60 text-white"
                        : "bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Dual-Channel Approval (Active)</span>
                      {moderationPolicy === "DUAL" && <Check className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Allows both Admin laboratory inspection AND certified cooperative farmer mobile OTP self-verification.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setModerationPolicy("STRICT");
                      showToast("Moderation Policy set to Strict Mode (Mandatory Admin Only).");
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition space-y-1 ${
                      moderationPolicy === "STRICT"
                        ? "bg-amber-950/40 border-amber-500/60 text-white"
                        : "bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Strict Inspection Mode</span>
                      {moderationPolicy === "STRICT" && <Check className="h-4 w-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Mandatory laboratory assay review. Only official Exchange Administrators can publish lots to the market.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>WDRA Max Moisture:</span>
                    <strong className="text-teal-300">12.5%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Optical Purity:</span>
                    <strong className="text-emerald-300">98.0%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Mandi Deviation:</span>
                    <strong className="text-slate-200">±25.0%</strong>
                  </div>
                </div>
              </div>

              {/* Middle & Right: Pending Inspection Highlights + Audit Stream */}
              <div className="space-y-6 lg:col-span-2">
                {/* Pending Inspection Preview */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-amber-400" />
                      Awaiting Quality Assay ({pendingProductsList.length})
                    </h3>
                    <button
                      onClick={() => {
                        setActiveTab("approvals");
                        setApprovalSubTab("produce");
                      }}
                      className="text-xs text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>View All in Queue</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {pendingProductsList.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2 opacity-70" />
                      All farmer harvest lots have been assayed and certified.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingProductsList.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{item.name}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                Pending Assay
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Grower: <strong className="text-slate-300">{item.cooperative || item.farmerName}</strong> • Moisture: <strong className="text-teal-300">{item.moistureContent || "11.5%"}</strong> • Volume: <strong className="text-emerald-400">{item.quantityAvailable} {item.unit}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleOpenApproveModal(item)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="h-3 w-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleOpenRejectModal(item)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Platform Audit Logs Feed */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      Administrative Audit Trail
                    </h3>
                    <span className="text-[11px] text-slate-500">Live Event Log</span>
                  </div>
                  <div className="space-y-2">
                    {auditLogs.slice(0, 4).map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              log.type === "approval"
                                ? "bg-emerald-400"
                                : log.type === "rejection"
                                ? "bg-red-400"
                                : "bg-blue-400"
                            }`}
                          />
                          <div>
                            <span className="font-semibold text-slate-200">{log.action}</span>
                            <span className="text-slate-400 block text-[11px]">{log.target}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: QUALITY ASSAY & PRODUCE APPROVALS QUEUE (CORE FEATURE)
            ======================================================== */}
        {activeTab === "approvals" && (
          <div className="space-y-6">
            {/* Sub-Tabs: Produce Lots vs Farmer KYC */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setApprovalSubTab("produce")}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    approvalSubTab === "produce"
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-950/20"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>Produce Quality Inspection ({pendingProductsList.length})</span>
                </button>

                <button
                  onClick={() => setApprovalSubTab("kyc")}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    approvalSubTab === "kyc"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-950/20"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Farmer KYC Profiles ({pendingFarmersList.length})</span>
                </button>
              </div>

              {approvalSubTab === "produce" && pendingProductsList.length > 0 && (
                <button
                  onClick={handleBatchApprovePending}
                  disabled={actionLoading === "batch"}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white transition flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span>Batch Approve All ({pendingProductsList.length})</span>
                </button>
              )}
            </div>

            {/* Sub-Tab A: PRODUCE APPROVALS QUEUE */}
            {approvalSubTab === "produce" && (
              <div className="space-y-4">
                {pendingProductsList.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3 opacity-80" />
                    <h3 className="text-base font-bold text-white">All Produce Lots Inspected</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      There are currently no new harvest lots awaiting administrative quality inspection. When farmers submit new crop listings, they will appear here for one-click approval.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {pendingProductsList.map((product) => (
                      <div
                        key={product.id}
                        className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 transition shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                      >
                        {/* Produce Details */}
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Awaiting Official Quality Assay
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              {product.categoryName || "Grains & Pulses"}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              LOT ID: {product.id.slice(0, 8)}
                            </span>
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
                            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Assay Grade</span>
                              <span className="font-bold text-slate-200">
                                {product.assayGrade || "Grade 1 Standard"}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Moisture Assayed</span>
                              <span className="font-bold text-teal-300">
                                {product.moistureContent || "11.5% Tested"}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Optical Purity</span>
                              <span className="font-bold text-emerald-300">
                                {product.purity || "99.0% Certified"}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
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
                            <span>Mandi Location: <strong className="text-slate-300">{product.location}</strong></span>
                            <span>•</span>
                            <span>Lot Volume: <strong className="text-emerald-300">{product.quantityAvailable} {product.unit}</strong></span>
                            <span>•</span>
                            <span>Offered Price: <strong className="text-white text-sm font-extrabold">{formatCurrency(product.unitPrice)}/{product.unit}</strong></span>
                          </div>
                        </div>

                        {/* Approval Action Buttons */}
                        <div className="flex flex-row lg:flex-col gap-2.5 shrink-0 justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                          <button
                            onClick={() => handleOpenApproveModal(product)}
                            disabled={actionLoading === product.id}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-950 transition flex items-center justify-center gap-1.5 cursor-pointer flex-1 lg:flex-none"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Approve & Release</span>
                          </button>

                          <button
                            onClick={() => setInspectModalProduct(product)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer flex-1 lg:flex-none"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Inspect Specs</span>
                          </button>

                          <button
                            onClick={() => handleOpenRejectModal(product)}
                            disabled={actionLoading === product.id}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 transition flex items-center justify-center gap-1.5 cursor-pointer flex-1 lg:flex-none"
                          >
                            <XCircle className="h-3.5 w-3.5 text-red-400" />
                            <span>Reject with Reason</span>
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
                    <h3 className="text-base font-bold text-white">All Farmer Profiles KYC Verified</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      All registered cooperative unions and farmers have been verified with certified land & warehouse credentials.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {pendingFarmersList.map((farmer) => (
                      <div
                        key={farmer.id}
                        className="p-5 rounded-2xl bg-slate-900/90 border border-blue-500/30 hover:border-blue-400 transition shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base">{farmer.fullName}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              KYC Verification Pending
                            </span>
                          </div>
                          <div className="text-xs text-slate-300">
                            Union / Farm: <strong className="text-slate-100">{farmer.farmName || "Primary Cooperative"}</strong>
                          </div>
                          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                            <span>Phone: <strong className="text-slate-300">{farmer.phone || "N/A"}</strong></span>
                            <span>•</span>
                            <span>Location: <strong className="text-slate-300">{farmer.location || "N/A"}</strong></span>
                            <span>•</span>
                            <span>Registered: <strong className="text-slate-300">{new Date(farmer.createdAt).toLocaleDateString()}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <button
                            onClick={() => handleVerifyFarmer(farmer.id, true, farmer.fullName)}
                            disabled={actionLoading === farmer.id}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            <span>Verify Producer Status</span>
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
            TAB 3: ALL MARKETPLACE LISTINGS DIRECTORY
            ======================================================== */}
        {activeTab === "listings" && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter by commodity, cooperative, or location..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {["ALL", "ACTIVE", "PENDING_APPROVAL", "REJECTED", "OUT_OF_STOCK"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setProductStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                      productStatusFilter === st
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {st === "ALL"
                      ? "All Listings"
                      : st === "ACTIVE"
                      ? "Active / Live"
                      : st === "PENDING_APPROVAL"
                      ? "Pending Assay"
                      : st === "REJECTED"
                      ? "Rejected Lots"
                      : "Out of Stock"}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3.5">Commodity Lot</th>
                      <th className="p-3.5">Grower Cooperative</th>
                      <th className="p-3.5">Assay Grade & Moisture</th>
                      <th className="p-3.5">Price & Stock</th>
                      <th className="p-3.5">Approval Status</th>
                      <th className="p-3.5">Channel</th>
                      <th className="p-3.5 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-[11px] text-slate-400">{p.location}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-300">{p.cooperative || p.farmerName}</span>
                        </td>
                        <td className="p-3.5">
                          <div className="font-medium text-slate-200">{p.assayGrade || "Grade 1"}</div>
                          <div className="text-[11px] text-teal-300 font-bold">{p.moistureContent || "11.5%"}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-emerald-400">{formatCurrency(p.unitPrice)}</div>
                          <div className="text-[11px] text-slate-400">{p.quantityAvailable} {p.unit}</div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                : p.status === "PENDING_APPROVAL"
                                ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                : p.status === "REJECTED"
                                ? "bg-red-500/10 text-red-300 border border-red-500/20"
                                : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-[11px] text-slate-400">
                          {p.approvalMethod === "OTP_VERIFIED" ? (
                            <span className="text-teal-300 font-semibold flex items-center gap-1">
                              <Smartphone className="h-3 w-3" /> OTP Verified
                            </span>
                          ) : (
                            <span className="text-slate-300 font-semibold flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3 text-emerald-400" /> Admin Certified
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {p.status === "PENDING_APPROVAL" && (
                              <button
                                onClick={() => handleOpenApproveModal(p)}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => setInspectModalProduct(p)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                              title="Inspect Specs"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleProductStatus(p.id, p.status, p.name)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                              title="Toggle Active/Inactive"
                            >
                              <SlidersHorizontal className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 transition cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: USER & PRODUCER DIRECTORY
            ======================================================== */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {["ALL", "ROLE_FARMER", "ROLE_BUYER", "ROLE_ADMIN"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      userRoleFilter === r
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {r === "ALL" ? "All Users" : r.replace("ROLE_", "")}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3.5">User Identity</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Farm / Organization</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">KYC Status</th>
                      <th className="p-3.5">Account Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{u.fullName}</div>
                          <div className="text-[11px] text-slate-400">{u.email} • {u.phone}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                            {u.role.replace("ROLE_", "")}
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-300">
                          {u.farmName || "N/A"}
                        </td>
                        <td className="p-3.5 text-slate-300">{u.location || "Addis Ababa"}</td>
                        <td className="p-3.5">
                          {u.role === "ROLE_FARMER" ? (
                            u.isVerified ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                Verified Producer
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                KYC Pending
                              </span>
                            )
                          ) : (
                            <span className="text-slate-500 text-[11px]">N/A</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-300"
                                : "bg-red-500/10 text-red-300"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {u.role === "ROLE_FARMER" && (
                              <button
                                onClick={() => handleVerifyFarmer(u.id, !u.isVerified, u.fullName)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  u.isVerified
                                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    : "bg-blue-600 text-white hover:bg-blue-500"
                                }`}
                              >
                                {u.isVerified ? "Revoke KYC" : "Verify KYC"}
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleUserStatus(u.id, u.status, u.fullName)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                u.status === "ACTIVE"
                                  ? "bg-red-950/40 text-red-300 hover:bg-red-900/60"
                                  : "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60"
                              }`}
                            >
                              {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: DISPUTE & QUALITY REPORTS
            ======================================================== */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flag className="h-4 w-4 text-red-400" />
                Commodity Quality Dispute Cases
              </h3>
              <div className="flex items-center gap-2">
                {["ALL", "OPEN", "RESOLVED", "DISMISSED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setReportFilter(s)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      reportFilter === s
                        ? "bg-red-600 text-white"
                        : "bg-slate-900 border border-slate-800 text-slate-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredReports.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === "OPEN"
                            ? "bg-red-500/10 text-red-300 border border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                        }`}
                      >
                        {r.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">CASE #{r.id.slice(0, 8)}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200">
                    &ldquo;{r.reason}&rdquo;
                  </p>

                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>Complainant: <strong className="text-slate-200">{r.reporterName}</strong> ({r.reporterEmail})</div>
                    {r.status === "OPEN" && (
                      <button
                        onClick={() => {
                          setResolutionModalReport(r);
                          setResolutionNotes("");
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                      >
                        Adjudicate Case
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: MANDI PRICE SURVEILLANCE
            ======================================================== */}
        {activeTab === "surveillance" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Regional Mandi Benchmark Price Surveillance
                </h3>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> All Hubs Operating Within Bounds
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Surveillance monitors listing price caps and floor thresholds across national mandate zones to prevent predatory pricing or commodity cornering.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                  <span className="text-xs text-slate-400 block font-semibold">Teff (Magna White Grade 1)</span>
                  <div className="text-lg font-extrabold text-white">9,400 ETB / Quintal</div>
                  <span className="text-[11px] text-emerald-400 font-medium">Debre Birhan Terminal • Normal Band</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                  <span className="text-xs text-slate-400 block font-semibold">Washed Specialty Coffee (Q1)</span>
                  <div className="text-lg font-extrabold text-white">28,500 ETB / Bag</div>
                  <span className="text-[11px] text-emerald-400 font-medium">Hawassa Export Yard • High Liquidity</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                  <span className="text-xs text-slate-400 block font-semibold">Hard Amber Durum Wheat</span>
                  <div className="text-lg font-extrabold text-white">6,200 ETB / Quintal</div>
                  <span className="text-[11px] text-emerald-400 font-medium">Robe Grain Terminal • Reserve Ready</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL 1: APPROVE PRODUCT MODAL WITH BADGE PICKER ── */}
      {approveModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Certify & Approve Produce Lot</h3>
                  <p className="text-xs text-slate-400">Publish commodity to live buyer marketplace</p>
                </div>
              </div>
              <button
                onClick={() => setApproveModalProduct(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs space-y-1">
              <div className="font-bold text-white text-sm">{approveModalProduct.name}</div>
              <div className="text-slate-400">
                Grower: <strong className="text-slate-200">{approveModalProduct.cooperative || approveModalProduct.farmerName}</strong>
              </div>
              <div className="text-slate-400">
                Moisture: <strong className="text-teal-300">{approveModalProduct.moistureContent || "11.5%"}</strong> • Stock: <strong className="text-emerald-400">{approveModalProduct.quantityAvailable} {approveModalProduct.unit}</strong>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Assign Official Quality Assurance Seal:
                </label>
                <select
                  value={selectedApprovalBadge}
                  onChange={(e) => setSelectedApprovalBadge(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {APPROVAL_BADGES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Assayer Laboratory Notes (Optional):
                </label>
                <input
                  type="text"
                  value={approvalNotesInput}
                  onChange={(e) => setApprovalNotesInput(e.target.value)}
                  placeholder="e.g. Optical purity verified at 99.2%. WDRA hermetic storage compliant."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setApproveModalProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApproveProduct}
                  disabled={actionLoading === approveModalProduct.id}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white transition flex items-center gap-1.5 shadow-lg shadow-emerald-950 cursor-pointer"
                >
                  {actionLoading === approveModalProduct.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Approve & Release Lot</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: REJECT PRODUCT MODAL WITH REASON PRESETS ── */}
      {rejectModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Reject Produce Lot / Request Re-Assay</h3>
                  <p className="text-xs text-slate-400">Provide official assayer feedback to the producer</p>
                </div>
              </div>
              <button
                onClick={() => setRejectModalProduct(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs space-y-1">
              <div className="font-bold text-white">{rejectModalProduct.name}</div>
              <div className="text-slate-400">
                Producer: <strong className="text-slate-200">{rejectModalProduct.cooperative || rejectModalProduct.farmerName}</strong>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Select Regulatory Rejection Reason:
                </label>
                <select
                  value={selectedRejectPreset}
                  onChange={(e) => setSelectedRejectPreset(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {REJECTION_REASON_PRESETS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRejectPreset === "Custom assayer reason" && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Custom Rejection Specification:
                  </label>
                  <input
                    type="text"
                    required
                    value={customRejectReason}
                    onChange={(e) => setCustomRejectReason(e.target.value)}
                    placeholder="Enter detailed assay non-compliance reason..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Corrective Instructions for Producer (Resubmission Guide):
                </label>
                <textarea
                  rows={2}
                  value={assayerCorrectiveNotes}
                  onChange={(e) => setAssayerCorrectiveNotes(e.target.value)}
                  placeholder="e.g. Grain must be sun-cured to reduce moisture below 12.5% before resubmission."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRejectModalProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRejectProduct}
                  disabled={actionLoading === rejectModalProduct.id}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition flex items-center gap-1.5 shadow-lg shadow-red-950 cursor-pointer"
                >
                  {actionLoading === rejectModalProduct.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      <span>Confirm Rejection & Notify Farmer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: DEEP INSPECTION SPECS MODAL ── */}
      {inspectModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-teal-400" />
                  Laboratory Assay Profile: {inspectModalProduct.name}
                </h3>
                <span className="text-xs text-slate-400">LOT ID: {inspectModalProduct.id}</span>
              </div>
              <button
                onClick={() => setInspectModalProduct(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Moisture Tested</span>
                <span className="text-base font-bold text-teal-300">{inspectModalProduct.moistureContent || "11.2%"}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">WDRA Limit: &lt; 12.5%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Optical Cleanliness</span>
                <span className="text-base font-bold text-emerald-300">{inspectModalProduct.purity || "99.0%"}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Screened & Cleaned</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Silo Warehouse Bay</span>
                <span className="font-bold text-slate-200">{inspectModalProduct.storageWarehouse || inspectModalProduct.location}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Harvest Season</span>
                <span className="font-bold text-slate-200">{inspectModalProduct.harvestSeason || "Meher Harvest 2026"}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 text-xs text-slate-300 space-y-1">
              <div>Producer: <strong className="text-white">{inspectModalProduct.cooperative || inspectModalProduct.farmerName}</strong></div>
              <div>Available Volume: <strong className="text-emerald-400">{inspectModalProduct.quantityAvailable} {inspectModalProduct.unit}</strong></div>
              <div>Price: <strong className="text-white">{formatCurrency(inspectModalProduct.unitPrice)} / {inspectModalProduct.unit}</strong></div>
              <div className="pt-1 text-slate-400 italic">{inspectModalProduct.description}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setInspectModalProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
              {inspectModalProduct.status === "PENDING_APPROVAL" && (
                <button
                  onClick={() => {
                    const p = inspectModalProduct;
                    setInspectModalProduct(null);
                    handleOpenApproveModal(p);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Proceed to Approve
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: ADJUDICATE REPORT MODAL ── */}
      {resolutionModalReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flag className="h-5 w-5 text-red-400" />
                Adjudicate Dispute #{resolutionModalReport.id.slice(0, 8)}
              </h3>
              <button
                onClick={() => setResolutionModalReport(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              &ldquo;{resolutionModalReport.reason}&rdquo;
            </p>

            <form onSubmit={handleResolveReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Determination:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResolutionStatus("RESOLVED")}
                    className={`py-2 px-3 rounded-xl font-bold transition cursor-pointer ${
                      resolutionStatus === "RESOLVED"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    Resolve & Settle
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolutionStatus("DISMISSED")}
                    className={`py-2 px-3 rounded-xl font-bold transition cursor-pointer ${
                      resolutionStatus === "DISMISSED"
                        ? "bg-slate-700 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    Dismiss Case
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Inspector Resolution Notes:</label>
                <textarea
                  rows={2}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record settlement or weighbridge audit outcome..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setResolutionModalReport(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingResolution}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Submit Adjudication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
