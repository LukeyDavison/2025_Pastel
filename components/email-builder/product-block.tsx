"use client"

import { useState } from "react"
import { useEmailBuilder } from "@/contexts/email-builder-context"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Search } from "lucide-react"
import { ProductSearchDialog } from "./product-search-dialog"
import type { Product } from "@/types/product"

interface ProductBlockEditorProps {
  blockId: string
  content: any
}

export function ProductBlockEditor({ blockId, content }: ProductBlockEditorProps) {
  const { updateBlock, emailProducts } = useEmailBuilder()
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)

  const handleAddProduct = (product: Product) => {
    const updatedProducts = [...content.products, product]
    updateBlock(blockId, {
      ...content,
      products: updatedProducts,
    })
  }

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...content.products]
    updatedProducts.splice(index, 1)
    updateBlock(blockId, {
      ...content,
      products: updatedProducts,
    })
  }

  const handleColumnsChange = (increment: number) => {
    const newColumns = Math.max(1, Math.min(3, content.columns + increment))
    updateBlock(blockId, {
      ...content,
      columns: newColumns,
    })
  }

  const handleToggleSetting = (setting: "showName" | "showPrice" | "showSwatch") => {
    updateBlock(blockId, {
      ...content,
      [setting]: !content[setting],
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Product Columns</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => handleColumnsChange(-1)} disabled={content.columns <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <span>{content.columns}</span>
          <Button variant="outline" size="icon" onClick={() => handleColumnsChange(1)} disabled={content.columns >= 3}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showName"
            checked={content.showName}
            onChange={() => handleToggleSetting("showName")}
            className="mr-2"
          />
          <label htmlFor="showName">Show product name</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showPrice"
            checked={content.showPrice}
            onChange={() => handleToggleSetting("showPrice")}
            className="mr-2"
          />
          <label htmlFor="showPrice">Show product price</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showSwatch"
            checked={content.showSwatch}
            onChange={() => handleToggleSetting("showSwatch")}
            className="mr-2"
          />
          <label htmlFor="showSwatch">Show color swatches</label>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Products</h3>
        {content.products.length === 0 ? (
          <p className="text-gray-500 text-sm mb-2">No products added yet</p>
        ) : (
          <div className="space-y-2 mb-4">
            {content.products.map((product: Product, index: number) => (
              <div key={index} className="flex items-center border rounded-md p-2">
                <img
                  src={product.selectedImage || product.media?.default?.src || product.imageUrl || "/placeholder.svg"}
                  alt={product.titles?.default || product.name || "Product"}
                  className="w-12 h-12 object-cover mr-2"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {product.titles?.default || product.name || "Untitled Product"}
                  </p>
                  <p className="text-xs text-gray-500">£{product.pricing.price.toFixed(2)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveProduct(index)} className="ml-2">
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button onClick={() => setSearchDialogOpen(true)} className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search Products
        </Button>
      </div>

      <ProductSearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} onAddProduct={handleAddProduct} />
    </div>
  )
}
