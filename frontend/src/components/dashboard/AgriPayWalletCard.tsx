"use client";

import { useState, useEffect } from "react";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Building2,
  CheckCircle2,
  Receipt,
  RefreshCw,
  CreditCard,
  History,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getMyWallet, getMyWalletLedger, depositFunds, withdrawFunds } from "@/lib/agribazaar";
import { Wallet, WalletLedgerEntry } from "@/types";

interface Props {
  userRole?: string;
}

export function AgriPayWalletCard({ userRole = "FARMER" }: Props) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [ledger, setLedger] = useState<WalletLedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<"DEPOSIT" | "WITHDRAW" | null>(null);
  const [amountInput, setAmountInput] = useState<number>(5000);
  const [bankInput, setBankInput] = useState("Commercial Bank of Ethiopia - Acct #100029384729");
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [wData, lData] = await Promise.all([getMyWallet(), getMyWalletLedger()]);
      setWallet(wData);
      setLedger(lData);
    } catch (err) {
      console.error("Wallet loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountInput || amountInput <= 0) return;
    setProcessing(true);
    setFeedback(null);

    try {
      if (modalType === "DEPOSIT") {
        const updated = await depositFunds(amountInput);
        setWallet(updated);
        setFeedback(`Successfully deposited ${formatCurrency(amountInput)} into your AgriPay Wallet!`);
      } else {
        const updated = await withdrawFunds(amountInput, bankInput);
        setWallet(updated);
        setFeedback(`Payout transfer of ${formatCurrency(amountInput)} scheduled to your registered bank account!`);
      }
      const newLedger = await getMyWalletLedger();
      setLedger(newLedger);
      setTimeout(() => {
        setModalType(null);
        setFeedback(null);
      }, 2500);
    } catch (err: any) {
      setFeedback(err.message || "Wallet transaction failed. Please check funds.");
    } finally {
      setProcessing(false);
    }
  };

  const balance = wallet?.balance ?? (userRole === "ROLE_BUYER" ? 385000 : 142000);
  const escrowLocked = wallet?.escrowLocked ?? (userRole === "ROLE_BUYER" ? 94000 : 0);

  return (
    <div className="space-y-6">
      {/* Wallet Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1c4482] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-900/50 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-radial from-blue-500/10 to-transparent pointer-events-none rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>AgriPay Escrow & Settlement Stack</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AgriPay Digital Wallet
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Double-entry financial ledger securing trade deposits, holding consignment funds safely in escrow, and releasing automated payouts directly to registered bank accounts upon verified delivery acceptance.
            </p>
          </div>

          {/* Balance Widget */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-left min-w-[200px]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200 block">
                Available Cash Balance
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
                {formatCurrency(balance)}
              </div>
              <span className="text-[10px] text-emerald-300 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Fully Liquid for Withdrawal
              </span>
            </div>

            {escrowLocked > 0 && (
              <div className="bg-amber-500/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-amber-400/20 text-left min-w-[180px]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-200 block flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" /> Locked in Escrow
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {formatCurrency(escrowLocked)}
                </div>
                <span className="text-[10px] text-amber-200 font-medium block mt-1">
                  Pending Consignment Inspection
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setModalType("DEPOSIT")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Top-up / Deposit Funds</span>
          </button>

          <button
            onClick={() => setModalType("WITHDRAW")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition border border-white/20"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw Payout to Bank</span>
          </button>

          <button
            onClick={loadWalletData}
            disabled={loading}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-blue-200 hover:text-white text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-300" : ""}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {/* Double-Entry Transaction Ledger Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-slate-900 text-base">
              Double-Entry Financial Audit Ledger
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Immutable Transaction Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Timestamp & Ref</th>
                <th className="py-3 px-4">Transaction Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Entry</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {ledger.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No transactions recorded yet in this AgriPay account.
                  </td>
                </tr>
              ) : (
                ledger.map((entry) => {
                  const isCredit = entry.entryType === "CREDIT";
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        <div>{new Date(entry.createdAt).toLocaleDateString()}</div>
                        <span className="text-[10px] text-slate-400">{entry.referenceId}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                          {entry.transactionType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                        {entry.description}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-extrabold text-[10px] px-2 py-0.5 rounded-full ${
                            isCredit ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {entry.entryType}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-bold text-sm ${
                          isCredit ? "text-rose-600" : "text-emerald-700"
                        }`}
                      >
                        {isCredit ? "-" : "+"}
                        {formatCurrency(entry.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                        {formatCurrency(entry.balanceAfter)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Deposit or Withdraw */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  AgriPay Gateway
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {modalType === "DEPOSIT" ? "Top-up Wallet Balance" : "Request Payout Withdrawal"}
                </h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  feedback.includes("Successfully") || feedback.includes("scheduled")
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handleAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Amount in Ethiopian Birr (ETB)
                </label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={amountInput}
                  onChange={(e) => setAmountInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-extrabold text-xl text-slate-900 focus:ring-2 focus:ring-blue-600"
                  placeholder="5000"
                  required
                />
              </div>

              {modalType === "WITHDRAW" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Bank Account Details
                  </label>
                  <input
                    type="text"
                    value={bankInput}
                    onChange={(e) => setBankInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              )}

              {modalType === "DEPOSIT" && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
                  <span className="font-bold text-slate-700 block">Instant Payment Channels Supported:</span>
                  <p>Telebirr, CBE Birr, Awash Bank, Nib Bank, or International Bank Wire.</p>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold transition shadow-xs ${
                    modalType === "DEPOSIT"
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-[#1c4482] hover:bg-blue-800"
                  }`}
                >
                  {processing ? "Processing Transaction..." : modalType === "DEPOSIT" ? "Deposit Funds" : "Authorize Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
