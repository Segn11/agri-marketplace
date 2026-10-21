"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  BookOpen,
  Send,
  Trash2,
  ExternalLink,
  ShoppingBag,
  Award,
  TrendingUp,
  Warehouse,
  ShieldCheck,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  HelpCircle,
} from "lucide-react";
import {
  askRagAssistant,
  searchRag,
  fetchRagDocuments,
  fetchRagSuggestions,
} from "@/lib/rag";
import {
  RagChatMessage,
  RagCitation,
  RagDocument,
  RagPromptSuggestion,
} from "@/types/rag";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

export default function AssistantPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "knowledge" | "matcher">("chat");

  // Chat State
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedCitation, setSelectedCitation] = useState<RagCitation | null>(null);
  const [activeDocument, setActiveDocument] = useState<RagDocument | null>(null);

  // Data states
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [suggestions, setSuggestions] = useState<RagPromptSuggestion[]>([]);
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [docCategoryFilter, setDocCategoryFilter] = useState("ALL");

  // Semantic matcher state
  const [matcherQuery, setMatcherQuery] = useState("");
  const [matcherLoading, setMatcherLoading] = useState(false);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [matchedCitations, setMatchedCitations] = useState<RagCitation[]>([]);

  const { addToCart, setIsCartDrawerOpen } = useCart();

  const handleAddToCartProduct = (prod: Product) => {
    addToCart(
      {
        productId: prod.id,
        name: prod.name,
        categoryName: prod.categoryName || "Commodity Lot",
        unitPrice: prod.unitPrice,
        unit: prod.unit,
        quantity: 1,
        farmerName: prod.farmerName,
        cooperative: prod.cooperative,
        location: prod.location,
        assayGrade: prod.assayGrade,
        maxQuantity: prod.quantityAvailable || 100,
        image: prod.imageUrls?.[0],
      },
      1
    );
    setIsCartDrawerOpen(true);
  };

  const [messages, setMessages] = useState<Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    citations?: RagCitation[];
    matchedProducts?: Product[];
    suggestedFollowUps?: string[];
    modelUsed?: string;
  }>>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome to the **AgriMarketplace AI Agricultural Advisor & RAG Knowledge Hub**!\n\nThis system is directly connected to our **PostgreSQL commodity inventory** and grounded in verified **Ethiopian Commodity Exchange (ECX)** assay standards, **WDRA** warehousing rules, and seasonal mandi terminal pricing data.\n\nChoose an inquiry topic below or type your question:`,
      suggestedFollowUps: [
        "What is the maximum allowable moisture for Magna Teff?",
        "What cupping score and defect limits apply to Q1 Specialty Coffee?",
        "Where can I find durum wheat lots in Bale Zone?",
        "How does trade escrow protect buyers using Telebirr or CBE Birr?",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRagDocuments().then(setDocuments).catch(console.error);
    fetchRagSuggestions().then(setSuggestions).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const q = (textToSend || query).trim();
    if (!q || isLoading) return;

    const userMsg = {
      id: "u-" + Date.now(),
      role: "user" as const,
      content: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    try {
      const history: RagChatMessage[] = messages
        .filter((m) => m.id !== "welcome")
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await askRagAssistant({
        query: q,
        categoryFilter: categoryFilter !== "ALL" ? categoryFilter : undefined,
        conversationHistory: history,
        includeMarketProducts: true,
        topK: 4,
      });

      const assistantMsg = {
        id: "a-" + Date.now(),
        role: "assistant" as const,
        content: response.answer,
        citations: response.citations,
        matchedProducts: response.matchedProducts,
        suggestedFollowUps: response.suggestedFollowUps,
        modelUsed: response.modelUsed,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "assistant",
          content: "I experienced an error retrieving the requested knowledge. Please try rephrasing your agricultural query.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunMatcher = async () => {
    if (!matcherQuery.trim() || matcherLoading) return;
    setMatcherLoading(true);

    try {
      const res = await searchRag({
        query: matcherQuery,
        limit: 6,
      });
      setMatchedProducts(res.productMatches || []);
      setMatchedCitations(res.knowledgeMatches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setMatcherLoading(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = docCategoryFilter === "ALL" || doc.category === docCategoryFilter;
    const matchesSearch =
      !docSearchQuery ||
      doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.tags?.toLowerCase().includes(docSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ── TOP HERO BANNER ── */}
      <div className="bg-gradient-to-r from-[#1c4482] via-[#1a365d] to-[#0f2942] text-white py-10 px-4 sm:px-8 border-b border-blue-900/50 shadow-md">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Agricultural RAG (Retrieval-Augmented Generation) Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                AgriCopilot AI Knowledge & Trade Advisor
              </h1>
              <p className="text-sm text-blue-200/90 max-w-2xl leading-relaxed">
                Empowering producers, millers, and grain buyers with grounded insights from ECX quality
                guidelines, WDRA silo protocols, and live marketplace stock.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-xs border border-white/20 text-center">
              <div>
                <div className="text-xl font-extrabold text-amber-300">6+</div>
                <div className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">
                  ECX Standards
                </div>
              </div>
              <div className="border-x border-white/20 px-3">
                <div className="text-xl font-extrabold text-teal-300">100%</div>
                <div className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">
                  Grounded
                </div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-emerald-300">Live</div>
                <div className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">
                  DB Catalog
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 mt-8 pt-4 border-t border-white/10">
            {[
              { id: "chat", label: "AI Copilot Advisor", icon: Sparkles },
              { id: "knowledge", label: "Verified Knowledge Base", icon: BookOpen },
              { id: "matcher", label: "Semantic Commodity Matcher", icon: ShoppingBag },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition ${
                    activeTab === tab.id
                      ? "bg-white text-[#1c4482] shadow-sm"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-8 mt-8">
        {/* TAB 1: COPILOT ADVISORY CHAT */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Prompt Library & Filter Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-blue-700" />
                  <span>Knowledge Scope</span>
                </h3>
                <div className="space-y-1">
                  {[
                    { id: "ALL", label: "All Topics" },
                    { id: "ECX_GRADING_STANDARDS", label: "ECX Quality & Moisture" },
                    { id: "POST_HARVEST_STORAGE", label: "WDRA Silos & Hermetic" },
                    { id: "MARKET_PRICE_TRENDS", label: "Mandi Terminal Rates" },
                    { id: "MARKETPLACE_POLICY", label: "Escrow & Settlements" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        categoryFilter === cat.id
                          ? "bg-[#1c4482] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Prompts */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Quick Inquiries</span>
                </h3>
                <div className="space-y-2">
                  {[
                    "What is the maximum allowable moisture for Magna Teff?",
                    "What are the cupping and defect requirements for Q1 Coffee?",
                    "Where can I find durum wheat lots in Bale Zone?",
                    "How should grain stacks be arranged on pallets according to WDRA?",
                    "How does trade escrow work with Telebirr and CBE Birr?",
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p)}
                      className="w-full text-left text-[11px] p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#1c4482] border border-slate-200/80 transition leading-snug"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Chat Thread */}
            <div className="lg:col-span-3 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[720px]">
              {/* Chat Thread Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1 text-xs text-slate-400">
                      <span className="font-bold text-slate-600">
                        {msg.role === "user" ? "You" : "AgriCopilot AI"}
                      </span>
                      {msg.modelUsed && (
                        <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded text-[10px]">
                          {msg.modelUsed}
                        </span>
                      )}
                    </div>

                    <div
                      className={`max-w-[90%] rounded-2xl px-5 py-4 leading-relaxed text-sm ${
                        msg.role === "user"
                          ? "bg-[#1c4482] text-white rounded-tr-xs"
                          : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs"
                      }`}
                    >
                      <div className="space-y-2.5 whitespace-pre-wrap">
                        {renderMarkdownContent(msg.content)}
                      </div>

                      {/* Source Citations */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-teal-600" />
                            <span>Verified Reference Citations</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.citations.map((cit) => (
                              <button
                                key={cit.citationNumber}
                                onClick={() => setSelectedCitation(cit)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100 transition text-xs font-semibold"
                              >
                                <span className="text-teal-700 font-bold">[{cit.citationNumber}]</span>
                                <span>{cit.documentTitle}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Attached Live Products from DB */}
                      {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <ShoppingBag className="h-3.5 w-3.5 text-blue-700" />
                            <span>Live Database Listings Recommended</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {msg.matchedProducts.map((prod) => (
                              <div
                                key={prod.id}
                                className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between hover:border-blue-400 transition"
                              >
                                <div>
                                  <Link
                                    href={`/products/${prod.id}`}
                                    className="font-bold text-slate-900 text-xs hover:text-[#1c4482] block truncate"
                                  >
                                    {prod.name}
                                  </Link>
                                  <div className="text-xs text-slate-600 mt-1">
                                    <span className="font-extrabold text-emerald-700">
                                      {prod.unitPrice?.toLocaleString()} ETB
                                    </span>
                                    {" / "}
                                    <span>{prod.unit}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-1">
                                    📍 {prod.location}
                                  </div>
                                  {prod.assayGrade && (
                                    <div className="text-[10px] text-slate-600 mt-0.5">
                                      Assay: <strong>{prod.assayGrade}</strong>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200/60">
                                  <button
                                    onClick={() => handleAddToCartProduct(prod)}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-xs transition"
                                  >
                                    Procure Lot
                                  </button>
                                  <Link
                                    href={`/products/${prod.id}`}
                                    className="p-1.5 text-slate-500 hover:text-blue-800 transition"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Follow-up Prompts */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="mt-2 pl-2 space-y-1">
                        <div className="text-[11px] text-slate-400 font-medium">Follow-up inquiries:</div>
                        <div className="flex flex-wrap gap-2">
                          {msg.suggestedFollowUps.map((p, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendMessage(p)}
                              className="text-xs bg-white text-slate-700 hover:text-[#1c4482] hover:bg-blue-50 border border-slate-200 px-3 py-1 rounded-full shadow-2xs transition flex items-center gap-1"
                            >
                              <span>{p}</span>
                              <ChevronRight className="h-3 w-3 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-sm">
                    <Sparkles className="h-5 w-5 text-teal-600 animate-spin" />
                    <span className="text-xs text-slate-600 font-medium">
                      Retrieving verified standards & live market records...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about ECX grading, moisture thresholds, warehousing, or live commodity lots..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1c4482] focus:bg-white transition"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="bg-[#1c4482] hover:bg-blue-800 disabled:opacity-40 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-sm transition flex items-center gap-2"
                  >
                    <span>Ask</span>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KNOWLEDGE BASE EXPLORER */}
        {activeTab === "knowledge" && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search verified standards, crops, moisture..."
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-700"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                {[
                  { id: "ALL", label: "All Categories" },
                  { id: "ECX_GRADING_STANDARDS", label: "ECX Quality" },
                  { id: "COMMODITY_SPECS", label: "Commodity Specs" },
                  { id: "POST_HARVEST_STORAGE", label: "WDRA Storage" },
                  { id: "MARKET_PRICE_TRENDS", label: "Price Trends" },
                  { id: "MARKETPLACE_POLICY", label: "Safe Trading" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setDocCategoryFilter(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      docCategoryFilter === c.id
                        ? "bg-[#1c4482] text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between p-5 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200 uppercase">
                        {doc.category.replace(/_/g, " ")}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{doc.readTimeMinutes || 3} min read</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-[#1c4482] transition line-clamp-2">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {doc.summary}
                    </p>

                    {doc.tags && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {doc.tags.split(",").slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                      {doc.author || "ECX Directorate"}
                    </span>
                    <button
                      onClick={() => setActiveDocument(doc)}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 group-hover:translate-x-0.5 transition"
                    >
                      <span>Read Standard</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SEMANTIC COMMODITY MATCHER */}
        {activeTab === "matcher" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#1c4482] text-xs font-bold uppercase tracking-wider">
                <ShoppingBag className="h-4 w-4" />
                <span>Natural Language Procurement Matcher</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Describe the Commodity & Specifications You Need
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our semantic retrieval engine cross-references your description against live listings in the
                database and ranks lots matching your desired moisture, assay grade, and location.
              </p>

              <div className="space-y-3 pt-2">
                <textarea
                  rows={3}
                  value={matcherQuery}
                  onChange={(e) => setMatcherQuery(e.target.value)}
                  placeholder="e.g. I need 100 quintals of Grade 1 Magna White Teff with moisture below 12% in North Shewa or Debre Birhan for commercial bakery production..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1c4482] focus:bg-white transition"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span>Try:</span>
                    <button
                      onClick={() =>
                        setMatcherQuery(
                          "Grade 1 Pure White Teff with moisture below 12% in Debre Birhan"
                        )
                      }
                      className="text-blue-700 hover:underline"
                    >
                      Teff &lt; 12% Moisture
                    </button>
                    <span>•</span>
                    <button
                      onClick={() =>
                        setMatcherQuery(
                          "Specialty Washed Green Coffee Beans Q1 SCA 85+ in Hawassa"
                        )
                      }
                      className="text-blue-700 hover:underline"
                    >
                      Specialty Coffee Q1
                    </button>
                    <span>•</span>
                    <button
                      onClick={() =>
                        setMatcherQuery(
                          "Hard Amber Durum Wheat with protein > 13.5% in Bale Zone"
                        )
                      }
                      className="text-blue-700 hover:underline"
                    >
                      Durum Wheat Bale
                    </button>
                  </div>

                  <button
                    onClick={handleRunMatcher}
                    disabled={!matcherQuery.trim() || matcherLoading}
                    className="bg-[#1c4482] hover:bg-blue-800 disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>{matcherLoading ? "Matching..." : "Match Commodities"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Matcher Results */}
            {matchedProducts.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>Ranked Matching Marketplace Lots ({matchedProducts.length})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                            Available Now
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            Stock: {p.quantityAvailable} {p.unit}
                          </span>
                        </div>

                        <Link
                          href={`/products/${p.id}`}
                          className="font-bold text-slate-900 text-sm hover:text-[#1c4482] block leading-snug"
                        >
                          {p.name}
                        </Link>

                        <div className="text-sm font-extrabold text-emerald-700 mt-2">
                          {p.unitPrice?.toLocaleString()} ETB{" "}
                          <span className="text-xs font-normal text-slate-500">/ {p.unit}</span>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3 mt-3 text-xs space-y-1 border border-slate-100">
                          {p.assayGrade && (
                            <div>
                              <span className="text-slate-400">Assay Grade: </span>
                              <strong className="text-slate-800">{p.assayGrade}</strong>
                            </div>
                          )}
                          {p.moistureContent && (
                            <div>
                              <span className="text-slate-400">Moisture: </span>
                              <strong className="text-slate-800">{p.moistureContent}</strong>
                            </div>
                          )}
                          <div>
                            <span className="text-slate-400">Terminal Location: </span>
                            <span className="text-slate-700">{p.location}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Cooperative: </span>
                            <span className="text-slate-700">{p.cooperative || p.farmerName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => handleAddToCartProduct(p)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition"
                        >
                          Procure Lot via Escrow
                        </button>
                        <Link
                          href={`/products/${p.id}`}
                          className="border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── DOCUMENT VIEWER MODAL ── */}
      {activeDocument && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="bg-teal-50 text-teal-800 text-xs font-bold px-2.5 py-1 rounded border border-teal-200 uppercase">
                {activeDocument.category.replace(/_/g, " ")}
              </span>
              <button
                onClick={() => setActiveDocument(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {activeDocument.title}
              </h2>
              <div className="text-xs text-slate-400">
                Author: {activeDocument.author || "ECX Directorate"} • {activeDocument.readTimeMinutes} min read
              </div>
              <div className="border-t border-slate-100 pt-4 whitespace-pre-wrap font-sans">
                {renderMarkdownContent(activeDocument.content)}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {activeDocument.sourceUrl ? (
                <a
                  href={activeDocument.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Official Source Authority</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <div />
              )}
              <button
                onClick={() => setActiveDocument(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CITATION DETAILS MODAL ── */}
      {selectedCitation && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="text-xs font-bold text-teal-700 uppercase mb-1">
              Verified Citation [{selectedCitation.citationNumber}]
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {selectedCitation.documentTitle}
            </h3>
            <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 italic leading-relaxed mb-4">
              {selectedCitation.snippet}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedCitation(null)}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderMarkdownContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ")) {
      return (
        <h2 key={idx} className="text-base font-bold text-slate-900 mt-3 mb-1">
          {trimmed.replace("# ", "")}
        </h2>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={idx} className="text-sm font-bold text-slate-900 mt-2.5 mb-1">
          {trimmed.replace("## ", "")}
        </h3>
      );
    }
    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={idx} className="text-xs font-bold text-slate-800 mt-2 mb-0.5">
          {trimmed.replace("### ", "")}
        </h4>
      );
    }
    if (trimmed.startsWith("- ")) {
      return (
        <div key={idx} className="flex items-start gap-2 pl-2 my-1">
          <span className="text-teal-600 font-bold">•</span>
          <span>{parseInlineFormatting(trimmed.substring(2))}</span>
        </div>
      );
    }
    return (
      <p key={idx} className="my-1">
        {parseInlineFormatting(line)}
      </p>
    );
  });
}

function parseInlineFormatting(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
