"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FlaskConical,
  Leaf,
  Bug,
  ThermometerSun,
  Layers,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { CROP_DOCTOR_DATABASE } from "@/lib/agribazaar";
import { CropDoctorDiagnosis } from "@/types";

export default function CropDoctorPage() {
  const cropList = Object.keys(CROP_DOCTOR_DATABASE);
  const [selectedCrop, setSelectedCrop] = useState<string>(cropList[0]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<CropDoctorDiagnosis>(
    CROP_DOCTOR_DATABASE[cropList[0]][0]
  );
  const [customSymptomInput, setCustomSymptomInput] = useState("");
  const [showAiDiagnosis, setShowAiDiagnosis] = useState(false);

  const availableIssues = CROP_DOCTOR_DATABASE[selectedCrop] || [];

  const handleSelectCrop = (crop: string) => {
    setSelectedCrop(crop);
    if (CROP_DOCTOR_DATABASE[crop] && CROP_DOCTOR_DATABASE[crop].length > 0) {
      setSelectedDiagnosis(CROP_DOCTOR_DATABASE[crop][0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-400/10 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/70 border border-emerald-400/30 text-emerald-200 text-xs font-semibold tracking-wide uppercase">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>AgriBazaar Intelligence • Crop Health & Pathology</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Crop Doctor — Clinical Diagnosis & Treatment Advisory
            </h1>
            <p className="text-emerald-100 text-base sm:text-lg leading-relaxed">
              Identify foliar diseases, fungal rusts, and destructive insect infestations before they jeopardize harvest yields. Access scientifically validated clinical chemical dosages alongside 100% certified organic bio-remedies for highland cereals, coffee, and pulses.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> EIAR & Agronomy Standard Verified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-teal-300" /> Integrated Chemical & Organic Protocols
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-amber-300" /> Exact Spray Dilution Ratios
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Crop Selection Ribbon */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Select Target Commodity Crop</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {cropList.map((crop) => (
              <button
                key={crop}
                onClick={() => handleSelectCrop(crop)}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border text-left flex flex-col justify-between ${
                  selectedCrop === crop
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/30"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{crop}</span>
                <span className={`text-[10px] mt-1 ${selectedCrop === crop ? "text-emerald-200" : "text-slate-400"}`}>
                  {CROP_DOCTOR_DATABASE[crop].length} Known Pathologies
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Diagnostic Selector & Pathology Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Symptoms & Disease Selection */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Bug className="w-4 h-4 text-rose-500" />
                <span>Observed Disease or Pest Symptoms</span>
              </h3>
              <p className="text-xs text-slate-500">
                Select the pathological profile that matches what you are seeing in your field:
              </p>

              <div className="space-y-3">
                {availableIssues.map((diag) => {
                  const isSelected = selectedDiagnosis.issue === diag.issue;
                  return (
                    <div
                      key={diag.issue}
                      onClick={() => setSelectedDiagnosis(diag)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-emerald-50/80 border-emerald-500 shadow-xs"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{diag.issue}</span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            diag.severity === "CRITICAL"
                              ? "bg-rose-100 text-rose-800"
                              : diag.severity === "HIGH"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {diag.severity} Severity
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {diag.symptoms.map((s, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Freeform Symptom Inquiry */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Seeing unique unlisted symptoms? Ask AI Crop Doctor
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. White powdery mildew under lower leaf surface..."
                    value={customSymptomInput}
                    onChange={(e) => setCustomSymptomInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <Link
                    href={`/assistant?q=${encodeURIComponent(
                      `Crop Doctor diagnosis for ${selectedCrop}: ${customSymptomInput}`
                    )}`}
                    className="px-3 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition shrink-0"
                  >
                    Analyze
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pathology Report, Chemical & Organic Treatment Protocol */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Target Crop: {selectedDiagnosis.crop}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">
                    {selectedDiagnosis.issue}
                  </h2>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider ${
                    selectedDiagnosis.severity === "CRITICAL"
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {selectedDiagnosis.severity} ALERT
                </div>
              </div>

              {/* Pathology Explanation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Clinical Pathology & Transmission Mechanism
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedDiagnosis.pathologyExplanation}
                </p>
              </div>

              {/* Treatment Protocols: Chemical vs Organic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chemical Treatment */}
                <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                    <FlaskConical className="w-4 h-4 text-blue-600" />
                    <span>Scientific Chemical Protocol</span>
                  </div>
                  <p className="text-xs text-blue-950 font-medium leading-relaxed">
                    {selectedDiagnosis.chemicalRemedy}
                  </p>
                </div>

                {/* Organic / Bio Treatment */}
                <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>100% Certified Organic Remedy</span>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {selectedDiagnosis.organicRemedy}
                  </p>
                </div>
              </div>

              {/* Application Guidelines */}
              <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Spraying & Farm Hygiene Guidelines</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  {selectedDiagnosis.applicationGuideline}
                </p>
              </div>

              {/* Input Marketplace CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Need bio-pesticides, certified seeds, or knapsack sprayers?
                </div>
                <Link
                  href="/inputs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
                >
                  <span>Order Protective Inputs from Verified Suppliers</span>
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
