"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Star, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([
    {
      id: "ord-201",
      productName: "Premium White Teff (Magna)",
      farmerName: "Gemechu Desta",
      farmerPhone: "0911876543", // revealed once accepted (FR-4.7)
      quantity: 2,
      unit: "Quintal",
      totalPrice: 19000,
      deliveryPreference: "PICKUP",
      status: "ACCEPTED",
      createdAt: "2026-10-18",
      hasReviewed: false,
    },
    {
      id: "ord-202",
      productName: "Organic Forest Coffee",
      farmerName: "Tigist Bekele",
      farmerPhone: "0912345678",
      quantity: 10,
      unit: "KG",
      totalPrice: 4200,
      deliveryPreference: "FARMER_DELIVERY",
      status: "COMPLETED",
      createdAt: "2026-10-10",
      hasReviewed: false,
    },
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Buyer Order Center</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your produce purchases, contact farmers upon order acceptance, and review completed orders.
          </p>
        </div>
        <Link href="/products">
          <Button size="md">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {orders.map((ord) => (
            <div key={ord.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-900 text-lg">{ord.productName}</h3>
                  <Badge variant={ord.status === "COMPLETED" ? "success" : "secondary"}>
                    {ord.status}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  Farmer: <strong>{ord.farmerName}</strong> &bull; Quantity: <strong>{ord.quantity} {ord.unit}</strong> &bull; Total: <strong>{formatCurrency(ord.totalPrice)}</strong>
                </p>

                {ord.status !== "PENDING" && (
                  <div className="flex items-center text-sm font-semibold text-green-800 mt-2">
                    <Phone className="h-4 w-4 mr-1.5" />
                    Farmer Direct Line: <span>{ord.farmerPhone}</span>
                  </div>
                )}
              </div>

              <div>
                {ord.status === "COMPLETED" && (
                  <Button size="sm" variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                    <Star className="h-4 w-4 mr-1.5 text-yellow-500 fill-yellow-500" />
                    Rate & Review Farmer
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
