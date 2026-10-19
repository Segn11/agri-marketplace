"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, User as UserIcon, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function AgriLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));

      if (data.data.role === "ROLE_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/products");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your phone/email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-100">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-md border border-slate-200">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white shadow-md">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-8 h-8">
              <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9A9 9 0 0 1 3 11c0-4.97 4.03-9 9-9z" />
              <path d="M12 7c-2 2-3 4-3 6a3 3 0 0 0 6 0c0-2-1-4-3-6z" fill="currentColor" opacity="0.9" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Sign In to Agri<span className="text-teal-600">Market</span>
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Access your direct agricultural commodity trading account
          </p>
        </div>

        {error && (
          <div className="mt-5 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email or Phone Number
            </label>
            <div className="relative">
              <UserIcon className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="0911234567 or trader@agrimarket.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <a href="#" className="text-xs text-teal-600 hover:underline font-medium">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-brand py-2.5 rounded text-sm font-semibold flex items-center justify-center gap-2 shadow-sm mt-2 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Sign In"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          New to AgriMarket?{" "}
          <Link href="/register" className="font-bold text-teal-600 hover:underline">
            Register as Farmer or Trader
          </Link>
        </div>
      </div>
    </div>
  );
}
