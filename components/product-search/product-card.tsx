"use client"

import { useState } from "react"
import { SizeDisplay } from "./size-display"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  imageUrl: string
  onInsert: () => void
  isSelected?: boolean
}

export function ProductCard({ product, imageUrl, onInsert, isSelected = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get product name from various possible sources
  const productName = product.titles?.default || product.name || "Product"

  // Get price from various possible sources
  const price =
    typeof product.pricing?.price === "number"
      ? product.pricing.price.toFixed(2)
      : typeof product.price === "number"
        ? product.price.toFixed(2)
        : product.price || product.pricing?.price || "N/A"

  // Get was price from various possible sources
  const wasPrice =
    typeof product.pricing?.was === "number"
      ? product.pricing.was.toFixed(2)
      : typeof product.wasPrice === "number"
        ? product.wasPrice.toFixed(2)
        : product.wasPrice || product.pricing?.was

  return (
    <div
      className={`product-card ${isSelected ? "border-white" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container">
        <img
          src={imageUrl || "/placeholder.svg?height=300&width=300&query=product"}
          alt={productName}
          className="product-image"
          onError={(e) => {
            // If image fails to load, replace with placeholder
            e.currentTarget.src = `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(productName)}`
          }}
        />
        <button
          onClick={onInsert}
          className={`absolute inset-0 flex-center bg-black bg-opacity-50 transition-opacity duration-300 ${
            isHovered || isSelected ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="btn btn-sm bg-white text-black">{isSelected ? "Selected" : "Insert"}</span>
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-title">{productName}</h3>
        <div className="flex items-center">
          <span className="product-price">£{price}</span>
          {wasPrice && <span className="product-original-price">£{wasPrice}</span>}
        </div>
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2">
            <SizeDisplay sizes={product.sizes} />
          </div>
        )}
      </div>
    </div>
  )
}
