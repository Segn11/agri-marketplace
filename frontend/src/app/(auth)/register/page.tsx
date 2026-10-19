"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout, ArrowRight, UserCheck, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
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
      const res = await fetch("http://localhost:8080/api/auth/register", {
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

      if (role === "ROLE_FARMER") {
        router.push("/farmer");
      } else {
        router.push("/products");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-gradient-to-tr from-brand-300/20 via-emerald-200/20 to-harvest-200/20 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-lg glass-panel p-8 sm:p-10 rounded-3xl shadow-soft-lg relative">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-700 via-green-600 to-emerald-500 text-white shadow-glow-sm">
            <Sprout className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
            Create Your Account
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Join the digital direct agricultural trading network
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="mt-6 flex rounded-2xl bg-slate-100/90 p-1.5 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setRole("ROLE_FARMER")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition duration-150 flex items-center justify-center gap-1.5 ${
              role === "ROLE_FARMER"
                ? "bg-white text-brand-800 shadow-sm border border-slate-200/40"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>🌱</span> Farmer / Grower
          </button>
          <button
            type="button"
            onClick={() => setRole("ROLE_BUYER")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition duration-150 flex items-center justify-center gap-1.5 ${
              role === "ROLE_BUYER"
                ? "bg-white text-brand-800 shadow-sm border border-slate-200/40"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>🛒</span> Buyer / Business
          </button>
        </div>

        {error && (
          <div className="mt-5 p-3.5 text-xs text-red-700 bg-red-50/80 border border-red-200 rounded-2xl flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Gemechu Desta"
              className="w-full px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0911234567"
                className="w-full px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Farming Zone / City
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. East Highland, Adama"
                className="w-full px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition shadow-xs"
              />
            </div>
          </div>

          {role === "ROLE_FARMER" && (
            <div className="border-t border-slate-200/70 pt-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Farm Details
              </span>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Farm Name or Producer Cooperative
                </label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  placeholder="e.g. Green Valley Farm Cooperative"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition shadow-xs"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 btn-primary-gradient text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-glow-sm disabled:opacity-60 transition"
          >
            {loading ? "Creating Account..." : `Register as ${role === "ROLE_FARMER" ? "Farmer" : "Buyer"}`}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200/60 text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-brand-700 hover:text-brand-800 transition">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
