"use client"

import { useState } from "react"
import { Reorder, AnimatePresence } from "framer-motion"
import { Plus, X, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"

interface ProductGridProps {
  products: Product[]
  columns: number
  showName?: boolean
  showPrice?: boolean
  showSwatch?: boolean
  onAddProduct: () => void
  onRemoveProduct: (index: number) => void
  onReorderProducts: (newOrder: Product[]) => void
}

export function FramerProductGrid({
  products,
  columns,
  showName = true,
  showPrice = true,
  showSwatch = true,
  onAddProduct,
  onRemoveProduct,
  onReorderProducts,
}: ProductGridProps) {
  const [editMode, setEditMode] = useState(false)

  // Calculate grid layout
  const gridClass = `grid grid-cols-${columns} gap-4`

  return (
    <div className="relative">
      {/* Edit mode toggle */}
      <div className="absolute -top-3 -right-3 z-10">
        <Button
          size="sm"
          variant={editMode ? "default" : "outline"}
          className="rounded-full h-8 w-8 p-0"
          onClick={() => setEditMode(!editMode)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {/* Product grid */}
      <div className={gridClass}>
        {products.length === 0 ? (
          // Placeholder items
          Array.from({ length: columns }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center"
            >
              <Button variant="ghost" onClick={onAddProduct}>
                <Plus className="h-6 w-6 text-gray-400" />
              </Button>
            </div>
          ))
        ) : editMode ? (
          // Editable grid with Reorder
          <Reorder.Group
            axis="horizontal"
            values={products}
            onReorder={onReorderProducts}
            className={`${gridClass} col-span-${columns}`}
          >
            <AnimatePresence>
              {products.map((product, index) => (
                <Reorder.Item
                  key={product.id}
                  value={product}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { type: "spring", stiffness: 300, damping: 25 },
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileDrag={{
                    scale: 1.05,
                    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
                    zIndex: 1,
                  }}
                  className="relative group cursor-move"
                >
                  <div className="aspect-[3/4] bg-white border rounded-md overflow-hidden">
                    <div className="relative h-3/4">
                      <img
                        src={
                          product.selectedImage || product.media?.default?.src || product.imageUrl || "/placeholder.svg"
                        }
                        alt={product.titles?.default || product.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onRemoveProduct(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-2">
                      {showName && (
                        <p className="text-sm font-medium truncate">
                          {product.titles?.default || product.name || "Product"}
                        </p>
                      )}
                      {showPrice && (
                        <p className="text-sm">
                          £{product.pricing.price.toFixed(2)}
                          {product.pricing.was && (
                            <span className="ml-1 text-red-500 line-through text-xs">
                              £{product.pricing.was.toFixed(2)}
                            </span>
                          )}
                        </p>
                      )}
                      {showSwatch && product.properties?.swatches && product.properties.swatches.length > 0 && (
                        <div className="flex mt-1 space-x-1">
                          {product.properties.swatches.slice(0, 4).map((swatch: any) => (
                            <span
                              key={swatch.id}
                              className="inline-block w-3 h-3 rounded-full"
                              style={{ backgroundColor: swatch.hex }}
                              title={swatch.colour}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          // Regular display grid
          <>
            {products.map((product, index) => (
              <div key={product.id} className="relative group">
                <div className="aspect-[3/4] bg-white border rounded-md overflow-hidden">
                  <div className="relative h-3/4">
                    <img
                      src={
                        product.selectedImage || product.media?.default?.src || product.imageUrl || "/placeholder.svg"
                      }
                      alt={product.titles?.default || product.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    {showName && (
                      <p className="text-sm font-medium truncate">
                        {product.titles?.default || product.name || "Product"}
                      </p>
                    )}
                    {showPrice && (
                      <p className="text-sm">
                        £{product.pricing.price.toFixed(2)}
                        {product.pricing.was && (
                          <span className="ml-1 text-red-500 line-through text-xs">
                            £{product.pricing.was.toFixed(2)}
                          </span>
                        )}
                      </p>
                    )}
                    {showSwatch && product.properties?.swatches && product.properties.swatches.length > 0 && (
                      <div className="flex mt-1 space-x-1">
                        {product.properties.swatches.slice(0, 4).map((swatch: any) => (
                          <span
                            key={swatch.id}
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: swatch.hex }}
                            title={swatch.colour}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {products.length < columns * 5 && (
              <div className="aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center">
                <Button variant="ghost" onClick={onAddProduct}>
                  <Plus className="h-6 w-6 text-gray-400" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
