"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Users,
  Package,
  ShoppingCart,
  CheckCircle,
  EyeOff,
  Building2,
  AlertTriangle,
  UserCheck,
  UserX,
  Search,
  SlidersHorizontal,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ROLE_FARMER" | "ROLE_BUYER" | "ROLE_ADMIN";
  location: string;
  cooperative?: string;
  status: "ACTIVE" | "SUSPENDED";
  verified: boolean;
}

interface DisputeReport {
  id: string;
  reporter: string;
  targetType: "COMMODITY_LOT" | "REVIEW" | "PAYMENT_ESCROW";
  targetName: string;
  reason: string;
  status: "OPEN" | "RESOLVED";
  createdAt: string;
}

export default function AgriAdminDashboard() {
  const [activeTab, setActiveTab] = useState<"disputes" | "users" | "surveillance">("disputes");
  const [userSearch, setUserSearch] = useState("");

  const [metrics, setMetrics] = useState([
    { title: "Registered Farm Cooperatives", value: "1,240", change: "+12% this month", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Live Produce Lots on Board", value: "320", change: "+18 this week", icon: Package, color: "text-teal-700", bg: "bg-teal-50" },
    { title: "Settled Trades (AgriPay Escrow)", value: "ETB 48.5M", change: "99.8% completion rate", icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Open Disputes / Assay Arbitrations", value: "2", change: "Action required", icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
  ]);

  const [reports, setReports] = useState<DisputeReport[]>([
    {
      id: "rep-1",
      reporter: "Alazar Tadesse (Apex Milling PLC)",
      targetType: "COMMODITY_LOT",
      targetName: "Durum Wheat Lot #890 (Moisture Dispute)",
      reason: "Moisture content measured 14.8% on delivery inspection vs 13.5% listed in assay report.",
      status: "OPEN",
      createdAt: "Yesterday, 3:10 PM",
    },
    {
      id: "rep-2",
      reporter: "Hanna Girma (Highland Wholesale)",
      targetType: "PAYMENT_ESCROW",
      targetName: "Escrow Release Delay on Onion Lot #202",
      reason: "Seller delayed delivery receipt signoff. Buyer verified physical stock.",
      status: "OPEN",
      createdAt: "Today, 9:20 AM",
    },
  ]);

  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: "u-1",
      name: "Gemechu Desta",
      email: "gemechu@odagida.org",
      role: "ROLE_FARMER",
      location: "East Highland Farming Zone",
      cooperative: "Oda Gida Agricultural Farmers Union",
      status: "ACTIVE",
      verified: true,
    },
    {
      id: "u-2",
      name: "Apex Commercial Milling PLC",
      email: "procurement@apexmill.com",
      role: "ROLE_BUYER",
      location: "Central Logistics Park",
      status: "ACTIVE",
      verified: true,
    },
    {
      id: "u-3",
      name: "Chala Tolosa",
      email: "chala@mekibatu.org",
      role: "ROLE_FARMER",
      location: "Central River Basin",
      cooperative: "Meki-Batu Vegetable Growers Union",
      status: "ACTIVE",
      verified: true,
    },
    {
      id: "u-4",
      name: "Solomon Kassa (Grain Broker)",
      email: "solomon@speculate.et",
      role: "ROLE_BUYER",
      location: "West Mandi Post",
      status: "SUSPENDED",
      verified: false,
    },
  ]);

  const handleResolveReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "RESOLVED" } : r))
    );
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
          : u
      )
    );
  };

  const handleToggleVerify = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, verified: !u.verified } : u))
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.location.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-8">
        {/* ── TOP BANNER ── */}
        <div
          className="text-white p-8 sm:p-10 rounded-2xl shadow-md mb-8"
          style={{ background: "linear-gradient(135deg, #041d1c 0%, #073330 50%, #0a4843 100%)" }}
        >
          <div className="inline-flex items-center gap-2 bg-teal-900/80 text-teal-200 border border-teal-500/30 px-3 py-1 rounded text-xs font-semibold mb-3">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span>Platform Governance & Market Surveillance</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Agri Marketplace Admin & Moderation Hub
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Monitor nationwide trading volume, arbitrate quality assay disputes, verify agricultural cooperative credentials, and enforce exchange integrity.
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

        {/* ── TABS ── */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("disputes")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === "disputes"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Disputes & Assay Arbitration ({reports.filter((r) => r.status === "OPEN").length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === "users"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            User & Cooperative Directory ({users.length})
          </button>
        </div>

        {/* ── TAB: DISPUTES ── */}
        {activeTab === "disputes" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900">Trade Disputes & Moderation Queue</h2>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {reports.filter((r) => r.status === "OPEN").length} Open Actions
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
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                          rep.status === "OPEN"
                            ? "bg-red-100 text-red-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Dispute Reason: <span className="italic text-slate-700 font-medium">"{rep.reason}"</span> &bull; Raised by: <strong className="text-slate-800">{rep.reporter}</strong>
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{rep.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {rep.status === "OPEN" ? (
                      <>
                        <button
                          onClick={() => handleResolveReport(rep.id)}
                          className="btn-brand text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Mediate & Settle
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id)}
                          className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50"
                        >
                          <EyeOff className="h-3.5 w-3.5 inline mr-1" />
                          Delist Lot
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Arbitrated & Settled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: USERS DIRECTORY ── */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Exchange Participants</h3>
                <p className="text-xs text-slate-500">
                  Verify cooperative legal profiles, inspect tax registrations, and manage account statuses.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Participant Name</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Verification</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <strong className="text-slate-900 block">{u.name}</strong>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {u.role === "ROLE_FARMER" ? "🌾 Farmer / Co-op" : "🏢 Corporate Buyer"}
                        </span>
                      </td>
                      <td className="px-6 py-4">{u.location}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleVerify(u.id)}
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                            u.verified
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {u.verified ? "Verified Co-op" : "Pending Verification"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            u.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                            u.status === "ACTIVE"
                              ? "text-red-600 border-red-200 hover:bg-red-50"
                              : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          }`}
                        >
                          {u.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
