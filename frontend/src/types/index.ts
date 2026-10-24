export type Role = 'ROLE_FARMER' | 'ROLE_BUYER' | 'ROLE_ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  location: string;
  status: 'ACTIVE' | 'SUSPENDED';
  isVerified?: boolean;
  farmName?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  location: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  cooperative?: string;
  farmerPhone?: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  unitPrice: number;
  unit: string;
  quantityAvailable: number;
  minOrderQuantity?: number;
  location: string;
  assayGrade?: string;
  moistureContent?: string;
  purity?: string;
  harvestSeason?: string;
  storageWarehouse?: string;
  badge?: string;
  rejectionReason?: string;
  approvalMethod?: 'ADMIN' | 'OTP_VERIFIED';
  approvedAt?: string;
  approvalNotes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'PENDING_APPROVAL' | 'REJECTED' | 'SUSPENDED' | 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'BIDDING_NEGOTIATING';
  tradeType?: 'FIXED_PRICE' | 'AUCTION' | 'NEGOTIABLE';
  reservePrice?: number;
  minBidIncrement?: number;
  currentHighestBid?: number;
  highestBidderId?: string;
  auctionEndAt?: string;
  pickupDate?: string;
  pickupAddress?: string;
  impurityPercentage?: number;
  imageUrls: string[];
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
}

export interface ProductOtpDto {
  productId: string;
  productName: string;
  otpCode: string;
  recipientPhone: string;
  expiresInMinutes: number;
  message: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  categoryName: string;
  unitPrice: number;
  unit: string;
  quantity: number;
  farmerName: string;
  cooperative?: string;
  location: string;
  assayGrade?: string;
  maxQuantity: number;
  image?: string;
}

// 12-Stage Lifecycle Status from AgriBazaar Specification Section 6
export type OrderStatus = 
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'LIVE'
  | 'BIDDING_NEGOTIATING'
  | 'DEAL_CONFIRMED'
  | 'PAYMENT_HELD'
  | 'PICKUP_SCHEDULED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'ACCEPTED'
  | 'DISPUTED'
  | 'SETTLED'
  | 'CLOSED'
  | 'PENDING'
  | 'READY'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export interface OrderItem {
  productId: string;
  productName: string;
  productUnit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  status: OrderStatus;
  note?: string;
  deliveryPreference: string;
  totalPrice: number;
  items: OrderItem[];
  createdAt: string;
}

// AgriBazaar Pillar 1: Trade - Bids and Negotiable Offers
export interface BidOffer {
  id: string;
  lotId: string;
  buyerId: string;
  buyerName?: string;
  type: 'AUCTION_BID' | 'NEGOTIATION_OFFER' | 'SELLER_COUNTER';
  amount: number;
  autoBidMax?: number;
  status: 'ACTIVE' | 'OUTBID' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  counterNote?: string;
  createdAt: string;
}

// AgriBazaar Pillar 2: Trust - AgriPay Wallet & Double-Entry Ledger
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  escrowLocked: number;
  currency: string;
  updatedAt: string;
}

export interface WalletLedgerEntry {
  id: string;
  walletId: string;
  userId: string;
  entryType: 'DEBIT' | 'CREDIT';
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'ESCROW_LOCK' | 'ESCROW_RELEASE' | 'COMMISSION_DEDUCTION' | 'DISPUTE_REFUND' | 'TRADE_PAYOUT';
  amount: number;
  balanceAfter: number;
  referenceId: string;
  description: string;
  createdAt: string;
}

// AgriBazaar Pillar 3: Fulfilment - Logistics, Weighing & Delivery
export interface Shipment {
  id: string;
  orderId: string;
  transporterName: string;
  driverName?: string;
  driverPhone: string;
  vehiclePlateNumber: string;
  trackingNumber: string;
  sourceWeightKg: number;
  destinationWeightKg?: number;
  weightSlipUrl?: string;
  proofOfDeliveryUrl?: string;
  status: 'SCHEDULED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'INSPECTED_ACCEPTED' | 'DISPUTED';
  pickupTime?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
}

// AgriBazaar Trust & Governance: Dispute Resolution
export interface Dispute {
  id: string;
  orderId: string;
  raisedById: string;
  raisedByName?: string;
  claimType: 'QUALITY_MISMATCH' | 'WEIGHT_SHORTAGE' | 'TRANSIT_DAMAGE' | 'LATE_DELIVERY' | 'WRONG_COMMODITY';
  description: string;
  evidenceNotes?: string;
  claimAmount: number;
  status: 'OPEN' | 'UNDER_INVESTIGATION' | 'RESOLVED_REFUND' | 'RESOLVED_PARTIAL' | 'DISMISSED';
  resolutionNotes?: string;
  resolvedById?: string;
  resolvedAt?: string;
  createdAt: string;
}

// AgriBazaar Pillar 4: Intelligence - Mandi Bhav Price Ticker
export interface MandiPrice {
  id: string;
  commodityName: string;
  variety?: string;
  mandiMarket: string;
  stateRegion: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  arrivalVolumeQuintals: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  recordedDate: string;
}

// AgriBazaar Intelligence: Input Marketplace
export interface InputProduct {
  id: string;
  supplierName: string;
  name: string;
  category: 'SEEDS' | 'FERTILISERS' | 'PESTICIDES' | 'EQUIPMENT';
  price: number;
  unit: string;
  stockQuantity: number;
  description: string;
  badge?: string;
  isOrganicCertified: boolean;
}

// AgriBazaar Trust: KYC Document Entity
export interface KYCDocument {
  id: string;
  userId: string;
  userName?: string;
  userRole?: string;
  docType: 'NATIONAL_ID' | 'FARM_TITLE' | 'TRADE_LICENSE' | 'TAX_CERTIFICATE' | 'BANK_STATEMENT';
  docNumber: string;
  fileUrl?: string;
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  verifiedAt?: string;
}

// AgriBazaar Intelligence: Crop Doctor Diagnostic Result
export interface CropDoctorDiagnosis {
  crop: string;
  issue: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  symptoms: string[];
  pathologyExplanation: string;
  chemicalRemedy: string;
  organicRemedy: string;
  applicationGuideline: string;
}

export interface Review {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
