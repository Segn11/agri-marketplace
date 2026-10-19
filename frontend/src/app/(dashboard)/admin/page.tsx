"use client";

import { ShieldAlert, Users, Package, ShoppingCart, CheckCircle, EyeOff, Building2, AlertTriangle } from "lucide-react";

export default function AgriAdminDashboard() {
  const metrics = [
    { title: "Registered Farm Cooperatives & Millers", value: "1,240", change: "+12% this month", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Live Produce Commodity Lots", value: "320", change: "+18 this week", icon: Package, color: "text-teal-700", bg: "bg-teal-50" },
    { title: "Settled Trades (Escrow Protected)", value: "890", change: "99.8% completion rate", icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Open Dispute / Assay Reports", value: "3", change: "Action required", icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const reports = [
    {
      id: "rep-1",
      reporter: "Alazar Tadesse (Apex Milling)",
      targetType: "COMMODITY_LOT",
      targetName: "Durum Wheat Lot #890 (Moisture Dispute)",
      reason: "Moisture content measured 14.8% vs 13.5% listed in assay report",
      status: "OPEN",
    },
    {
      id: "rep-2",
      reporter: "Hanna Girma",
      targetType: "REVIEW",
      targetName: "Review on White Teff Magna Lot",
      reason: "Inappropriate review comment",
      status: "OPEN",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-8">
        {/* ── TOP BANNER ── */}
        <div
          className="text-white p-8 sm:p-10 rounded-2xl shadow-md mb-8"
          style={{ background: 'linear-gradient(135deg, #041d1c 0%, #073330 50%, #0a4843 100%)' }}
        >
          <div className="inline-flex items-center gap-2 bg-teal-900/80 text-teal-200 border border-teal-500/30 px-3 py-1 rounded text-xs font-semibold mb-3">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span>Platform Governance & Market Surveillance</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            AgriMarket Admin & Moderation Hub
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Monitor trading volume, verify cooperative assay certificates, resolve trade disputes, and govern user accounts.
          </p>
        </div>

        {/* ── METRICS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="agri-card p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{m.title}</span>
                  <div className={`h-10 w-10 rounded-lg ${m.bg} ${m.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-3">{m.value}</p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">{m.change}</p>
              </div>
            );
          })}
        </div>

        {/* ── REPORTS & DISPUTES ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">Trade Disputes & Moderation Queue</h2>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {reports.length} Open
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {reports.map((rep) => (
              <div key={rep.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {rep.targetType}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{rep.targetName}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Dispute Reason: <span className="italic text-slate-700 font-medium">"{rep.reason}"</span> &bull; Raised by: <strong className="text-slate-800">{rep.reporter}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="btn-brand text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 shadow-sm">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Mediate & Settle
                  </button>
                  <button className="px-4 py-2 rounded text-xs font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50">
                    <EyeOff className="h-3.5 w-3.5 inline mr-1" />
                    Delist Lot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
