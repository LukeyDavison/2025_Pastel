"use client"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Product } from "@/types/product"

interface ProductCatalogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
  onRemoveProduct: (productId: string) => void
}

export function ProductCatalog({ open, onOpenChange, products, onRemoveProduct }: ProductCatalogProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Product Catalog</DrawerTitle>
          <DrawerDescription>Products added to your email</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products added yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Add products by creating a product block and using the search function
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg overflow-hidden bg-white">
                  <div className="relative">
                    <img
                      src={
                        product.selectedImage || product.media?.default?.src || product.imageUrl || "/placeholder.svg"
                      }
                      alt={product.titles?.default || product.name || "Product"}
                      className="w-full h-40 object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => onRemoveProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">
                      {product.titles?.default || product.name || "Untitled Product"}
                    </h3>
                    <p className="text-sm mt-1">£{product.pricing.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
