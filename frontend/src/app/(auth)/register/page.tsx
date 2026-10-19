"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, AlertCircle, Building2, User } from "lucide-react";

export default function AgriRegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"ROLE_FARMER" | "ROLE_BUYER">("ROLE_FARMER");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    location: "",
    farmName: "",
    farmLocation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));

      router.push("/products");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-100">
      <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-2xl shadow-md border border-slate-200">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white shadow-md">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-8 h-8">
              <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9A9 9 0 0 1 3 11c0-4.97 4.03-9 9-9z" />
              <path d="M12 7c-2 2-3 4-3 6a3 3 0 0 0 6 0c0-2-1-4-3-6z" fill="currentColor" opacity="0.9" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Join Agri<span className="text-teal-600">Market</span>
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            National Integrated Agritech & Commodity Trading Platform
          </p>
        </div>

        {/* Role Switcher */}
        <div className="mt-6 flex rounded-lg bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setRole("ROLE_FARMER")}
            className={`flex-1 py-2 text-xs font-bold rounded transition ${
              role === "ROLE_FARMER"
                ? "bg-white text-teal-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🌾 Farmer / Producer
          </button>
          <button
            type="button"
            onClick={() => setRole("ROLE_BUYER")}
            className={`flex-1 py-2 text-xs font-bold rounded transition ${
              role === "ROLE_BUYER"
                ? "bg-white text-teal-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏢 Miller / Corporate Trader
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Legal Name / Entity Contact
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Gemechu Desta or Apex Mills Sourcing Ltd"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="trade@company.com"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number (for SMS & OTP)
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0911234567"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Account Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Market / Operating Zone
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. East Highland Market"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {role === "ROLE_FARMER" && (
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> Producer Cooperative / Farm Info
              </span>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Farm Name or Cooperative Society
                </label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  placeholder="e.g. Oda Gida Farmers Union Cooperative"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-brand py-3 rounded text-sm font-semibold flex items-center justify-center gap-2 shadow-sm mt-3 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : `Register as ${role === "ROLE_FARMER" ? "Farmer / Producer" : "Corporate Trader"}`}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-teal-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
