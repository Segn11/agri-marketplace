"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
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
  Play,
  ExternalLink,
  Laptop,
  Smartphone,
  Calendar,
  TrendingUp,
  Gavel,
  Store,
  FileCheck,
  Wallet,
  Warehouse,
  CreditCard,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";
import { fetchProductsFromDb } from "@/lib/commodities";

export default function AgriMarketHomePage() {
  const [activeTab, setActiveTab] = useState<number>(0);
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

  // AgriBazaar 8-Tab Service Ribbon Elements
  const ribbonTabs = [
    {
      id: 0,
      name: "AgriTrade",
      label: "Spot Exchange",
      iconSvg: <TrendingUp className="w-6 h-6 shrink-0" />,
      headline: "AgriTrade - Spot Exchange",
      tagline: "Power of Digital Discovery and Direct Trading taking agricultural procurement to new frontiers.",
      description: "Direct agricultural commodities trading without intermediary markups. Connect directly with verified growers and primary cooperatives. Procure highland Teff, Specialty Coffee, Durum Wheat, Pulses, and Fresh Produce at transparent market rates recorded live in our PostgreSQL database.",
      bullets: [
        "100% database-verified producer & cooperative listings",
        "Atomic stock reservations with zero overselling",
        "Transparent moisture, purity, and grade specifications",
        "Direct warehouse pickup or cooperative trucking",
      ],
      cta: "EXPLORE MORE",
      link: "/products",
    },
    {
      id: 1,
      name: "Auction Engine",
      label: "e-Auction",
      iconSvg: <Gavel className="w-6 h-6 shrink-0" />,
      headline: "Online Trade & Auction Engine",
      tagline: "Transparent and competitive bidding for high-volume agricultural lots.",
      description: "Participate in structured spot e-Auctions for certified Ethiopian commodities. Commercial millers and exporters place binding orders with guaranteed lot reservation and settlement protection.",
      bullets: [
        "Real-time bid placement with certified cooperative unions",
        "Transparent price discovery reflecting national terminal rates",
        "Automated clearance and delivery documentation",
        "Direct integration with regional logistics dry ports",
      ],
      cta: "EXPLORE MORE",
      link: "/products",
    },
    {
      id: 2,
      name: "e-Mandi",
      label: "National Mandi",
      iconSvg: <Store className="w-6 h-6 shrink-0" />,
      headline: "e-Mandi Virtual Terminal",
      tagline: "Digitizing physical mandi terminals into transparent trade hubs.",
      description: "Access regional wholesale agricultural terminal lots across North Shewa, Bale, Sidama, and East Oromia. View arrivals, moisture readings, and spot market values directly through our database registry.",
      bullets: [
        "Verified commodity arrivals across 14 national hubs",
        "Pre-graded lots with moisture assay certification",
        "Direct wholesale pickup at regional mandi sheds",
        "Transparent buyer and union settlement terms",
      ],
      cta: "EXPLORE MORE",
      link: "/products",
    },
    {
      id: 3,
      name: "AgriAssay",
      label: "Quality Testing",
      iconSvg: <FileCheck className="w-6 h-6 shrink-0" />,
      headline: "AgriAssay - Quality & Lab Grading",
      tagline: "Scientific testing, moisture analysis, and verified grade certifications.",
      description: "Every commodity lot is tested for moisture content, kernel purity, protein levels, and defect count before trade execution. ECX standards and WDRA warehousing certifications ensure zero surprises upon handover.",
      bullets: [
        "Certified moisture meter testing (< 12.5% standard for grains)",
        "Kernel purity guarantee (up to 99.2% on Grade 1 Teff)",
        "Detailed assay certificates attached to each database trade lot",
        "Dispute arbitration with certified lab reinspection",
      ],
      cta: "EXPLORE MORE",
      link: "/products",
    },
    {
      id: 4,
      name: "AgriPay",
      label: "Escrow Settlement",
      iconSvg: <Wallet className="w-6 h-6 shrink-0" />,
      headline: "AgriPay - Secure Trade Escrow",
      tagline: "100% financial security for buyers and growers on every transaction.",
      description: "Funds are locked safely in escrow upon purchase order confirmation and released only after the commercial buyer receives, inspects, and approves physical lot quality at the silo terminal.",
      bullets: [
        "Escrow safeguarding on 100% of marketplace trades",
        "Release authorization upon physical stock inspection",
        "Atomic inventory reservation with zero double-selling",
        "Fully integrated with Ethiopian commercial banking rails",
      ],
      cta: "EXPLORE MORE",
      link: "/cart",
    },
    {
      id: 5,
      name: "Marketplace",
      label: "Institutional Trade",
      iconSvg: <Building2 className="w-6 h-6 shrink-0" />,
      headline: "Institutional Procurement Marketplace",
      tagline: "Bulk grain and cash crop procurement for flour mills, food processors, and exporters.",
      description: "Streamlined multi-lot purchasing tailored for high-volume commercial processors. Aggregate lots from multiple certified farming unions into a unified delivery and settlement invoice.",
      bullets: [
        "Multi-lot procurement cart with live stock locking",
        "Consolidated invoices with clear logistics freight breakdown",
        "Direct commercial agreement with cooperative federations",
        "Flexible pickup or bonded dry port dispatch",
      ],
      cta: "EXPLORE MORE",
      link: "/cart",
    },
    {
      id: 6,
      name: "AgriSilo",
      label: "Silo Warehousing",
      iconSvg: <Warehouse className="w-6 h-6 shrink-0" />,
      headline: "AgriSilo - Certified Warehousing",
      tagline: "Scientific grain storage, aeration, and bonded logistics terminals.",
      description: "Store grains and pulses in climate-controlled, fumigated, and insured warehouse facilities. Registered electronic warehouse receipts allow instant digital trade and transfer of ownership.",
      bullets: [
        "Insured and hermetically sealed storage capacity",
        "Electronic warehouse receipts linked to database inventory",
        "Pest management and continuous temperature monitoring",
        "Instant physical dispatch upon buyer clearance",
      ],
      cta: "EXPLORE MORE",
      link: "/products",
    },
    {
      id: 7,
      name: "Trade Card",
      label: "Clearance Card",
      iconSvg: <CreditCard className="w-6 h-6 shrink-0" />,
      headline: "Trade Card & Member Clearance",
      tagline: "Fast-track verification and preferential trade execution for registered members.",
      description: "Exclusive member status for vetted agricultural commercial buyers and producer unions. Enjoy expedited quality testing, waived deposit fees, and dedicated logistics coordinators.",
      bullets: [
        "Verified member badge on all transactions",
        "Priority allocation during peak Meher harvest auctions",
        "Comprehensive trade audit history and tax invoices",
        "Dedicated account manager for trade clearance",
      ],
      cta: "EXPLORE MORE",
      link: "/buyer",
    },
  ];

  // Services Panorama Items
  const panoramaServices = [
    {
      title: "IoT Based Farm & Warehouse Management",
      desc: "Remote monitoring of temperature, relative humidity, and silo aeration parameters.",
    },
    {
      title: "Crop & Grain Assay using Standard Lab Protocols",
      desc: "Scientific grading, moisture analysis, and defect profiling for certified trade.",
    },
    {
      title: "Intelligent Goods & Settlement Services",
      desc: "Automated escrow clearance, logistics dispatch, and digital delivery receipts.",
    },
    {
      title: "Input & Output Marketplace",
      desc: "Direct procurement of grains, specialty coffee, and organic pulses from primary unions.",
    },
    {
      title: "Agri FinTech & Escrow Trade Services",
      desc: "Guaranteed seller payout upon physical buyer sign-off at terminal hubs.",
    },
  ];

  // Stories
  const bazaarStories = [
    {
      title: "Meher Harvest Grain Forecast & Storage Guidelines 2026",
      desc: "Key findings on highland Magna Teff yields, moisture controls, and cooperative union aggregation protocols across North Shewa and Arsi.",
      date: "16-10-2026 06:40 AM",
      link: "/products?q=Teff",
    },
    {
      title: "Specialty Washed Arabica Coffee: Q1 Standards and Dry Port Logistics",
      desc: "A comprehensive look at Sidama washed grade 1 requirements, SCA scoring thresholds, and bonded climate-controlled transit routes.",
      date: "15-10-2026 07:22 AM",
      link: "/products?q=Coffee",
    },
    {
      title: "Durum Wheat Vitreous Quality and Gluten Index for Pasta Milling",
      desc: "Best practices for commercial bakeries and pasta millers sourcing high-protein Amber Durum Wheat from Bale highland cooperatives.",
      date: "09-10-2026 10:14 AM",
      link: "/products?q=Wheat",
    },
  ];

  // FAQs
  const faqs = [
    {
      q: "Which agricultural commodities are listed in the exchange?",
      a: "The marketplace catalog includes Grains & Cereals (Export White Teff, Durum Wheat, Barley, Maize), Pulses & Oilseeds (Sesame, Chickpeas, Beans), Cash Crops (Specialty Arabica Coffee, Spices), and Fresh Produce (Red Onions, Avocados).",
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
      <div className="bg-[#0e2a56] text-white overflow-hidden py-1.5 border-b border-blue-950 text-xs">
        <div className="flex items-center">
          <Link
            href="/products"
            className="bg-[#d81b60] hover:bg-[#c2185b] px-3.5 py-1 font-bold uppercase tracking-wider text-[11px] z-10 flex items-center gap-1.5 flex-shrink-0 shadow-xs transition cursor-pointer"
          >
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Live Market Rates &rarr;
          </Link>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="animate-ticker flex items-center gap-8 pl-4">
              {featuredProducts.length > 0 ? (
                [...featuredProducts, ...featuredProducts].map((p, idx) => (
                  <Link key={idx} href={`/products/${p.id}`} className="flex items-center gap-2 font-medium hover:text-amber-300 transition">
                    <span className="text-blue-100 font-bold">{p.name}:</span>
                    <span className="font-bold text-amber-300">{formatCurrency(p.unitPrice)}/{p.unit}</span>
                    <span className="text-[10px] text-emerald-300 font-semibold">({p.quantityAvailable} {p.unit} available)</span>
                    <span className="text-[10px] text-blue-200">({p.location})</span>
                    <span className="text-blue-400 font-bold">•</span>
                  </Link>
                ))
              ) : (
                <div className="flex items-center gap-4 text-blue-200">
                  <span>Loading live commodity spot rates from database...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ AGRIBAZAAR SIGNATURE HERO BANNER ══════════ */}
      <section
        className="relative text-white py-16 sm:py-24 overflow-hidden"
        style={{
          background: "linear-gradient(rgba(10, 35, 75, 0.78), rgba(6, 24, 52, 0.88)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop') center/cover no-repeat",
        }}
      >
        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#d81b60]/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
              <span>National Commodity Exchange</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              ECX Grade Teff & <br />
              <span className="text-amber-400">Specialty Arabica Coffee</span>
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-slate-100">
              Commercial Procurement Open Season 2026 <br />
              <span className="text-sm sm:text-base font-normal text-slate-200">
                Direct Farm-Gate & Cooperative Trade Exchange with Zero Middlemen
              </span>
            </p>

            <div className="pt-2">
              <Link href="/products">
                <button className="bg-[#e65100] hover:bg-[#d84315] text-white px-8 py-3.5 rounded-lg text-sm font-bold shadow-lg transition transform hover:-translate-y-0.5">
                  Click Here for More Details
                </button>
              </Link>
            </div>

            <p className="text-xs text-slate-300 italic pt-2">
              Note: Direct cooperative trades with certified 99.2% seed purity & moisture assay guarantees recorded in our database.
            </p>

            {/* AgriBazaar Slider Dots */}
            <div className="flex items-center gap-2 pt-4">
              <span className="h-2.5 w-6 rounded-full bg-white shadow-xs" />
              <span className="h-2.5 w-2.5 rounded-full border border-white/80" />
              <span className="h-2.5 w-2.5 rounded-full border border-white/80" />
              <span className="h-2.5 w-2.5 rounded-full border border-white/80" />
              <span className="h-2.5 w-2.5 rounded-full border border-white/80" />
              <span className="h-2.5 w-2.5 rounded-full border border-white/80" />
              <span className="h-2.5 w-2.5 rounded-full border border-white/80" />
              <span className="h-2.5 w-2.5 rounded-full border border-white/80" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ AGRIBAZAAR 8-TAB SERVICE RIBBON (SIGNATURE COMPONENT) ══════════ */}
      <section id="services" className="bg-white border-b border-slate-200 shadow-xs sticky top-[108px] z-30">
        <div className="container mx-auto px-2 sm:px-8">
          <div className="grid grid-cols-4 lg:grid-cols-8 divide-x divide-slate-100 text-center">
            {ribbonTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3.5 px-2 flex flex-col items-center justify-center gap-1.5 transition-all focus:outline-none ${
                    isActive
                      ? "bg-[#d81b60] text-white font-bold shadow-inner"
                      : "bg-white text-slate-700 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <div className={isActive ? "text-white" : "text-[#d81b60]"}>
                    {tab.iconSvg}
                  </div>
                  <span className="text-[11px] sm:text-xs tracking-tight leading-snug">
                    {tab.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ INTERACTIVE SHOWCASE SECTION (AGRIBAZAAR STYLE) ══════════ */}
      <section className="py-14 bg-[#edf5ee] border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Device Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                {/* Laptop Mockup Frame */}
                <div className="bg-slate-900 rounded-2xl p-4 shadow-2xl border-4 border-slate-800 text-white">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="h-3 w-3 rounded-full bg-amber-500" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">agrimarket://{ribbonTabs[activeTab].name.toLowerCase()}</span>
                    <span className="text-[9px] bg-[#d81b60] text-white px-2 py-0.5 rounded font-bold">LIVE DB</span>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#d81b60]">
                        {ribbonTabs[activeTab].label}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Synchronized
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white">
                      {ribbonTabs[activeTab].headline}
                    </h4>

                    <div className="space-y-2 text-xs text-slate-300">
                      {ribbonTabs[activeTab].bullets.slice(0, 3).map((b, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#d81b60] mt-0.5 flex-shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400">PostgreSQL Status: Connected</span>
                      <span className="text-amber-400 font-bold">100% Escrow Protected</span>
                    </div>
                  </div>
                </div>

                {/* Overlaid Smartphone Frame */}
                <div className="absolute -bottom-6 -right-4 w-44 bg-slate-900 rounded-3xl p-2.5 shadow-2xl border-4 border-slate-700 hidden sm:block">
                  <div className="h-3 w-16 bg-slate-800 rounded-full mx-auto mb-2" />
                  <div className="bg-white text-slate-900 rounded-2xl p-3 text-center space-y-2">
                    <div className="h-7 w-7 rounded-full bg-[#d81b60] text-white flex items-center justify-center mx-auto text-xs font-bold">
                      🌾
                    </div>
                    <p className="text-[10px] font-bold text-slate-800 leading-tight">Instant Trade Confirmation</p>
                    <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Order Locked
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Detailed Description & Action */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white text-[#d81b60] shadow-sm flex items-center justify-center">
                  {ribbonTabs[activeTab].iconSvg}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d81b60]">
                    {ribbonTabs[activeTab].name}
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {ribbonTabs[activeTab].headline}
                  </h2>
                </div>
              </div>

              <p className="text-base font-semibold text-slate-800 leading-snug">
                {ribbonTabs[activeTab].tagline}
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                {ribbonTabs[activeTab].description}
              </p>

              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  {ribbonTabs[activeTab].bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#d81b60] mt-0.5 flex-shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Link href={ribbonTabs[activeTab].link}>
                  <button className="bg-[#d81b60] hover:bg-[#c2185b] text-white px-8 py-3 rounded-lg text-sm font-bold shadow-md transition transform hover:-translate-y-0.5 flex items-center gap-2">
                    {ribbonTabs[activeTab].cta}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED HARVEST TRADES (FROM DB) ══════════ */}
      <section className="py-16 container mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1c4482] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              National Marketplace
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Featured Agricultural Trades
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Live commodity lots fetched directly from the database exchange.
            </p>
          </div>

          <Link href="/products">
            <button className="bg-[#1c4482] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition">
              View All Commodities
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        {loadingProducts ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d81b60]"></div>
            <p className="text-xs font-semibold text-slate-500">Querying live commodities from database...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <Package className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Listings in Database Yet</h3>
            <p className="text-xs text-slate-500">
              Be the first to list agricultural produce on the platform. Register as a farmer to create listings.
            </p>
            <Link href="/register" className="bg-[#1c4482] text-white px-5 py-2 rounded-lg text-xs font-bold inline-block">
              Register to List Commodities
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((t) => (
              <div key={t.id} className="market-card p-6 flex flex-col justify-between border border-slate-200 hover:border-slate-300">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {t.categoryName}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      {t.badge || "Verified Lot"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">{t.name}</h3>

                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{t.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium mt-1 truncate">
                    Seller: <span className="font-bold text-slate-800">{t.farmerName}</span>
                  </p>

                  {t.assayGrade && (
                    <div className="mt-3 py-1.5 px-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] font-semibold text-emerald-900 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <Award className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">Assay: {t.assayGrade}</span>
                      </div>
                      <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.5 rounded font-bold uppercase ml-2 flex-shrink-0">
                        LAB TESTED
                      </span>
                    </div>
                  )}

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-900">{formatCurrency(t.unitPrice)}</span>
                      <span className="text-[11px] font-medium text-slate-400 ml-1">/{t.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-blue-900 block">{t.quantityAvailable} {t.unit}</span>
                      <span className="text-[10px] text-slate-400">Available Stock</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <Link href={`/products/${t.id}`}>
                    <button className="w-full bg-[#1c4482] hover:bg-blue-900 text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition">
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

      {/* ══════════ AGRIBAZAAR OUR SERVICES PANORAMA SECTION ══════════ */}
      <section
        id="all-services"
        className="relative text-white py-20 overflow-hidden"
        style={{
          background: "linear-gradient(rgba(14, 42, 86, 0.88), rgba(6, 24, 52, 0.94)), url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop') center/cover no-repeat",
        }}
      >
        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              National Leading Full-Stack Agritech Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Our Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-white/20 border-y border-white/20">
            {panoramaServices.map((s, idx) => (
              <div key={idx} className="p-6 flex flex-col justify-between space-y-4 hover:bg-white/5 transition">
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white leading-snug">{s.title}</h4>
                  <p className="text-xs text-slate-200/80 leading-relaxed">{s.desc}</p>
                </div>
                <Link href="/products" className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1 transition">
                  READ MORE &gt;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WHAT PEOPLE SAY (TESTIMONIALS WITH PLAY BUTTONS) ══════════ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              What People Say
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Testimonials from authenticated grain millers, commercial buyers, and cooperative union chairs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="market-card p-6 border border-slate-200 space-y-4">
              <div className="h-44 rounded-xl bg-slate-800 relative overflow-hidden flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop')" }} />
                <div className="h-12 w-12 rounded-full bg-[#d81b60] text-white flex items-center justify-center shadow-lg relative z-10 group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 fill-white ml-0.5" />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "AgriMarket has streamlined our grain procurement completely. We placed an order for 150 quintals of Magna Teff and completed handover with zero hassle."
                </p>
                <h4 className="text-sm font-bold text-slate-900 mt-3">Gemechu Desta</h4>
                <p className="text-[11px] text-slate-400">Grain Trader & Commercial Wholesaler &bull; North Shewa</p>
              </div>
            </div>

            <div className="market-card p-6 border border-slate-200 space-y-4">
              <div className="h-44 rounded-xl bg-slate-800 relative overflow-hidden flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop')" }} />
                <div className="h-12 w-12 rounded-full bg-[#d81b60] text-white flex items-center justify-center shadow-lg relative z-10 group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 fill-white ml-0.5" />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "The direct connection to verified agricultural producers eliminated broker markups. Our milling plant now sources directly through the platform."
                </p>
                <h4 className="text-sm font-bold text-slate-900 mt-3">Tigist Bekele</h4>
                <p className="text-[11px] text-slate-400">Procurement Director, Apex Milling &bull; Addis Ababa</p>
              </div>
            </div>

            <div className="market-card p-6 border border-slate-200 space-y-4">
              <div className="h-44 rounded-xl bg-slate-800 relative overflow-hidden flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop')" }} />
                <div className="h-12 w-12 rounded-full bg-[#d81b60] text-white flex items-center justify-center shadow-lg relative z-10 group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 fill-white ml-0.5" />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "Atomic stock reservation and escrow protection give us total confidence. Every trade is tracked cleanly from placement to completed delivery."
                </p>
                <h4 className="text-sm font-bold text-slate-900 mt-3">Chala Tolosa</h4>
                <p className="text-[11px] text-slate-400">Cooperative Union Representative &bull; Central Farming Basin</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ THE BAZAAR STORIES (INSIGHTS) ══════════ */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left title */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight block">
                  The Bazaar
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#d81b60] tracking-tight block">
                  STORIES
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Read & explore our perspectives on agriculture & technology with the latest trends. Get all current updates on commodity assays, logistics, and harvest yields.
              </p>
              <div className="pt-2">
                <Link href="/products">
                  <button className="bg-[#d81b60] hover:bg-[#c2185b] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs transition">
                    VIEW MORE
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: 3 Beige Story Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              {bazaarStories.map((story, i) => (
                <div key={i} className="bg-[#fbf5ea] p-5 rounded-xl border border-amber-200/60 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{story.title}</h4>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-4 leading-relaxed">{story.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-amber-200/40">
                    <span className="text-[10px] text-slate-400 block mb-1">{story.date}</span>
                    <Link href={story.link} className="text-xs font-bold text-[#d81b60] hover:underline">
                      READ MORE &gt;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ LOOKING FOR CORPORATE BUYING SECTION ══════════ */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Enterprise & Commercial Sourcing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Looking for <span className="text-[#d81b60]">Corporate Buying?</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Source directly from verified farm cooperatives with complete quality specifications, escrow protection, and guaranteed contract fulfillment.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Database-verified lots with certified moisture and purity specifications</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Escrow-protected fund transfers with atomic stock locking</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Direct grower and cooperative contact upon order confirmation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Bulk purchasing for food processors, millers, and exporters</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <Link href="/register">
                  <button className="bg-[#1c4482] hover:bg-blue-900 text-white px-6 py-3 rounded-lg text-xs font-bold shadow-sm transition">
                    Register as Commercial Buyer
                  </button>
                </Link>
                <Link href="/products">
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-lg text-xs font-bold border border-slate-200 transition">
                    Browse Bulk Lots
                  </button>
                </Link>
              </div>
            </div>

            {/* Clearance Card Preview */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#1c4482]" />
                  <span className="text-xs font-bold text-slate-800">Direct Institutional Trade Terminal</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  DATABASE SYNCED
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Atomic Inventory</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">100%</p>
                  <span className="text-[9px] text-slate-400">Locked</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Escrow Settlement</span>
                  <p className="text-lg font-bold text-blue-900 mt-1">AgriPay</p>
                  <span className="text-[9px] text-slate-400">Protected</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Mock Data</span>
                  <p className="text-lg font-bold text-emerald-600 mt-1">Zero</p>
                  <span className="text-[9px] text-slate-400">Verified</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 italic pt-1">
                "Agri Marketplace connects commercial buyers and agricultural cooperatives directly through certified database transactions."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FAQ SECTION ══════════ */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Everything you need to know about trading, quality specifications, and settlements.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-semibold text-slate-800 hover:text-[#1c4482] transition"
                >
                  <span>{f.q}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openFaq === i ? "rotate-180 text-[#1c4482]" : "text-slate-400"}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ AGRIBAZAAR FLOATING ACTION WIDGETS (BOTTOM RIGHT) ══════════ */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5">
        {/* WhatsApp Icon Circle */}
        <a
          href="https://wa.me/251911002244"
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 w-12 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          title="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
          </svg>
        </a>

        {/* Connect With Us Pill Button */}
        <Link href="/register">
          <button className="bg-[#d81b60] hover:bg-[#c2185b] text-white px-5 py-3 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Connect With Us
          </button>
        </Link>
      </div>
    </div>
  );
}
