"use client";

import { useState } from "react";
import {
  Satellite,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { getRegionalSatelliteTelemetry } from "@/lib/agribazaar";

export function SatelliteTelemetryModule() {
  const [region, setRegion] = useState("North Shewa");
  const telemetry = getRegionalSatelliteTelemetry(region);

  const regions = ["North Shewa", "Sidama", "Bale", "East Wollega"];

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              AgriBhumi & AgriKnow Satellite Crop Analytics
            </h3>
            <p className="text-xs text-slate-500">
              Multi-spectral Sentinel satellite field monitoring, soil moisture indexing, and spray advisory.
            </p>
          </div>
        </div>

        {/* Region Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-3 py-1.5 rounded-lg transition ${
                region === r
                  ? "bg-white text-indigo-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* NDVI Vegetation Vigor */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-emerald-900 font-bold text-xs uppercase tracking-wider">
            <span>NDVI Crop Vigor</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-950">
            {telemetry.ndviIndex}{" "}
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {telemetry.ndviStatus}
            </span>
          </div>
          <p className="text-[11px] text-emerald-800">Dense photosynthetic chlorophyll density.</p>
        </div>

        {/* Soil Moisture */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-blue-900 font-bold text-xs uppercase tracking-wider">
            <span>Root Zone Moisture</span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-950">
            {telemetry.soilMoisturePercent}%{" "}
            <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              {telemetry.soilMoistureStatus}
            </span>
          </div>
          <p className="text-[11px] text-blue-800">Adequate for tillering and ear formation.</p>
        </div>

        {/* Precipitation Forecast */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 p-4 rounded-2xl border border-purple-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-purple-900 font-bold text-xs uppercase tracking-wider">
            <span>Rainfall Forecast (72h)</span>
            <CloudRain className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-950">
            {telemetry.precipitationForecastMm}{" "}
            <span className="text-xs font-semibold text-purple-700">mm expected</span>
          </div>
          <p className="text-[11px] text-purple-800">Highland convection precipitation.</p>
        </div>

        {/* Spray Window Condition */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-2xl border border-amber-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-amber-900 font-bold text-xs uppercase tracking-wider">
            <span>Spray Window</span>
            <Wind className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-950 mt-1">
            <span
              className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full ${
                telemetry.sprayCondition === "FAVORABLE"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {telemetry.sprayCondition.replace("_", " ")}
            </span>
          </div>
          <p className="text-[11px] text-amber-800">Scout early morning before 10 AM.</p>
        </div>
      </div>

      {/* Advisory Text Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Irrigation & Soil Moisture Action Plan</span>
          </div>
          <p className="text-slate-600 leading-relaxed">{telemetry.irrigationGuidance}</p>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-1.5 text-amber-950">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Upcoming Regional Weather Hazard Alert</span>
          </div>
          <p className="text-amber-900 leading-relaxed">{telemetry.upcomingWeatherAlert}</p>
        </div>
      </div>
    </div>
  );
}
