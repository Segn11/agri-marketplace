"use client";

import { ShieldAlert, Users, Package, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const metrics = [
    { title: "Registered Users", value: "1,240", change: "+12% this month", icon: Users },
    { title: "Active Produce Listings", value: "320", change: "+18 this week", icon: Package },
    { title: "Completed Transactions", value: "890", change: "99.2% satisfaction", icon: ShoppingCart },
    { title: "Open Moderation Reports", value: "3", change: "Action required", icon: ShieldAlert },
  ];

  const reports = [
    {
      id: "rep-1",
      reporter: "Alazar Tadesse",
      targetType: "LISTING",
      targetName: "Maize Grade 2 (Unverified stock)",
      reason: "Farmer unresponsive to accepted orders",
      status: "OPEN",
    },
    {
      id: "rep-2",
      reporter: "Hanna Girma",
      targetType: "REVIEW",
      targetName: "Review on White Teff",
      reason: "Inappropriate language used",
      status: "OPEN",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900">Platform Administration</h1>
        <p className="text-sm text-gray-500 mt-1">
          Oversee marketplace activity, manage user roles, and moderate reported listings and reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{m.title}</span>
                <Icon className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">{m.value}</p>
              <p className="text-xs text-green-700 font-medium mt-1">{m.change}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Moderation Reports</h2>
        <div className="divide-y divide-gray-200">
          {reports.map((rep) => (
            <div key={rep.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">{rep.targetType}</Badge>
                  <span className="font-semibold text-gray-900">{rep.targetName}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Reason: <span className="italic">"{rep.reason}"</span> &bull; Reported by: {rep.reporter}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="text-green-700 border-green-600">
                  Resolve
                </Button>
                <Button size="sm" variant="danger">
                  Hide Item
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
