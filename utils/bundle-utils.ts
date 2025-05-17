import type { ProductBundle, BundleStore } from "@/types/bundle"
import type { Product } from "@/types/product"
import { logError, logInfo } from "@/lib/error-handling/error-logger"

const BUNDLE_STORAGE_KEY = "lkb-product-bundles"

// Initialize the bundle store
export function initBundleStore(): BundleStore {
  if (typeof window === "undefined") {
    return { bundles: [], selectedBundleId: null }
  }

  try {
    const storedData = localStorage.getItem(BUNDLE_STORAGE_KEY)
    if (storedData) {
      return JSON.parse(storedData)
    }
  } catch (error) {
    logError("Failed to load bundles from localStorage", { error }, "BundleUtils")
  }

  return { bundles: [], selectedBundleId: null }
}

// Save the bundle store to localStorage
export function saveBundleStore(store: BundleStore): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(BUNDLE_STORAGE_KEY, JSON.stringify(store))
    logInfo("Saved bundles to localStorage", { bundleCount: store.bundles.length }, "BundleUtils")
  } catch (error) {
    logError("Failed to save bundles to localStorage", { error }, "BundleUtils")
  }
}

// Create a new bundle from selected products
export function createBundle(
  name: string,
  products: Array<Product & { imageUrl?: string }>,
  description?: string,
): ProductBundle {
  const now = Date.now()
  return {
    id: `bundle_${now}_${Math.random().toString(36).substring(2, 9)}`,
    name,
    description,
    products,
    createdAt: now,
    updatedAt: now,
  }
}

// Update an existing bundle
export function updateBundle(
  bundle: ProductBundle,
  updates: Partial<Omit<ProductBundle, "id" | "createdAt">>,
): ProductBundle {
  return {
    ...bundle,
    ...updates,
    updatedAt: Date.now(),
  }
}

// Add a bundle to the store
export function addBundle(store: BundleStore, bundle: ProductBundle): BundleStore {
  return {
    ...store,
    bundles: [...store.bundles, bundle],
  }
}

// Update a bundle in the store
export function updateBundleInStore(store: BundleStore, updatedBundle: ProductBundle): BundleStore {
  return {
    ...store,
    bundles: store.bundles.map((bundle) => (bundle.id === updatedBundle.id ? updatedBundle : bundle)),
  }
}

// Remove a bundle from the store
export function removeBundle(store: BundleStore, bundleId: string): BundleStore {
  return {
    ...store,
    bundles: store.bundles.filter((bundle) => bundle.id !== bundleId),
    selectedBundleId: store.selectedBundleId === bundleId ? null : store.selectedBundleId,
  }
}

// Select a bundle
export function selectBundle(store: BundleStore, bundleId: string | null): BundleStore {
  return {
    ...store,
    selectedBundleId: bundleId,
  }
}

// Get a bundle by ID
export function getBundleById(store: BundleStore, bundleId: string): ProductBundle | undefined {
  return store.bundles.find((bundle) => bundle.id === bundleId)
}

// Format date for display
export function formatBundleDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
