"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold">Procurement Cart</h2>
                <p className="text-xs text-slate-300">
                  {totalItems} {totalItems === 1 ? "commodity lot" : "commodity lots"} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse verified commodity lots from certified farmer cooperatives and add them to your procurement cart.
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-block mt-2 text-xs font-bold text-teal-700 bg-teal-50 px-4 py-2 rounded-lg hover:bg-teal-100 transition"
                >
                  Explore Commodity Exchange &rarr;
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="h-16 w-16 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-2xl flex-shrink-0">
                    🌾
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.cooperative || item.farmerName} &bull; {item.location}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-slate-400 hover:text-red-500 transition p-1"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {item.assayGrade && (
                      <span className="inline-block mt-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {item.assayGrade}
                      </span>
                    )}

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {formatCurrency(item.unitPrice)}/{item.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 px-6 py-5 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Subtotal ({totalItems} units)</span>
                <span className="text-base font-extrabold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-teal-50/70 border border-teal-200 text-[11px] text-teal-900">
                <ShieldCheck className="h-4 w-4 text-teal-700 flex-shrink-0" />
                <span>Protected by AgriMarket Trade Escrow until physical handover inspection.</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full btn-brand py-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Full Checkout
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 py-2.5 rounded-lg text-xs font-bold text-center transition"
                >
                  Keep Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
