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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-3xl shadow-soft mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Producer Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Farmer Harvest Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your crop listings, track atomic inventory, and review incoming buyer orders.
          </p>
        </div>

        <Button size="lg" className="bg-brand-700 hover:bg-brand-800 text-white font-semibold shadow-glow-sm">
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Produce Listing
        </Button>
      </div>

      {/* Modern KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Listings</span>
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">2 Active</p>
          <span className="text-xs font-medium text-brand-700 flex items-center mt-1">
            <TrendingUp className="h-3.5 w-3.5 mr-1" /> Ready for immediate orders
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Orders</span>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">1 New Order</p>
          <span className="text-xs font-medium text-amber-700 flex items-center mt-1">
            Action required: Accept or Reject
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trade Revenue</span>
            <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{formatCurrency(93500)}</p>
          <span className="text-xs font-medium text-slate-500 mt-1 block">
            Across 3 orders fulfilled
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 mb-6 gap-8">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === "orders"
              ? "border-brand-700 text-brand-800"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Incoming Buyer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("listings")}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === "listings"
              ? "border-brand-700 text-brand-800"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          My Harvest Inventory ({listings.length})
        </button>
      </div>

      {/* Tab: Orders */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{ord.productName}</h3>
                  <span
                    className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                      ord.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : ord.status === "ACCEPTED"
                        ? "bg-brand-100 text-brand-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Buyer: <strong className="text-slate-900">{ord.buyerName}</strong> &bull; Quantity:{" "}
                  <strong>{ord.quantity} {ord.unit}</strong> &bull; Delivery:{" "}
                  <span className="font-semibold text-slate-700">{ord.deliveryPreference}</span>
                </p>

                {ord.status !== "PENDING" ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-200/70 text-brand-900 text-xs font-semibold">
                    <PhoneCall className="h-3.5 w-3.5 text-brand-600" />
                    <span>Direct Buyer Phone Revealed: <strong>{ord.buyerPhone}</strong></span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    Buyer phone number will be revealed automatically once you accept this order.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                <div className="text-left lg:text-right">
                  <span className="text-xs text-slate-400 block font-medium">Order Total</span>
                  <span className="text-xl font-black text-brand-700">{formatCurrency(ord.totalPrice)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {ord.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(ord.id, "ACCEPTED")}
                        className="bg-brand-700 hover:bg-brand-800 text-white font-semibold"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Accept Order
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(ord.id, "REJECTED")}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Reject
                      </Button>
                    </>
                  )}

                  {ord.status === "ACCEPTED" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(ord.id, "READY")}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                    >
                      Mark Ready For Pickup
                    </Button>
                  )}

                  {ord.status === "READY" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(ord.id, "COMPLETED")}
                      className="bg-brand-700 hover:bg-brand-800 text-white font-semibold"
                    >
                      Complete Handover
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Listings */}
      {activeTab === "listings" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Produce Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4">Available Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4 font-bold text-brand-700">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{item.quantityAvailable} {item.unit}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === "ACTIVE"
                          ? "bg-brand-100 text-brand-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-brand-700 hover:underline">
                      Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
