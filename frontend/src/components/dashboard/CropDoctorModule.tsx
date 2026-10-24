"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Sprout,
  AlertTriangle,
  FlaskConical,
  Leaf,
  Bug,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { CROP_DOCTOR_DATABASE } from "@/lib/agribazaar";
import { CropDoctorDiagnosis } from "@/types";

export function CropDoctorModule() {
  const cropList = Object.keys(CROP_DOCTOR_DATABASE);
  const [selectedCrop, setSelectedCrop] = useState<string>(cropList[0]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<CropDoctorDiagnosis>(
    CROP_DOCTOR_DATABASE[cropList[0]][0]
  );

  const availableIssues = CROP_DOCTOR_DATABASE[selectedCrop] || [];

  const handleSelectCrop = (crop: string) => {
    setSelectedCrop(crop);
    if (CROP_DOCTOR_DATABASE[crop] && CROP_DOCTOR_DATABASE[crop].length > 0) {
      setSelectedDiagnosis(CROP_DOCTOR_DATABASE[crop][0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Crop Doctor — Clinical Diagnostics Desk
            </h3>
            <p className="text-xs text-slate-500">
              Immediate pathology identification, chemical dosages, and certified organic bio-controls.
            </p>
          </div>
        </div>

        <Link
          href="/crop-doctor"
          className="text-emerald-700 hover:text-emerald-800 text-xs font-bold flex items-center gap-1 underline"
        >
          <span>Open Full Pathology Encyclopedia</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Crop Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {cropList.map((crop) => (
          <button
            key={crop}
            onClick={() => handleSelectCrop(crop)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
              selectedCrop === crop
                ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {crop}
          </button>
        ))}
      </div>

      {/* Disease Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Issues List */}
        <div className="md:col-span-5 space-y-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Observed Pathologies ({availableIssues.length}):
          </span>
          {availableIssues.map((diag) => {
            const isSelected = selectedDiagnosis.issue === diag.issue;
            return (
              <div
                key={diag.issue}
                onClick={() => setSelectedDiagnosis(diag)}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-500 shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{diag.issue}</span>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      diag.severity === "CRITICAL"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {diag.severity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Diagnosis & Treatment Box */}
        <div className="md:col-span-7 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {selectedDiagnosis.crop} Pathology
              </span>
              <span className="text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                {selectedDiagnosis.severity} ALERT
              </span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 mt-1">
              {selectedDiagnosis.issue}
            </h4>
          </div>

          <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
            {selectedDiagnosis.pathologyExplanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 space-y-1">
              <span className="font-bold text-blue-900 flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                Chemical Remedy
              </span>
              <p className="text-blue-950 font-medium">{selectedDiagnosis.chemicalRemedy}</p>
            </div>

            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-900 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                Organic Bio-Control
              </span>
              <p className="text-emerald-950 font-medium">{selectedDiagnosis.organicRemedy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
