import type { Product } from "./product"

export interface CatalogProduct extends Product {
  imageUrl?: string
  addedAt: number
  source: "api" | "manual"
  catalogId: string
}

export interface Catalog {
  products: Record<string, CatalogProduct>
  lastUpdated: number
}
