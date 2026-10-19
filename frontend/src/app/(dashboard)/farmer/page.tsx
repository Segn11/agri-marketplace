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
  ArrowUpRight,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "listings">("orders");

  const [orders, setOrders] = useState([
    {
      id: "ord-101",
      productName: "Premium White Teff (Magna)",
      buyerName: "Oromia Commercial Kitchens",
      buyerPhone: "0917654321", // revealed after acceptance
      buyerLocation: "Capital Distribution Center",
      quantity: 5,
      unit: "Quintal",
      totalPrice: 47000,
      deliveryPreference: "FARMER_DELIVERY",
      status: "PENDING",
      createdAt: "Today, 10:30 AM",
    },
    {
      id: "ord-102",
      productName: "Fresh Red Cooking Onions",
      buyerName: "Highland Supermarket Chain",
      buyerPhone: "0923456789",
      buyerLocation: "Regional Market Depot",
      quantity: 300,
      unit: "KG",
      totalPrice: 25500,
      deliveryPreference: "PICKUP",
      status: "ACCEPTED",
      createdAt: "Yesterday, 4:15 PM",
    },
    {
      id: "ord-103",
      productName: "Organic Forest Coffee",
      buyerName: "Blue Nile Export & Roasters",
      buyerPhone: "0934567890",
      buyerLocation: "Airport Logistics Zone",
      quantity: 50,
      unit: "KG",
      totalPrice: 21000,
      deliveryPreference: "PICKUP",
      status: "COMPLETED",
      createdAt: "3 days ago",
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
      status: "ACTIVE",
    },
    {
      id: "l2",
      name: "Fresh Red Cooking Onions",
      category: "Vegetables",
      quantityAvailable: 1200,
      unit: "KG",
      unitPrice: 85,
      status: "ACTIVE",
    },
    {
      id: "l3",
      name: "Highland Sun-Dried Coffee",
      category: "Coffee & Spices",
      quantityAvailable: 0,
      unit: "KG",
      unitPrice: 420,
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-soft mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-brand-300/20 via-emerald-200/10 to-transparent rounded-bl-full pointer-events-none -z-10" />

        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60 mb-3">
            <Boxes className="h-3.5 w-3.5" /> Producer Management Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Farmer Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Control your live stock inventory, accept incoming buyer requests, and access direct buyer contact details upon confirmation.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary-gradient text-white font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 self-start md:self-auto shadow-glow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Add Produce Listing
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Listings</span>
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">2 Active</p>
          <span className="text-xs font-semibold text-brand-700 flex items-center mt-1.5">
            <TrendingUp className="h-3.5 w-3.5 mr-1" /> Live on public marketplace
          </span>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Orders</span>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">1 New Order</p>
          <span className="text-xs font-semibold text-amber-700 flex items-center mt-1.5">
            Requires your acceptance
          </span>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Fulfilled Value</span>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{formatCurrency(93500)}</p>
          <span className="text-xs font-medium text-slate-400 mt-1.5 block">
            Across 3 settled transactions
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/70 max-w-fit">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "orders"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Incoming Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "listings"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          My Crop Inventory ({listings.length})
        </button>
      </div>

      {/* Tab Content: Orders */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="produce-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{ord.productName}</h3>
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                      ord.status === "PENDING"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : ord.status === "ACCEPTED"
                        ? "bg-brand-50 text-brand-800 border border-brand-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Buyer: <strong className="text-slate-800">{ord.buyerName}</strong> &bull; Quantity:{" "}
                  <strong className="text-slate-800">{ord.quantity} {ord.unit}</strong> &bull; Delivery:{" "}
                  <span className="font-semibold text-slate-700">{ord.deliveryPreference}</span>
                </p>

                {ord.status !== "PENDING" ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-200/70 text-brand-900 text-xs font-semibold">
                    <PhoneCall className="h-3.5 w-3.5 text-brand-600" />
                    <span>Direct Buyer Phone: <strong>{ord.buyerPhone}</strong></span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    Direct buyer contact will be revealed immediately upon order acceptance.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-4 lg:pt-0">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total</span>
                  <span className="text-2xl font-black text-brand-700">{formatCurrency(ord.totalPrice)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {ord.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(ord.id, "ACCEPTED")}
                        className="btn-primary-gradient text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Accept Order
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(ord.id, "REJECTED")}
                        className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  {ord.status === "ACCEPTED" && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "READY")}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                    >
                      Mark Ready For Handover
                    </button>
                  )}

                  {ord.status === "READY" && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "COMPLETED")}
                      className="btn-primary-gradient text-white text-xs font-semibold px-4 py-2.5 rounded-xl"
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

      {/* Tab Content: Listings */}
      {activeTab === "listings" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Produce Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4">Available Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4 font-bold text-brand-700">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{item.quantityAvailable} {item.unit}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                          item.status === "ACTIVE"
                            ? "bg-brand-50 text-brand-800 border border-brand-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-brand-700 hover:text-brand-800 transition">
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

      {/* Add Produce Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative border border-slate-100 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400" />
            <div className="p-7 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[10px] font-bold text-brand-700 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                    New Farm Listing
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">Add Produce Listing</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddProduce} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Crop / Produce Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduce.name}
                    onChange={(e) => setNewProduce({ ...newProduce, name: e.target.value })}
                    placeholder="e.g. Organic Red Teff"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newProduce.category}
                      onChange={(e) => setNewProduce({ ...newProduce, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                      Measurement Unit
                    </label>
                    <select
                      value={newProduce.unit}
                      onChange={(e) => setNewProduce({ ...newProduce, unit: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="KG">KG (Kilogram)</option>
                      <option value="Quintal">Quintal (100 KG)</option>
                      <option value="Liter">Liter</option>
                      <option value="Box">Crate / Box</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Initial Stock Quantity
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newProduce.quantityAvailable}
                      onChange={(e) => setNewProduce({ ...newProduce, quantityAvailable: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 btn-primary-gradient text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-glow-sm"
                >
                  Publish Listing to Marketplace
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
