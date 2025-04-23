"use client"

import { useState } from "react"
import { useEmailBuilder } from "@/contexts/email-builder-context"
import { ProductSearchDialog } from "./product-search-dialog"
import { FramerProductGrid } from "./framer-product-grid"
import type { Product } from "@/types/product"

interface ProductBlockProps {
  blockId: string
  content: any
}

export function ProductBlockFramer({ blockId, content }: ProductBlockProps) {
  const { updateBlock } = useEmailBuilder()
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

  const handleReorderProducts = (newOrder: Product[]) => {
    updateBlock(blockId, {
      ...content,
      products: newOrder,
    })
  }

  return (
    <div className="space-y-4">
      <FramerProductGrid
        products={content.products}
        columns={content.columns}
        showName={content.showName}
        showPrice={content.showPrice}
        showSwatch={content.showSwatch}
        onAddProduct={() => setSearchDialogOpen(true)}
        onRemoveProduct={handleRemoveProduct}
        onReorderProducts={handleReorderProducts}
      />

      <ProductSearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} onAddProduct={handleAddProduct} />
    </div>
  )
}
