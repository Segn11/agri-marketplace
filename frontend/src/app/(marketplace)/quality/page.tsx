"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  CheckCircle,
  AlertCircle,
  FileText,
  ChevronRight,
  Award,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  PhoneCall,
  UserCheck,
} from "lucide-react";
import { QUALITY_CERTIFICATES, QualityAssayReport } from "@/lib/ethiopia-data";

export default function QualityAssayPage() {
  const [certInput, setCertInput] = useState<string>("ECX-AS-2026-9041");
  const [activeReport, setActiveReport] = useState<QualityAssayReport | null>(
    QUALITY_CERTIFICATES[0]
  );
  const [searchError, setSearchError] = useState<string | null>(null);

  // Field Inspection Booking
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [cropType, setCropType] = useState("Pure White Teff");
  const [inspectionSuccess, setInspectionSuccess] = useState<string | null>(null);

  const handleSearchCert = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const found = QUALITY_CERTIFICATES.find(
      (c) => c.certificateNumber.toLowerCase() === certInput.trim().toLowerCase()
    );

    if (found) {
      setActiveReport(found);
    } else {
      setSearchError(
        `Certificate "${certInput}" not found in national registry. Try clicking one of the sample certificates below.`
      );
      setActiveReport(null);
    }
  };

  const handleBookInspection = (e: React.FormEvent) => {
    e.preventDefault();
    setInspectionSuccess(
      `Field assay inspection booked for ${cropType} at ${farmLocation}. An accredited regional agronomist from the Ministry of Agriculture testing post will arrive within 48 hours.`
    );
    setTimeout(() => {
      setInspectionSuccess(null);
      setFarmName("");
      setFarmLocation("");
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-teal-600 transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-bold text-slate-800">Quality Assay & ECX Certification</span>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 p-8 sm:p-12 text-white shadow-xl overflow-hidden mb-10">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              Scientific Quality Assaying & ECX Standard Verification
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Standardized Quality <span className="text-emerald-400">Assay & Grading</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every commodity lot traded on Agri Marketplace undergoes strict moisture analysis, foreign matter screening, and defect categorization following Ethiopian Commodity Exchange (ECX) export standards.
            </p>
          </div>
        </div>

        {/* Certificate Lookup Tool */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-12">
          <div className="max-w-2xl mb-6">
            <h2 className="text-xl font-black text-slate-900">
              National Assay Certificate Verification Engine
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify laboratory test results, moisture ratios, purity scores, and inspector credentials for any registered commodity batch.
            </p>
          </div>

          <form onSubmit={handleSearchCert} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter Certificate No (e.g. ECX-AS-2026-9041)..."
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              Verify Certificate
            </button>
          </form>

          {/* Sample quick buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Verify Samples:</span>
            {QUALITY_CERTIFICATES.map((c) => (
              <button
                key={c.certificateNumber}
                type="button"
                onClick={() => {
                  setCertInput(c.certificateNumber);
                  setActiveReport(c);
                  setSearchError(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                  activeReport?.certificateNumber === c.certificateNumber
                    ? "bg-teal-50 text-teal-800 border-teal-300"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {c.certificateNumber} ({c.commodity.slice(0, 15)}...)
              </button>
            ))}
          </div>

          {searchError && (
            <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              {searchError}
            </div>
          )}

          {/* Active Verified Certificate Display */}
          {activeReport && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="rounded-3xl border-2 border-teal-600/30 bg-teal-50/20 p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-teal-100 pb-5">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                      Authentic Laboratory Assay Record
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">
                      {activeReport.commodity}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Registered Grower / Cooperative: <span className="font-bold text-slate-800">{activeReport.growerOrUnion}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Official Assay Certificate</div>
                    <div className="text-base font-black text-teal-800">{activeReport.certificateNumber}</div>
                    <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                      {activeReport.officialGrade}
                    </div>
                  </div>
                </div>

                {/* Laboratory Parameters Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Moisture Content</div>
                    <div className="text-2xl font-black text-teal-900 mt-1">
                      {activeReport.moistureContent}%
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      ✓ Safe Storage Limit (&lt; 12.5%)
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Seed Purity Ratio</div>
                    <div className="text-2xl font-black text-teal-900 mt-1">
                      {activeReport.purityScore}%
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      ✓ Cleaned & Sorted
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Foreign Matter</div>
                    <div className="text-2xl font-black text-teal-900 mt-1">
                      {activeReport.foreignMatter}%
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      ✓ Sub-1% Export Tolerance
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Defect Ratio</div>
                    <div className="text-2xl font-black text-teal-900 mt-1">
                      {activeReport.defectRate}%
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      ✓ Sound Kernel Guarantee
                    </div>
                  </div>
                </div>

                {/* Additional Specs & Origin */}
                <div className="bg-white p-4 rounded-2xl border border-teal-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="text-slate-500 font-medium">
                      Geographic Origin: <span className="font-bold text-slate-800">{activeReport.originWoreda}, {activeReport.region}</span>
                    </div>
                    <div className="text-slate-500 font-medium">
                      Lot Size & Storage: <span className="font-bold text-slate-800">{activeReport.lotSize}</span>
                    </div>
                    {activeReport.cupScore && (
                      <div className="text-emerald-700 font-black">
                        Coffee Specialty Cup Score: {activeReport.cupScore} / 100 (SCA Q-Certified)
                      </div>
                    )}
                    {activeReport.oilOrProteinContent && (
                      <div className="text-teal-800 font-bold">
                        Nutritional Content: {activeReport.oilOrProteinContent}
                      </div>
                    )}
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 w-full sm:w-auto">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Assaying Inspector</div>
                    <div className="font-bold text-slate-900">{activeReport.inspector}</div>
                    <div className="text-[10px] text-slate-400">Certified Date: {activeReport.assayDate}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Book On-Farm Field Assay Modal / Form */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 rounded-3xl p-8 sm:p-10 text-white shadow-lg border border-teal-800/40">
          <div className="max-w-2xl mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <UserCheck className="h-3.5 w-3.5" /> Mobile Agronomist Service
            </div>
            <h3 className="text-2xl font-black text-white">
              Request On-Farm Assay Inspection for Your Harvest
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Schedule a visit from an accredited regional laboratory inspector to test moisture, purity, and grade your grain or coffee lot directly at your farmgate or cooperative warehouse.
            </p>
          </div>

          {inspectionSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              {inspectionSuccess}
            </div>
          ) : (
            <form onSubmit={handleBookInspection} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Grower or Primary Union Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gemechu Desta"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-teal-800 text-white placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Woreda & Farmgate Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ada Woreda, Bishoftu"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-teal-800 text-white placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Produce Category
                </label>
                <div className="flex gap-2">
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-teal-800 text-white text-xs focus:ring-2 focus:ring-teal-400"
                  >
                    <option>Pure White Teff (Magna)</option>
                    <option>Specialty Green Coffee</option>
                    <option>Durum Wheat</option>
                    <option>Humera Sesame</option>
                    <option>Hybrid Maize</option>
                    <option>Red Haricot Beans</option>
                  </select>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-sm whitespace-nowrap"
                  >
                    Book Inspector
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
