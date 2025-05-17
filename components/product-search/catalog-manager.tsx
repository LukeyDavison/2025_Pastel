"use client"

import { useState, useEffect } from "react"
import { X, Trash2, Download, Upload, Database, Search, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  initCatalog,
  getAllCatalogProducts,
  clearCatalog,
  saveCatalog,
  removeProductsFromCatalog,
} from "@/utils/catalog-utils"

interface CatalogManagerProps {
  isOpen: boolean
  onClose: () => void
  onSelectProducts: (products: any[]) => void
}

export function CatalogManager({ isOpen, onClose, onSelectProducts }: CatalogManagerProps) {
  const [catalog, setCatalog] = useState(null)
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState([])
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load catalog when component mounts or dialog opens
  useEffect(() => {
    if (isOpen) {
      const loadedCatalog = initCatalog()
      setCatalog(loadedCatalog)
      setProducts(getAllCatalogProducts(loadedCatalog))
      setSelectedProducts([])
      setSearchTerm("")
    }
  }, [isOpen])

  // Filter products based on search term
  const filteredProducts = searchTerm
    ? products.filter((product) => {
        const searchableText = [
          product.name,
          product.titles?.default,
          // Add other searchable fields here
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()

        return searchableText.includes(searchTerm.toLowerCase())
      })
    : products

  // Handle product selection
  const toggleProductSelection = (product) => {
    if (selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id))
    } else {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  // Select all visible products
  const selectAllVisible = () => {
    setSelectedProducts(filteredProducts)
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedProducts([])
  }

  // Load selected products
  const handleLoadSelected = () => {
    onSelectProducts(selectedProducts)
    onClose()
  }

  // Delete selected products from catalog
  const handleDeleteSelected = () => {
    if (selectedProducts.length === 0) return

    if (confirm(`Are you sure you want to delete ${selectedProducts.length} products from your catalog?`)) {
      const productIds = selectedProducts.map((p) => p.id)
      const updatedCatalog = removeProductsFromCatalog(catalog, productIds)
      setCatalog(updatedCatalog)
      setProducts(getAllCatalogProducts(updatedCatalog))
      setSelectedProducts([])
    }
  }

  // Clear entire catalog
  const handleClearCatalog = () => {
    if (confirm("Are you sure you want to clear your entire catalog? This cannot be undone.")) {
      const newCatalog = clearCatalog()
      setCatalog(newCatalog)
      setProducts([])
      setSelectedProducts([])
    }
  }

  // Export catalog to JSON file
  const handleExportCatalog = () => {
    try {
      setIsExporting(true)

      const catalogData = JSON.stringify(catalog, null, 2)
      const blob = new Blob([catalogData], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `lkb-catalog-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setIsExporting(false)
      }, 100)
    } catch (err) {
      console.error("Failed to export catalog:", err)
      setError("Failed to export catalog")
      setIsExporting(false)
    }
  }

  // Import catalog from JSON file
  const handleImportCatalog = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const importedCatalog = JSON.parse(event.target.result as string)

        // Validate the imported data
        if (!importedCatalog.version || !importedCatalog.products) {
          throw new Error("Invalid catalog format")
        }

        // Save the imported catalog
        saveCatalog(importedCatalog)

        // Update state
        setCatalog(importedCatalog)
        setProducts(getAllCatalogProducts(importedCatalog))
        setSelectedProducts([])

        // Reset the file input
        e.target.value = null
      } catch (err) {
        console.error("Failed to import catalog:", err)
        setError("Failed to import catalog: Invalid format")
      }
    }

    reader.onerror = () => {
      setError("Failed to read the file")
    }

    reader.readAsText(file)
  }

  // If the dialog is not open, don't render anything
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/80 border border-white/20 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Product Catalog
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 border-b border-white/10 bg-black/40">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search catalog..."
                  className="w-full bg-white/10 border border-white/20 rounded-md py-2 pl-10 pr-3 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCatalog}
                disabled={isExporting || products.length === 0}
                className="whitespace-nowrap"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>

              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("catalog-import")?.click()}
                  className="whitespace-nowrap"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Import
                </Button>
                <input
                  id="catalog-import"
                  type="file"
                  accept=".json"
                  onChange={handleImportCatalog}
                  className="hidden"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCatalog}
                disabled={products.length === 0}
                className="whitespace-nowrap text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-3 bg-red-900/30 border border-red-500/50 text-red-200 px-3 py-2 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <div className="text-sm">{error}</div>
              <button onClick={() => setError(null)} className="ml-auto text-red-200/70 hover:text-red-200">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="text-white/70 text-sm">
              {filteredProducts.length} of {products.length} products
              {selectedProducts.length > 0 && ` • ${selectedProducts.length} selected`}
            </div>

            <div className="flex gap-2">
              {selectedProducts.length > 0 ? (
                <>
                  <Button variant="outline" size="sm" onClick={clearSelection} className="whitespace-nowrap">
                    Clear Selection
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteSelected}
                    className="whitespace-nowrap text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                  <Button variant="cta" size="sm" onClick={handleLoadSelected} className="whitespace-nowrap">
                    <Check className="h-4 w-4 mr-1" />
                    Use Selected
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllVisible}
                  disabled={filteredProducts.length === 0}
                  className="whitespace-nowrap"
                >
                  Select All
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              {products.length === 0 ? (
                <div className="text-white/70">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Your catalog is empty</p>
                  <p className="mt-2 text-sm max-w-md mx-auto">
                    Add products to your catalog by selecting them in search results and clicking "Add to Catalog"
                  </p>
                </div>
              ) : (
                <div className="text-white/70">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No products match your search</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((product) => {
                const isSelected = selectedProducts.some((p) => p.id === product.id)
                const title = product.titles?.default || product.name || "Product"
                const imageUrl = product.imageUrl || product.media?.default?.src || "/diverse-products-still-life.png"

                return (
                  <div
                    key={product.id}
                    className={`bg-white/10 rounded-lg overflow-hidden border ${
                      isSelected ? "border-white/60 ring-2 ring-white/40" : "border-white/20"
                    } cursor-pointer transition-all hover:border-white/40`}
                    onClick={() => toggleProductSelection(product)}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h3 className="text-white text-sm font-medium truncate">{title}</h3>
                      <p className="text-white/90 text-xs mt-1">
                        £
                        {typeof product.pricing?.price === "number"
                          ? product.pricing.price.toFixed(2)
                          : typeof product.price === "number"
                            ? product.price.toFixed(2)
                            : product.price || "N/A"}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
