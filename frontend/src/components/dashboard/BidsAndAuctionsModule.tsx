"use client";

import { useState } from "react";
import {
  Gavel,
  Clock,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product, BidOffer } from "@/types";

interface Props {
  products: Product[];
  userRole?: string;
  onRefresh?: () => void;
}

export function BidsAndAuctionsModule({ products, userRole = "ROLE_FARMER", onRefresh }: Props) {
  const [selectedLot, setSelectedLot] = useState<Product | null>(null);
  const [bids, setBids] = useState<Record<string, BidOffer[]>>({
    "b0000000-0000-0000-0000-000000000005": [
      {
        id: "bid-1",
        lotId: "b0000000-0000-0000-0000-000000000005",
        buyerId: "a0000000-0000-0000-0000-000000000003",
        buyerName: "Almaz Commercial Millers",
        type: "AUCTION_BID",
        amount: 5850,
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: "bid-2",
        lotId: "b0000000-0000-0000-0000-000000000005",
        buyerId: "u-buyer-2",
        buyerName: "Nekemte Flour & Feed Processing PLC",
        type: "AUCTION_BID",
        amount: 5750,
        status: "OUTBID",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ],
    "b0000000-0000-0000-0000-000000000001": [
      {
        id: "neg-1",
        lotId: "b0000000-0000-0000-0000-000000000001",
        buyerId: "a0000000-0000-0000-0000-000000000003",
        buyerName: "Almaz Commercial Millers",
        type: "NEGOTIATION_OFFER",
        amount: 9200,
        status: "ACTIVE",
        counterNote: "Ready to procure full 150 quintal lot if delivered to Debre Birhan Silo 8 with moisture guarantee < 11.5%.",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ],
  });

  const [counterModalBid, setCounterModalBid] = useState<BidOffer | null>(null);
  const [counterAmount, setCounterAmount] = useState<number>(0);
  const [counterNote, setCounterNote] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const auctionLots = products.filter((p) => p.tradeType === "AUCTION" || p.name.includes("Maize") || p.name.includes("Auction"));
  const negotiableLots = products.filter((p) => p.tradeType === "NEGOTIABLE" || p.name.includes("Teff") || p.name.includes("Coffee"));

  const handleOpenCounter = (bid: BidOffer) => {
    setCounterModalBid(bid);
    setCounterAmount(bid.amount + 150);
    setCounterNote("");
    setFeedback(null);
  };

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterModalBid) return;

    const newOffer: BidOffer = {
      id: "counter-" + Date.now(),
      lotId: counterModalBid.lotId,
      buyerId: counterModalBid.buyerId,
      buyerName: "Farmer Counter-Offer",
      type: "SELLER_COUNTER",
      amount: counterAmount,
      status: "ACTIVE",
      counterNote: counterNote || "Seller counter-offer proposal submitted.",
      createdAt: new Date().toISOString(),
    };

    setBids((prev) => ({
      ...prev,
      [counterModalBid.lotId]: [newOffer, ...(prev[counterModalBid.lotId] || [])],
    }));

    setFeedback(`Counter-offer of ${formatCurrency(counterAmount)} dispatched to buyer.`);
    setTimeout(() => {
      setCounterModalBid(null);
      setFeedback(null);
    }, 2000);
  };

  const handleAcceptOffer = (bid: BidOffer) => {
    setFeedback(`Deal Confirmed! Price locked at ${formatCurrency(bid.amount)}. Buyer has been notified to deposit funds into Escrow.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Feedback Alert */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. Live e-Auctions Header Box */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                e-Auction Trading Desks
              </h3>
              <p className="text-xs text-slate-500">
                Competitive spot bidding with reserve price safeguards and anti-sniping timer extensions (+3 mins).
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {auctionLots.length} Active Auctions
          </span>
        </div>

        {/* Auction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {auctionLots.slice(0, 4).map((lot) => {
            const lotBids = bids[lot.id] || [];
            const highBid = lot.currentHighestBid || (lotBids.length > 0 ? lotBids[0].amount : lot.unitPrice);
            return (
              <div
                key={lot.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 hover:border-amber-400 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                      Live Auction
                    </span>
                    <h4 className="font-bold text-slate-900 text-base mt-1">{lot.name}</h4>
                    <p className="text-xs text-slate-500">{lot.location}</p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block font-semibold">Ends In</span>
                    <span className="font-black text-rose-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 2d 14h 22m
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium">Reserve Price</span>
                    <span className="font-bold text-slate-700 text-sm">
                      {formatCurrency(lot.reservePrice || lot.unitPrice)}
                    </span>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <span className="text-amber-700 block font-bold">Highest Active Bid</span>
                    <span className="font-black text-amber-950 text-base">
                      {formatCurrency(highBid)}
                    </span>
                  </div>
                </div>

                {/* Bid History */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                  <span className="font-bold text-slate-500 block">Bid Audit History ({lotBids.length}):</span>
                  {lotBids.length === 0 ? (
                    <p className="text-slate-400 italic">No bids placed yet. Bidding opens at reserve price.</p>
                  ) : (
                    lotBids.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-white border border-slate-100"
                      >
                        <span className="font-semibold text-slate-800">{b.buyerName}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{formatCurrency(b.amount)}</span>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                              b.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Negotiable Trades Header Box */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Negotiable Price Desks & Counter-Offers
              </h3>
              <p className="text-xs text-slate-500">
                Two-way price discussion between buyer and grower with timestamps and price lock guarantees.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {negotiableLots.length} Negotiable Lots
          </span>
        </div>

        {/* Negotiable Lots Feed */}
        <div className="space-y-4">
          {negotiableLots.slice(0, 3).map((lot) => {
            const lotOffers = bids[lot.id] || [];
            return (
              <div
                key={lot.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded">
                      Negotiable Trade
                    </span>
                    <h4 className="font-bold text-slate-900 text-base mt-1">{lot.name}</h4>
                    <p className="text-xs text-slate-500">
                      Listing Price: <strong>{formatCurrency(lot.unitPrice)} / {lot.unit}</strong> • Qty: {lot.quantityAvailable}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500">
                    Cooperative: <strong className="text-slate-800">{lot.cooperative || "Primary Union"}</strong>
                  </div>
                </div>

                {/* Offers List */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500 block">Active Price Proposals:</span>
                  {lotOffers.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No buyer proposals submitted yet.</p>
                  ) : (
                    lotOffers.map((offer) => (
                      <div
                        key={offer.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{offer.buyerName}</span>
                            <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              Proposed: {formatCurrency(offer.amount)}
                            </span>
                          </div>
                          {offer.counterNote && (
                            <p className="text-xs text-slate-600 italic">"{offer.counterNote}"</p>
                          )}
                        </div>

                        {userRole === "ROLE_FARMER" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAcceptOffer(offer)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                            >
                              Accept & Lock Price
                            </button>
                            <button
                              onClick={() => handleOpenCounter(offer)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                            >
                              Counter-Offer
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Send Counter-Offer */}
      {counterModalBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  Counter-Proposal
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Submit Counter-Offer</h3>
                <p className="text-xs text-slate-500">Buyer offered: {formatCurrency(counterModalBid.amount)}</p>
              </div>
              <button
                onClick={() => setCounterModalBid(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendCounter} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Your Counter Price (ETB)
                </label>
                <input
                  type="number"
                  min={counterModalBid.amount + 50}
                  step="50"
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-lg text-slate-900 focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Proposal Notes / Terms
                </label>
                <textarea
                  rows={3}
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  placeholder="e.g. Can meet at this price if pickup is completed by Friday from Silo #4."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCounterModalBid(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1c4482] hover:bg-blue-800 text-white text-xs font-bold transition shadow-xs"
                >
                  Dispatch Counter-Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
