"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ErrorDisplay } from "@/components/ui"
import type { CatalogProduct, Catalog } from "@/types/catalog"
import {
  initCatalog,
  saveCatalog,
  getCatalogProducts,
  searchCatalog,
  removeProductFromCatalog,
  exportCatalogToJson,
  importCatalogFromJson,
  formatCatalogDate,
} from "@/utils/catalog-utils"
import { Search, Trash2, Download, Upload, Database, X, ExternalLink, Check } from "lucide-react"
import { useErrorHandler } from "@/hooks/use-error-handler"

interface CatalogManagerProps {
  isOpen: boolean
  onClose: () => void
  onSelectProducts: (products: CatalogProduct[]) => void
}

export function CatalogManager({ isOpen, onClose, onSelectProducts }: CatalogManagerProps) {
  const [catalog, setCatalog] = useState<Catalog>({ products: {}, lastUpdated: Date.now() })
  const [searchQuery, setSearchQuery] = useState("")
  const [displayedProducts, setDisplayedProducts] = useState<CatalogProduct[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { error, handleError, clearError } = useErrorHandler({
    component: "CatalogManager",
  })

  // Load catalog from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const loadedCatalog = initCatalog()
      setCatalog(loadedCatalog)
      setDisplayedProducts(getCatalogProducts(loadedCatalog))
      setSelectedProducts([])
      setSearchQuery("")
    }
  }, [isOpen])

  // Save catalog to localStorage when it changes
  useEffect(() => {
    if (Object.keys(catalog.products).length > 0) {
      saveCatalog(catalog)
    }
  }, [catalog])

  // Update displayed products when search query changes
  useEffect(() => {
    setDisplayedProducts(searchCatalog(catalog, searchQuery))
  }, [catalog, searchQuery])

  // Handle removing a product from the catalog
  const handleRemoveProduct = (catalogId: string) => {
    setCatalog(removeProductFromCatalog(catalog, catalogId))
    setSelectedProducts(selectedProducts.filter((id) => id !== catalogId))
  }

  // Handle selecting a product
  const handleSelectProduct = (catalogId: string) => {
    if (selectedProducts.includes(catalogId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== catalogId))
    } else {
      setSelectedProducts([...selectedProducts, catalogId])
    }
  }

  // Handle selecting all displayed products
  const handleSelectAll = () => {
    if (selectedProducts.length === displayedProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(displayedProducts.map((product) => product.catalogId))
    }
  }

  // Handle loading selected products
  const handleLoadSelected = () => {
    const productsToLoad = displayedProducts.filter((product) => selectedProducts.includes(product.catalogId))
    onSelectProducts(productsToLoad)
    onClose()
  }

  // Handle exporting the catalog
  const handleExportCatalog = () => {
    exportCatalogToJson(catalog)
  }

  // Handle importing a catalog
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  // Handle file selection for import
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    clearError()

    try {
      const importedCatalog = await importCatalogFromJson(file)
      if (importedCatalog) {
        setCatalog(importedCatalog)
        setDisplayedProducts(getCatalogProducts(importedCatalog))
      }
    } catch (err) {
      handleError(err, "Failed to import catalog")
    } finally {
      setIsImporting(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const productCount = Object.keys(catalog.products).length
  const filteredCount = displayedProducts.length

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Product Catalog
            <span className="ml-2 text-sm font-normal text-muted-foreground">({productCount} products)</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 flex-1 overflow-hidden">
          {/* Search and actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search catalog..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCatalog} disabled={productCount === 0}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleImportClick} disabled={isImporting}>
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            </div>
          </div>

          {/* Error display */}
          {error.hasError && (
            <ErrorDisplay message={error.message} severity="error" compact={true} onDismiss={clearError} />
          )}

          {/* Product count and selection */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {searchQuery ? `${filteredCount} results` : `${productCount} products in catalog`}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleSelectAll} disabled={displayedProducts.length === 0}>
                {selectedProducts.length === displayedProducts.length && displayedProducts.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              {selectedProducts.length > 0 && (
                <Button variant="cta" size="sm" onClick={handleLoadSelected}>
                  Load Selected ({selectedProducts.length})
                </Button>
              )}
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto">
            {displayedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Database className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground mt-1">
                  {productCount === 0
                    ? "Your catalog is empty. Add products by searching and selecting them."
                    : "No products match your search criteria."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedProducts.map((product) => (
                  <div
                    key={product.catalogId}
                    className={`bg-card rounded-lg overflow-hidden border transition-all ${
                      selectedProducts.includes(product.catalogId)
                        ? "ring-2 ring-primary border-primary"
                        : "hover:border-muted-foreground/50"
                    }`}
                  >
                    <div
                      className="aspect-square relative cursor-pointer"
                      onClick={() => handleSelectProduct(product.catalogId)}
                    >
                      <img
                        src={product.imageUrl || "/placeholder.svg?height=200&width=200&query=product"}
                        alt={product.titles?.default || product.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                      {selectedProducts.includes(product.catalogId) && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm truncate">
                        {product.titles?.default || product.name || "Product"}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-bold">
                          £
                          {typeof product.pricing?.price === "number"
                            ? product.pricing.price.toFixed(2)
                            : typeof product.price === "number"
                              ? product.price.toFixed(2)
                              : product.price || "N/A"}
                        </p>
                        <span className="text-xs text-muted-foreground">{formatCatalogDate(product.addedAt)}</span>
                      </div>
                      <div className="flex mt-2 gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          onClick={() => handleRemoveProduct(product.catalogId)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Remove</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          onClick={() => window.open(`https://www.lkbennett.com/product/${product.id}`, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View on site</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs"
                          onClick={() => {
                            handleSelectProduct(product.catalogId)
                            handleLoadSelected()
                          }}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
