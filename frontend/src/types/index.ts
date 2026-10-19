export type Role = 'ROLE_FARMER' | 'ROLE_BUYER' | 'ROLE_ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  location: string;
  status: 'ACTIVE' | 'SUSPENDED';
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
  farmerPhone?: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  unitPrice: number;
  unit: string;
  quantityAvailable: number;
  location: string;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  imageUrls: string[];
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
}

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'READY' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

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
