"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Trash2,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Info,
  Layers,
  ShoppingBag,
  TrendingUp,
  Warehouse,
  Award,
  ShieldCheck,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { askRagAssistant, fetchRagSuggestions } from "@/lib/rag";
import { RagChatMessage, RagCitation, RagPromptSuggestion } from "@/types/rag";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: RagCitation[];
  matchedProducts?: Product[];
  suggestedFollowUps?: string[];
  modelUsed?: string;
  processingTimeMs?: number;
}

export function AgriCopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<RagCitation | null>(null);
  const [suggestions, setSuggestions] = useState<RagPromptSuggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const { addToCart, setIsCartDrawerOpen } = useCart();

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I am your **AgriCopilot AI Advisor**, grounded in verified **Ethiopian Commodity Exchange (ECX)** assay standards, **WDRA** warehousing rules, and live agricultural database listings.\n\nAsk me anything about grain moisture thresholds, coffee cupping grades, mandi terminal price trends, or current lots available for trade!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedFollowUps: [
        "What is the maximum allowable moisture for Magna Teff?",
        "What are the cupping and defect requirements for Q1 Coffee?",
        "Where can I find durum wheat lots in Bale Zone?",
        "How does trade escrow work with Telebirr and CBE Birr?",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRagSuggestions()
      .then((data) => setSuggestions(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: MessageItem = {
      id: "u-" + Date.now(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const history: RagChatMessage[] = messages
        .filter((m) => m.id !== "welcome")
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await askRagAssistant({
        query,
        categoryFilter: selectedCategory !== "ALL" ? selectedCategory : undefined,
        conversationHistory: history,
        includeMarketProducts: true,
        topK: 4,
      });

      const assistantMsg: MessageItem = {
        id: "a-" + Date.now(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        citations: response.citations,
        matchedProducts: response.matchedProducts,
        suggestedFollowUps: response.suggestedFollowUps,
        modelUsed: response.modelUsed,
        processingTimeMs: response.processingTimeMs,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: MessageItem = {
        id: "e-" + Date.now(),
        role: "assistant",
        content: `I encountered a momentary issue processing your agricultural inquiry. Please try rephrasing or selecting from the prompt recommendations below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedFollowUps: [
          "What is the maximum allowable moisture for Magna Teff?",
          "How does payment escrow protect buyers during physical assay?",
        ],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Chat history cleared. How can I assist your farming or commodity trade decisions today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedFollowUps: [
          "What is the maximum allowable moisture for Magna Teff?",
          "What are the benchmark mandi rates in Debre Birhan?",
        ],
      },
    ]);
  };

  const handleAddToCartFromCopilot = (product: Product) => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        categoryName: product.categoryName || "Commodity Lot",
        unitPrice: product.unitPrice,
        unit: product.unit,
        quantity: 1,
        farmerName: product.farmerName,
        cooperative: product.cooperative,
        location: product.location,
        assayGrade: product.assayGrade,
        maxQuantity: product.quantityAvailable || 100,
        image: product.imageUrls?.[0],
      },
      1
    );
    setIsCartDrawerOpen(true);
  };

  return (
    <>
      {/* ── FLOATING TRIGGER BUTTON (BOTTOM RIGHT) ── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 text-white text-xs font-semibold py-2 px-3.5 rounded-full shadow-lg backdrop-blur-xs border border-slate-700/60 animate-bounce duration-1000">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Need advice? Ask AgriCopilot</span>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          className="relative group h-14 w-14 rounded-full bg-gradient-to-tr from-[#1c4482] via-[#1565c0] to-teal-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-white/80"
          aria-label="Open AI Copilot Advisor"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <>
              <Sparkles className="h-6 w-6 text-amber-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500 border-2 border-white text-[8px] font-bold text-white items-center justify-center">
                  AI
                </span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* ── EXPANDED CHAT MODAL DRAWER ── */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col bg-white border border-slate-200 overflow-hidden ${
            isMinimized
              ? "bottom-24 right-6 w-80 h-16 rounded-2xl"
              : "bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[450px] md:w-[480px] h-[640px] max-h-[85vh] rounded-3xl"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1c4482] via-[#1a365d] to-[#0f2942] text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-blue-900/50">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20 text-amber-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight text-white">AgriCopilot Advisor</h3>
                  <span className="bg-teal-500/20 text-teal-300 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-teal-500/30">
                    RAG Grounded
                  </span>
                </div>
                <p className="text-[11px] text-blue-200/80 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Grounded in ECX, WDRA & Live Marketplace
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-blue-200">
              <Link
                href="/assistant"
                target="_blank"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="Open Dedicated Full-Screen Assistant"
              >
                <Maximize2 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleClearHistory}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="Clear Chat History"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Category Filter Toolbar */}
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                <span className="text-slate-400 font-medium whitespace-nowrap pl-1">Scope:</span>
                {[
                  { id: "ALL", label: "All Knowledge" },
                  { id: "ECX_GRADING_STANDARDS", label: "ECX Quality" },
                  { id: "POST_HARVEST_STORAGE", label: "WDRA Silos" },
                  { id: "MARKET_PRICE_TRENDS", label: "Mandi Rates" },
                  { id: "MARKETPLACE_POLICY", label: "Escrow & Safety" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition ${
                      selectedCategory === cat.id
                        ? "bg-[#1c4482] text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    {/* Role header & timestamp */}
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                      <span>{msg.role === "user" ? "You" : "AgriCopilot"}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && (
                        <span className="bg-slate-200 text-slate-600 px-1 rounded text-[9px]">
                          {msg.modelUsed}
                        </span>
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed shadow-xs ${
                        msg.role === "user"
                          ? "bg-[#1c4482] text-white rounded-tr-xs"
                          : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs"
                      }`}
                    >
                      {/* Formatted Markdown text */}
                      <div className="space-y-2 whitespace-pre-wrap font-sans text-xs">
                        {renderMarkdownContent(msg.content)}
                      </div>

                      {/* Source Citations */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <BookOpen className="h-3 w-3 text-teal-600" />
                            <span>Retrieved Verified Standards</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.citations.map((cit) => (
                              <button
                                key={cit.citationNumber}
                                onClick={() => setSelectedCitation(cit)}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200/70 hover:bg-teal-100 transition text-[11px] font-medium"
                              >
                                <span className="font-bold text-teal-700">[{cit.citationNumber}]</span>
                                <span className="truncate max-w-[170px]">{cit.documentTitle}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Attached Live Products from PostgreSQL Database */}
                      {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <ShoppingBag className="h-3 w-3 text-blue-700" />
                            <span>Live Database Commodities Matched</span>
                          </div>
                          <div className="space-y-2">
                            {msg.matchedProducts.map((prod) => (
                              <div
                                key={prod.id}
                                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2.5 hover:border-blue-400 transition"
                              >
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/products/${prod.id}`}
                                    className="font-bold text-slate-900 text-xs hover:text-[#1c4482] truncate block"
                                  >
                                    {prod.name}
                                  </Link>
                                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                    <span className="font-semibold text-emerald-700">
                                      {prod.unitPrice?.toLocaleString()} ETB
                                    </span>
                                    {" / "}
                                    <span>{prod.unit}</span>
                                    {prod.assayGrade && (
                                      <span className="ml-1.5 text-slate-400">
                                        • {prod.assayGrade}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                    📍 {prod.location}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleAddToCartFromCopilot(prod)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2 py-1.5 rounded-lg text-[10px] shadow-xs transition"
                                  >
                                    Procure
                                  </button>
                                  <Link
                                    href={`/products/${prod.id}`}
                                    className="p-1.5 text-slate-400 hover:text-blue-700 transition"
                                    title="View Trade"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
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
                      <div className="mt-2 pl-1 space-y-1">
                        <div className="text-[10px] text-slate-400 font-medium">Suggested follow-ups:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedFollowUps.map((prompt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(prompt)}
                              className="text-[11px] text-left bg-white text-slate-700 hover:text-[#1c4482] hover:bg-blue-50/70 border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs transition flex items-center gap-1"
                            >
                              <span>{prompt}</span>
                              <ChevronRight className="h-3 w-3 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start space-x-2">
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs">
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <Sparkles className="h-4 w-4 text-teal-600 animate-spin" />
                        <span className="font-medium">Retrieving knowledge base & market listings...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips (Initial or Idle) */}
              {messages.length <= 2 && suggestions.length > 0 && (
                <div className="bg-white px-3 py-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                    Try:
                  </span>
                  {[
                    "🌾 Teff Moisture Rules",
                    "📈 Mandi Prices",
                    "☕ Coffee Q1 Grades",
                    "🏬 Silo Storage",
                    "🛡️ Escrow Settlement",
                  ].map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(chip)}
                      className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#1c4482] text-slate-600 border border-slate-200 transition text-[11px]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Ask about ECX grades, moisture, mandi rates, or stock..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1c4482] focus:bg-white transition"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || isLoading}
                    className="bg-[#1c4482] hover:bg-blue-800 disabled:opacity-40 text-white p-2.5 rounded-xl shadow-xs transition flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
                  <span>ECX & WDRA Certified RAG Grounding</span>
                  <Link href="/assistant" className="hover:text-blue-700 underline">
                    Full AI Knowledge Workspace →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── CITATION DETAILS MODAL DRAWER ── */}
      {selectedCitation && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedCitation(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="h-4 w-4" />
              <span>Verified Reference Standard [{selectedCitation.citationNumber}]</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2">
              {selectedCitation.documentTitle}
            </h3>

            <div className="flex items-center gap-2 mb-4">
              <span className="bg-teal-50 text-teal-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-teal-200">
                {selectedCitation.category.replace(/_/g, " ")}
              </span>
              <span className="text-slate-400 text-xs">
                Relevance: {Math.round(selectedCitation.relevanceScore * 100)}%
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed max-h-60 overflow-y-auto mb-4">
              <p className="font-semibold text-slate-900 mb-1">Grounded Excerpt:</p>
              <p className="italic">{selectedCitation.snippet}</p>
            </div>

            {selectedCitation.sourceUrl && (
              <a
                href={selectedCitation.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-semibold mb-4"
              >
                <span>View Official Source Publication</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedCitation(null)}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Lightweight markdown parser for bold, headers, code, and bullet lists
 */
function renderMarkdownContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={idx} className="font-bold text-slate-900 text-xs mt-2 mb-1">
          {trimmed.replace("### ", "")}
        </h4>
      );
    }
    if (trimmed.startsWith("#### ")) {
      return (
        <h5 key={idx} className="font-bold text-slate-800 text-xs mt-1.5 mb-0.5">
          {trimmed.replace("#### ", "")}
        </h5>
      );
    }
    if (trimmed.startsWith("- ")) {
      return (
        <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
          <span className="text-teal-600 font-bold">•</span>
          <span>{parseInlineFormatting(trimmed.substring(2))}</span>
        </div>
      );
    }
    return (
      <p key={idx} className="my-0.5">
        {parseInlineFormatting(line)}
      </p>
    );
  });
}

function parseInlineFormatting(text: string): React.ReactNode {
  // Bold matches: **text**
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
