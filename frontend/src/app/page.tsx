"use client";

import { useState } from "react";
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
  Laptop,
  Smartphone,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Award,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AgriMarketHomePage() {
  const [activeService, setActiveService] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Live Commodity Ticker Data
  const tickerItems = [
    { commodity: "White Teff (Magna)", price: "9,450 ETB/Qtl", change: "+2.4%", up: true, location: "East Highland Hub" },
    { commodity: "Arabica Forest Coffee", price: "420 ETB/KG", change: "+1.8%", up: true, location: "Western Zone" },
    { commodity: "Red Cooking Onions", price: "85 ETB/KG", change: "-0.5%", up: false, location: "Central River Basin" },
    { commodity: "Highland Durum Wheat", price: "4,800 ETB/Qtl", change: "+3.1%", up: true, location: "Northern Plateau" },
    { commodity: "Export Hass Avocados", price: "90 ETB/KG", change: "+1.2%", up: true, location: "Southern Belt" },
    { commodity: "Humera White Sesame", price: "8,900 ETB/Qtl", change: "+4.0%", up: true, location: "Lowland Market Post" },
    { commodity: "Organic Garlic Bulbs", price: "220 ETB/KG", change: "-1.1%", up: false, location: "Foothills Center" },
  ];

  // 6 Core Offerings in the AgriMarket Ribbon
  const services = [
    {
      id: 0,
      title: "AgriVision GIS",
      subtitle: "Precision Agritech & Farm Mapping",
      icon: "🛰️",
      tagline: "Power of Satellite Imagery and Remote Sensing bringing transparency to agriculture.",
      description: "AgriVision combines satellite radar, spectral vegetation indices, and localized weather telemetry to provide farm polygon mapping, crop health analytics, and accurate harvest yield forecasting for farmers and cooperatives.",
      features: [
        "High-resolution farm boundary mapping",
        "NDVI vegetation index and moisture stress analytics",
        "Yield estimation models for institutional buyers",
        "Pest & disease early alert telemetry",
      ],
      badge: "GIS & Sensor Technology",
      cta: "Explore AgriVision",
      link: "/products",
    },
    {
      id: 1,
      title: "Digital Auction Engine",
      subtitle: "e-Auctions & Fair Price Discovery",
      icon: "⚖️",
      tagline: "Transparent digital bidding platform connecting growers directly with bulk buyers.",
      description: "Our proprietary auction mechanism supports Forward Auctions, Reverse Auctions, and Bulk Tenders, ensuring farmers receive maximum competitive pricing while commercial buyers procure standardized lots.",
      features: [
        "Dynamic live price bidding engine with anti-overselling",
        "Verified digital cataloging of produce lots",
        "Automated winner declaration & margin allocation",
        "Comprehensive electronic contract generation",
      ],
      badge: "Trading Platform",
      cta: "View Live Auctions",
      link: "/products",
    },
    {
      id: 2,
      title: "Direct Marketplace",
      subtitle: "Physical & Digital Spot Exchange",
      icon: "🌾",
      tagline: "The fastest-growing direct digital agricultural marketplace.",
      description: "Connect directly with thousands of verified growers. Buy and sell cereals, pulses, oilseeds, spices, and fresh vegetables at true farm-gate origin prices without intermediary brokerage markups.",
      features: [
        "100% verified farmer & cooperative grower profiles",
        "Real-time atomic stock reservation and order locks",
        "Transparent quality grades and moisture disclosures",
        "Flexible logistics coordination: Farmgate or Warehouse",
      ],
      badge: "Spot Market",
      cta: "Explore Harvest Trades",
      link: "/products",
    },
    {
      id: 3,
      title: "AgriAdvisory",
      subtitle: "Good Agricultural Practices & Intelligence",
      icon: "📰",
      tagline: "Hyper-local weather forecasts, regional market trends, and harvest advisory.",
      description: "AgriAdvisory delivers tailored agronomy intelligence directly to farmers, advising on optimal sowing windows, crop protection, regional price movements, and post-harvest storage techniques.",
      features: [
        "Micro-climate hyper-local 7-day weather alerts",
        "Historical market price comparison & arrival trends",
        "Organic fertilization & IPM disease guides",
        "Multilingual farmer SMS and mobile support",
      ],
      badge: "Farmer Advisory",
      cta: "Access Advisory",
      link: "/products",
    },
    {
      id: 4,
      title: "AgriSettlement",
      subtitle: "Escrow & Instant Digital Payments",
      icon: "💳",
      tagline: "Safe, automated digital payments with instant release upon verified handover.",
      description: "AgriSettlement guarantees financial peace of mind. Buyer funds are held in secure escrow upon trade creation, and released instantaneously to the farmer's mobile money or bank account once delivery handover is approved.",
      features: [
        "Escrow-secured buyer payments with atomic verification",
        "Instant settlement to Telebirr, CBE, or commercial banks",
        "Invoice factoring & trade credit options for millers",
        "Tamper-proof digital ledger of trade transactions",
      ],
      badge: "Fintech & Escrow",
      cta: "Learn About Settlement",
      link: "/register",
    },
    {
      id: 5,
      title: "Corporate Sourcing",
      subtitle: "Institutional Bulk Procurement",
      icon: "🏢",
      tagline: "End-to-end supply chain sourcing for flour mills, food processors, and exporters.",
      description: "We partner with leading food corporations, consumer goods companies, and regional grain boards to aggregate, assay, store, and transport thousands of metric tons with verified lab quality certifications.",
      features: [
        "Certified scientific warehousing & pest control",
        "Third-party lab assaying (protein, moisture, purity)",
        "Scheduled milestone deliveries & dedicated logistics",
        "Formal corporate procurement tenders & tax compliance",
      ],
      badge: "B2B Enterprise",
      cta: "Partner With Us",
      link: "/register",
    },
  ];

  // Featured Marketplace Trades
  const featuredTrades = [
    {
      id: "t1",
      commodity: "Premium White Teff (Magna Grade 1)",
      category: "Grains & Cereals",
      location: "East Highland Farming Zone",
      seller: "Oda Gida Agricultural Cooperative",
      price: 9400,
      unit: "Quintal (100kg)",
      stock: 45,
      assayGrade: "A+ (99.2% Purity)",
      badge: "Live Exchange",
    },
    {
      id: "t2",
      commodity: "Wollega Sun-Dried Arabica Coffee",
      category: "Specialty & Spices",
      location: "Western Forest District",
      seller: "Highland Forest Organic Growers",
      price: 420,
      unit: "KG",
      stock: 350,
      assayGrade: "Grade 1 Specialty",
      badge: "Spot Trade",
    },
    {
      id: "t3",
      commodity: "Commercial Grade Red Cooking Onions",
      category: "Fresh Vegetables",
      location: "Central River Basin",
      seller: "Valley Green Farmer Union",
      price: 85,
      unit: "KG",
      stock: 1200,
      assayGrade: "Export Quality",
      badge: "Direct Sourcing",
    },
    {
      id: "t4",
      commodity: "Durum Wheat Milling Grain",
      category: "Grains & Cereals",
      location: "Northern Plateau Plains",
      seller: "Plateau Grain Producers Association",
      price: 4800,
      unit: "Quintal (100kg)",
      stock: 80,
      assayGrade: "13.5% Protein Certified",
      badge: "Bulk Lot",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "AgriMarket has kept me updated with live fluctuations in crop prices and all current market updates. I received full payment in my account within minutes of delivery.",
      author: "Gemechu Desta",
      role: "Grain Trader & Wholesaler",
      location: "East Highland Hub",
    },
    {
      quote: "Even during difficult seasons, AgriMarket has provided our cooperative convenience and speed in trading. We sold over 200 quintals of wheat directly to commercial millers.",
      author: "Tolosa Chala",
      role: "Cooperative Union President",
      location: "River Basin District",
    },
    {
      quote: "The quality assay reports and escrow payment system eliminate all counterparty risk. Our processing factory now procures 40% of our raw grain directly through AgriMarket.",
      author: "Tigist Bekele",
      role: "Procurement Director, Apex Milling",
      location: "Central Logistics Park",
    },
  ];

  // FAQ Items
  const faqs = [
    {
      q: "Which agricultural commodities can I buy or sell on AgriMarket?",
      a: "You can trade a wide variety of commodities including Grains & Cereals (White & Red Teff, Wheat, Barley, Maize), Pulses & Oilseeds (Sesame, Chickpeas, Red Kidney Beans), Cash Crops (Arabica Coffee, Spices, Garlic), and Fresh Produce (Red Onions, Avocados, Tomatoes).",
    },
    {
      q: "How does AgriMarket help farmers get better prices?",
      a: "By eliminating multiple tiers of speculative brokers, AgriMarket gives farmers direct access to commercial millers, food processors, and wholesale buyers. Real-time competitive bidding and transparent market prices ensure growers receive 100% fair market value.",
    },
    {
      q: "What is AgriVision GIS?",
      a: "AgriVision is our satellite remote-sensing engine. It provides farm boundary tagging, vegetative health indexing (NDVI), soil moisture telemetry, and yield prediction to support modern precision agriculture.",
    },
    {
      q: "What services does AgriMarket offer?",
      a: "Our integrated agritech suite includes direct spot trading, digital auctions, AgriVision GIS farm tracking, agronomy advisories, escrow-backed settlement, scientific warehousing, and third-party quality assay certification.",
    },
    {
      q: "How does the contact privacy guard work?",
      a: "To protect both growers and buyers from spam, direct phone lines and contact details are masked during the discovery phase and are revealed automatically once an order is formally accepted.",
    },
  ];

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      {/* ══════════ LIVE COMMODITY TICKER ══════════ */}
      <div className="bg-[#051817] text-white overflow-hidden py-2 border-b border-teal-950 text-xs">
        <div className="flex items-center">
          <div className="bg-teal-700 px-4 py-1 font-bold uppercase tracking-wider text-[11px] z-10 flex items-center gap-1.5 flex-shrink-0 shadow-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Market Rates
          </div>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="animate-ticker flex items-center gap-8 pl-4">
              {[...tickerItems, ...tickerItems].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 font-medium">
                  <span className="text-slate-300">{item.commodity}:</span>
                  <span className="font-bold text-teal-300">{item.price}</span>
                  <span className={`text-[11px] font-bold flex items-center ${item.up ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {item.up ? <TrendingUp className="h-3 w-3 mr-0.5 inline" /> : <TrendingDown className="h-3 w-3 mr-0.5 inline" />}
                    {item.change}
                  </span>
                  <span className="text-[10px] text-slate-400">({item.location})</span>
                  <span className="text-teal-800 font-bold">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ HERO SECTION (DEEP FOREST TEAL & GOLD) ══════════ */}
      <section
        className="relative text-white py-16 sm:py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #041d1c 0%, #073330 50%, #0a4843 100%)' }}
      >
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 bg-teal-950/80 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-200 mb-6 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>National Direct Agricultural Exchange & Procurement</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              National Integrated <br />
              <span className="text-amber-400">Agricultural Marketplace</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-200 leading-relaxed font-light">
              Say goodbye to middlemen and inflated prices. Trade crops, grains, and fresh harvests directly with verified regional farmers through guaranteed stock tracking and instant digital settlement.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/products">
                <button className="btn-amber px-8 py-3.5 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2">
                  Explore Live Harvests
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/register">
                <button className="btn-brand px-8 py-3.5 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2">
                  Register as Farmer or Buyer
                </button>
              </Link>
            </div>

            {/* Note bar */}
            <div className="mt-8 pt-6 border-t border-teal-800/60 text-xs text-teal-200 flex items-center gap-2">
              <span className="font-bold text-amber-300">Notice:</span>
              <span>All registered agricultural cooperatives and commercial buyers enjoy atomic stock reservation and fair price discovery.</span>
            </div>

            {/* Carousel Dots Indicator */}
            <div className="flex items-center gap-2 mt-6">
              <span className="h-2.5 w-7 rounded-full bg-amber-400 transition-all" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
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
              {/* Left Mockup visual */}
              <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 sm:p-8 text-white relative shadow-xl overflow-hidden border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] font-mono text-teal-400">agrimarket://{services[activeService].title.toLowerCase().replace(/\s+/g, '-')}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      {services[activeService].badge}
                    </span>
                    <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-700 px-2 py-0.5 rounded">
                      STATUS: ONLINE
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white">{services[activeService].title} Dashboard</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Live telemetry, auction rates, polygon mapping, and contract settlements in progress.
                  </p>

                  {/* Simulated metric board */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Trading Volume</span>
                      <p className="text-lg font-bold text-amber-400 mt-0.5">2,480 Metric Tons</p>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Settlement Rate</span>
                      <p className="text-lg font-bold text-teal-400 mt-0.5">100% Instant</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>Quality Assayed & Verified Atomic Stock Guarantee</span>
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
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Key Capabilities:</span>
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

      {/* ══════════ FEATURED HARVEST TRADES ══════════ */}
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
              Real-time available harvest lots direct from verified farmers and regional cooperatives.
            </p>
          </div>

          <Link href="/products">
            <button className="btn-brand px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              View All Produce
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredTrades.map((t) => (
            <div key={t.id} className="market-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {t.category}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {t.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{t.commodity}</h3>

                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span>{t.location}</span>
                </div>

                <p className="text-xs text-slate-600 font-medium mt-1 truncate">
                  By {t.seller}
                </p>

                {/* Quality Grade */}
                <div className="mt-3 py-1.5 px-2.5 bg-teal-50/70 rounded-lg border border-teal-200/60 text-[11px] font-semibold text-teal-900 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-teal-600" />
                  <span>Assay: {t.assayGrade}</span>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">{formatCurrency(t.price)}</span>
                    <span className="text-[11px] font-medium text-slate-400 ml-1">/{t.unit}</span>
                  </div>
                  <span className="text-xs font-bold text-teal-700">{t.stock} {t.unit}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link href="/products">
                  <button className="w-full btn-brand py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
                    Order Produce
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ LOOKING FOR CORPORATE BUYING? ══════════ */}
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
                Source directly from verified farm cooperatives with complete quality assay certification, scientific warehousing, and guaranteed contract fulfillment.
              </p>

              <div className="space-y-3 text-xs text-slate-700 font-medium">
                {[
                  "Standardized lab assay tests for purity, moisture, and protein content",
                  "Escrow-protected fund transfers with atomic stock locking",
                  "Dedicated logistics coordination and direct grower contact upon acceptance",
                  "Forward contracts for commercial food manufacturers, bakeries, and millers",
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

            {/* Visual Screen Mockup */}
            <div className="lg:col-span-7 bg-slate-100 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft">
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-teal-700" />
                    <span className="font-bold text-sm text-slate-900">Institutional Procurement Terminal</span>
                  </div>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                    ENTERPRISE TENDER
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Settled Volume</span>
                    <p className="text-lg font-bold text-slate-900 mt-1">12,500 MT</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Verified Lots</span>
                    <p className="text-lg font-bold text-teal-700 mt-1">450+ Lots</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">QC Assured</span>
                    <p className="text-lg font-bold text-emerald-600 mt-1">100%</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 italic pt-1">
                  "AgriMarket enables large buyers to procure consistent quality grain directly from thousands of farmholders without speculative risk."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ WHAT PEOPLE SAY ABOUT AGRI MARKET ══════════ */}
      <section className="py-16 container mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Real Impact Stories
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            What People Say About <span className="text-teal-700">AGRIMARKET</span>
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
              Everything you need to know about trading, quality assay, and settlements on AgriMarket.
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
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-teal-600' : ''}`} />
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

      {/* ══════════ FLOATING WHATSAPP & SUPPORT WIDGET ══════════ */}
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
