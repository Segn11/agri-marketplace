"use client";

import { useState } from "react";
import { PlusCircle, Package, ShoppingBag, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState<"listings" | "orders">("orders");

  // Sample incoming orders matching SRS flow (Pending, Accepted, Ready, Completed)
  const [orders, setOrders] = useState([
    {
      id: "ord-101",
      productName: "Premium White Teff (Magna)",
      buyerName: "Oromia Hotel Restaurant",
      buyerPhone: "0917654321", // revealed after acceptance
      quantity: 5,
      unit: "Quintal",
      totalPrice: 47500,
      deliveryPreference: "FARMER_DELIVERY",
      status: "PENDING",
      createdAt: "2026-10-18",
    },
    {
      id: "ord-102",
      productName: "Fresh Red Onions",
      buyerName: "Nekemte General Wholesaler",
      buyerPhone: "0923456789",
      quantity: 300,
      unit: "KG",
      totalPrice: 25500,
      deliveryPreference: "PICKUP",
      status: "ACCEPTED",
      createdAt: "2026-10-17",
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Farmer Management Hub</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your crop listings, inventory, and respond to incoming buyer orders.
          </p>
        </div>
        <Button size="md" className="sm:self-start">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Produce Listing
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-green-100 text-green-800 flex items-center justify-center">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-sm text-gray-500">Active Listings</span>
            <p className="text-2xl font-bold text-gray-900">4 Products</p>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-sm text-gray-500">Pending Orders</span>
            <p className="text-2xl font-bold text-gray-900">1 Awaiting Action</p>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <span className="text-sm text-gray-500">Total Fulfilled Orders</span>
            <p className="text-2xl font-bold text-gray-900">18 Orders</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 text-sm font-semibold border-b-2 mr-8 transition ${
            activeTab === "orders"
              ? "border-green-700 text-green-800"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Incoming Buyer Orders
        </button>
        <button
          onClick={() => setActiveTab("listings")}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${
            activeTab === "listings"
              ? "border-green-700 text-green-800"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          My Crop Inventory
        </button>
      </div>

      {/* Orders List */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {orders.map((ord) => (
              <div key={ord.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900 text-lg">{ord.productName}</h3>
                    <Badge variant={ord.status === "PENDING" ? "warning" : "success"}>
                      {ord.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Buyer: <strong>{ord.buyerName}</strong> &bull; Quantity: <strong>{ord.quantity} {ord.unit}</strong> &bull; Total: <strong>{formatCurrency(ord.totalPrice)}</strong>
                  </p>
                  {ord.status !== "PENDING" && (
                    <p className="text-xs text-green-800 font-medium mt-1">
                      Buyer Phone (Direct contact revealed): <strong>{ord.buyerPhone}</strong>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {ord.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(ord.id, "ACCEPTED")}
                        className="bg-green-700 hover:bg-green-800"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Accept Order
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(ord.id, "REJECTED")}
                        className="text-red-700 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}

                  {ord.status === "ACCEPTED" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(ord.id, "READY")}
                      variant="secondary"
                    >
                      Mark Ready for Delivery/Pickup
                    </Button>
                  )}

                  {ord.status === "READY" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(ord.id, "COMPLETED")}
                      className="bg-green-700 hover:bg-green-800"
                    >
                      Complete Order
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === "listings" && (
        <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 text-sm">All crop stocks and listings are actively synchronized with PostgreSQL.</p>
        </div>
      )}
    </div>
  );
}
