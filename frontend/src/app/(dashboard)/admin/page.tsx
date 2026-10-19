"use client";

import { ShieldAlert, Users, Package, ShoppingCart, CheckCircle, EyeOff, Sparkles, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const metrics = [
    { title: "Registered Users", value: "1,240", change: "+12% this month", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Listings", value: "320", change: "+18 this week", icon: Package, color: "text-brand-600", bg: "bg-brand-50" },
    { title: "Completed Orders", value: "890", change: "99.2% rate", icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Open Reports", value: "3", change: "Action required", icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-soft mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-brand-300/20 via-emerald-200/10 to-transparent rounded-bl-full pointer-events-none -z-10" />

        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60 mb-3">
            <ShieldAlert className="h-3.5 w-3.5" /> Platform Governance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Admin Moderation Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Oversee ecosystem metrics, resolve customer disputes, and manage flagged listings and reviews.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{m.title}</span>
                <div className={`h-10 w-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center border border-slate-100`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-3">{m.value}</p>
              <p className="text-xs text-brand-700 font-semibold mt-1">{m.change}</p>
            </div>
          );
        })}
      </div>

      {/* Reports Feed */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Pending Moderation Reports</h2>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {reports.length} Open
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {reports.map((rep) => (
            <div key={rep.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {rep.targetType}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{rep.targetName}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Reason: <span className="italic text-slate-700 font-medium">"{rep.reason}"</span> &bull; Reported by: <strong className="text-slate-800">{rep.reporter}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                <button className="btn-primary-gradient text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Resolve
                </button>
                <button className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition flex items-center gap-1.5">
                  <EyeOff className="h-3.5 w-3.5" />
                  Hide Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
