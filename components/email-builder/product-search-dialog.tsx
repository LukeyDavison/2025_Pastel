"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { SearchBar } from "./search-bar"
import { SearchResults } from "./search-results"
import type { Product } from "@/types/product"
import { useEmailBuilder } from "@/contexts/email-builder-context"
import { Button } from "@/components/ui/button"

interface ProductSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddProduct: (product: Product) => void
}

export function ProductSearchDialog({ open, onOpenChange, onAddProduct }: ProductSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const { addEmailProduct } = useEmailBuilder()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch("/api/product-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_text: searchQuery }),
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data = await response.json()
      setResults(data.products || [])
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      if (exists) {
        return prev.filter((p) => p.id !== product.id)
      } else {
        return [...prev, product]
      }
    })
  }

  const handleAddSelectedProducts = () => {
    // Add all selected products to the catalog
    selectedProducts.forEach((product) => {
      addEmailProduct(product)
      onAddProduct(product)
    })

    // Reset selection and close dialog
    setSelectedProducts([])
    onOpenChange(false)
  }

  const handleClose = () => {
    setSelectedProducts([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
          <DialogDescription>Search for products to add to your email</DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="flex-1 overflow-hidden">
          <SearchResults
            results={results}
            isLoading={isLoading}
            hasSearched={hasSearched}
            onToggleProduct={handleToggleProduct}
            selectedProducts={selectedProducts}
            multiSelect={true}
          />
        </div>

        <DialogFooter className="px-4 py-3 border-t">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-gray-500">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleAddSelectedProducts} disabled={selectedProducts.length === 0}>
                Add to Email
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
