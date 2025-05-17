import type { Product } from "./product"

export interface ProductBundle {
  id: string
  name: string
  description?: string
  products: Array<Product & { imageUrl?: string }>
  createdAt: number
  updatedAt: number
}

export interface BundleStore {
  bundles: ProductBundle[]
  selectedBundleId: string | null
}
