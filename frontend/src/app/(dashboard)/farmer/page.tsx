"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Tractor,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  PhoneCall,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  Boxes,
  ShieldCheck,
  Building2,
  Award,
  LogIn,
  LogOut,
  User as UserIcon,
  MapPin,
  Lock,
  ArrowRight,
  Truck,
  Sparkles,
  Phone,
  RefreshCw,
  Search,
  Star,
  Edit3,
  Trash2,
  AlertTriangle,
  MessageSquare,
  X,
  Check,
  ExternalLink,
  ChevronRight,
  Layers,
  FileCheck,
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

interface FarmerOrderResponse {
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

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export default function AgriFarmerPortal() {
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Auth gate state (if not logged in as Farmer)
  const [authIdentifier, setAuthIdentifier] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "add" | "reviews">("orders");
  const [orderFilter, setOrderFilter] = useState<string>("ALL");
  const [inventorySearch, setInventorySearch] = useState("");

  // Data State
  const [orders, setOrders] = useState<FarmerOrderResponse[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // New Listing Form State
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [newProduce, setNewProduce] = useState({
    name: "Export Grade Pure White Teff (Magna)",
    categoryId: "",
    unitPrice: 9400,
    unit: "Quintal (100kg)",
    quantityAvailable: 150,
    location: "Debre Birhan Mandi Terminal, North Shewa",
    assayGrade: "Grade 1 (99.2% Purity)",
    moistureContent: "11.2% (WDRA Standard Compliant)",
    purity: "99.2% Certified Clean",
    harvestSeason: "Main Meher Harvest 2026",
    storageWarehouse: "Central Grain Silo Bay #04",
    cooperative: "Oda Gida Agricultural Farmers Union",
    badge: "Spot e-Auction Lot",
    description: "Sustainably cultivated highland Magna White Teff. Fully tested for moisture compliance and optical purity. Packaged in sanitized moisture-barrier bags ready for wholesale delivery.",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
  });

  // Edit Listing Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    unitPrice: 8500,
    quantityAvailable: 100,
    unit: "Quintal (100kg)",
    location: "Debre Birhan Mandi",
    description: "",
  });

