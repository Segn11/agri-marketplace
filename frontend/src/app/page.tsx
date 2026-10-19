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
  ExternalLink,
  Laptop,
  Smartphone,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Award,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AgriBazaarHomePage() {
  const [activeService, setActiveService] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Live Mandi / Commodity Ticker Data
  const tickerItems = [
    { commodity: "White Teff (Magna)", price: "9,450 ETB/Qtl", change: "+2.4%", up: true, mandi: "East Highland Mandi" },
    { commodity: "Arabica Forest Coffee", price: "420 ETB/KG", change: "+1.8%", up: true, mandi: "Western Hub" },
    { commodity: "Red Cooking Onions", price: "85 ETB/KG", change: "-0.5%", up: false, mandi: "Central Basin" },
    { commodity: "Highland Durum Wheat", price: "4,800 ETB/Qtl", change: "+3.1%", up: true, mandi: "Northern Plateau" },
    { commodity: "Export Hass Avocados", price: "90 ETB/KG", change: "+1.2%", up: true, mandi: "Southern Belt" },
    { commodity: "Humera White Sesame", price: "8,900 ETB/Qtl", change: "+4.0%", up: true, mandi: "Lowland Trading Post" },
    { commodity: "Organic Garlic Bulbs", price: "220 ETB/KG", change: "-1.1%", up: false, mandi: "Foothills Mandi" },
  ];

  // 6 Core Offerings in the Ribbon
  const services = [
    {
      id: 0,
      title: "AgriBhumi",
      subtitle: "Precision Agritech & GIS",
      icon: "🛰️",
      tagline: "Power of Satellite Imagery and Machine Learning taking Agriculture to new frontiers.",
      description: "AgriBhumi integrates remote sensing, satellite radar, and spectral vegetation indices to provide farm boundary mapping, real-time crop health monitoring, and harvest estimation for thousands of smallholders and farmer cooperatives.",
      features: [
        "High-resolution polygon farm boundary mapping",
        "NDVI vegetation index and moisture stress analytics",
        "Yield estimation algorithms for institutional buyers",
        "Pest & disease early alert telemetry",
      ],
      badge: "GIS & AI Technology",
      cta: "Explore AgriBhumi",
      link: "/products",
    },
    {
      id: 1,
      title: "Online Auction Engine",
      subtitle: "e-Auctions & Price Discovery",
      icon: "⚖️",
      tagline: "Transparent digital bidding platform connecting farmers directly with bulk buyers.",
      description: "Our proprietary auction mechanism supports Forward Auctions, Reverse Auctions, and Bulk Procurement Tenders, ensuring farmers receive maximum competitive pricing while institutional buyers procure standardized lots.",
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
      title: "e-Mandi",
      subtitle: "Physical & Digital Spot Trading",
      icon: "🌾",
      tagline: "India's & Africa's fastest-growing digital agricultural produce marketplace.",
      description: "Connect directly with thousands of verified growers. Buy and sell cereals, pulses, oilseeds, spices, and fresh vegetables at true farm-gate origin prices without intermediary brokerage markups.",
      features: [
        "100% verified farmer & cooperative grower profiles",
        "Real-time atomic stock reservation and order locks",
        "Transparent quality grades and moisture disclosures",
        "Flexible logistics coordination: Farmgate or Warehouse",
      ],
      badge: "Spot Market",
      cta: "Explore e-Mandi Trades",
      link: "/products",
    },
    {
      id: 3,
      title: "AgriKnow (GAP)",
      subtitle: "Good Agricultural Practices & Advisory",
      icon: "📰",
      tagline: "Hyper-local weather forecasts, mandi rate trends, and crop advisory.",
      description: "AgriKnow delivers tailored agronomy intelligence directly to farmers' mobile devices, advising on optimal sowing windows, crop protection, mandi arrival trends, and post-harvest storage techniques.",
      features: [
        "Micro-climate hyper-local 7-day weather alerts",
        "Historical mandi price comparison & arrival trends",
        "Organic fertilization & IPM disease guides",
        "Multilingual farmer SMS and voice support",
      ],
      badge: "Farmer Advisory",
      cta: "Access AgriKnow",
      link: "/products",
    },
    {
      id: 4,
      title: "AgriPay",
      subtitle: "Settlement & Escrow Financial Services",
      icon: "💳",
      tagline: "Safe, automated digital payments with instant settlement upon quality acceptance.",
      description: "AgriPay guarantees financial peace of mind. Buyer funds are held in secure escrow upon trade creation, and released instantaneously to the farmer's mobile money or bank account once delivery handover is approved.",
      features: [
        "Escrow-secured buyer payments with atomic verification",
        "Instant settlement to Telebirr, CBE, or commercial banks",
        "Invoice factoring & trade credit options for millers",
        "Tamper-proof digital ledger of trade transactions",
      ],
      badge: "Fintech & Escrow",
      cta: "Learn About AgriPay",
      link: "/register",
    },
    {
      id: 5,
      title: "Corporate Buying",
      subtitle: "Institutional Bulk Procurement",
      icon: "🏢",
      tagline: "End-to-end supply chain sourcing for flour mills, food processors, and exporters.",
      description: "We partner with leading food corporations, consumer goods companies, and regional grain boards to aggregate, assay, store, and transport thousands of metric tons with verified lab quality certifications.",
      features: [
        "WDRA-compliant scientific warehousing & pest control",
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
      badge: "Live Auction",
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
      quote: "agribazaar has kept me updated with live fluctuations in mandi prices and all current business updates. I received full payment in my account within minutes of delivery.",
      author: "Suneel Gemechu",
      role: "Grain Trader & Wholesaler",
      location: "Highland Central Hub",
    },
    {
      quote: "Even during difficult seasons, agribazaar has been working great and provided me convenience and ease in trading. We sold over 200 quintals of wheat directly to millers.",
      author: "Kamlesh Tolosa",
      role: "Farmer Cooperative Leader",
      location: "East Farming Zone",
    },
    {
      quote: "The quality assay reports and escrow payment system eliminate all counterparty risk. Our processing factory now procures 40% of our raw materials through agribazaar.",
      author: "Sanath Bekele",
      role: "Procurement Director, Apex Milling",
      location: "National Logistics Park",
    },
  ];

  // FAQ Items
  const faqs = [
    {
      q: "Which agricultural commodities can I buy or sell on agribazaar?",
      a: "You can trade a wide variety of commodities including Grains & Cereals (White & Red Teff, Wheat, Barley, Maize), Pulses & Oilseeds (Sesame, Chickpeas, Red Kidney Beans), Cash Crops (Arabica Coffee, Spices, Garlic), and Fresh Produce (Red Onions, Avocados, Tomatoes).",
    },
    {
      q: "How does agribazaar help farmers get better prices?",
      a: "By eliminating multiple tiers of speculative brokers and middlemen, agribazaar gives farmers direct access to millers, food processors, and wholesale buyers. Real-time competitive bidding and transparent mandi prices ensure growers receive 100% fair market value.",
    },
    {
      q: "What is AgriBhumi?",
      a: "AgriBhumi is our proprietary satellite GIS and AI engine. It provides farm boundary tagging, vegetative health indexing (NDVI), soil moisture telemetry, and yield prediction to support modern precision agriculture.",
    },
    {
      q: "What services does agribazaar offer?",
      a: "Our integrated agritech suite includes e-Mandi spot trading, Online Reverse & Forward Auctions, AgriBhumi GIS farm tracking, AgriKnow agronomy advisories, AgriPay instant settlement, scientific warehousing, and third-party quality assay testing.",
    },
    {
      q: "What is crop monitoring, and why is it important?",
      a: "Crop monitoring uses satellite sensors to detect water stress, pest infestations, and growth anomalies before they become visible to the naked eye. This allows proactive interventions, prevents harvest loss, and certifies crop quality for prospective buyers.",
    },
  ];

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      {/* ══════════ LIVE COMMODITY MANDI TICKER ══════════ */}
      <div className="bg-slate-900 text-white overflow-hidden py-2 border-b border-slate-800 text-xs">
        <div className="flex items-center">
          <div className="bg-agriRed px-4 py-1 font-bold uppercase tracking-wider text-[11px] z-10 flex items-center gap-1.5 flex-shrink-0 shadow-md">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Live Mandi Rates
          </div>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="animate-ticker flex items-center gap-8 pl-4">
              {[...tickerItems, ...tickerItems].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 font-medium">
                  <span className="text-slate-200">{item.commodity}:</span>
                  <span className="font-bold text-white">{item.price}</span>
                  <span className={`text-[11px] font-bold flex items-center ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.up ? <TrendingUp className="h-3 w-3 mr-0.5 inline" /> : <TrendingDown className="h-3 w-3 mr-0.5 inline" />}
                    {item.change}
                  </span>
                  <span className="text-[10px] text-slate-400">({item.mandi})</span>
                  <span className="text-slate-600 font-bold">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ HERO SECTION (AGRIBAZAAR STYLE) ══════════ */}
      <section
        className="relative text-white py-16 sm:py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #091a36 0%, #11284d 50%, #0d381e 100%)' }}
      >
        {/* Subtle agricultural background texture */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 bg-agriNavy-800/80 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-200 mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>National Commodity E-Trading & Sourcing Exchange</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              India's & East Africa's Leading Integrated <span className="text-amber-400">Agritech Platform</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Putting the power into small farmowners' and institutional buyers' hands with state-of-the-art auction engines, satellite GIS monitoring, and guaranteed instant digital settlements.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/products">
                <button className="btn-agri-amber px-8 py-3.5 rounded text-sm font-bold shadow-lg flex items-center gap-2">
                  Click Here for Live Trades
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/register">
                <button className="btn-agri-red px-8 py-3.5 rounded text-sm font-bold shadow-lg flex items-center gap-2">
                  Register as Miller / Trader
                </button>
              </Link>
            </div>

            {/* Note bar */}
            <div className="mt-8 pt-6 border-t border-blue-800/60 text-xs text-blue-200 flex items-center gap-2">
              <span className="font-bold text-amber-300">Notice:</span>
              <span>All certified agricultural cooperatives and institutional buyers can participate in open forward auctions.</span>
            </div>

            {/* Carousel Dots Indicator */}
            <div className="flex items-center gap-2 mt-6">
              <span className="h-2.5 w-7 rounded-full bg-white transition-all" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ THE ICONIC AGRIBAZAAR SERVICE RIBBON ══════════ */}
      <section id="services" className="bg-white border-b border-slate-200 shadow-sm sticky top-[72px] z-30">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-slate-100 text-center">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveService(s.id)}
                className={`agri-ribbon-tab py-4 px-2 flex flex-col items-center justify-center gap-1.5 focus:outline-none ${
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
          <div className="agri-card p-8 sm:p-12 border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Mockup visual */}
              <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 sm:p-8 text-white relative shadow-xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">agribazaar://{services[activeService].title.toLowerCase()}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      {services[activeService].badge}
                    </span>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded">
                      STATUS: ONLINE
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white">{services[activeService].title} Dashboard</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Live telemetry, auction rates, polygon mapping, and contract settlements in progress.
                  </p>

                  {/* Simulated metric board */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase">Trading Volume</span>
                      <p className="text-lg font-bold text-amber-400 mt-0.5">2,480 Metric Tons</p>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase">Settlement Rate</span>
                      <p className="text-lg font-bold text-emerald-400 mt-0.5">100% Instant</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-3 rounded border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>ISO 9001:2015 Certified AgTech & WDRA Warehousing Standard</span>
                  </div>
                </div>
              </div>

              {/* Right Description */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-agriRed bg-red-50 px-3 py-1 rounded border border-red-200 mb-3">
                    <span>{services[activeService].icon}</span>
                    <span>{services[activeService].subtitle}</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {services[activeService].title}
                  </h2>
                  <p className="text-base font-medium text-slate-700 mt-2">
                    {services[activeService].tagline}
                  </p>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {services[activeService].description}
                </p>

                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Key Capabilities:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {services[activeService].features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-agriRed mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={services[activeService].link}>
                    <button className="btn-agri-red px-7 py-3 rounded text-sm font-semibold flex items-center gap-2 shadow-sm">
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

      {/* ══════════ LIVE COMMODITY AUCTION & TRADING BOARD ══════════ */}
      <section className="py-16 container mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-agriRed bg-red-50 px-3 py-1 rounded border border-red-200">
              National e-Mandi Market
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Featured Agricultural Trades
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Real-time available harvest lots direct from verified farmers and regional cooperatives.
            </p>
          </div>

          <Link href="/products">
            <button className="btn-agri-red px-5 py-2.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              View All Mandi Trades
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredTrades.map((t) => (
            <div key={t.id} className="agri-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {t.category}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-red-50 text-agriRed border border-red-100">
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
                <div className="mt-3 py-1.5 px-2.5 bg-emerald-50 rounded border border-emerald-200/60 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Assay: {t.assayGrade}</span>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">{formatCurrency(t.price)}</span>
                    <span className="text-[11px] font-medium text-slate-400 ml-1">/{t.unit}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">{t.stock} {t.unit}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link href="/products">
                  <button className="w-full btn-agri-red py-2.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5">
                    Bid / Place Order
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
              <span className="text-xs font-bold uppercase tracking-wider text-agriNavy font-semibold bg-blue-50 px-3 py-1 rounded border border-blue-200">
                Enterprise & Food Processing
              </span>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Looking for <span className="text-agriRed">Corporate Buying?</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Source directly from verified farm cooperatives with complete quality assay certification, WDRA scientific warehousing, and guaranteed contract fulfillment.
              </p>

              <div className="space-y-3 text-xs text-slate-700 font-medium">
                {[
                  "Standardized lab assay tests for purity, moisture, and protein content",
                  "Escrow-protected fund transfers with automated dispute resolution",
                  "Dedicated logistics coordination and cold chain freight dispatch",
                  "Custom forward procurement contracts for food manufacturers and millers",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex gap-3">
                <Link href="/register">
                  <button className="btn-agri-red px-6 py-3 rounded text-sm font-semibold shadow-sm">
                    Register as Corporate Buyer
                  </button>
                </Link>
                <Link href="/products">
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded text-sm transition">
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
                    <Building2 className="h-5 w-5 text-agriNavy" />
                    <span className="font-bold text-sm text-slate-900">Institutional Procurement Terminal</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                    ENTERPRISE TENDER
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Settled Volume</span>
                    <p className="text-lg font-bold text-slate-900 mt-1">12,500 MT</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Verified Lots</span>
                    <p className="text-lg font-bold text-agriRed mt-1">450+ Lots</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">QC Assured</span>
                    <p className="text-lg font-bold text-emerald-600 mt-1">100%</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 italic pt-1">
                  "AgriBazaar enables large buyers to procure consistent quality grain directly from thousands of farmholders without speculative risk."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ WHAT PEOPLE SAY ABOUT AGRIBAZAAR ══════════ */}
      <section className="py-16 container mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-agriRed bg-red-50 px-3 py-1 rounded border border-red-200">
            Real Impact Stories
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            What People Say About <span className="text-agriRed">AGRIBAZAAR</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Empowering growers, millers, and agricultural trade partners across the nation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="agri-card p-6 flex flex-col justify-between">
              <div>
                <span className="text-3xl text-agriRed font-serif leading-none">“</span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2">
                  {t.quote}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-900">{t.author}</p>
                <p className="text-xs text-agriRed font-semibold">{t.role}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ FAQ ACCORDION (AGRIBAZAAR STYLE) ══════════ */}
      <section className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Everything you need to know about trading, quality assay, and settlements on AgriBazaar.
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
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-agriRed' : ''}`} />
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
      <div className="whatsapp-float flex items-center gap-2">
        <a
          href="https://wa.me/251911234567"
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:bg-emerald-600 transition hover:scale-105"
          title="Chat with AgriBazaar Support"
        >
          <MessageCircle className="h-6 w-6" />
        </a>

        <a
          href="/register"
          className="btn-agri-red px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 hover:scale-105 transition"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          <span>Connect With Us</span>
        </a>
      </div>
    </div>
  );
}
