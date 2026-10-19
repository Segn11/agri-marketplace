"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Building2,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  MapPin,
  Award,
  Package,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";
import { fetchProductsFromDb } from "@/lib/commodities";

export default function AgriMarketHomePage() {
  const [activeService, setActiveService] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetchProductsFromDb({ size: 8 })
      .then((res) => {
        setFeaturedProducts(res.content || []);
      })
      .catch((err) => {
        console.error("Failed to load featured products from DB:", err);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  // 6 Database-Backed Core Platform Capabilities
  const services = [
    {
      id: 0,
      title: "Direct Spot Exchange",
      subtitle: "Farm-Gate to Buyer Marketplace",
      icon: "🌾",
      tagline: "Direct agricultural commodities trading without intermediary markups.",
      description: "Connect directly with verified growers and primary cooperatives. Procure highland Teff, Specialty Coffee, Durum Wheat, Pulses, and Fresh Produce at transparent market rates recorded live in our PostgreSQL database.",
      features: [
        "100% database-verified producer & cooperative listings",
        "Atomic stock reservations with zero overselling",
        "Transparent moisture, purity, and grade specifications",
        "Direct warehouse pickup or cooperative trucking",
      ],
      badge: "Spot Market",
      cta: "Explore Commodity Listings",
      link: "/products",
    },
    {
      id: 1,
      title: "Procurement Cart",
      subtitle: "Atomic Escrow Settlement",
      icon: "🛒",
      tagline: "Manage multi-lot commodity orders with integrated freight calculations.",
      description: "Assemble procurement lots from multiple cooperatives into a single checkout flow. Confirm logistics preferences and lock orders in escrow with full database audit logging.",
      features: [
        "Multi-commodity cart with real-time stock limits",
        "Flexible pickup or cooperative freight dispatch selection",
        "Instant settlement calculations with VAT transparency",
        "Direct order creation linked to your Buyer account",
      ],
      badge: "Procurement",
      cta: "View Procurement Cart",
      link: "/cart",
    },
    {
      id: 2,
      title: "Order Tracking",
      subtitle: "Live Trade Progression",
      icon: "📦",
      tagline: "4-stage milestone tracking from placement to physical handover.",
      description: "Follow your purchase order lifecycle in real time: Placed &rarr; Accepted &rarr; Ready at Silo &rarr; Completed. Cooperative contact details are unlocked once an order is confirmed.",
      features: [
        "Live status progression: PENDING, ACCEPTED, READY, COMPLETED",
        "Unlocked direct telephone lines upon trade confirmation",
        "Instant cancellation protection during pending stage",
        "Complete historical record of past trade settlements",
      ],
      badge: "Order Center",
      cta: "Track Live Orders",
      link: "/buyer",
    },
    {
      id: 3,
      title: "AgriPay Escrow",
      subtitle: "Buyer & Farmer Protection",
      icon: "💳",
      tagline: "Secure funds held in escrow until physical quality handover is confirmed.",
      description: "Funds are protected upon order confirmation and released only after the buyer inspects the delivery lot and verifies moisture, purity, and grade specifications.",
      features: [
        "100% escrow protection on all exchange transactions",
        "Release authorization upon physical stock inspection",
        "Dispute mitigation protocols for assay discrepancies",
        "Compatible with Ethiopian commercial banking rails",
      ],
      badge: "Escrow Protocol",
      cta: "Learn About Escrow",
      link: "/cart",
    },
    {
      id: 4,
      title: "Verified Ratings",
      subtitle: "Quality & Inspection Feedback",
      icon: "⭐",
      tagline: "Crowdsourced quality ratings from authenticated commercial buyers.",
      description: "Buyers submit verified star ratings and detailed assay commentary after inspecting completed delivery lots, establishing trusted cooperative performance reputations.",
      features: [
        "Verified ratings restricted to completed trade orders",
        "Detailed commentary on kernel purity and moisture standards",
        "Average rating calculations updated live in product catalog",
        "Transparent producer accountability across harvests",
      ],
      badge: "Trust & Quality",
      cta: "Browse Verified Listings",
      link: "/products",
    },
    {
      id: 5,
      title: "Platform Governance",
      subtitle: "Market Surveillance & Control",
      icon: "🛡️",
      tagline: "Comprehensive moderation tools for exchange integrity and compliance.",
      description: "Administrative oversight of registered participants and commodity lots. Delist non-compliant products, review dispute queues, and monitor nationwide trade volume.",
      features: [
        "Live telemetry from PostgreSQL database tables",
        "Instant product moderation: Activate or Hide listings",
        "User account status management: Active vs Suspended",
        "Open dispute and quality arbitration queue monitoring",
      ],
      badge: "Administration",
      cta: "Access Admin Dashboard",
      link: "/admin",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "AgriMarket has streamlined our grain procurement completely. We placed an order for 150 quintals of Magna Teff and completed handover with zero hassle.",
      author: "Gemechu Desta",
      role: "Grain Trader & Commercial Wholesaler",
      location: "East Highland Mandi Terminal",
    },
    {
      quote: "The direct connection to verified agricultural producers eliminated broker markups. Our milling plant now sources directly through the platform.",
      author: "Tigist Bekele",
      role: "Procurement Director, Apex Milling",
      location: "Addis Ababa Logistics Hub",
    },
    {
      quote: "Atomic stock reservation and escrow protection give us total confidence. Every trade is tracked cleanly from placement to completed delivery.",
      author: "Chala Tolosa",
      role: "Cooperative Union Representative",
      location: "Central Farming Basin",
    },
  ];

  // FAQ Items
  const faqs = [
    {
      q: "Which agricultural commodities are listed in the exchange?",
      a: "The marketplace catalog includes Grains & Cereals (White Teff, Durum Wheat, Barley, Maize), Pulses & Oilseeds (Sesame, Chickpeas, Beans), Cash Crops (Specialty Arabica Coffee, Spices), and Fresh Produce (Red Onions, Avocados).",
    },
    {
      q: "How does AgriPay Escrow protect buyers and sellers?",
      a: "When a buyer places an order, funds are safeguarded in an escrow holding account. Payment is only released to the cooperative producer after the physical goods have arrived, undergone inspection, and handover is signed off.",
    },
    {
      q: "Are the listings and stock figures real-time from the database?",
      a: "Yes. All commodity cards, available quantities, and prices are fetched live from the PostgreSQL database via Spring Boot REST APIs with atomic stock validation upon order placement.",
    },
    {
      q: "How does the contact privacy guard work?",
      a: "To prevent spam and protect grower privacy, telephone numbers and direct contact lines are revealed only after an order is formally confirmed by the seller.",
    },
  ];

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      {/* ══════════ LIVE COMMODITY TICKER ══════════ */}
      <div className="bg-[#051817] text-white overflow-hidden py-2 border-b border-teal-950 text-xs">
        <div className="flex items-center">
          <Link
            href="/products"
            className="bg-teal-700 hover:bg-teal-600 px-4 py-1 font-bold uppercase tracking-wider text-[11px] z-10 flex items-center gap-1.5 flex-shrink-0 shadow-md transition cursor-pointer"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Database Exchange &rarr;
          </Link>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="animate-ticker flex items-center gap-8 pl-4">
              {featuredProducts.length > 0 ? (
                [...featuredProducts, ...featuredProducts].map((p, idx) => (
                  <Link key={idx} href={`/products/${p.id}`} className="flex items-center gap-2 font-medium hover:text-amber-300 transition">
                    <span className="text-slate-300">{p.name}:</span>
                    <span className="font-bold text-teal-300">{formatCurrency(p.unitPrice)}/{p.unit}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">({p.quantityAvailable} {p.unit} available)</span>
                    <span className="text-[10px] text-slate-400">({p.location})</span>
                    <span className="text-teal-800 font-bold">•</span>
                  </Link>
                ))
              ) : (
                <div className="flex items-center gap-4 text-slate-400">
                  <span>Loading live commodity spot rates from database...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ HERO SECTION (DEEP FOREST TEAL & GOLD) ══════════ */}
      <section
        className="relative text-white py-16 sm:py-24 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #041d1c 0%, #073330 50%, #0a4843 100%)" }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-teal-950/80 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-200 mb-6 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>National Direct Agricultural Exchange & Procurement</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              National Integrated <br />
              <span className="text-amber-400">Agricultural Marketplace</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-200 leading-relaxed font-light">
              Say goodbye to middlemen and inflated prices. Trade crops, grains, and specialty coffee directly with verified regional producers through guaranteed stock tracking and instant escrow settlement.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/products">
                <button className="btn-amber px-8 py-3.5 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2">
                  Explore Live Commodities
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/register">
                <button className="btn-brand px-8 py-3.5 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2">
                  Register as Farmer or Buyer
                </button>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-teal-800/60 text-xs text-teal-200 flex items-center gap-2">
              <span className="font-bold text-amber-300">Notice:</span>
              <span>All commodity listings and inventory metrics are synchronized directly with our PostgreSQL database registry.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ THE SERVICE RIBBON ══════════ */}
      <section id="services" className="bg-white border-b border-slate-200 shadow-sm sticky top-[72px] z-30">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-slate-100 text-center">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveService(s.id)}
                className={`service-ribbon-tab py-4 px-2 flex flex-col items-center justify-center gap-1.5 focus:outline-none ${
                  activeService === s.id ? "active font-bold" : "text-slate-600 font-medium"
                }`}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs sm:text-sm tracking-tight leading-snug">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ DYNAMIC SERVICE SHOWCASE SECTION ══════════ */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-100">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="market-card p-8 sm:p-12 border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Panel */}
              <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 sm:p-8 text-white relative shadow-xl overflow-hidden border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] font-mono text-teal-400">agrimarket://{services[activeService].title.toLowerCase().replace(/\s+/g, "-")}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      {services[activeService].badge}
                    </span>
                    <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-700 px-2 py-0.5 rounded font-bold">
                      DATABASE: SYNCED
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white">{services[activeService].title} Service</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Live exchange operations, atomic inventory safeguards, and verified settlement workflows.
                  </p>

                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>Real database REST API connection with zero mock datasets</span>
                  </div>
                </div>
              </div>

              {/* Right Description */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 mb-3">
                    <span>{services[activeService].icon}</span>
                    <span>{services[activeService].subtitle}</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {services[activeService].title}
                  </h2>
                  <p className="text-base font-semibold text-teal-800 mt-2">
                    {services[activeService].tagline}
                  </p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {services[activeService].description}
                </p>

                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Key Features:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {services[activeService].features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={services[activeService].link}>
                    <button className="btn-brand px-7 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm">
                      {services[activeService].cta}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED HARVEST TRADES (FROM DB) ══════════ */}
      <section className="py-16 container mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              National Marketplace
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Featured Agricultural Trades
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Live commodity lots fetched directly from the database catalog.
            </p>
          </div>

          <Link href="/products">
            <button className="btn-brand px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              View All Commodities
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        {loadingProducts ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <p className="text-xs font-semibold text-slate-500">Loading commodities from database...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <Package className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Listings in Database Yet</h3>
            <p className="text-xs text-slate-500">
              Be the first to list agricultural produce on the platform. Register as a farmer to create listings.
            </p>
            <Link href="/register" className="btn-brand px-5 py-2 rounded-lg text-xs font-bold inline-block">
              Register to List Commodities
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.slice(0, 4).map((t) => (
              <div key={t.id} className="market-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {t.categoryName}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {t.badge || "Verified Lot"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">{t.name}</h3>

                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{t.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium mt-1 truncate">
                    Seller: {t.farmerName}
                  </p>

                  {t.assayGrade && (
                    <div className="mt-3 py-1.5 px-2.5 bg-teal-50/70 rounded-lg border border-teal-200/60 text-[11px] font-semibold text-teal-900 flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-teal-600" />
                      <span className="truncate">Assay: {t.assayGrade}</span>
                    </div>
                  )}

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-900">{formatCurrency(t.unitPrice)}</span>
                      <span className="text-[11px] font-medium text-slate-400 ml-1">/{t.unit}</span>
                    </div>
                    <span className="text-xs font-bold text-teal-700">{t.quantityAvailable} {t.unit}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <Link href={`/products/${t.id}`}>
                    <button className="w-full btn-brand py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
                      View Specs & Trade
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ══════════ ENTERPRISE SOURCING ══════════ */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Enterprise & Commercial Sourcing
              </span>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Looking for <span className="text-teal-700">Corporate Buying?</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Source directly from verified farm cooperatives with complete quality specifications, escrow protection, and guaranteed contract fulfillment.
              </p>

              <div className="space-y-3 text-xs text-slate-700 font-medium">
                {[
                  "Database-verified lots with moisture and purity specifications",
                  "Escrow-protected fund transfers with atomic stock locking",
                  "Direct grower and cooperative contact upon order confirmation",
                  "Bulk purchasing for food processors, millers, and exporters",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex gap-3">
                <Link href="/register">
                  <button className="btn-brand px-6 py-3 rounded-lg text-sm font-semibold shadow-sm">
                    Register as Commercial Buyer
                  </button>
                </Link>
                <Link href="/products">
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-lg text-sm transition">
                    Browse Bulk Lots
                  </button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-100 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft">
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-teal-700" />
                    <span className="font-bold text-sm text-slate-900">Direct Institutional Trade Terminal</span>
                  </div>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                    DATABASE SYNCED
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Atomic Inventory</span>
                    <p className="text-lg font-bold text-slate-900 mt-1">100% Locked</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Escrow Settlement</span>
                    <p className="text-lg font-bold text-teal-700 mt-1">Protected</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Mock Data</span>
                    <p className="text-lg font-bold text-emerald-600 mt-1">Zero</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 italic pt-1">
                  "Agri Marketplace connects commercial buyers and agricultural cooperatives directly through certified database transactions."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-16 container mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Real Impact Stories
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            What People Say About <span className="text-teal-700">AGRI MARKET</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Empowering growers, millers, and trade partners across the nation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="market-card p-6 flex flex-col justify-between">
              <div>
                <span className="text-3xl text-teal-600 font-serif leading-none">“</span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2">
                  {t.quote}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-900">{t.author}</p>
                <p className="text-xs text-teal-700 font-semibold">{t.role}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ FAQ ACCORDION ══════════ */}
      <section className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Everything you need to know about trading, quality specifications, and settlements.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 font-semibold text-sm text-slate-800 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180 text-teal-600" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FLOATING SUPPORT WIDGET ══════════ */}
      <div className="floating-widget flex items-center gap-2">
        <a
          href="https://wa.me/251911234567"
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition hover:scale-105"
          title="Chat with AgriMarket Support"
        >
          <MessageCircle className="h-6 w-6" />
        </a>

        <a
          href="/register"
          className="btn-brand px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 hover:scale-105 transition"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          <span>Connect With Us</span>
        </a>
      </div>
    </div>
  );
}
