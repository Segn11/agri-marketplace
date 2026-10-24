"use client";

import { useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Percent,
  Coins,
  Building2,
  FileText,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getFarmerCreditOffer, KisanCreditOffer } from "@/lib/agribazaar";

interface Props {
  farmerName?: string;
  landHectares?: number;
}

export function KisanFinanceModule({ farmerName = "Gemechu Desta", landHectares = 3.5 }: Props) {
  const [offer, setOffer] = useState<KisanCreditOffer>(getFarmerCreditOffer(farmerName, landHectares));
  const [drawdownAmount, setDrawdownAmount] = useState<number>(25000);
  const [drawdownSuccess, setDrawdownSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"card" | "repay">("card");

  const handleDrawdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawdownAmount > offer.availableCreditETB) return;
    setOffer((prev) => ({
      ...prev,
      availableCreditETB: prev.availableCreditETB - drawdownAmount,
    }));
    setDrawdownSuccess(true);
    setTimeout(() => setDrawdownSuccess(false), 3500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Kisan Safalta Seasonal Credit Facility
            </h3>
            <p className="text-xs text-slate-500">
              Timely harvest-linked seasonal finance for inputs, seeds, and tractor mechanization with zero collateral.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>PRE-APPROVED CREDIT LINE</span>
        </span>
      </div>

      {/* Credit Card Graphic & Key Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Physical Digital Card */}
        <div className="lg:col-span-5">
          <div className="bg-gradient-to-tr from-slate-950 via-amber-900 to-amber-700 rounded-3xl p-6 text-white shadow-xl border border-amber-500/30 space-y-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-40 h-40 bg-radial from-amber-400/20 to-transparent pointer-events-none rounded-full" />
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                KISAN SAFALTA CARD
              </span>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                Cooperative Banking
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-amber-200/80">Available Credit Limit</span>
              <div className="text-3xl font-black text-white tracking-tight">
                {formatCurrency(offer.availableCreditETB)}
              </div>
            </div>

            <div className="flex items-end justify-between text-xs pt-4 border-t border-white/15">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-amber-200/60 block">Cardholder</span>
                <span className="font-extrabold text-sm">{offer.farmerName}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-amber-200/60 block">Maturity Date</span>
                <span className="font-mono text-xs">{offer.harvestSettlementDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Parameters */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                Grace Period
              </span>
              <span className="text-lg font-black text-slate-900 mt-1 block">
                {offer.gracePeriodDays} Days
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">0.0% Interest During Growth</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                Post-Harvest APR
              </span>
              <span className="text-lg font-black text-slate-900 mt-1 block">
                {offer.interestRateAnnual}% p.a.
              </span>
              <span className="text-[10px] text-blue-600 font-medium">Subsidized Bank Rate</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                Repayment Mechanism
              </span>
              <span className="text-sm font-black text-slate-900 mt-1 block">
                Escrow Deduction
              </span>
              <span className="text-[10px] text-slate-500">Auto-cleared from harvest sales</span>
            </div>
          </div>

          {/* Quick Drawdown Form */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
            <span className="font-bold text-xs text-amber-950 block">
              Drawdown Capital to AgriPay Wallet for Input Procurement
            </span>
            {drawdownSuccess ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Funds disbursed directly into your AgriPay Wallet! Available immediately.</span>
              </div>
            ) : (
              <form onSubmit={handleDrawdown} className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="1000"
                    max={offer.availableCreditETB}
                    step="1000"
                    value={drawdownAmount}
                    onChange={(e) => setDrawdownAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 font-bold text-sm text-slate-900 bg-white"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">ETB</span>
                </div>
                <button
                  type="submit"
                  disabled={drawdownAmount > offer.availableCreditETB}
                  className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition shadow-xs whitespace-nowrap"
                >
                  Disburse to Wallet
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