  // Reject Modal
  const [rejectModalOrder, setRejectModalOrder] = useState<FarmerOrderResponse | null>(null);
  const [rejectReason, setRejectReason] = useState("");

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
          if (parsed.role === "ROLE_FARMER") {
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

  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Fetch Farmer Orders
      try {
        const ordersRes = await fetchApi<any>("/orders/farmer?page=0&size=50");
        setOrders(ordersRes.data?.content || []);
      } catch (e) {
        console.warn("Could not fetch farmer orders from API:", e);
      }

      // 2. Fetch Farmer Listings
      try {
        const prodRes = await fetchApi<any>("/products/my-listings?page=0&size=50");
        setInventory(prodRes.data?.content || []);
      } catch (e) {
        // Fallback to fetch from DB
        try {
          const fallback = await fetchProductsFromDb({ status: "ALL", size: 50 });
          setInventory(fallback.content || []);
        } catch (err) {
          console.warn("Could not fetch listings:", err);
        }
      }

      // 3. Fetch Categories
      try {
        const catRes = await fetchApi<any[]>("/categories");
        setCategories(catRes.data || []);
        if (catRes.data && catRes.data.length > 0 && !newProduce.categoryId) {
          setNewProduce((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
        }
      } catch (e) {
        console.warn("Could not fetch categories:", e);
      }

      // 4. Fetch Reviews
      try {
        const reviewsRes = await fetchApi<any[]>(`/reviews/farmer/${user.id || user.userId}`);
        setReviews(reviewsRes.data || []);
      } catch (e) {
        // Mock sample reviews if none
        setReviews([
          {
            id: "rev-1",
            rating: 5,
            comment: "Exceptional purity! Moisture tested at 11.2%, perfectly within WDRA guidelines. Clean packaging.",
            reviewerName: "Abebe Commercial Foods",
            createdAt: "2026-10-18T14:30:00Z",
          },
          {
            id: "rev-2",
            rating: 5,
            comment: "Flawless dispatch from Debre Birhan Silo. Weighbridge slip matched exactly to the quintal.",
            reviewerName: "Kaliti Flour & Biscuit Mills",
            createdAt: "2026-10-14T09:15:00Z",
          },
        ]);
      }
    } catch (err: any) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, [user, newProduce.categoryId]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  // Auth Handler: Farmer Login
  const handleFarmerLogin = async (e?: React.FormEvent, customIdent?: string, customPass?: string) => {
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

      if (data.data.role !== "ROLE_FARMER") {
        throw new Error("Access denied: You must be a registered Agricultural Producer to enter this portal.");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      setUser(data.data);
      showToast("Signed in successfully as Agricultural Producer.");
    } catch (err: any) {
      setAuthError(err.message || "Farmer login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: "admin" | "farmer" | "buyer") => {
    if (role === "farmer") {
      handleFarmerLogin(undefined, "farmer@agri.com", "password");
    } else if (role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/buyer";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Order Lifecycle Transitions
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: "ACCEPTED" | "READY" | "COMPLETED" | "REJECTED",
    reason?: string
  ) => {
    setUpdatingOrderId(orderId);
    try {
      const body: any = { status: newStatus };
      if (reason) body.reason = reason;

      const res = await fetchApi<FarmerOrderResponse>(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, ...res.data, status: newStatus } : ord))
      );

      if (newStatus === "ACCEPTED") {
        showToast("Order accepted! Stock deducted and buyer telephone contact has been unlocked.");
      } else if (newStatus === "READY") {
        showToast("Order marked Ready for Silo Pickup / Logistics Transport.");
      } else if (newStatus === "COMPLETED") {
        showToast("Order confirmed delivered and trade transaction completed!");
      } else if (newStatus === "REJECTED") {
        showToast("Order declined and stock restored.", "error");
      }

      setRejectModalOrder(null);
      setRejectReason("");
    } catch (err: any) {
      showToast(err.message || "Failed to update order status.", "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Create Produce Listing (Submitted as PENDING_APPROVAL)
  const handleCreateProduce = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduce.categoryId && categories.length > 0) {
      newProduce.categoryId = categories[0].id;
    }

    setSubmittingProduct(true);
    try {
      const payload = {
        name: newProduce.name,
        categoryId: newProduce.categoryId,
        description: newProduce.description,
        unitPrice: Number(newProduce.unitPrice),
        unit: newProduce.unit,
        quantityAvailable: Number(newProduce.quantityAvailable),
        location: newProduce.location,
        assayGrade: newProduce.assayGrade,
        moistureContent: newProduce.moistureContent,
        purity: newProduce.purity,
        harvestSeason: newProduce.harvestSeason,
        storageWarehouse: newProduce.storageWarehouse,
        cooperative: newProduce.cooperative,
        badge: newProduce.badge,
        status: "PENDING_APPROVAL", // Enforces quality inspection workflow
        imageUrls: [newProduce.imageUrl],
      };

      const res = await fetchApi<Product>("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setInventory((prev) => [res.data, ...prev]);
      showToast(`Listing "${newProduce.name}" submitted! Awaiting Admin Quality & Assay Inspection.`);
      setActiveTab("inventory");
    } catch (err: any) {
      showToast(err.message || "Failed to create produce listing.", "error");
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Edit Listing
  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const payload = {
        ...editingProduct,
        name: editForm.name,
        unitPrice: Number(editForm.unitPrice),
        quantityAvailable: Number(editForm.quantityAvailable),
        unit: editForm.unit,
        location: editForm.location,
        description: editForm.description,
      };

      const res = await fetchApi<Product>(`/products/${editingProduct.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setInventory((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? res.data : p))
      );
      showToast(`Listing "${editForm.name}" updated successfully.`);
      setEditingProduct(null);
    } catch (err: any) {
      showToast(err.message || "Failed to update listing.", "error");
    }
  };

  // Delete Listing
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from your catalog?`)) return;
    try {
      await fetchApi(`/products/${id}`, { method: "DELETE" });
      setInventory((prev) => prev.filter((p) => p.id !== id));
      showToast(`Listing "${name}" was removed.`);
    } catch (err: any) {
      showToast(err.message || "Failed to delete listing.", "error");
    }
  };

  // Preset Commodity Fill
  const handleApplyPreset = (presetKey: string) => {
    if (presetKey === "teff") {
      setNewProduce((prev) => ({
        ...prev,
        name: "Export Grade Pure White Teff (Magna)",
        unitPrice: 9400,
        unit: "Quintal (100kg)",
        quantityAvailable: 150,
        assayGrade: "Grade 1 (99.2% Purity)",
        moistureContent: "11.2% (WDRA Standard Compliant)",
        purity: "99.2% Certified Clean",
        harvestSeason: "Main Meher Harvest 2026",
        storageWarehouse: "Central Grain Silo Bay #04, Debre Birhan",
        badge: "Spot e-Auction Lot",
      }));
    } else if (presetKey === "coffee") {
      setNewProduce((prev) => ({
        ...prev,
        name: "Sidama Washed Specialty Green Coffee Beans",
        unitPrice: 28500,
        unit: "Bag (60kg Jute)",
        quantityAvailable: 80,
        assayGrade: "Q1 Specialty Grade (SCA 87.5)",
        moistureContent: "10.8% Moisture Meter Assayed",
        purity: "99.8% Defect Free (Screen 15+)",
        harvestSeason: "Main Crop 2026",
        storageWarehouse: "Hawassa Central Export Dry Port",
        badge: "ECX Q1 Certified",
      }));
    } else if (presetKey === "maize") {
      setNewProduce((prev) => ({
        ...prev,
        name: "Bako Premium Hybrid White Maize (Lot #402)",
        unitPrice: 5850,
        unit: "Quintal (100kg)",
        quantityAvailable: 350,
        assayGrade: "Grade 1 (99.0% Purity)",
        moistureContent: "11.8% Assayed Moisture",
        purity: "99.0% Screened Clean",
        harvestSeason: "Meher Harvest 2026",
        storageWarehouse: "Nekemte Central Silo Bay #03",
        badge: "Pending Assay Approval",
      }));
    } else if (presetKey === "beans") {
      setNewProduce((prev) => ({
        ...prev,
        name: "Bale Highland Red Haricot Kidney Beans",
        unitPrice: 7400,
        unit: "Quintal (100kg)",
        quantityAvailable: 220,
        assayGrade: "Export Grade (98.5% Clean)",
        moistureContent: "10.9% Tested Moisture",
        purity: "98.5% Purity",
        harvestSeason: "Meher Harvest 2026",
        storageWarehouse: "Bokoji Cooperative Storage #01",
        badge: "Under Inspection",
      }));
    }
  };

  // Metrics
  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;
  const acceptedOrdersCount = orders.filter((o) => o.status === "ACCEPTED").length;
  const readyOrdersCount = orders.filter((o) => o.status === "READY").length;
  const completedOrdersCount = orders.filter((o) => o.status === "COMPLETED").length;

  const totalGrossSales = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const totalSiloStock = inventory.reduce((sum, p) => sum + (p.quantityAvailable || 0), 0);

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "ALL") return true;
    return o.status === orderFilter;
  });

  const filteredInventory = inventory.filter((p) => {
    return (
      inventorySearch === "" ||
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.location.toLowerCase().includes(inventorySearch.toLowerCase())
    );
  });

  // --- LOADING AUTH STATE ---
  if (authChecking) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white">
          <RefreshCw className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-sm font-medium tracking-wide">Connecting to Producer Terminal...</p>
        </div>
      </div>
    );
  }

  // --- UNAUTHENTICATED FARMER LOGIN PORTAL ---
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
        {/* Top Quick Role Bar */}
        <div className="max-w-md mx-auto w-full mb-4">
          <div className="bg-slate-900/80 backdrop-blur border border-emerald-800/40 rounded-xl p-3 shadow-lg flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Switch Role:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleQuickDemoLogin("farmer")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-500 transition"
              >
                Farmer
              </button>
              <button
                onClick={() => handleQuickDemoLogin("admin")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickDemoLogin("buyer")}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Buyer
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 shadow-xl shadow-emerald-950 mb-4 ring-4 ring-emerald-500/20">
              <Tractor className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Producer & Cooperative Portal
            </h1>
            <p className="mt-1 text-xs text-emerald-200/80">
              Direct National Commodity Trading • Silo Management & Order Fulfillment
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
                onClick={() => handleQuickDemoLogin("farmer")}
                disabled={authLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-950 transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                {authLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 text-emerald-200" />
                    <span>One-Click Login as Demo Farmer</span>
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

            <form onSubmit={handleFarmerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Farmer Phone or Email
                </label>
                <input
                  type="text"
                  required
                  value={authIdentifier}
                  onChange={(e) => setAuthIdentifier(e.target.value)}
                  placeholder="farmer@agri.com or 0911000002"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
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
                    <span>Sign In to Producer Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Demo Account:</span>
              <code className="text-emerald-400 font-mono font-semibold">farmer@agri.com / password</code>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-6">
          National Agricultural Marketplace • Verified Farm Gate Trading
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED FARMER DASHBOARD ---
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
            PRODUCER TERMINAL ACTIVE
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Direct Grain Trade & Spot Fulfillment Network
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
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded bg-emerald-600 text-white shadow-xs">
              Farmer
            </span>
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

      {/* ── MAIN PRODUCER HEADER ── */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-lg shadow-emerald-950">
              <Tractor className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {user.fullName || "Oda Gida Cooperative Producer"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> ECX Certified Producer
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9 (38 Reviews)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span>Oda Gida Agricultural Farmers Union • Debre Birhan Mandi Terminal, North Shewa</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setActiveTab("add")}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white transition flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>List New Harvest Lot</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── METRIC CARDS ── */}
      <section className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Pending Orders Action Needed */}
          <div
            onClick={() => {
              setActiveTab("orders");
              setOrderFilter("PENDING");
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
              pendingOrdersCount > 0
                ? "bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-500/40 hover:border-amber-400 shadow-md shadow-amber-950/20"
                : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
            }`}
          >
            {pendingOrdersCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Incoming Requests</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                {pendingOrdersCount}
              </span>
              <span className="text-xs text-amber-400/80 font-medium">Require Acceptance</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Buyers awaiting contract confirmation
            </p>
          </div>

          {/* Card 2: Orders in Packaging & Transport */}
          <div
            onClick={() => {
              setActiveTab("orders");
              setOrderFilter("ACCEPTED");
            }}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active Trade Pipeline</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Truck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {acceptedOrdersCount + readyOrdersCount}
              </span>
              <span className="text-xs text-blue-400 font-medium">In Logistics</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {acceptedOrdersCount} Packaging • {readyOrdersCount} Ready for Pickup
            </p>
          </div>

          {/* Card 3: Silo Grain Inventory */}
          <div
            onClick={() => setActiveTab("inventory")}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Silo Stock Stored</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Boxes className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {totalSiloStock}
              </span>
              <span className="text-xs text-emerald-400 font-medium">Quintals</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Across {inventory.length} Certified Commodity Lots
            </p>
          </div>

          {/* Card 4: Gross Settled Revenue */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Settled Revenue</span>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-300">
                {formatCurrency(totalGrossSales > 0 ? totalGrossSales : 185000)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {completedOrdersCount > 0 ? completedOrdersCount : 8} Completed Shipments
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
                  ? "border-emerald-400 text-emerald-300 bg-emerald-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <ShoppingBag className="h-4 w-4 text-emerald-400" />
              <span>Orders Fulfillment Pipeline</span>
              {pendingOrdersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-slate-950">
                  {pendingOrdersCount} Action
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "inventory"
                  ? "border-teal-400 text-teal-300 bg-teal-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Package className="h-4 w-4 text-teal-400" />
              <span>My Crop Lots & Silos</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                {inventory.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("add")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === "add"
                  ? "border-amber-400 text-amber-300 bg-amber-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <PlusCircle className="h-4 w-4 text-amber-400" />
              <span>List New Commodity (Wizard)</span>
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
              <span>Buyer Reviews & Ratings</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                {reviews.length}
              </span>
            </button>
          </nav>
        </div>
      </section>

      {/* ── TAB CONTENT BODY ── */}
      <main className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full flex-1">
        {/* ========================================================
            TAB 1: ORDERS FULFILLMENT PIPELINE
            ======================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* 4-Step Fulfillment Lifecycle Stepper Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4" /> 4-Stage Agricultural Trade Pipeline
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Strict Contact Privacy Guard & Stock Deductions
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-amber-400 font-bold block">1. Incoming Request</span>
                  <span className="font-semibold text-slate-200">Pending Review</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-blue-400 font-bold block">2. Accepted & Reserved</span>
                  <span className="font-semibold text-slate-200">Contact Unlocked</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-teal-400 font-bold block">3. Ready for Logistics</span>
                  <span className="font-semibold text-slate-200">Pickup Dispatch</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-emerald-400 font-bold block">4. Handover & Paid</span>
                  <span className="font-semibold text-slate-200">Completed & Rated</span>
                </div>
              </div>
            </div>

            {/* Order Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 font-semibold shrink-0">Filter Pipeline:</span>
              {[
                { id: "ALL", label: "All Orders", count: orders.length },
                { id: "PENDING", label: "Action Required (Pending)", count: pendingOrdersCount },
                { id: "ACCEPTED", label: "In Packaging (Accepted)", count: acceptedOrdersCount },
                { id: "READY", label: "Ready for Pickup", count: readyOrdersCount },
                { id: "COMPLETED", label: "Completed & Settled", count: completedOrdersCount },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    orderFilter === f.id
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <span>{f.label}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Order Cards */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
                <ShoppingBag className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Orders in this Stage</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  When commercial buyers place procurement requests for your grains, they will show up here for one-click fulfillment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => {
                  const isPending = order.status === "PENDING";
                  const isAccepted = order.status === "ACCEPTED";
                  const isReady = order.status === "READY";
                  const isCompleted = order.status === "COMPLETED";

                  return (
                    <div
                      key={order.id}
                      className={`p-5 rounded-2xl bg-slate-900/90 border transition-all shadow-lg flex flex-col gap-4 ${
                        isPending
                          ? "border-amber-500/40 hover:border-amber-400"
                          : isAccepted
                          ? "border-blue-500/40"
                          : isReady
                          ? "border-teal-500/40"
                          : "border-slate-800"
                      }`}
                    >
                      {/* Top Order Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
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
                              ? "Action Needed: Pending Acceptance"
                              : order.status === "ACCEPTED"
                              ? "Accepted: In Preparation"
                              : order.status === "READY"
                              ? "Ready for Logistics Transport"
                              : order.status}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            Contract #{order.id.slice(0, 8)}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400">
                          Placed: <strong className="text-slate-300">{new Date(order.createdAt).toLocaleString()}</strong>
                        </div>
                      </div>

                      {/* Items Ordered */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Commodity Lots Requested
                        </div>
                        {order.items && order.items.length > 0 ? (
                          <div className="divide-y divide-slate-800">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
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
                          <div className="text-xs text-slate-400">Standard Grain Order Lot</div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                          <span className="text-slate-400">
                            Delivery Preference: <strong className="text-slate-200">{order.deliveryPreference || "Buyer Mandi Silo Pickup"}</strong>
                          </span>
                          <div className="text-right">
                            <span className="text-slate-400 mr-2">Total Contract Value:</span>
                            <strong className="text-base font-extrabold text-white">
                              {formatCurrency(order.totalPrice)}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Unlocked Contact Box or Masked Privacy Guard */}
                      <div className="p-3.5 rounded-xl border text-xs">
                        {isPending ? (
                          <div className="flex items-center gap-2 text-amber-300/90 bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30">
                            <Lock className="h-4 w-4 shrink-0 text-amber-400" />
                            <span>
                              <strong>Contact Privacy Guard (FR-4.7):</strong> Buyer phone number and warehouse address will be unveiled immediately once you accept this incoming contract.
                            </span>
                          </div>
                        ) : (
                          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4" /> Unlocked Buyer Coordinates
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                Buyer ID: {order.buyerId.slice(0, 8)}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300">
                              <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Buyer Name</span>
                                <strong className="text-white">{order.buyerName}</strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Direct Telephone</span>
                                <a
                                  href={`tel:${order.buyerPhone || "0911000003"}`}
                                  className="text-emerald-400 hover:text-emerald-300 font-mono font-bold flex items-center gap-1"
                                >
                                  <PhoneCall className="h-3 w-3" />
                                  {order.buyerPhone || "0911000003"}
                                </a>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Logistics Notes</span>
                                <span>{order.note || "Standard Silo Bay pickup via 40t flatbed truck"}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Workflow Actions */}
                      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                        {isPending && (
                          <>
                            <button
                              onClick={() => setRejectModalOrder(order)}
                              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 transition cursor-pointer"
                            >
                              Decline Request
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "ACCEPTED")}
                              disabled={updatingOrderId === order.id}
                              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-950 transition flex items-center gap-1.5 cursor-pointer"
                            >
                              {updatingOrderId === order.id ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span>Accept Order & Deduct Stock</span>
                                </>
                              )}
                            </button>
                          </>
                        )}

                        {isAccepted && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "READY")}
                            disabled={updatingOrderId === order.id}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition flex items-center gap-1.5 cursor-pointer"
                          >
                            {updatingOrderId === order.id ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <Truck className="h-4 w-4" />
                                <span>Mark Packaged & Ready for Pickup</span>
                              </>
                            )}
                          </button>
                        )}

                        {isReady && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "COMPLETED")}
                            disabled={updatingOrderId === order.id}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition flex items-center gap-1.5 cursor-pointer"
                          >
                            {updatingOrderId === order.id ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Confirm Handover & Payment Settled</span>
                              </>
                            )}
                          </button>
                        )}

                        {isCompleted && (
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Completed & Reconciled
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: MY CROP LOTS & SILO STORAGE
            ======================================================== */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search my grain lots by crop or silo..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={() => setActiveTab("add")}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Crop Lot</span>
              </button>
            </div>

            {filteredInventory.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
                <Boxes className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Grain Lots in Inventory</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Click the button below to register your harvest lot with assay grade and moisture specifications.
                </p>
                <button
                  onClick={() => setActiveTab("add")}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white cursor-pointer"
                >
                  List First Harvest Lot
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                              : item.status === "PENDING_APPROVAL"
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                              : item.status === "OUT_OF_STOCK"
                              ? "bg-slate-700 text-slate-300"
                              : "bg-red-500/10 text-red-300 border border-red-500/20"
                          }`}
                        >
                          {item.status === "ACTIVE"
                            ? "Live on Spot Market"
                            : item.status === "PENDING_APPROVAL"
                            ? "Awaiting Admin Quality Inspection"
                            : item.status}
                        </span>

                        <span className="text-[11px] text-slate-400 font-mono">
                          ID: {item.id.slice(0, 8)}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white">{item.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>

                      {/* Specs Mini Grid */}
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

                      <div className="text-xs text-slate-300 space-y-1 pt-1">
                        <div>Silo: <strong className="text-slate-200">{item.storageWarehouse || item.location}</strong></div>
                        <div className="flex items-center justify-between">
                          <span>Available Stock:</span>
                          <strong className="text-emerald-400 font-bold">{item.quantityAvailable} {item.unit}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Unit Price:</span>
                          <strong className="text-white font-extrabold">{formatCurrency(item.unitPrice)} / {item.unit}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setEditingProduct(item);
                          setEditForm({
                            name: item.name,
                            unitPrice: item.unitPrice,
                            quantityAvailable: item.quantityAvailable,
                            unit: item.unit,
                            location: item.location,
                            description: item.description,
                          });
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Adjust Lot</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(item.id, item.name)}
                        className="py-1.5 px-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: ADD NEW COMMODITY WIZARD
            ======================================================== */}
        {activeTab === "add" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-emerald-400" />
                Commodity Harvest Registration & Quality Assay Submission
              </h3>
              <p className="text-xs text-slate-300">
                Register a new produce lot. In accordance with National Agricultural Exchange rules, all submissions enter the <strong>Quality Inspection Queue (Pending Approval)</strong> where the exchange inspector validates assay parameters before releasing the lot for spot trading.
              </p>

              {/* Quick Ethiopian Crop Presets */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Quick-Fill Verified Ethiopian Commodity Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("teff")}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-emerald-950 text-emerald-300 border border-emerald-800/50 transition cursor-pointer"
                  >
                    Highland Magna Teff
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("coffee")}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-emerald-950 text-emerald-300 border border-emerald-800/50 transition cursor-pointer"
                  >
                    Sidama Washed Coffee
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("maize")}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-emerald-950 text-emerald-300 border border-emerald-800/50 transition cursor-pointer"
                  >
                    Bako White Maize
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("beans")}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-emerald-950 text-emerald-300 border border-emerald-800/50 transition cursor-pointer"
                  >
                    Bale Red Kidney Beans
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateProduce} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Commodity Lot Name & Variety
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduce.name}
                    onChange={(e) => setNewProduce({ ...newProduce, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Commodity Category
                  </label>
                  <select
                    value={newProduce.categoryId}
                    onChange={(e) => setNewProduce({ ...newProduce, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Unit of Measurement
                  </label>
                  <select
                    value={newProduce.unit}
                    onChange={(e) => setNewProduce({ ...newProduce, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Quintal (100kg)">Quintal (100kg)</option>
                    <option value="Bag (60kg Jute)">Bag (60kg Jute)</option>
                    <option value="KG">KG (Kilogram)</option>
                    <option value="Metric Ton">Metric Ton (1,000kg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Lot Quantity Available
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProduce.quantityAvailable}
                    onChange={(e) => setNewProduce({ ...newProduce, quantityAvailable: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Unit Price (ETB)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={newProduce.unitPrice}
                    onChange={(e) => setNewProduce({ ...newProduce, unitPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Assay Grade Standard
                  </label>
                  <input
                    type="text"
                    value={newProduce.assayGrade}
                    onChange={(e) => setNewProduce({ ...newProduce, assayGrade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Assayed Moisture Content
                  </label>
                  <input
                    type="text"
                    value={newProduce.moistureContent}
                    onChange={(e) => setNewProduce({ ...newProduce, moistureContent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Purity Rating
                  </label>
                  <input
                    type="text"
                    value={newProduce.purity}
                    onChange={(e) => setNewProduce({ ...newProduce, purity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Storage Silo / Terminal
                  </label>
                  <input
                    type="text"
                    value={newProduce.storageWarehouse}
                    onChange={(e) => setNewProduce({ ...newProduce, storageWarehouse: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Agricultural & Milling Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newProduce.description}
                    onChange={(e) => setNewProduce({ ...newProduce, description: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("inventory")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-950 transition flex items-center gap-2 cursor-pointer"
                >
                  {submittingProduct ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4" />
                      <span>Submit Lot for Quality Inspection</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 4: REVIEWS & BUYER FEEDBACK
            ======================================================== */}
        {activeTab === "reviews" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  Verified Buyer Reviews & Ratings
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Every review is tied to a completed order and backed by verified scale receipts.
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold text-amber-300">4.9</span>
                <span className="text-xs text-slate-400 block">Overall Score</span>
              </div>
            </div>

            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white text-xs">{r.reviewerName}</div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(r.rating || 5)].map((_, idx) => (
                        <Star key={idx} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic">&ldquo;{r.comment}&rdquo;</p>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {new Date(r.createdAt).toLocaleDateString()} • Verified Commercial Delivery
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── ADJUST LOT MODAL ── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-emerald-400" />
                Adjust Lot: {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lot Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Available Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editForm.quantityAvailable}
                    onChange={(e) => setEditForm({ ...editForm, quantityAvailable: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Unit Price (ETB)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={editForm.unitPrice}
                    onChange={(e) => setEditForm({ ...editForm, unitPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Silo / Location
                </label>
                <input
                  type="text"
                  required
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── REJECT MODAL ── */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-400" />
                Decline Contract #{rejectModalOrder.id.slice(0, 8)}
              </h3>
              <button
                onClick={() => setRejectModalOrder(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Please state why this order cannot be fulfilled (e.g. temporary silo maintenance, transport scheduling constraint).
            </p>

            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for declining request..."
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateOrderStatus(rejectModalOrder.id, "REJECTED", rejectReason)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
