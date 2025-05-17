import type { Product } from "@/types/product"
import type { Catalog, CatalogProduct } from "@/types/catalog"
import { logError, logInfo } from "@/lib/error-handling/error-logger"

const CATALOG_STORAGE_KEY = "lkb-product-catalog"

// Initialize the catalog
export function initCatalog(): Catalog {
  if (typeof window === "undefined") {
    return { products: {}, lastUpdated: Date.now() }
  }

  try {
    const storedData = localStorage.getItem(CATALOG_STORAGE_KEY)
    if (storedData) {
      return JSON.parse(storedData)
    }
  } catch (error) {
    logError("Failed to load catalog from localStorage", { error }, "CatalogUtils")
  }

  return { products: {}, lastUpdated: Date.now() }
}

// Save the catalog to localStorage
export function saveCatalog(catalog: Catalog): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(catalog))
    logInfo("Saved catalog to localStorage", { productCount: Object.keys(catalog.products).length }, "CatalogUtils")
  } catch (error) {
    logError("Failed to save catalog to localStorage", { error }, "CatalogUtils")
  }
}

// Add a product to the catalog
export function addProductToCatalog(
  catalog: Catalog,
  product: Product & { imageUrl?: string },
  source: "api" | "manual" = "api",
): Catalog {
  const catalogId = `catalog_${product.id}_${Date.now()}`

  const catalogProduct: CatalogProduct = {
    ...product,
    imageUrl: product.imageUrl,
    addedAt: Date.now(),
    source,
    catalogId,
  }

  return {
    products: {
      ...catalog.products,
      [catalogId]: catalogProduct,
    },
    lastUpdated: Date.now(),
  }
}

// Add multiple products to the catalog
export function addProductsToCatalog(
  catalog: Catalog,
  products: Array<Product & { imageUrl?: string }>,
  source: "api" | "manual" = "api",
): Catalog {
  let updatedCatalog = { ...catalog }

  products.forEach((product) => {
    updatedCatalog = addProductToCatalog(updatedCatalog, product, source)
  })

  return updatedCatalog
}

// Remove a product from the catalog
export function removeProductFromCatalog(catalog: Catalog, catalogId: string): Catalog {
  const { [catalogId]: removed, ...remainingProducts } = catalog.products

  return {
    products: remainingProducts,
    lastUpdated: Date.now(),
  }
}

// Get all products from the catalog as an array
export function getCatalogProducts(catalog: Catalog): CatalogProduct[] {
  return Object.values(catalog.products).sort((a, b) => b.addedAt - a.addedAt)
}

// Search the catalog
export function searchCatalog(catalog: Catalog, query: string): CatalogProduct[] {
  if (!query.trim()) {
    return getCatalogProducts(catalog)
  }

  const searchTerms = query.toLowerCase().split(" ")

  return getCatalogProducts(catalog).filter((product) => {
    const productName = (product.titles?.default || product.name || "").toLowerCase()
    const productDescription = (product.description || "").toLowerCase()

    // Check if all search terms are found in the product name or description
    return searchTerms.every((term) => productName.includes(term) || productDescription.includes(term))
  })
}

// Export catalog to JSON file
export function exportCatalogToJson(catalog: Catalog): void {
  try {
    const dataStr = JSON.stringify(catalog, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `lkb-product-catalog-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    logInfo("Exported catalog to JSON file", { productCount: Object.keys(catalog.products).length }, "CatalogUtils")
  } catch (error) {
    logError("Failed to export catalog to JSON", { error }, "CatalogUtils")
  }
}

// Import catalog from JSON file
export async function importCatalogFromJson(file: File): Promise<Catalog | null> {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const catalog = JSON.parse(event.target?.result as string) as Catalog

          // Validate the catalog structure
          if (!catalog.products || typeof catalog.lastUpdated !== "number") {
            reject(new Error("Invalid catalog format"))
            return
          }

          logInfo(
            "Imported catalog from JSON file",
            { productCount: Object.keys(catalog.products).length },
            "CatalogUtils",
          )
          resolve(catalog)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }

      reader.readAsText(file)
    })
  } catch (error) {
    logError("Failed to import catalog from JSON", { error }, "CatalogUtils")
    return null
  }
}

// Format date for display
export function formatCatalogDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
