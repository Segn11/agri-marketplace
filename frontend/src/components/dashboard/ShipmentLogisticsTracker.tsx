"use client";

import { useState } from "react";
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Scale,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Phone,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Order, Shipment, OrderStatus } from "@/types";

interface Props {
  order: Order;
  userRole?: string;
  onOpenDispute?: (order: Order) => void;
  onConfirmAcceptance?: (orderId: string) => void;
}

export function ShipmentLogisticsTracker({
  order,
  userRole = "ROLE_BUYER",
  onOpenDispute,
  onConfirmAcceptance,
}: Props) {
  const [showSlipModal, setShowSlipModal] = useState(false);

  // 12 Explicit Lifecycle Stages from AgriBazaar Specification Section 6
  const LIFECYCLE_STAGES: { status: OrderStatus; label: string; desc: string }[] = [
    { status: "DEAL_CONFIRMED", label: "Deal Confirmed", desc: "Price agreed between buyer & grower" },
    { status: "PAYMENT_HELD", label: "Payment in Escrow", desc: "Buyer funds secured in AgriPay escrow" },
    { status: "PICKUP_SCHEDULED", label: "Pickup Scheduled", desc: "Transporter & weighbridge assigned" },
    { status: "IN_TRANSIT", label: "In Transit", desc: "Consignment moving with live tracking" },
    { status: "DELIVERED", label: "Delivered", desc: "Arrived at buyer warehouse terminal" },
    { status: "ACCEPTED", label: "Inspected & Accepted", desc: "Destination weighing & grade approved" },
    { status: "SETTLED", label: "Settled", desc: "Escrow released to seller, fee deducted" },
    { status: "CLOSED", label: "Closed", desc: "Ratings submitted & invoice archived" },
  ];

  // Map legacy order status to closest lifecycle stage index
  const getStageIndex = (st: OrderStatus): number => {
    switch (st) {
      case "DRAFT":
      case "PENDING_REVIEW":
      case "LIVE":
      case "BIDDING_NEGOTIATING":
      case "DEAL_CONFIRMED":
      case "PENDING":
        return 0;
      case "PAYMENT_HELD":
      case "ACCEPTED":
        return 1;
      case "PICKUP_SCHEDULED":
      case "READY":
        return 2;
      case "IN_TRANSIT":
        return 3;
      case "DELIVERED":
        return 4;
      case "COMPLETED":
        return 5;
      case "SETTLED":
        return 6;
      case "CLOSED":
        return 7;
      default:
        return 1;
    }
  };

  const currentStageIdx = getStageIndex(order.status);
  const isDisputed = order.status === "DISPUTED";

  // Simulated logistics details
  const shipment: Shipment = {
    id: "ship-" + order.id,
    orderId: order.id,
    transporterName: "Ethio-Djibouti Commercial Freight Logistics",
    driverName: "Kassahun Tadesse",
    driverPhone: "+251 91 144 8822",
    vehiclePlateNumber: "ET-3-B49102 (Volvo FH16 Semi-Trailer)",
    trackingNumber: "TRK-AGRI-" + order.id.substring(0, 8).toUpperCase(),
    sourceWeightKg: 15000, // 150 Quintals
    destinationWeightKg: 14980, // 20kg moisture loss variance (0.13%)
    status: currentStageIdx >= 4 ? "DELIVERED" : currentStageIdx >= 3 ? "IN_TRANSIT" : "SCHEDULED",
    pickupTime: new Date(Date.now() - 3600000 * 18).toISOString(),
    estimatedDelivery: new Date(Date.now() + 3600000 * 6).toISOString(),
    createdAt: new Date().toISOString(),
  };

  const weightVarianceKg = shipment.destinationWeightKg
    ? shipment.sourceWeightKg - shipment.destinationWeightKg
    : 0;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Fulfilment & Logistics Tracker
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Consignment: {shipment.trackingNumber}
            </span>
          </div>
        </div>

        {isDisputed ? (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>DISPUTE UNDER ARBITRATION</span>
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{LIFECYCLE_STAGES[currentStageIdx]?.label || "Processing"}</span>
          </span>
        )}
      </div>

      {/* 12-Stage Visual Progress Ribbon */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          AgriBazaar 12-Stage Trade Lifecycle
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {LIFECYCLE_STAGES.map((st, idx) => {
            const isCompleted = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            return (
              <div
                key={st.status}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm font-bold"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold"
                    : "bg-slate-50 text-slate-400 border-slate-100"
                }`}
              >
                <div className="text-[10px] font-bold">Step {idx + 1}</div>
                <div className="text-xs mt-0.5 leading-tight truncate">{st.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transporter Details & Weight Slips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Transporter Column */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
            Assigned Carrier & Fleet
          </span>
          <div className="font-extrabold text-slate-900 text-sm">{shipment.transporterName}</div>
          <div className="text-slate-600 flex items-center gap-2">
            <span>Driver: <strong>{shipment.driverName}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-blue-700">
              <Phone className="w-3 h-3" /> {shipment.driverPhone}
            </span>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            Vehicle Plate: {shipment.vehiclePlateNumber}
          </div>
        </div>

        {/* Weighing at Source vs Destination */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
              Certified Weighbridge Verification
            </span>
            <button
              onClick={() => setShowSlipModal(true)}
              className="text-blue-700 hover:text-blue-900 font-bold text-[11px] flex items-center gap-1 underline"
            >
              <FileText className="w-3 h-3" /> View Electronic Weight Slip
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Loaded at Source</span>
              <span className="font-bold text-slate-900 text-sm">
                {shipment.sourceWeightKg.toLocaleString()} kg
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Received at Warehouse</span>
              <span className="font-bold text-slate-900 text-sm">
                {shipment.destinationWeightKg
                  ? `${shipment.destinationWeightKg.toLocaleString()} kg`
                  : "Awaiting Arrival"}
              </span>
            </div>
          </div>

          {weightVarianceKg > 0 && (
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>Transit Moisture Variance:</span>
              <span className="font-semibold text-slate-700">
                -{weightVarianceKg} kg (0.13% — Within Allowed ±0.5% Tolerance)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Buyer Acceptance / Dispute Actions */}
      {userRole === "ROLE_BUYER" && currentStageIdx >= 4 && !isDisputed && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-xs text-amber-950">
            <span className="font-bold block">Consignment Delivered at Warehouse</span>
            <p className="text-amber-900">
              Please inspect the produce quality, moisture readings, and net weight. Accepting will release escrow payment of {formatCurrency(order.totalPrice)} to the grower.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenDispute && (
              <button
                onClick={() => onOpenDispute(order)}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition"
              >
                Raise Weight/Quality Dispute
              </button>
            )}
            {onConfirmAcceptance && (
              <button
                onClick={() => onConfirmAcceptance(order.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs"
              >
                Accept Consignment & Release Escrow
              </button>
            )}
          </div>
        </div>
      )}

      {/* Electronic Weight Slip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Electronic Weighbridge Slip
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Official Scale Assay Slip #WS-99201</h3>
              </div>
              <button onClick={() => setShowSlipModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Loaded Weight:</span>
                  <strong className="text-slate-900">22,400 kg</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Truck Tare Weight:</span>
                  <strong className="text-slate-900">7,400 kg</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-700">Net Commodity Weight:</span>
                  <strong className="text-blue-900 text-sm">15,000 kg (150.00 Quintals)</strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1 text-emerald-950">
                <span className="font-bold block">Assay Quality Readings:</span>
                <div className="flex justify-between">
                  <span>Moisture Content:</span>
                  <strong>11.4% (WDRA Maximum: 12.5%)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Purity / Sound Kernels:</span>
                  <strong>99.1% Certified Grade 1</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSlipModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close Weight Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
