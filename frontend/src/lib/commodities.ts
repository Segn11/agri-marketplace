import { Product, Category, PagedResponse } from "@/types";
import { fetchApi } from "./api";

/**
 * Fetch products directly from the database REST API.
 * No mock data.
 */
export async function fetchProductsFromDb(params: {
  q?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  page?: number;
  size?: number;
} = {}): Promise<PagedResponse<Product>> {
  const query = new URLSearchParams();
  if (params.q) query.append("q", params.q);
  if (params.category && params.category !== "all") query.append("category", params.category);
  if (params.location && params.location !== "all") query.append("location", params.location);
  if (params.minPrice) query.append("minPrice", params.minPrice.toString());
  if (params.maxPrice) query.append("maxPrice", params.maxPrice.toString());
  if (params.status) query.append("status", params.status);
  query.append("page", (params.page || 0).toString());
  query.append("size", (params.size || 20).toString());

  const res = await fetchApi<PagedResponse<Product>>(`/products?${query.toString()}`);
  return res.data;
}

/**
 * Fetch single product details by ID directly from the database.
 */
export async function fetchProductByIdFromDb(id: string): Promise<Product> {
  const res = await fetchApi<Product>(`/products/${id}`);
  return res.data;
}

/**
 * Fetch all categories directly from the database.
 */
export async function fetchCategoriesFromDb(): Promise<Category[]> {
  const res = await fetchApi<Category[]>("/categories");
  return res.data;
}
