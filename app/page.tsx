"use client"

import { useState, useCallback, useEffect } from "react"
import { Button, ErrorDisplay } from "@/components/ui" // Updated import
import { SearchBar } from "@/components/product-search/search-bar"
import { SearchResults } from "@/components/product-search/search-results"
import { BundleManager } from "@/components/product-search/bundle-manager"
import { CatalogManager } from "@/components/product-search/catalog-manager"
import { Badge } from "@/components/ui" // Updated import
import { Check, X, Save, Package, Database, Plus } from "lucide-react"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { safeFetch } from "@/lib/error-handling/api-error-handler"
import { logInfo, logError } from "@/lib/error-handling/error-logger"
import { initCatalog, saveCatalog, addProductsToCatalog } from "@/utils/catalog-utils"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [isBundleManagerOpen, setIsBundleManagerOpen] = useState(false)
  const [isCatalogManagerOpen, setIsCatalogManagerOpen] = useState(false)
  const [catalog, setCatalog] = useState(null)

  // Use our error handler hook
  const { error, handleError, clearError } = useErrorHandler({
    component: "ProductSearch",
  })

  // Initialize catalog on mount
  useEffect(() => {
    setCatalog(initCatalog())
  }, [])

  // Function to search for products
  const searchProducts = useCallback(
    async (term: string) => {
      if (!term.trim()) return

      setIsLoading(true)
      clearError()
      setHasSearched(true)

      try {
        logInfo(`Searching for products with term: ${term}`, {}, "ProductSearch")

        const data = await safeFetch(
          "/api/product-search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ search_text: term }),
            cache: "no-store",
          },
          "ProductSearch",
        )

        if (!data.success) {
          throw new Error(data.error || "Search failed")
        }

        if (Array.isArray(data.products)) {
          setResults(data.products)
          logInfo(`Found ${data.products.length} products for "${term}"`, {}, "ProductSearch")
        } else {
          logError("Unexpected response format", { data }, "ProductSearch")
          setResults([])
          throw new Error("Invalid response format")
        }
      } catch (err) {
        handleError(err, "Failed to search products")
        setResults([])
      } finally {
        setIsLoading(false)
      }
    },
    [clearError, handleError],
  )

  // Handle product selection
  const handleProductSelect = (product, imageUrl) => {
    if (multiSelectMode) {
      // Check if product is already selected
      const existingIndex = selectedProducts.findIndex((p) => p.id === product.id)

      if (existingIndex >= 0) {
        // Remove product if already selected
        setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id))
      } else {
        // Add product to selection
        setSelectedProducts([...selectedProducts, { ...product, imageUrl }])
      }
    } else {
      // Single select mode - add product directly
      setSelectedProducts([...selectedProducts, { ...product, imageUrl }])
    }
  }

  // Clear all selected products
  const handleClearSelected = () => {
    setSelectedProducts([])
  }

  // Open bundle manager
  const openBundleManager = () => {
    setIsBundleManagerOpen(true)
  }

  // Close bundle manager
  const closeBundleManager = () => {
    setIsBundleManagerOpen(false)
  }

  // Open catalog manager
  const openCatalogManager = () => {
    setIsCatalogManagerOpen(true)
  }

  // Close catalog manager
  const closeCatalogManager = () => {
    setIsCatalogManagerOpen(false)
  }

  // Load products from a bundle
  const handleLoadBundle = (products) => {
    setSelectedProducts(products)
  }

  // Add selected products to catalog
  const handleAddToCatalog = () => {
    if (selectedProducts.length === 0 || !catalog) return

    const updatedCatalog = addProductsToCatalog(catalog, selectedProducts)
    setCatalog(updatedCatalog)
    saveCatalog(updatedCatalog)

    // Show confirmation
    alert(`Added ${selectedProducts.length} products to your catalog`)
  }

  // Load products from catalog
  const handleLoadFromCatalog = (products) => {
    setSelectedProducts(products)
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-black/30 backdrop-blur-md p-4 shadow-lg border-b border-white/10">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">LK Bennett Product Search</h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <SearchBar value={searchTerm} onChange={setSearchTerm} onSearch={searchProducts} isLoading={isLoading} />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="cta"
                size="sm"
                onClick={() => setMultiSelectMode(!multiSelectMode)}
                className={`whitespace-nowrap ${multiSelectMode ? "bg-white/20" : ""}`}
              >
                <Check className={`h-4 w-4 mr-1 ${multiSelectMode ? "opacity-100" : "opacity-50"}`} />
                Multi-Select {multiSelectMode && selectedProducts.length > 0 && `(${selectedProducts.length})`}
              </Button>

              <Button variant="outline" size="sm" onClick={openBundleManager} className="whitespace-nowrap">
                <Package className="h-4 w-4 mr-1" />
                Bundles
              </Button>

              <Button variant="outline" size="sm" onClick={openCatalogManager} className="whitespace-nowrap">
                <Database className="h-4 w-4 mr-1" />
                Catalog
              </Button>
            </div>
          </div>

          {/* Display error if there is one */}
          {error.hasError && (
            <div className="mt-3">
              <ErrorDisplay
                message={error.message}
                severity="error"
                compact={true}
                onDismiss={clearError}
                onRetry={() => searchTerm && searchProducts(searchTerm)}
              />
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto flex-1 p-4 flex flex-col">
        {/* Selected products area */}
        {selectedProducts.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium">Selected Products ({selectedProducts.length})</h3>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleAddToCatalog} className="text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Catalog
                </Button>
                <Button variant="outline" size="sm" onClick={openBundleManager} className="text-white">
                  <Save className="h-4 w-4 mr-1" />
                  Save Bundle
                </Button>
                <Button variant="cta" size="sm" onClick={handleClearSelected} className="text-white">
                  Clear All
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-black/20 rounded">
              {selectedProducts.map((product) => (
                <Badge key={product.id} className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white">
                  <img
                    src={product.imageUrl || "/placeholder.svg?height=20&width=20&query=product"}
                    alt={product.name}
                    className="w-5 h-5 object-cover rounded"
                    loading="lazy"
                  />
                  <span className="truncate max-w-[150px]">{product.name || product.titles?.default || "Product"}</span>
                  <button
                    onClick={() => setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id))}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Search results */}
        <div className="flex-1 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden">
          <SearchResults
            results={results}
            isLoading={isLoading}
            hasSearched={hasSearched}
            onInsertProduct={handleProductSelect}
            selectedProductIds={selectedProducts.map((p) => p.id)}
            multiSelectMode={multiSelectMode}
          />
        </div>

        {/* Selected products display */}
        {selectedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Selected Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden border border-white/20 hover:border-white/40 transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.imageUrl || "/placeholder.svg?height=300&width=300&query=fashion product"}
                      alt={product.titles?.default || product.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-white truncate">{product.titles?.default || product.name}</h3>
                    <p className="text-white/90 font-bold mt-1">
                      £
                      {typeof product.pricing?.price === "number"
                        ? product.pricing.price.toFixed(2)
                        : typeof product.price === "number"
                          ? product.price.toFixed(2)
                          : product.price || "N/A"}
                    </p>
                    {product.wasPrice && (
                      <p className="text-red-300 line-through text-sm">
                        £{typeof product.wasPrice === "number" ? product.wasPrice.toFixed(2) : product.wasPrice}
                      </p>
                    )}
                    <Button
                      variant="cta"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => window.open(`https://www.lkbennett.com/product/${product.id}`, "_blank")}
                    >
                      View on LK Bennett
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bundle Manager Dialog */}
      <BundleManager
        isOpen={isBundleManagerOpen}
        onClose={closeBundleManager}
        selectedProducts={selectedProducts}
        onLoadBundle={handleLoadBundle}
      />

      {/* Catalog Manager Dialog */}
      <CatalogManager
        isOpen={isCatalogManagerOpen}
        onClose={closeCatalogManager}
        onSelectProducts={handleLoadFromCatalog}
      />
    </main>
  )
}
