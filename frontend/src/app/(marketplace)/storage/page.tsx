"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  ShieldCheck,
  CheckCircle,
  ChevronRight,
  Calculator,
  PhoneCall,
  Calendar,
  Layers,
  ArrowRight,
  X,
  FileCheck,
} from "lucide-react";
import { ETHIOPIA_WAREHOUSES, CertifiedWarehouse } from "@/lib/ethiopia-data";
import { formatCurrency } from "@/lib/utils";

export default function StoragePage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<CertifiedWarehouse | null>(null);

  // Storage Calculator State
  const [calcQty, setCalcQty] = useState<number>(100); // Quintals
  const [calcMonths, setCalcMonths] = useState<number>(3); // Months
  const [calcRate, setCalcRate] = useState<number>(16); // ETB/Qtl/Month

  // Booking Modal
  const [bookingWarehouse, setBookingWarehouse] = useState<CertifiedWarehouse | null>(null);
  const [farmerName, setFarmerName] = useState("");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [commodityType, setCommodityType] = useState("Magna White Teff");
  const [depositQty, setDepositQty] = useState(50);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const totalStorageFee = calcQty * calcRate * calcMonths;
  const insuranceAndFumigationFee = Math.round(totalStorageFee * 0.08); // 8% standard
  const grandTotalFee = totalStorageFee + insuranceAndFumigationFee;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingWarehouse) return;

    const receiptNo = `e-NWR-ETH-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingSuccess(`Storage booked successfully at ${bookingWarehouse.name}! Your Electronic Warehouse Receipt reservation code is: ${receiptNo}. Manager ${bookingWarehouse.managerName} (${bookingWarehouse.contactPhone}) has been notified.`);

    setTimeout(() => {
      setBookingWarehouse(null);
      setBookingSuccess(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-teal-600 transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-bold text-slate-800">Electronic Warehouse Receipts (e-NWR) & Public Silos</span>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 p-8 sm:p-12 text-white shadow-xl overflow-hidden mb-10">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Building2 className="h-4 w-4" />
              Scientific Agro-Warehousing & Electronic Receipts
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Certified Public Silos & <span className="text-emerald-400">e-NWR Storage</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Store your harvests in WDRA and ECX certified regional warehouses to prevent post-harvest spoilage and distress sales. Convert your warehouse receipts into bank collateral for working capital credit.
            </p>
          </div>
        </div>

        {/* Interactive Storage Fee Calculator */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-2xl bg-teal-100 text-teal-800">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Official Ethiopian Warehouse Storage Calculator
              </h2>
              <p className="text-xs text-slate-500">
                Estimate standard monthly storage, continuous aerated fumigation, and insurance costs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Warehouse Hub
              </label>
              <select
                onChange={(e) => {
                  const wh = ETHIOPIA_WAREHOUSES.find((w) => w.id === e.target.value);
                  if (wh) setCalcRate(wh.storageRatePerQtlMonth);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {ETHIOPIA_WAREHOUSES.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.storageRatePerQtlMonth} ETB/Qtl/mo)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Commodity Volume (Quintals / 100kg)
              </label>
              <input
                type="number"
                min={10}
                step={10}
                value={calcQty}
                onChange={(e) => setCalcQty(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Planned Duration (Months)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={calcMonths}
                onChange={(e) => setCalcMonths(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
              <div className="text-[10px] uppercase font-bold text-teal-800">Estimated Total Storage Fee</div>
              <div className="text-xl font-black text-teal-950">
                {formatCurrency(grandTotalFee)}
              </div>
              <div className="text-[10px] text-teal-700 mt-0.5">
                Includes {formatCurrency(insuranceAndFumigationFee)} comprehensive indemnity
              </div>
            </div>
          </div>
        </div>

        {/* Certified Warehouses Grid */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Network of Certified Public Warehouses & Silos
              </h2>
              <p className="text-xs text-slate-500">
                Operated under Ethiopian Commodity Exchange (ECX) and WDRA regulatory supervision
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800">
              180,000 MT Total Supervised Silo Capacity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ETHIOPIA_WAREHOUSES.map((wh) => {
              const utilizedPercent = Math.round(
                ((wh.totalCapacityMT - wh.availableCapacityMT) / wh.totalCapacityMT) * 100
              );

              return (
                <div
                  key={wh.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {wh.code}
                      </span>
                      {wh.wdraCertified && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> WDRA Certified
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-snug">
                        {wh.name}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                        <span>{wh.location} ({wh.region})</span>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-500">Available Space:</span>
                        <span className="font-bold text-slate-800">
                          {wh.availableCapacityMT.toLocaleString()} MT / {wh.totalCapacityMT.toLocaleString()} MT
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-teal-600 h-2 rounded-full transition-all"
                          style={{ width: `${utilizedPercent}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-right text-slate-400 font-medium">
                        {utilizedPercent}% Occupied
                      </div>
                    </div>

                    {/* Facilities list */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Infrastructure:</div>
                      {wh.facilities.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-slate-700">
                          <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Tariff</div>
                      <div className="text-base font-black text-slate-900">
                        {wh.storageRatePerQtlMonth} ETB
                        <span className="text-[10px] font-normal text-slate-500 ml-0.5">/Qtl/mo</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setBookingWarehouse(wh)}
                      className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      Book Deposit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Book Warehouse Deposit Modal */}
        {bookingWarehouse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setBookingWarehouse(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="p-2 rounded-xl bg-teal-100 text-teal-800">
                  <FileCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Book Inward Grain Deposit
                  </h3>
                  <p className="text-xs text-slate-500">{bookingWarehouse.name}</p>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold space-y-2">
                  <div className="flex items-center gap-2 font-black text-sm text-emerald-900">
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                    Reservation Confirmed!
                  </div>
                  <p className="leading-relaxed">{bookingSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Grower / Primary Cooperative Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gemechu Desta or Oda Gida Union"
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Phone (Ethiopia +251)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0911 234 567"
                      value={farmerPhone}
                      onChange={(e) => setFarmerPhone(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Commodity
                      </label>
                      <input
                        type="text"
                        value={commodityType}
                        onChange={(e) => setCommodityType(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Deposit Volume (Quintals)
                      </label>
                      <input
                        type="number"
                        min={5}
                        value={depositQty}
                        onChange={(e) => setDepositQty(Number(e.target.value))}
                        required
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Standard Silo Tariff:</span>
                      <span className="font-bold text-slate-800">
                        {bookingWarehouse.storageRatePerQtlMonth} ETB / Qtl / Month
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Deposit Location:</span>
                      <span className="font-bold text-slate-800">{bookingWarehouse.location}</span>
                    </div>
                    <div className="flex justify-between text-teal-700 font-bold">
                      <span>Electronic Receipt (e-NWR):</span>
                      <span>Automated Issuance</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingWarehouse(null)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs"
                    >
                      Confirm Storage Deposit
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
