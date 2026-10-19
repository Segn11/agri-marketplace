"use client";

import { useState } from "react";
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
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AgriFarmerDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "listings">("orders");

  const [orders, setOrders] = useState([
    {
      id: "ord-101",
      productName: "Premium White Teff (Magna)",
      buyerName: "Apex Commercial Milling PLC",
      buyerPhone: "0917654321", // revealed after acceptance
      buyerLocation: "National Grain Logistics Depot",
      quantity: 5,
      unit: "Quintal",
      totalPrice: 47000,
      deliveryPreference: "FARMER_DELIVERY",
      status: "PENDING",
      createdAt: "Today, 10:30 AM",
      assayGrade: "Grade 1 (99.2% Purity)",
    },
    {
      id: "ord-102",
      productName: "Fresh Red Cooking Onions",
      buyerName: "Highland Retail Supply Chain",
      buyerPhone: "0923456789",
      buyerLocation: "Regional Mandi Warehouse #4",
      quantity: 300,
      unit: "KG",
      totalPrice: 25500,
      deliveryPreference: "PICKUP",
      status: "ACCEPTED",
      createdAt: "Yesterday, 4:15 PM",
      assayGrade: "Export Quality",
    },
    {
      id: "ord-103",
      productName: "Organic Forest Coffee",
      buyerName: "Blue Nile Specialty Roasters",
      buyerPhone: "0934567890",
      buyerLocation: "Airport Cargo Logistics Zone",
      quantity: 50,
      unit: "KG",
      totalPrice: 21000,
      deliveryPreference: "PICKUP",
      status: "COMPLETED",
      createdAt: "3 days ago",
      assayGrade: "Specialty Grade 1",
    },
  ]);

  const [listings, setListings] = useState([
    {
      id: "l1",
      name: "Premium White Teff (Magna)",
      category: "Cereals & Grains",
      quantityAvailable: 45,
      unit: "Quintal",
      unitPrice: 9400,
      assayGrade: "Grade 1",
      status: "ACTIVE",
    },
    {
      id: "l2",
      name: "Fresh Red Cooking Onions",
      category: "Vegetables",
      quantityAvailable: 1200,
      unit: "KG",
      unitPrice: 85,
      assayGrade: "QC Passed",
      status: "ACTIVE",
    },
    {
      id: "l3",
      name: "Highland Sun-Dried Coffee",
      category: "Coffee & Spices",
      quantityAvailable: 0,
      unit: "KG",
      unitPrice: 420,
      assayGrade: "Export Grade",
      status: "OUT_OF_STOCK",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduce, setNewProduce] = useState({
    name: "",
    category: "Cereals & Grains",
    unitPrice: 100,
    quantityAvailable: 50,
    unit: "KG",
  });

  const handleAddProduce = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: "l-" + Date.now(),
      name: newProduce.name,
      category: newProduce.category,
      quantityAvailable: Number(newProduce.quantityAvailable),
      unit: newProduce.unit,
      unitPrice: Number(newProduce.unitPrice),
      assayGrade: "Self-Certified Standard",
      status: "ACTIVE",
    };
    setListings([created, ...listings]);
    setShowAddModal(false);
    setNewProduce({ name: "", category: "Cereals & Grains", unitPrice: 100, quantityAvailable: 50, unit: "KG" });
    setActiveTab("listings");
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-8">
        {/* ── TOP BANNER ── */}
        <div
          className="text-white p-8 sm:p-10 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, #041d1c 0%, #073330 50%, #0a4843 100%)' }}
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-900/80 text-teal-200 border border-teal-500/30 px-3 py-1 rounded text-xs font-semibold mb-3">
              <Boxes className="h-3.5 w-3.5 text-amber-400" />
              <span>AgriMarket Producer & Cooperative Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Farmer Trade & Stock Dashboard
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Manage your agricultural commodity listings, approve incoming institutional purchase orders, and release lots upon AgriMarket escrow confirmation.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-brand px-6 py-3 rounded text-sm font-semibold flex items-center justify-center gap-2 shadow-md self-start md:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            Create Produce Listing
          </button>
        </div>

        {/* ── KPI STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="agri-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Listings</span>
              <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-3">2 Active Lots</p>
            <span className="text-xs font-semibold text-teal-700 flex items-center mt-1">
              <TrendingUp className="h-3.5 w-3.5 mr-1" /> Live on AgriMarket Board
            </span>
          </div>

          <div className="agri-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Orders</span>
              <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-3">1 Pending Order</p>
            <span className="text-xs font-semibold text-amber-700 flex items-center mt-1">
              Requires Seller Acceptance
            </span>
          </div>

          <div className="agri-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Escrow Settled Revenue</span>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-3">{formatCurrency(93500)}</p>
            <span className="text-xs font-medium text-slate-400 mt-1 block">
              100% Escrow Released
            </span>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === "orders"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Incoming Buyer Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === "listings"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            My Commodity Inventory ({listings.length})
          </button>
        </div>

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
                        ord.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : ord.status === "ACCEPTED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Buyer: <strong className="text-slate-900">{ord.buyerName}</strong> &bull; Quantity:{" "}
                    <strong>{ord.quantity} {ord.unit}</strong> &bull; Delivery:{" "}
                    <span className="font-semibold text-slate-800">{ord.deliveryPreference}</span>
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Award className="h-3.5 w-3.5 text-emerald-600" />
                    <span>QC Assay: {ord.assayGrade}</span>
                  </div>

                  {ord.status !== "PENDING" ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                      <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Direct Buyer Phone: <strong>{ord.buyerPhone}</strong></span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      Buyer contact will be disclosed immediately upon order acceptance.
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
                          onClick={() => handleUpdateStatus(ord.id, "ACCEPTED")}
                          className="btn-brand text-xs px-4 py-2.5 rounded font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Accept Trade
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, "REJECTED")}
                          className="px-3 py-2 rounded text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {ord.status === "ACCEPTED" && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, "READY")}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded transition"
                      >
                        Mark Ready For Pickup
                      </button>
                    )}

                    {ord.status === "READY" && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, "COMPLETED")}
                        className="btn-brand text-xs px-4 py-2.5 rounded font-semibold"
                      >
                        Complete Handover
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: LISTINGS ── */}
        {activeTab === "listings" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Commodity</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Rate</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Assay Grade</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {listings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                      <td className="px-6 py-4">{item.category}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-6 py-4 font-semibold">{item.quantityAvailable} {item.unit}</td>
                      <td className="px-6 py-4 text-emerald-700 font-semibold">{item.assayGrade}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-bold text-teal-700 hover:underline">
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ADD PRODUCE MODAL ── */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative border border-slate-200 overflow-hidden">
              <div className="h-1.5 w-full bg-teal-600" />
              <div className="p-7">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">List Commodity Lot</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleAddProduce} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Commodity Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduce.name}
                      onChange={(e) => setNewProduce({ ...newProduce, name: e.target.value })}
                      placeholder="e.g. Export White Sesame"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newProduce.category}
                        onChange={(e) => setNewProduce({ ...newProduce, category: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="Cereals & Grains">Cereals & Grains</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits & Orchards">Fruits & Orchards</option>
                        <option value="Coffee & Spices">Coffee & Spices</option>
                        <option value="Pulses & Seeds">Pulses & Seeds</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Unit
                      </label>
                      <select
                        value={newProduce.unit}
                        onChange={(e) => setNewProduce({ ...newProduce, unit: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="KG">KG</option>
                        <option value="Quintal">Quintal (100kg)</option>
                        <option value="Liter">Liter</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Unit Price (ETB)
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newProduce.unitPrice}
                        onChange={(e) => setNewProduce({ ...newProduce, unitPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Available Stock
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newProduce.quantityAvailable}
                        onChange={(e) => setNewProduce({ ...newProduce, quantityAvailable: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-brand py-2.5 rounded text-sm font-semibold shadow-sm mt-2"
                  >
                    Publish to AgriMarket Exchange
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
