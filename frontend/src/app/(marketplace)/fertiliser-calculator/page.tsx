"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Sprout,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FlaskConical,
  Layers,
  Scale,
  Calendar,
  ShieldAlert,
  Coins,
  Package,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calculateFertiliserRequirements } from "@/lib/agribazaar";

export default function FertiliserCalculatorPage() {
  const [crop, setCrop] = useState("Maize (Corn)");
  const [landArea, setLandArea] = useState<number>(2.0);
  const [areaUnit, setAreaUnit] = useState<"Hectare" | "Acre" | "Timad (0.25 Ha)">("Hectare");
  const [soilFertility, setSoilFertility] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

  const crops = ["Maize (Corn)", "White Teff", "Durum Wheat", "Arabica Coffee", "Red Haricot Beans"];

  const result = calculateFertiliserRequirements(crop, landArea, areaUnit, soilFertility);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-amber-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-400/10 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-800/80 border border-amber-400/30 text-amber-200 text-xs font-semibold tracking-wide uppercase">
              <Calculator className="w-3.5 h-3.5" />
              <span>AgriBazaar Agronomic Tool • Precision Input Optimization</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Fertiliser Calculator — Crop & Soil Dosage Optimizer
            </h1>
            <p className="text-amber-100 text-base sm:text-lg leading-relaxed">
              Calculate exact nutrient requirements of Urea (46% N) and Diammonium Phosphate (DAP 18-46-0) tailored to your farm size and soil condition. Prevent over-fertilization, maximize nitrogen use efficiency, and budget your input procurement costs accurately.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-amber-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Agronomic Standard Formulation
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-300" /> Basal vs Top-Dressing Splits
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-orange-200" /> Live Subsidized Price Estimation
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-amber-600" />
                <span>Farm & Plot Input Parameters</span>
              </h2>

              {/* 1. Select Crop */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Select Crop Variety</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {crops.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Land Size and Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Land Area Size</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={landArea}
                    onChange={(e) => setLandArea(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Unit of Area</label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Hectare">Hectare (10,000 m²)</option>
                    <option value="Acre">Acre (~4,046 m²)</option>
                    <option value="Timad (0.25 Ha)">Timad (0.25 Ha)</option>
                  </select>
                </div>
              </div>

              {/* 3. Soil Fertility Level */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">Soil Baseline Fertility</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["LOW", "MEDIUM", "HIGH"] as const).map((fert) => (
                    <button
                      key={fert}
                      type="button"
                      onClick={() => setSoilFertility(fert)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                        soilFertility === fert
                          ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {fert === "LOW" ? "Depleted / Low" : fert === "MEDIUM" ? "Normal / Medium" : "Rich / High"}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">
                  {soilFertility === "LOW" && "Requires +20% nutrient boost for depleted or sandy soils."}
                  {soilFertility === "MEDIUM" && "Standard regional recommendation for highland clay-loam soils."}
                  {soilFertility === "HIGH" && "Reduced by -20% to prevent excessive vegetative lodging."}
                </p>
              </div>

              {/* Agronomy Notice */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/80 text-xs text-amber-950 space-y-1">
                <span className="font-bold block">Soil Health Best Practice</span>
                <p>{result.agronomyAdvice}</p>
              </div>
            </div>
          </div>

          {/* Right Results Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              {/* Output Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                    Dosage Plan For: {result.landArea} {result.areaUnit} of {result.crop}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    Recommended Fertiliser Quotas
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block">
                    Estimated Input Cost
                  </span>
                  <span className="text-xl font-extrabold text-amber-700">
                    {formatCurrency(result.estimatedCostETB)}
                  </span>
                </div>
              </div>

              {/* Key Dosage Cards: Urea vs DAP vs Manure */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* DAP Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-5 rounded-2xl border border-blue-200/80 space-y-2">
                  <div className="flex items-center justify-between text-blue-900 font-bold text-xs uppercase tracking-wider">
                    <span>Diammonium Phosphate</span>
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-blue-950">
                    {result.dapBags50kg} <span className="text-xs font-semibold text-blue-700">Bags (50kg)</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Total: <strong className="text-slate-800">{result.totalKgDap} kg</strong> (18% N, 46% P₂O₅)
                  </div>
                </div>

                {/* Urea Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-5 rounded-2xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between text-emerald-900 font-bold text-xs uppercase tracking-wider">
                    <span>Granular Urea</span>
                    <FlaskConical className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-950">
                    {result.ureaBags50kg} <span className="text-xs font-semibold text-emerald-700">Bags (50kg)</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Total: <strong className="text-slate-800">{result.totalKgUrea} kg</strong> (46% Nitrogen)
                  </div>
                </div>

                {/* Compost Card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <span>Cured Compost</span>
                    <Sprout className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-amber-950">
                    {result.compostQuintals} <span className="text-xs font-semibold text-amber-700">Quintals</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Soil Organic Matter Booster
                  </div>
                </div>
              </div>

              {/* Application Timeline Splits */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Precision Application Schedule & Agronomy Splits
                </h4>

                <div className="space-y-3 text-xs">
                  {/* Basal Split */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        Basal Placement at Planting (Day 0)
                      </span>
                      <p className="text-slate-600 mt-1 leading-relaxed">
                        {result.basalApplicationDap}
                      </p>
                    </div>
                  </div>

                  {/* 1st Top Dressing */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        First Top-Dressing at Knee-High Stage (Day 30-35)
                      </span>
                      <p className="text-slate-600 mt-1 leading-relaxed">
                        {result.firstTopDressingUrea}
                      </p>
                    </div>
                  </div>

                  {/* 2nd Top Dressing */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        Second Top-Dressing at Booting / Pre-Flowering
                      </span>
                      <p className="text-slate-600 mt-1 leading-relaxed">
                        {result.secondTopDressingUrea}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Inputs CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Ready to procure your calculated fertiliser bags directly from agricultural unions?
                </div>
                <Link
                  href="/inputs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition"
                >
                  <span>Order Required Fertiliser from Verified Unions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
