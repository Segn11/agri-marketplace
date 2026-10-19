"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gavel,
  Clock,
  Building2,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  X,
  TrendingUp,
  FileText,
} from "lucide-react";
import {
  AuctionTender,
  INITIAL_AUCTIONS,
  getStoredAuctions,
  placeAuctionBid,
} from "@/lib/ethiopia-data";
import { formatCurrency } from "@/lib/utils";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<AuctionTender[]>(INITIAL_AUCTIONS);
  const [selectedAuction, setSelectedAuction] = useState<AuctionTender | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidderName, setBidderName] = useState<string>("");
  const [bidderOrg, setBidderOrg] = useState<string>("");
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);
  const [bidError, setBidError] = useState<string | null>(null);

  // New Tender Modal
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newCommodity, setNewCommodity] = useState("");
  const [newQty, setNewQty] = useState(1000);
  const [newBasePrice, setNewBasePrice] = useState(5000);
  const [newHub, setNewHub] = useState("Adama Central Silo Reserve");

  useEffect(() => {
    setAuctions(getStoredAuctions());
  }, []);

  const handleOpenBidModal = (auc: AuctionTender) => {
    setSelectedAuction(auc);
    setBidAmount(auc.currentHighestBid + 100);
    setBidSuccess(null);
    setBidError(null);
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction) return;

    if (bidAmount <= selectedAuction.currentHighestBid) {
      setBidError(`Bid must exceed current highest bid of ${formatCurrency(selectedAuction.currentHighestBid)}`);
      return;
    }

    const success = placeAuctionBid(selectedAuction.id, bidAmount);
    if (success) {
      setBidSuccess(`Bid of ${formatCurrency(bidAmount)} submitted successfully for lot ${selectedAuction.id}!`);
      setAuctions(getStoredAuctions());
      setTimeout(() => {
        setSelectedAuction(null);
        setBidSuccess(null);
      }, 2000);
    } else {
      setBidError("Failed to record bid. Please try again.");
    }
  };

  const handleCreateTender = (e: React.FormEvent) => {
    e.preventDefault();
    const newAuction: AuctionTender = {
      id: `auc-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      organization: newOrg,
      organizationType: "Commercial Miller / Processor",
      commodity: newCommodity,
      quantityTotal: Number(newQty),
      unit: "Quintal (100kg)",
      basePrice: Number(newBasePrice),
      currentHighestBid: Number(newBasePrice),
      totalBidsPlaced: 1,
      location: newHub,
      deliveryHub: newHub,
      assayRequirements: "ECX Grade 1 Assayed, Moisture < 12.0%",
      deadlineHoursRemaining: 48,
      status: "LIVE",
      verifiedECX: true,
    };

    const current = getStoredAuctions();
    const updated = [newAuction, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem("agri_auctions", JSON.stringify(updated));
    }
    setAuctions(updated);
    setIsCreateOpen(false);
    // Reset form
    setNewTitle("");
    setNewOrg("");
    setNewCommodity("");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-teal-600 transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-bold text-slate-800">Electronic Auctions & Institutional Tenders</span>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 p-8 sm:p-12 text-white shadow-xl overflow-hidden mb-10">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Gavel className="h-4 w-4" />
              Digital Commodity Auctions & Bulk Reverse Tenders
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Institutional Agricultural <span className="text-amber-400">e-Auctions</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Connect primary farmer cooperative unions directly with government food reserves, commercial flour mills, beverage breweries, and certified export syndicates through transparent digital price discovery.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-sm flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Publish Bulk Procurement Tender
              </button>
              <Link
                href="/products"
                className="px-5 py-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white font-bold text-xs transition border border-teal-600"
              >
                Explore Spot Lots
              </Link>
            </div>
          </div>
        </div>

        {/* Active Auctions Grid */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Active Ethiopian Electronic Tenders
              </h2>
              <p className="text-xs text-slate-500">
                Live bidding with automated anti-overselling and instant escrow settlement
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-teal-100 text-teal-800">
              {auctions.length} Live Institutional Lots
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {auctions.map((auc) => (
              <div
                key={auc.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {auc.deadlineHoursRemaining}h Remaining
                    </span>
                    {auc.verifiedECX && (
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                        ECX Assayed
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {auc.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{auc.organization}</span>
                      <span className="text-slate-300">•</span>
                      <span>{auc.organizationType}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Commodity:</span>
                      <span className="font-bold text-slate-800">{auc.commodity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Lot Volume:</span>
                      <span className="font-bold text-slate-800">
                        {auc.quantityTotal.toLocaleString()} {auc.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Delivery Depot:</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-teal-600" /> {auc.deliveryHub}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500 font-medium">Assay Standard:</span>
                      <span className="font-bold text-teal-700">{auc.assayRequirements}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Current Highest Bid</div>
                    <div className="text-xl font-black text-slate-900">
                      {formatCurrency(auc.currentHighestBid)}
                      <span className="text-xs font-normal text-slate-500 ml-1">/ {auc.unit}</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {auc.totalBidsPlaced} bids placed (Base: {formatCurrency(auc.basePrice)})
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenBidModal(auc)}
                    className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Gavel className="h-3.5 w-3.5" />
                    Place Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Place Bid Modal */}
        {selectedAuction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setSelectedAuction(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Gavel className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Submit Competitive Bid</h3>
                  <p className="text-xs text-slate-500">{selectedAuction.id} • {selectedAuction.title}</p>
                </div>
              </div>

              {bidSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 mb-4">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  {bidSuccess}
                </div>
              )}

              {bidError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 mb-4">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  {bidError}
                </div>
              )}

              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Highest Bid:</span>
                    <span className="font-bold text-slate-900">{formatCurrency(selectedAuction.currentHighestBid)} / {selectedAuction.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lot Quantity:</span>
                    <span className="font-bold text-slate-900">{selectedAuction.quantityTotal.toLocaleString()} {selectedAuction.unit}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Bid Offer (ETB per {selectedAuction.unit})
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={selectedAuction.currentHighestBid + 10}
                    step={10}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Total Estimated Contract Value: {formatCurrency(bidAmount * selectedAuction.quantityTotal)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Authorized Bidder Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dawit Tadesse"
                    value={bidderName}
                    onChange={(e) => setBidderName(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enterprise / Cooperative Union Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ada Primary Grain Growers Union"
                    value={bidderOrg}
                    onChange={(e) => setBidderOrg(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAuction(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs"
                  >
                    Confirm & Transmit Bid
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Publish Tender Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-xl bg-teal-100 text-teal-800">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Publish Institutional Bulk Tender</h3>
                  <p className="text-xs text-slate-500">Initiate digital price bidding for commercial procurement</p>
                </div>
              </div>

              <form onSubmit={handleCreateTender} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tender Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 5,000 Quintals White Maize Supply"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Procuring Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. National Food Processing PLC"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Commodity</label>
                    <input
                      type="text"
                      placeholder="e.g. White Maize"
                      value={newCommodity}
                      onChange={(e) => setNewCommodity(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quantity (Quintals)</label>
                    <input
                      type="number"
                      value={newQty}
                      onChange={(e) => setNewQty(Number(e.target.value))}
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Base Price (ETB/Qtl)</label>
                    <input
                      type="number"
                      value={newBasePrice}
                      onChange={(e) => setNewBasePrice(Number(e.target.value))}
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Depot</label>
                    <input
                      type="text"
                      value={newHub}
                      onChange={(e) => setNewHub(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs"
                  >
                    Publish Tender Live
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
