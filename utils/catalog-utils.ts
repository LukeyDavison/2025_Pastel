// Catalog management utilities
// These functions handle the local product catalog

interface CatalogProduct {
  id: string
  name?: string
  titles?: { default: string }
  price?: number
  pricing?: { price: number; was?: number }
  wasPrice?: number
  imageUrl?: string
  media?: { default?: { src?: string } }
  properties?: any
  variants?: any[]
  stock?: any
  addedAt: number
}

interface Catalog {
  version: number
  lastUpdated: number
  products: Record<string, CatalogProduct>
}

const CATALOG_STORAGE_KEY = "lkb_product_catalog"
const CATALOG_VERSION = 1

// Initialize the catalog from local storage or create a new one
export function initCatalog(): Catalog {
  try {
    const storedCatalog = localStorage.getItem(CATALOG_STORAGE_KEY)

    if (storedCatalog) {
      const catalog = JSON.parse(storedCatalog) as Catalog

      // Check if we need to upgrade the catalog version
      if (catalog.version !== CATALOG_VERSION) {
        // In the future, we could add migration logic here
        return createNewCatalog()
      }

      return catalog
    }
  } catch (error) {
    console.error("Failed to load catalog from storage:", error)
  }

  return createNewCatalog()
}

// Create a new empty catalog
function createNewCatalog(): Catalog {
  return {
    version: CATALOG_VERSION,
    lastUpdated: Date.now(),
    products: {},
  }
}

// Save the catalog to local storage
export function saveCatalog(catalog: Catalog): boolean {
  try {
    // Update the lastUpdated timestamp
    catalog.lastUpdated = Date.now()

    // Save to local storage
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(catalog))
    return true
  } catch (error) {
    console.error("Failed to save catalog to storage:", error)
    return false
  }
}

// Add products to the catalog
export function addProductsToCatalog(catalog: Catalog, products: any[]): Catalog {
  const updatedCatalog = { ...catalog }

  products.forEach((product) => {
    // Skip if no valid ID
    if (!product.id) return

    // Add or update the product
    updatedCatalog.products[product.id] = {
      ...product,
      addedAt: Date.now(),
    }
  })

  return updatedCatalog
}

// Remove products from the catalog
export function removeProductsFromCatalog(catalog: Catalog, productIds: string[]): Catalog {
  const updatedCatalog = {
    ...catalog,
    products: { ...catalog.products },
  }

  productIds.forEach((id) => {
    delete updatedCatalog.products[id]
  })

  return updatedCatalog
}

// Search the catalog for products matching a query
export function searchCatalog(catalog: Catalog, query: string): any[] {
  if (!catalog || !query || query.trim() === "") {
    return []
  }

  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0)

  if (searchTerms.length === 0) {
    return []
  }

  const results = Object.values(catalog.products).filter((product) => {
    // Get searchable text from the product
    const searchableText = [
      product.name,
      product.titles?.default,
      // Add other searchable fields here
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    // Check if all search terms are found
    return searchTerms.every((term) => searchableText.includes(term))
  })

  // Sort by most recently added
  return results.sort((a, b) => b.addedAt - a.addedAt)
}

// Get all products from the catalog
export function getAllCatalogProducts(catalog: Catalog): any[] {
  return Object.values(catalog.products).sort((a, b) => b.addedAt - a.addedAt)
}

// Clear the entire catalog
export function clearCatalog(): Catalog {
  const newCatalog = createNewCatalog()
  saveCatalog(newCatalog)
  return newCatalog
}
