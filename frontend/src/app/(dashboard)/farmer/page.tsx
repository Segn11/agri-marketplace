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
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authIdentifier, setAuthIdentifier] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Register form state
  const [regData, setRegData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    location: "Nekemte Central Mandi, East Wollega",
    farmName: "",
    farmLocation: "Nekemte Central Mandi, East Wollega",
    farmDescription: "Local agricultural producer union serving Nekemte, Bako, and surrounding Oromia farming woredas.",
  });

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "reviews">("orders");
  const [orders, setOrders] = useState<FarmerOrderResponse[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>("ALL");

  // Reviews state (FR-6.1)
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // New listing modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [newProduce, setNewProduce] = useState({
    name: "",
    categoryId: "",
    unitPrice: 8500,
    unit: "Quintal (100kg)",
    quantityAvailable: 100,
    location: "Nekemte Central Mandi",
    assayGrade: "Grade 1 (99.2% Purity)",
    moistureContent: "11.5% Tested",
    purity: "99.0% Clean",
    harvestSeason: "Meher Harvest 2026",
    storageWarehouse: "Nekemte Central Mandi Silo #2",
    cooperative: "Bako & Nekemte Agro Cooperative",
    badge: "Assay Certified",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
  });

  // Edit listing modal state (FR-2.2)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    unitPrice: 8500,
    quantityAvailable: 100,
    unit: "Quintal (100kg)",
    location: "Nekemte Central Mandi",
    description: "",
  });

  // Reject order modal state (UC-05)
  const [rejectModalOrder, setRejectModalOrder] = useState<FarmerOrderResponse | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Verify stored user session
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

  // Fetch categories for product listing dropdown
  useEffect(() => {
    fetchApi<CategoryOption[]>("/categories")
      .then((res) => {
        setCategories(res.data || []);
        if (res.data && res.data.length > 0) {
          setNewProduce((prev) => ({ ...prev, categoryId: res.data[0].id }));
        }
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  // Load orders & inventory for the farmer
  const loadFarmerData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch Farmer's Orders
      try {
        const orderRes = await fetchApi<{ content: FarmerOrderResponse[] }>("/orders/farmer?size=50");
        setOrders(orderRes.data.content || []);
      } catch (err) {
        console.warn("Could not load farmer orders from API:", err);
      }

      // 2. Fetch Farmer's Listings from Database
      const prodRes = await fetchProductsFromDb({ size: 50 });
      const allProds = prodRes.content || [];
      // Filter for this farmer's listings if matching, or show all created by farmer
      const farmerListings = allProds.filter(
        (p) => p.farmerId === user.userId || p.farmerName === user.fullName
      );
      setInventory(farmerListings.length > 0 ? farmerListings : allProds.slice(0, 4));
    } catch (err) {
      console.error("Failed to load farmer dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadFarmerData();
    }
  }, [user, loadFarmerData]);

  const loadReviews = useCallback(async () => {
    if (!user) return;
    setLoadingReviews(true);
    try {
      const res = await fetchApi<{ content: any[] }>("/reviews/farmer?size=50");
      setReviews(res.data?.content || []);
    } catch (err) {
      console.warn("Could not load farmer reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  }, [user]);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this listing from the marketplace?")) return;
    try {
      await fetchApi(`/products/${productId}`, { method: "DELETE" });
      setInventory((prev) => prev.filter((p) => p.id !== productId));
    } catch (err: any) {
      alert(err.message || "Failed to delete listing.");
    }
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setEditForm({
      name: p.name,
      unitPrice: p.unitPrice,
      quantityAvailable: p.quantityAvailable,
      unit: p.unit,
      location: p.location,
      description: p.description || "",
    });
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSubmittingProduct(true);
    try {
      const payload = {
        name: editForm.name,
        categoryId: editingProduct.categoryId || categories[0]?.id,
        description: editForm.description,
        unitPrice: Number(editForm.unitPrice),
        unit: editForm.unit,
        quantityAvailable: Number(editForm.quantityAvailable),
        location: editForm.location,
        assayGrade: editingProduct.assayGrade || "Grade 1",
        moistureContent: editingProduct.moistureContent || "11.5%",
        purity: editingProduct.purity || "99.0%",
        harvestSeason: editingProduct.harvestSeason || "Meher Harvest 2026",
        storageWarehouse: editForm.location,
        cooperative: editingProduct.cooperative || "Bako & Nekemte Agro Cooperative",
        badge: editingProduct.badge || "Verified",
        imageUrls: editingProduct.imageUrls || [],
      };
      await fetchApi(`/products/${editingProduct.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setEditingProduct(null);
      loadFarmerData();
    } catch (err: any) {
      alert(err.message || "Failed to update listing.");
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleRejectOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalOrder) return;
    setUpdatingOrderId(rejectModalOrder.id);
    try {
      await fetchApi(`/orders/${rejectModalOrder.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "REJECTED",
          reason: rejectReason || "Rejected by producer due to harvest depletion or local transport constraint",
        }),
      });
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === rejectModalOrder.id ? { ...ord, status: "REJECTED" as any } : ord
        )
      );
      setRejectModalOrder(null);
      setRejectReason("");
    } catch (err: any) {
      alert(err.message || "Failed to decline order.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Auth Handler: Login
  const handleFarmerLogin = async (e: React.FormEvent) => {
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

      if (data.data.role !== "ROLE_FARMER") {
        throw new Error("This account is registered as " + data.data.role.replace("ROLE_", "") + ". Please login with a Farmer account, or register as a Farmer below.");
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

  // Auth Handler: Register
  const handleFarmerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...regData,
          role: "ROLE_FARMER",
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
      setAuthError(err.message || "Farmer registration failed");
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

  // Order status update handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await fetchApi(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      // Refresh local orders list
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus as any } : ord))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Create new produce listing handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProduct(true);
    try {
      const payload = {
        name: newProduce.name,
        categoryId: newProduce.categoryId,
        description: newProduce.description || `${newProduce.name} harvested in ${newProduce.harvestSeason}. Certified ${newProduce.assayGrade}.`,
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
        imageUrls: newProduce.imageUrl ? [newProduce.imageUrl] : [],
      };

      await fetchApi("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setShowAddModal(false);
      setNewProduce({
        name: "",
        categoryId: categories[0]?.id || "",
        unitPrice: 8500,
        unit: "Quintal (100kg)",
        quantityAvailable: 100,
        location: "Debre Birhan Mandi Terminal",
        assayGrade: "Grade 1 (99.2% Purity)",
        moistureContent: "11.5% Tested",
        purity: "99.0% Clean",
        harvestSeason: "Meher Harvest 2026",
        storageWarehouse: "Public Silo #3, North Shewa",
        cooperative: "Oda Gida Agricultural Union",
        badge: "Assay Certified",
        description: "",
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
      });

      // Reload data
      loadFarmerData();
    } catch (err: any) {
      alert(err.message || "Failed to create product listing.");
    } finally {
      setSubmittingProduct(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <RefreshCw className="h-7 w-7 text-amber-600 animate-spin" />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // 1. AUTH GATE: SHOW FARMER LOGIN / REGISTRATION IF NOT LOGGED IN
  // ══════════════════════════════════════════════════════════════
  if (!user) {
    return (
      <div className="min-h-[85vh] bg-gradient-to-b from-amber-50/50 via-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-emerald-600 text-white shadow-lg mb-3">
              <Tractor className="h-8 w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Farmer & Producer Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Direct marketplace access for verified growers, primary cooperative unions, and commercial agricultural producers.
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
              Sign In to Farmer Portal
            </button>
            <button
              onClick={() => { setAuthTab("register"); setAuthError(""); }}
              className={`flex-1 py-2.5 rounded-lg transition ${
                authTab === "register"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Register as New Producer
            </button>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* ── TAB: FARMER LOGIN ── */}
          {authTab === "login" && (
            <div className="bg-white p-7 sm:p-9 rounded-2xl border border-slate-200 shadow-sm">
              <form onSubmit={handleFarmerLogin} className="space-y-4">
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
                      placeholder="e.g. 0911000002 or farmer@agri.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                      <span>Enter Farmer Portal</span>
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
                    setAuthIdentifier("farmer@agri.com");
                    setAuthPassword("password");
                  }}
                  className="w-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  Fill Demo Farmer Account (farmer@agri.com)
                </button>
              </div>
            </div>
          )}

          {/* ── TAB: FARMER REGISTRATION ── */}
          {authTab === "register" && (
            <div className="bg-white p-7 sm:p-9 rounded-2xl border border-slate-200 shadow-sm">
              <form onSubmit={handleFarmerRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Farmer / Representative Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.fullName}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                    placeholder="e.g. Gemechu Desta"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500"
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
                      placeholder="0911234567"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500"
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
                      placeholder="grower@agri.com"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500"
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
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Farm Name / Cooperative Union
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.farmName}
                    onChange={(e) => setRegData({ ...regData, farmName: e.target.value })}
                    placeholder="e.g. Oda Gida Farmers Union"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Farm Location & Terminal Woreda
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.farmLocation}
                    onChange={(e) => setRegData({ ...regData, farmLocation: e.target.value })}
                    placeholder="e.g. Debre Birhan Mandi Terminal, North Shewa"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500"
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
                      <span>Complete Producer Registration</span>
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
  // 2. AUTHENTICATED: SHOW FULL FARMER DASHBOARD & CROP MANAGER
  // ══════════════════════════════════════════════════════════════
  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;
  const acceptedOrdersCount = orders.filter((o) => o.status === "ACCEPTED" || o.status === "READY").length;
  const completedRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "ALL") return true;
    return o.status === orderFilter;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-8">
        {/* ── TOP BANNER: FARMER IDENTITY ── */}
        <div className="bg-gradient-to-r from-amber-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>Verified Primary Cooperative Producer</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {user.fullName || "Producer"}&apos;s Farmer Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  {user.location || "Debre Birhan Mandi Terminal"}
                </span>
                <span>&bull;</span>
                <span className="text-amber-200">Phone: {user.phone || "0911000002"}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#d81b60] hover:bg-[#c2185b] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ List New Crop</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* ── METRIC STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Produce</span>
              <Boxes className="h-5 w-5 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {inventory.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Live commodity listings in registry</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Orders</span>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-600">
              {pendingOrdersCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Require acceptance or confirmation</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fulfillment In Progress</span>
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-700">
              {acceptedOrdersCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Accepted lots awaiting dispatch</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Gross</span>
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-700">
              {formatCurrency(completedRevenue)}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Settled volume without deductions</span>
          </div>
        </div>

        {/* ── PORTAL VIEW TABS ── */}
        <div className="flex items-center gap-4 border-b border-slate-200 mb-6 pb-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`font-bold text-sm pb-2 border-b-2 transition flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-[#1c4482] text-[#1c4482]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Incoming Buyer Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`font-bold text-sm pb-2 border-b-2 transition flex items-center gap-2 ${
              activeTab === "inventory"
                ? "border-[#1c4482] text-[#1c4482]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Boxes className="h-4 w-4" />
            <span>My Commodity Listings ({inventory.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("reviews");
              loadReviews();
            }}
            className={`font-bold text-sm pb-2 border-b-2 transition flex items-center gap-2 ${
              activeTab === "reviews"
                ? "border-[#1c4482] text-[#1c4482]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Star className="h-4 w-4 text-amber-500" />
            <span>Customer Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* VIEW 1: INCOMING ORDERS & ATOMIC FULFILLMENT */}
        {/* ═══════════════════════════════════════════════ */}
        {activeTab === "orders" && (
          <div className="space-y-5">
            {/* Filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
              {["ALL", "PENDING", "ACCEPTED", "READY", "COMPLETED", "CANCELLED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                    orderFilter === st
                      ? "bg-[#1c4482] text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <RefreshCw className="h-8 w-8 text-amber-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 mt-2">Loading incoming buyer orders from PostgreSQL...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <ShoppingBag className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Orders in this Status</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  When millers, exporters, or commercial buyers place spot orders on your produce listings, they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-blue-200 transition"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-slate-400">
                            #{ord.id.substring(0, 8)}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              ord.status === "PENDING"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : ord.status === "ACCEPTED"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : ord.status === "READY"
                                ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                                : ord.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">
                          Buyer: {ord.buyerName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Placed: {new Date(ord.createdAt).toLocaleString()} &bull; Preference: {ord.deliveryPreference || "Mandi Pickup"}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-500">Total Lot Settlement</span>
                        <div className="text-xl font-extrabold text-[#1c4482]">
                          {formatCurrency(ord.totalPrice)}
                        </div>
                      </div>
                    </div>

                    {/* Items table */}
                    <div className="py-4 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ordered Commodity Items:</span>
                      {ord.items && ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <div>
                            <span className="font-semibold text-slate-900">{item.productName}</span>
                            <span className="text-slate-500 ml-2">({item.quantity} {item.productUnit})</span>
                          </div>
                          <span className="font-bold text-slate-800">{formatCurrency(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Buyer Contact Disclosure Section */}
                    <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="h-4 w-4 text-[#1c4482]" />
                        {ord.status === "PENDING" ? (
                          <span className="text-slate-600">
                            <strong>Buyer Contact Phone:</strong> <span className="font-mono text-slate-400">0911****** (Protected)</span> &bull; <span className="text-[11px] text-amber-700">Accept this order to reveal direct phone.</span>
                          </span>
                        ) : (
                          <span className="text-slate-800">
                            <strong>Buyer Contact Disclosed:</strong> <span className="font-bold text-[#1c4482]">{ord.buyerPhone || "0911000003"}</span>
                          </span>
                        )}
                      </div>

                      {ord.status !== "PENDING" && ord.buyerPhone && (
                        <a
                          href={`tel:${ord.buyerPhone}`}
                          className="bg-[#1c4482] hover:bg-blue-900 text-white font-bold px-3 py-1 rounded text-xs transition"
                        >
                          Call Buyer
                        </a>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                      {ord.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => {
                              setRejectModalOrder(ord);
                              setRejectReason("");
                            }}
                            disabled={updatingOrderId === ord.id}
                            className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-xs font-bold transition"
                          >
                            Decline / Reject Order
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, "ACCEPTED")}
                            disabled={updatingOrderId === ord.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Accept & Reveal Phone
                          </button>
                        </>
                      )}

                      {ord.status === "ACCEPTED" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "READY")}
                          disabled={updatingOrderId === ord.id}
                          className="bg-[#1c4482] hover:bg-blue-900 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                        >
                          <Truck className="h-4 w-4" />
                          Mark Ready for Delivery / Pickup
                        </button>
                      )}

                      {ord.status === "READY" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "COMPLETED")}
                          disabled={updatingOrderId === ord.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark Fulfilled & Complete
                        </button>
                      )}

                      {ord.status === "COMPLETED" && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Transaction Fulfilled
                        </span>
                      )}

                      {ord.status === "REJECTED" && (
                        <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                          <XCircle className="h-4 w-4" /> Order Declined
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* VIEW 2: COMMODITY INVENTORY & LISTINGS */}
        {/* ═══════════════════════════════════════════════ */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Active Commodity Lots</h3>
                <p className="text-xs text-slate-500">
                  Products published directly to the national digital spot exchange and terminal catalog.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#1c4482] hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <PlusCircle className="h-4 w-4" />
                Add New Listing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {inventory.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition"
                >
                  <div className="h-40 bg-slate-100 relative">
                    <img
                      src={prod.imageUrls?.[0] || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {prod.categoryName || "Agricultural Commodity"}
                    </span>
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ${
                        prod.status === "ACTIVE"
                          ? "bg-emerald-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {prod.status}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{prod.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{prod.description}</p>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Price</span>
                        <span className="font-extrabold text-[#1c4482]">{formatCurrency(prod.unitPrice)}</span>
                        <span className="text-[10px] text-slate-500"> / {prod.unit}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Available Stock</span>
                        <span className="font-bold text-slate-800">{prod.quantityAvailable} {prod.unit}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg text-[11px] text-slate-600 space-y-0.5">
                      <div className="flex justify-between">
                        <span>Assay Grade:</span>
                        <span className="font-semibold text-slate-800">{prod.assayGrade || "Grade 1"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Warehouse:</span>
                        <span className="font-semibold text-slate-800">{prod.storageWarehouse || prod.location}</span>
                      </div>
                    </div>

                    {/* Low Stock Warning (FR-5.5) */}
                    {prod.quantityAvailable <= 10 && prod.quantityAvailable > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>Low Stock Alert (&le;10 remaining)</span>
                      </div>
                    )}

                    {prod.quantityAvailable === 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-md">
                        <XCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                        <span>Out of Stock (FR-5.3)</span>
                      </div>
                    )}

                    {/* Listing Edit & Delete Actions (FR-2.2) */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit Listing
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* VIEW 3: CUSTOMER REVIEWS (FR-6.1) */}
        {/* ═══════════════════════════════════════════════ */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">Buyer Reviews & Quality Ratings</h3>
              <p className="text-xs text-slate-500">
                Verified customer ratings and comments submitted by buyers after order completion.
              </p>
            </div>

            {loadingReviews ? (
              <div className="py-16 text-center">
                <RefreshCw className="h-8 w-8 text-amber-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 mt-2">Loading customer reviews from database...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <Star className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No Reviews Recorded Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  When commercial buyers complete their orders and confirm shipment quality, their verified reviews will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{rev.productName}</span>
                        <p className="text-[11px] text-slate-500">By {rev.buyerName} &bull; {new Date(rev.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-xs font-bold text-amber-800 border border-amber-200">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{rev.rating} / 5</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* ADD NEW COMMODITY LISTING MODAL */}
        {/* ═══════════════════════════════════════════════ */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-[#1c4482]" />
                  <h3 className="text-lg font-bold text-slate-900">Publish New Produce Listing</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Commodity Name</label>
                  <input
                    type="text"
                    required
                    value={newProduce.name}
                    onChange={(e) => setNewProduce({ ...newProduce, name: e.target.value })}
                    placeholder="e.g. Export Grade Pure White Teff (Magna)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#1c4482]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newProduce.categoryId}
                      onChange={(e) => setNewProduce({ ...newProduce, categoryId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#1c4482]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Unit of Measure</label>
                    <select
                      value={newProduce.unit}
                      onChange={(e) => setNewProduce({ ...newProduce, unit: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#1c4482]"
                    >
                      <option value="Quintal (100kg)">Quintal (100kg)</option>
                      <option value="Bag (60kg)">Bag (60kg)</option>
                      <option value="KG">Kilogram (KG)</option>
                      <option value="Metric Ton">Metric Ton</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Unit Price (ETB Birr)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProduce.unitPrice}
                      onChange={(e) => setNewProduce({ ...newProduce, unitPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#1c4482]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Available Quantity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProduce.quantityAvailable}
                      onChange={(e) => setNewProduce({ ...newProduce, quantityAvailable: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#1c4482]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assay Quality Grade</label>
                    <input
                      type="text"
                      value={newProduce.assayGrade}
                      onChange={(e) => setNewProduce({ ...newProduce, assayGrade: e.target.value })}
                      placeholder="e.g. Grade 1 (99.2% Purity)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Moisture Content</label>
                    <input
                      type="text"
                      value={newProduce.moistureContent}
                      onChange={(e) => setNewProduce({ ...newProduce, moistureContent: e.target.value })}
                      placeholder="e.g. 11.2% Tested"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Storage Warehouse / Mandi Depot</label>
                  <input
                    type="text"
                    required
                    value={newProduce.storageWarehouse}
                    onChange={(e) => setNewProduce({ ...newProduce, storageWarehouse: e.target.value })}
                    placeholder="e.g. Public Silo #3, Debre Birhan Logistics Zone"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Photo URL</label>
                  <input
                    type="url"
                    value={newProduce.imageUrl}
                    onChange={(e) => setNewProduce({ ...newProduce, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Listing Description</label>
                  <textarea
                    rows={3}
                    value={newProduce.description}
                    onChange={(e) => setNewProduce({ ...newProduce, description: e.target.value })}
                    placeholder="Details regarding harvest quality, processing, and batch specifications..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="bg-[#1c4482] hover:bg-blue-900 text-white font-bold px-6 py-2 rounded-xl text-sm shadow-sm transition flex items-center gap-1.5"
                  >
                    {submittingProduct ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <span>Publish Commodity Listing</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* EDIT COMMODITY LISTING MODAL (FR-2.2) */}
        {/* ═══════════════════════════════════════════════ */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-[#1c4482]" />
                  <h3 className="text-lg font-bold text-slate-900">Edit Listing: {editingProduct.name}</h3>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Commodity Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price / Unit (ETB)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editForm.unitPrice}
                      onChange={(e) => setEditForm({ ...editForm, unitPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Available Quantity</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editForm.quantityAvailable}
                      onChange={(e) => setEditForm({ ...editForm, quantityAvailable: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Warehouse / Woreda Location</label>
                  <input
                    type="text"
                    required
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="bg-[#1c4482] hover:bg-blue-900 text-white font-bold px-6 py-2 rounded-xl text-sm shadow-sm transition flex items-center gap-1.5"
                  >
                    {submittingProduct ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* REJECT ORDER WITH REASON MODAL (UC-05) */}
        {/* ═══════════════════════════════════════════════ */}
        {rejectModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="text-base font-bold text-slate-900">Decline Buyer Order</h3>
                </div>
                <button
                  onClick={() => setRejectModalOrder(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <p className="text-xs text-slate-600 mb-3">
                Order <strong>#{rejectModalOrder.id.slice(0, 8)}</strong> from <strong>{rejectModalOrder.buyerName}</strong> ({formatCurrency(rejectModalOrder.totalPrice)}).
                Stock will remain in inventory and the buyer will be notified with your stated reason.
              </p>

              <form onSubmit={handleRejectOrder} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Rejection</label>
                  <textarea
                    rows={3}
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Lot reserved for local cooperative seed bank, or temporary dispatch truck breakdown..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRejectModalOrder(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg text-xs shadow-sm transition"
                  >
                    Confirm Rejection
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
