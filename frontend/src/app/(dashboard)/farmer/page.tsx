"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  PhoneCall,
  TrendingUp,
  AlertCircle,
  SlidersHorizontal,
  ChevronRight,
  Boxes,
  ShieldCheck,
  Building2,
  Award,
  Edit2,
  Trash2,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getStoredProducts, saveProduct, deleteStoredProduct } from "@/lib/commodities";
import { Product } from "@/types";

export default function AgriFarmerDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "inventory">("inventory");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [inventory, setInventory] = useState<Product[]>([]);

  const [orders, setOrders] = useState([
    {
      id: "ord-101",
      productName: "Export Grade Pure White Teff (Magna)",
      buyerName: "Apex Commercial Milling PLC",
      buyerPhone: "0917654321",
      buyerLocation: "National Grain Logistics Depot",
      quantity: 5,
      unit: "Quintal",
      totalPrice: 47000,
      deliveryPreference: "Mandi Pickup",
      status: "PENDING",
      createdAt: "Today, 10:30 AM",
      assayGrade: "Grade 1 (99.2% Purity)",
    },
    {
      id: "ord-102",
      productName: "Fresh Red Bombay Cooking Onions",
      buyerName: "Highland Retail Supply Chain",
      buyerPhone: "0923456789",
      buyerLocation: "Regional Mandi Warehouse #4",
      quantity: 300,
      unit: "KG",
      totalPrice: 25500,
      deliveryPreference: "Cooperative Freight",
      status: "ACCEPTED",
      createdAt: "Yesterday, 4:15 PM",
      assayGrade: "Export Quality Grade 1",
    },
    {
      id: "ord-103",
      productName: "Sidama Washed Specialty Green Coffee Beans",
      buyerName: "Blue Nile Specialty Roasters",
      buyerPhone: "0934567890",
      buyerLocation: "Airport Cargo Logistics Zone",
      quantity: 2,
      unit: "Bag (60kg)",
      totalPrice: 57000,
      deliveryPreference: "Mandi Pickup",
      status: "READY",
      createdAt: "Oct 15, 2026",
      assayGrade: "Q1 Specialty Grade",
    },
  ]);

  const [newProduce, setNewProduce] = useState({
    name: "",
    category: "Cereals & Grains",
    categoryId: "cereals-grains",
    unit: "Quintal (100kg)",
    unitPrice: 5000,
    quantityAvailable: 100,
    minOrderQuantity: 2,
    location: "Debre Birhan Mandi Terminal",
    assayGrade: "Grade 1 (99.0% Purity)",
    moistureContent: "11.5% Tested",
    purity: "99.0% Clean",
    harvestSeason: "Main Season 2026",
    description: "",
  });

  useEffect(() => {
    setInventory(getStoredProducts());
  }, []);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleAddProduce = (e: React.FormEvent) => {
    e.preventDefault();
    const createdProduct: Product = {
      id: `prod-${Date.now()}`,
      farmerId: "current-user",
      farmerName: "Gemechu Desta",
      cooperative: "Oda Gida Agricultural Farmers Union",
      farmerPhone: "0911876543",
      categoryId: newProduce.categoryId,
      categoryName: newProduce.category,
      name: newProduce.name,
      description: newProduce.description || `${newProduce.name} harvested and processed under certified quality standards.`,
      unitPrice: newProduce.unitPrice,
      unit: newProduce.unit,
      quantityAvailable: newProduce.quantityAvailable,
      minOrderQuantity: newProduce.minOrderQuantity,
      location: newProduce.location,
      assayGrade: newProduce.assayGrade,
      moistureContent: newProduce.moistureContent,
      purity: newProduce.purity,
      harvestSeason: newProduce.harvestSeason,
      storageWarehouse: "Central Mandi Silo Bay",
      badge: "Producer Spot Lot",
      status: "ACTIVE",
      imageUrls: [],
      averageRating: 5.0,
      totalReviews: 1,
      createdAt: new Date().toISOString(),
    };

    saveProduct(createdProduct);
    setInventory((prev) => [createdProduct, ...prev]);
    setShowAddModal(false);
    setNewProduce({
      name: "",
      category: "Cereals & Grains",
      categoryId: "cereals-grains",
      unit: "Quintal (100kg)",
      unitPrice: 5000,
      quantityAvailable: 100,
      minOrderQuantity: 2,
      location: "Debre Birhan Mandi Terminal",
      assayGrade: "Grade 1 (99.0% Purity)",
      moistureContent: "11.5% Tested",
      purity: "99.0% Clean",
      harvestSeason: "Main Season 2026",
      description: "",
    });
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    saveProduct(editingProduct);
    setInventory((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    setEditingProduct(null);
  };

  const handleToggleStatus = (p: Product) => {
    const updated: Product = {
      ...p,
      status: p.status === "ACTIVE" ? "OUT_OF_STOCK" : "ACTIVE",
    };
    saveProduct(updated);
    setInventory((prev) =>
      prev.map((item) => (item.id === p.id ? updated : item))
    );
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to remove this commodity listing from the exchange?")) {
      deleteStoredProduct(id);
      setInventory((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const totalTonnage = inventory.reduce((sum, item) => sum + item.quantityAvailable, 0);

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
              <Boxes className="h-3.5 w-3.5 text-amber-400" />
              <span>Agri Marketplace Producer & Cooperative Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Seller Dashboard & Inventory Management
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Publish standardized commodity lots, manage silo inventory & rates in real-time, approve corporate orders, and initiate logistics handovers.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-brand px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md self-start md:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            Add Produce Listing
          </button>
        </div>

        {/* ── KPI STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
          <div className="agri-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Commodity Lots</span>
              <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-3">{inventory.length} Lots</p>
            <span className="text-xs font-semibold text-teal-700 flex items-center mt-1">
              <TrendingUp className="h-3.5 w-3.5 mr-1" /> Live on Commodity Board
            </span>
          </div>

          <div className="agri-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Available Stock Volume</span>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Boxes className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-3">{totalTonnage.toLocaleString()} Units</p>
            <span className="text-xs font-semibold text-emerald-700 flex items-center mt-1">
              Locked in Certified Silos
            </span>
          </div>

          <div className="agri-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Orders</span>
              <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-3">{orders.filter(o => o.status === "PENDING").length} Awaiting</p>
            <span className="text-xs font-semibold text-amber-700 flex items-center mt-1">
              Requires Farmer Action
            </span>
          </div>

          <div className="agri-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Escrow Settled Revenue</span>
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-3">{formatCurrency(129500)}</p>
            <span className="text-xs font-medium text-slate-400 mt-1 block">
              100% Escrow Transferred
            </span>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === "inventory"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Product & Inventory Management ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === "orders"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Incoming Buyer Purchase Orders ({orders.length})
          </button>
        </div>

        {/* ── TAB: INVENTORY MANAGEMENT ── */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Agricultural Produce Listings</h3>
                <p className="text-xs text-slate-500">
                  Update spot rates, replenish stock levels, or pause listings during harvest storage.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-brand px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Add New Lot
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Commodity Lot</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Spot Rate</th>
                    <th className="px-6 py-4">Available Stock</th>
                    <th className="px-6 py-4">Assay Grade</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <strong className="text-slate-900 block">{item.name}</strong>
                        <span className="text-[10px] text-slate-400">{item.location}</span>
                      </td>
                      <td className="px-6 py-4 font-medium">{item.categoryName}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {formatCurrency(item.unitPrice)}/{item.unit}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-800">
                        {item.quantityAvailable} {item.unit}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {item.assayGrade || "Grade 1"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded cursor-pointer transition ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {item.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingProduct(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition"
                          title="Edit Stock & Price"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: ORDERS ── */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="agri-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900">{ord.productName}</h3>
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded ${
                        ord.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : ord.status === "READY"
                          ? "bg-amber-100 text-amber-800"
                          : ord.status === "ACCEPTED"
                          ? "bg-blue-100 text-blue-800"
                          : ord.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {ord.status}
                    </span>
                    <span className="text-xs text-slate-400">&bull; {ord.createdAt}</span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Buyer Entity: <strong className="text-slate-900">{ord.buyerName}</strong> &bull;{" "}
                    Quantity: <strong>{ord.quantity} {ord.unit}</strong> &bull; Delivery Mode:{" "}
                    <strong>{ord.deliveryPreference}</strong>
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Award className="h-3.5 w-3.5 text-emerald-600" />
                    <span>QC Assay Certified: <strong className="text-slate-700">{ord.assayGrade}</strong></span>
                  </div>

                  {ord.status !== "PENDING" && ord.status !== "REJECTED" ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                      <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Buyer Logistics Contact: <strong>{ord.buyerPhone}</strong></span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      Buyer contact line will be revealed immediately upon accepting this purchase order.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Settlement Value</span>
                    <span className="text-2xl font-black text-slate-900">{formatCurrency(ord.totalPrice)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ord.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "ACCEPTED")}
                          className="btn-brand text-xs px-4 py-2.5 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Accept Trade Order
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "REJECTED")}
                          className="px-3 py-2 rounded-lg text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {ord.status === "ACCEPTED" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, "READY")}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition"
                      >
                        Mark Ready for Dispatch
                      </button>
                    )}

                    {ord.status === "READY" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, "COMPLETED")}
                        className="btn-brand text-xs px-4 py-2.5 rounded-lg font-semibold"
                      >
                        Complete Physical Handover
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ADD PRODUCE MODAL ── */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
              <div className="h-1.5 w-full bg-teal-600" />
              <div className="p-7 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Create New Produce Listing</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleAddProduce} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Commodity Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduce.name}
                      onChange={(e) => setNewProduce({ ...newProduce, name: e.target.value })}
                      placeholder="e.g. Export Grade Pure White Teff (Magna)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newProduce.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          const slugMap: Record<string, string> = {
                            "Cereals & Grains": "cereals-grains",
                            "Vegetables": "vegetables",
                            "Fruits & Orchards": "fruits",
                            "Coffee & Spices": "coffee-spices",
                            "Pulses & Seeds": "pulses-oilseeds",
                          };
                          setNewProduce({ ...newProduce, category: val, categoryId: slugMap[val] || "cereals-grains" });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="Cereals & Grains">Cereals & Grains</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits & Orchards">Fruits & Orchards</option>
                        <option value="Coffee & Spices">Coffee & Spices</option>
                        <option value="Pulses & Seeds">Pulses & Seeds</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Unit
                      </label>
                      <select
                        value={newProduce.unit}
                        onChange={(e) => setNewProduce({ ...newProduce, unit: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="Quintal (100kg)">Quintal (100kg)</option>
                        <option value="KG">KG</option>
                        <option value="Bag (60kg)">Bag (60kg Jute)</option>
                        <option value="Liter">Liter</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Spot Unit Price (ETB)
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newProduce.unitPrice}
                        onChange={(e) => setNewProduce({ ...newProduce, unitPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Available Stock
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newProduce.quantityAvailable}
                        onChange={(e) => setNewProduce({ ...newProduce, quantityAvailable: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Mandi Location / Terminal
                      </label>
                      <input
                        type="text"
                        required
                        value={newProduce.location}
                        onChange={(e) => setNewProduce({ ...newProduce, location: e.target.value })}
                        placeholder="e.g. Debre Birhan Mandi Terminal"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Assay Certification Grade
                      </label>
                      <input
                        type="text"
                        value={newProduce.assayGrade}
                        onChange={(e) => setNewProduce({ ...newProduce, assayGrade: e.target.value })}
                        placeholder="e.g. Grade 1 (99.2% Purity)"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Commodity Specifications / Description
                    </label>
                    <textarea
                      rows={2}
                      value={newProduce.description}
                      onChange={(e) => setNewProduce({ ...newProduce, description: e.target.value })}
                      placeholder="Describe seed purity, moisture percentage, and sorting methods..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-brand py-3 rounded-xl text-sm font-semibold shadow-sm mt-3"
                  >
                    Publish to Agri Marketplace
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── EDIT PRODUCE MODAL ── */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border border-slate-200 overflow-hidden">
              <div className="h-1.5 w-full bg-teal-600" />
              <div className="p-7">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Update Stock & Pricing</h3>
                  <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Commodity
                    </label>
                    <input
                      type="text"
                      disabled
                      value={editingProduct.name}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Spot Rate per Unit (ETB)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={editingProduct.unitPrice}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, unitPrice: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Available Stock ({editingProduct.unit})
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.quantityAvailable}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          quantityAvailable: Number(e.target.value),
                          status: Number(e.target.value) > 0 ? "ACTIVE" : "OUT_OF_STOCK",
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 btn-brand py-2.5 rounded-xl font-bold shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
