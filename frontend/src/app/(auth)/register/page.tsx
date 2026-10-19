"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
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
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6 glass-panel p-8 sm:p-10 rounded-3xl shadow-soft-lg">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-brand-500 text-white shadow-glow-sm">
            <Sprout className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
            Create Your Account
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Join the decentralized agricultural trading network
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
          <button
            type="button"
            onClick={() => setRole("ROLE_FARMER")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              role === "ROLE_FARMER"
                ? "bg-white text-brand-800 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            🌱 Farmer / Grower
          </button>
          <button
            type="button"
            onClick={() => setRole("ROLE_BUYER")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              role === "ROLE_BUYER"
                ? "bg-white text-brand-800 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            🛒 Buyer / Business
          </button>
        </div>

        {error && (
          <div className="p-3.5 text-xs text-red-700 bg-red-50 border border-red-200/80 rounded-xl">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Gemechu Desta"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0911234567"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                City / Farming District
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Adama, Bahir Dar, Hawassa"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {role === "ROLE_FARMER" && (
            <div className="border-t border-slate-200/80 pt-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                Farm Information
              </span>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Farm Name or Cooperative
                </label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  placeholder="e.g. Green Valley Farm Cooperative"
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold shadow-glow-sm mt-3"
            disabled={loading}
          >
            {loading ? "Creating Account..." : `Register as ${role === "ROLE_FARMER" ? "Farmer" : "Buyer"}`}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-200/70">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-brand-700 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
