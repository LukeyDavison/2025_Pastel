"use client"

import { useState } from "react"
import { Loader2, Mail, Download, ChevronLeft, ChevronRight, Check } from "lucide-react"
import type { Product } from "@/types/product"

interface SearchResultsProps {
  results: Product[]
  isLoading: boolean
  hasSearched: boolean
  onToggleProduct?: (product: Product) => void
  selectedProducts?: Product[]
  multiSelect?: boolean
  onAddProduct?: (product: Product) => void
}

export function SearchResults({
  results,
  isLoading,
  hasSearched,
  onToggleProduct,
  selectedProducts = [],
  multiSelect = false,
  onAddProduct,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-700 text-lg">No products found</p>
        <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-h-[70vh] overflow-y-auto">
      {results.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onToggleProduct={onToggleProduct}
          onAddProduct={onAddProduct}
          isSelected={selectedProducts.some((p) => p.id === product.id)}
          multiSelect={multiSelect}
        />
      ))}
    </div>
  )
}

function ProductCard({
  product,
  onToggleProduct,
  onAddProduct,
  isSelected,
  multiSelect,
}: {
  product: Product
  onToggleProduct?: (product: Product) => void
  onAddProduct?: (product: Product) => void
  isSelected: boolean
  multiSelect: boolean
}) {
  const swatches = product.properties?.swatches ?? []
  const defaultImg = product.media?.default?.src || product.imageUrl || "/placeholder.svg?height=300&width=300"
  const swatchImages = swatches.length ? swatches.map((s) => s.images) : [[defaultImg]]

  const [swatchIdx, setSwatchIdx] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)

  const images = swatchImages[swatchIdx] || [defaultImg]
  const currentImg = images[imgIdx] || defaultImg

  const prevImage = () => setImgIdx((i) => (i - 1 + images.length) % images.length)
  const nextImage = () => setImgIdx((i) => (i + 1) % images.length)

  const handleInsert = () => {
    if (multiSelect) {
      onToggleProduct?.(product)
    } else {
      onAddProduct?.({
        ...product,
        selectedImage: currentImg,
      })
    }
  }

  const handleDownload = async () => {
    try {
      // Create a new Image to load the image data
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = currentImg

      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      // Create a canvas to draw the image
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0)

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95))

      // Create download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${(product.titles?.default || product.name || "product").replace(/\s+/g, "-").toLowerCase()}.jpg`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      alert("⚠️ Download failed")
    }
  }

  const sizeOptions = product.variants?.size?.options ?? {}
  const sizes = Object.values(sizeOptions)

  return (
    <div
      className={`relative bg-white rounded-lg overflow-hidden border transition-all duration-300 ${
        isSelected ? "border-blue-500 shadow-md" : "hover:shadow-md"
      }`}
    >
      {multiSelect && (
        <div className="absolute top-2 left-2 z-10">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center cursor-pointer ${
              isSelected ? "bg-blue-500 text-white" : "bg-white border border-gray-300"
            }`}
            onClick={() => onToggleProduct?.(product)}
          >
            {isSelected && <Check className="h-3 w-3" />}
          </div>
        </div>
      )}

      <div className="absolute top-2 right-2 flex space-x-1 z-10">
        <button
          onClick={handleInsert}
          className={`p-1 rounded-full ${
            multiSelect ? "bg-gray-200 hover:bg-gray-300" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          title={multiSelect ? "Select product" : "Add to email"}
        >
          <Mail className="h-4 w-4" />
        </button>
        <button
          onClick={handleDownload}
          className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full"
          title="Download image"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row">
        <div className="relative h-40 sm:h-auto sm:w-1/3 bg-gray-100">
          <img
            src={currentImg || "/placeholder.svg"}
            alt={product.titles?.default || product.name || "Product image"}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 bg-white/70 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-white/70 rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <div className="p-4 sm:w-2/3 flex flex-col">
          <h3 className="font-medium mb-1 line-clamp-1">
            {product.titles?.default || product.name || "Untitled Product"}
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="font-bold">£{product.pricing.price.toFixed(2)}</span>
            {product.pricing.was && (
              <span className="text-red-500 line-through">£{product.pricing.was.toFixed(2)}</span>
            )}
          </div>

          {swatches.length > 0 && (
            <div className="flex space-x-2 mt-3">
              {swatches.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSwatchIdx(i)
                    setImgIdx(0)
                  }}
                  className={`w-6 h-6 rounded-full border-2 ${i === swatchIdx ? "border-black" : "border-transparent"}`}
                  style={{ backgroundColor: s.hex }}
                  title={s.colour}
                />
              ))}
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-3">
              <p className="text-sm mb-1">Sizes:</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sv) => (
                  <span key={sv.id} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {sv.definition.titles.default}: {sv.stock}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
