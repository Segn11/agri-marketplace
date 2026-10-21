import { Product } from "./index";

export type RagDocumentCategory =
  | "ALL"
  | "ECX_GRADING_STANDARDS"
  | "COMMODITY_SPECS"
  | "POST_HARVEST_STORAGE"
  | "MARKET_PRICE_TRENDS"
  | "MARKETPLACE_POLICY"
  | "AGRONOMY_ADVISORY";

export interface RagChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface RagCitation {
  citationNumber: number;
  documentId: string;
  documentTitle: string;
  slug: string;
  category: string;
  chunkIndex: number;
  snippet: string;
  relevanceScore: number;
  sourceUrl?: string;
}

export interface RagChatRequest {
  query: string;
  categoryFilter?: string;
  conversationHistory?: RagChatMessage[];
  topK?: number;
  includeMarketProducts?: boolean;
}

export interface RagChatResponse {
  query: string;
  answer: string;
  modelUsed: string;
  processingTimeMs: number;
  citations: RagCitation[];
  matchedProducts: Product[];
  suggestedFollowUps: string[];
}

export interface RagSearchRequest {
  query: string;
  category?: string;
  limit?: number;
}

export interface RagSearchResponse {
  query: string;
  searchTimeMs: number;
  knowledgeMatches: RagCitation[];
  productMatches: Product[];
}

export interface RagDocument {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  tags?: string;
  author?: string;
  sourceUrl?: string;
  readTimeMinutes?: number;
  chunkCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface RagPromptSuggestion {
  category: string;
  icon: string;
  title: string;
  prompts: string[];
}
