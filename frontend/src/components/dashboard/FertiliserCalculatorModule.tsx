"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Sprout,
  Package,
  FlaskConical,
  Coins,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calculateFertiliserRequirements } from "@/lib/agribazaar";

export function FertiliserCalculatorModule() {
  const [crop, setCrop] = useState("Maize (Corn)");
  const [landArea, setLandArea] = useState<number>(2.0);
  const [areaUnit, setAreaUnit] = useState<"Hectare" | "Acre" | "Timad (0.25 Ha)">("Hectare");
  const [soilFertility, setSoilFertility] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

  const crops = ["Maize (Corn)", "White Teff", "Durum Wheat", "Arabica Coffee", "Red Haricot Beans"];
  const result = calculateFertiliserRequirements(crop, landArea, areaUnit, soilFertility);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Precision Fertiliser Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Calculate exact nutrient quotas of Urea, DAP, and compost for your specific farm acreage.
            </p>
          </div>
        </div>

        <Link
          href="/fertiliser-calculator"
          className="text-amber-800 hover:text-amber-900 text-xs font-bold flex items-center gap-1 underline"
        >
          <span>Open Full Agronomy Planner</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Crop</label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900 bg-white"
          >
            {crops.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Land Area</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={landArea}
            onChange={(e) => setLandArea(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Area Unit</label>
          <select
            value={areaUnit}
            onChange={(e) => setAreaUnit(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900 bg-white"
          >
            <option value="Hectare">Hectare</option>
            <option value="Acre">Acre</option>
            <option value="Timad (0.25 Ha)">Timad (0.25 Ha)</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Soil Fertility</label>
          <select
            value={soilFertility}
            onChange={(e) => setSoilFertility(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900 bg-white"
          >
            <option value="LOW">Low / Sandy (+20%)</option>
            <option value="MEDIUM">Medium / Normal</option>
            <option value="HIGH">High / Rich (-20%)</option>
          </select>
        </div>
      </div>

      {/* Output Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
            DAP 18-46-0 (Basal)
          </span>
          <div className="text-2xl font-black text-blue-950">
            {result.dapBags50kg} <span className="text-xs font-semibold text-blue-700">Bags (50kg)</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">{result.totalKgDap} kg at planting</span>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
            Urea 46% N (Top-Dressing)
          </span>
          <div className="text-2xl font-black text-emerald-950">
            {result.ureaBags50kg} <span className="text-xs font-semibold text-emerald-700">Bags (50kg)</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">{result.totalKgUrea} kg split top-dressing</span>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
            Estimated Cost
          </span>
          <div className="text-2xl font-black text-amber-950">
            {formatCurrency(result.estimatedCostETB)}
          </div>
          <span className="text-xs text-slate-500 font-medium">Subsidized Union Price</span>
        </div>
      </div>
    </div>
  );
}
