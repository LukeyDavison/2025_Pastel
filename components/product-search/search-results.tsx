"use client"

import { useState, useEffect, memo } from "react"
import { ChevronLeft, ChevronRight, Loader2, Download, Info, Check, Search } from "lucide-react"
import { deferExecution } from "@/utils/performance-utils"

type ProductType = {
  id: string
  name?: string
  titles?: { default: string }
  price?: number | string
  pricing?: { price: number | string; was?: number | string }
  wasPrice?: number | string
  imageUrl?: string
  image_url?: string
  image?: string
  media?: { default?: { src?: string } }
  properties?: {
    swatches?: Array<{
      id?: string
      colour?: string
      hex?: string
      images?: string[]
      sizes?: Array<any>
    }>
  }
  variants?: Array<any>
  stock?: { available?: boolean; uk_stock?: number; global_stock?: number }
  inStock?: boolean
  sizes?: Array<any>
  options?: Array<{
    name: string
    values: string[]
  }>
}

// Memoize the ProductCardComponent to prevent unnecessary re-renders
const ProductCardComponent = memo(function ProductCard({
  product,
  onInsert,
  isSelected = false,
  multiSelectMode = false,
}) {
  // Handle different product data structures
  const title = product.titles?.default || product.name || "Product"
  const price = product.pricing?.price || (typeof product.price === "number" ? product.price : 0)
  const wasPrice = product.pricing?.was || product.wasPrice

  // Handle different image structures
  const defaultImg =
    product.media?.default?.src ||
    product.imageUrl ||
    product.image_url ||
    product.image ||
    "/diverse-fashion-display.png"

  // Handle swatches if available
  const swatches = product.properties?.swatches || []
  const swatchImages = swatches.length ? swatches.map((s) => s.images || [defaultImg]) : [[defaultImg]]

  const [swatchIdx, setSwatchIdx] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)
  const [showSizes, setShowSizes] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  const images = swatchImages[swatchIdx] || [defaultImg]
  const currentImg = images[imgIdx] || defaultImg

  // Get the current swatch color name
  const currentColor = swatches.length > 0 && swatchIdx < swatches.length ? swatches[swatchIdx].colour : null

  // Find sizes from all possible locations
  const findAllSizes = () => {
    let allSizes = []

    // Try to get sizes from the current swatch
    const currentSwatch = swatches[swatchIdx]
    if (currentSwatch?.sizes && currentSwatch.sizes.length > 0) {
      allSizes = [...allSizes, ...currentSwatch.sizes]
    }

    // Try to get sizes from variants
    if (product.variants && product.variants.length > 0) {
      // Filter variants by current color if possible
      const colorVariants = currentSwatch?.colour
        ? product.variants.filter((v) => v.colour === currentSwatch.colour)
        : product.variants

      if (colorVariants.length > 0) {
        allSizes = [...allSizes, ...colorVariants]
      }
    }

    // Try to get sizes from direct sizes property
    if (product.sizes && product.sizes.length > 0) {
      allSizes = [...allSizes, ...product.sizes]
    }

    // Try to get sizes from options
    if (product.options && product.options.length > 0) {
      const sizeOption = product.options.find((opt) => opt.name?.toLowerCase().includes("size"))
      if (sizeOption?.values?.length) {
        allSizes = [...allSizes, ...sizeOption.values.map((size) => ({ size }))]
      }
    }

    // If we still don't have sizes but know the product is in stock, add a "One Size" option
    if (allSizes.length === 0 && (product.stock?.available || product.inStock)) {
      allSizes = [{ size: "One Size", stock: { available: true } }]
    }

    return allSizes
  }

  const allSizes = findAllSizes()
  const hasSizes = allSizes.length > 0

  const prevImage = () => setImgIdx((i) => (i - 1 + images.length) % images.length)
  const nextImage = () => setImgIdx((i) => (i + 1) % images.length)

  const handleInsert = () => {
    // Format price as a number to ensure consistency
    const formattedPrice = typeof price === "string" ? Number.parseFloat(price) : price
    const formattedWasPrice = typeof wasPrice === "string" ? Number.parseFloat(wasPrice) : wasPrice

    // Make sure we include all necessary data including swatches with sizes
    const productWithSizes = {
      ...product,
      imageUrl: currentImg,
      // Ensure price is properly formatted
      price: formattedPrice || 0,
      wasPrice: formattedWasPrice,
      // Make sure name is available
      name: title,
      // Make sure we pass the swatches with their sizes
      swatches: swatches,
      // Include variants if available
      variants: product.variants || [],
      // Include stock information
      stock: product.stock || { available: true },
    }

    console.log("Inserting product with data:", productWithSizes)
    onInsert(productWithSizes, currentImg)
  }

  const handleDownload = async () => {
    try {
      const res = await fetch(currentImg)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${(title || "product").replace(/\s+/g, "-").toLowerCase()}.jpg`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch {
      alert("⚠️ Download failed")
    }
  }

  // Get total stock count
  const getTotalStock = () => {
    let total = 0

    // Try to get stock from the product directly
    if (product.stock?.uk_stock) {
      total += product.stock.uk_stock
    }

    if (product.stock?.global_stock) {
      total += product.stock.global_stock
    }

    // Try to get stock from variants
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant) => {
        if (variant.stock?.uk_stock) {
          total += variant.stock.uk_stock
        }
        if (variant.stock?.global_stock) {
          total += variant.stock.global_stock
        }
      })
    }

    return total > 0 ? total : "In Stock"
  }

  // Render a size item based on the data structure
  const renderSizeItem = (size, index) => {
    // Try to determine if the size is available
    const isAvailable =
      size.stock?.available !== false ||
      (size.stock?.uk_stock && size.stock.uk_stock > 0) ||
      (size.stock?.global_stock && size.stock.global_stock > 0) ||
      product.inStock

    // Try to get the size label
    const sizeLabel =
      size.titles?.uk ||
      size.titles?.default ||
      size.size ||
      size.name ||
      (typeof size === "string" ? size : `Size ${index + 1}`)

    // Get stock count if available
    const stockCount = (size.stock?.uk_stock || 0) + (size.stock?.global_stock || 0)

    return (
      <div
        key={index}
        className="inline-block px-2 py-1 text-xs border rounded-md m-1"
        style={{
          backgroundColor: isAvailable ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
          borderColor: isAvailable ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.2)",
          color: "white",
        }}
        title={`${sizeLabel} - ${isAvailable ? `In Stock (${stockCount || "Available"})` : "Out of Stock"}`}
      >
        <span>{sizeLabel}</span>
        {stockCount > 0 && <span className="ml-1 text-xs opacity-80">({stockCount})</span>}
      </div>
    )
  }

  return (
    <div
      className={`product-card h-full ${isSelected ? "ring-2 ring-white" : ""}`}
      style={{
        width: "100%",
        maxWidth: "100%",
        backdropFilter: "blur(10px) saturate(180%)",
        WebkitBackdropFilter: "blur(10px) saturate(180%)",
        backgroundColor: isSelected ? "rgba(255, 245, 235, 0.4)" : "rgba(255, 245, 235, 0.2)", // Brighter when selected
        borderRadius: "5px",
        border: isSelected ? "1px solid rgba(255, 255, 255, 0.6)" : "1px solid rgba(255, 245, 235, 0.2)",
        padding: "0",
        filter: "drop-shadow(0 5px 5px rgba(0, 0, 0, 0.05))", // Lighter shadow
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Selection indicator for multi-select mode */}
      {multiSelectMode && isSelected && (
        <div className="absolute top-2 left-2 z-20 bg-white rounded-full p-1">
          <Check className="h-4 w-4 text-green-600" />
        </div>
      )}

      <div className="wrapper w-full">
        <div
          className="banner-image"
          style={{
            backgroundImage: `url(${currentImg})`,
            backgroundPosition: "center",
            backgroundSize: "contain", // Changed to cover to fill the space better
            backgroundRepeat: "no-repeat",
            height: "250px", // Reduced height for better fit on page
            width: "100%",
            borderRadius: "5px 5px 0 0",
            border: "1px solid rgba(255, 245, 235, 0.2)",
            position: "relative",
            backgroundColor: "#f5f5f5", // Light background for transparent images
          }}
        >
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 bg-white/20 rounded-full"
                style={{
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 245, 235, 0.3)",
                }}
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-white/20 rounded-full"
                style={{
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 245, 235, 0.3)",
                }}
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </>
          )}

          {/* Icon-only controls */}
          <div className="absolute top-2 right-2 flex space-x-1 z-10">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="p-1 bg-white/20 hover:bg-white/30 rounded-full"
              style={{
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 245, 235, 0.3)",
              }}
            >
              <Info className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1 bg-white/20 hover:bg-white/30 rounded-full"
              style={{
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 245, 235, 0.3)",
              }}
            >
              <Download className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
        <div
          className="p-2"
          style={{
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(5px)",
          }}
        >
          <h1 className="text-white font-medium text-xs truncate">{title}</h1>
          {currentColor && <p className="text-white/80 text-xs">{currentColor}</p>}

          <p className="text-white mt-1 text-xs">
            £{typeof price === "number" ? price.toFixed(2) : price}
            {wasPrice && (
              <span className="text-red-300 line-through ml-2">
                £{typeof wasPrice === "number" ? wasPrice.toFixed(2) : wasPrice}
              </span>
            )}
          </p>

          {/* Stock count */}
          <p className="text-green-300 text-xs mt-1">Stock: {getTotalStock()}</p>

          {/* Always show sizes */}
          <div className="mt-1 border-t border-white/20 pt-1">
            {allSizes.length > 0 ? (
              <div className="flex flex-wrap justify-center">
                {allSizes.slice(0, 4).map((size, i) => renderSizeItem(size, i))}
                {allSizes.length > 4 && (
                  <button
                    onClick={() => setShowSizes(!showSizes)}
                    className="text-white/80 text-xs underline mt-1 w-full"
                  >
                    {showSizes ? "Show less" : `+${allSizes.length - 4} more sizes`}
                  </button>
                )}
              </div>
            ) : (
              <div className="text-white/70 text-xs">No size information</div>
            )}
          </div>

          {/* Show all sizes when expanded */}
          {showSizes && allSizes.length > 4 && (
            <div className="mt-1 pt-1">
              <div className="flex flex-wrap justify-center">
                {allSizes.slice(4).map((size, i) => renderSizeItem(size, i + 4))}
              </div>
            </div>
          )}

          {/* Debug information */}
          {showDebug && (
            <div className="mt-1 border-t border-white/20 pt-1 text-xs text-white/70">
              <div>ID: {product.id}</div>
              <div>Swatches: {swatches.length}</div>
              <div>Variants: {product.variants?.length || 0}</div>
              <div>Direct sizes: {product.sizes?.length || 0}</div>
              <div>Options: {product.options?.length || 0}</div>
              <div>All sizes found: {allSizes.length}</div>
            </div>
          )}
        </div>

        {/* Swatch selector */}
        {swatches.length > 0 && (
          <div
            className="flex justify-center space-x-1 py-1"
            style={{
              background: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(5px)",
            }}
          >
            {swatches.map((s, i) => (
              <button
                key={s.id || i}
                onClick={() => {
                  setSwatchIdx(i)
                  setImgIdx(0)
                }}
                className={`w-4 h-4 rounded-full border-2 ${i === swatchIdx ? "border-white" : "border-transparent"}`}
                style={{ backgroundColor: s.hex || "#ccc" }}
                title={s.colour || `Color ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <div
        className="button-wrapper w-full"
        style={{
          display: "flex",
          gap: "1px",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            color: "#ffffff",
            fontWeight: 100,
            background: "rgba(0, 0, 0, 0.5)",
            transition: "all .3s ease",
            border: "none",
            padding: "6px 10px",
            fontSize: "0.65rem",
            letterSpacing: "1px",
            cursor: "pointer",
            width: "50%",
          }}
          onClick={() => window.open(`https://www.lkbennett.com/product/${product.id}`, "_blank")}
        >
          SEE MORE
        </button>
        <button
          style={{
            color: "#ffffff",
            fontWeight: 100,
            background: multiSelectMode && isSelected ? "rgba(0, 150, 0, 0.5)" : "rgba(0, 0, 0, 0.5)",
            transition: "all .3s ease",
            border: "none",
            padding: "6px 10px",
            fontSize: "0.65rem",
            letterSpacing: "1px",
            cursor: "pointer",
            width: "50%",
          }}
          onClick={handleInsert}
        >
          {multiSelectMode ? (isSelected ? "SELECTED" : "SELECT") : "SELECT"}
        </button>
      </div>
    </div>
  )
})

type SearchResultsProps = {
  results: ProductType[]
  isLoading: boolean
  hasSearched: boolean
  onInsertProduct: (product: ProductType, imageUrl: string) => void
  selectedProductIds?: string[]
  multiSelectMode?: boolean
}

// Fix the SearchResults component to ensure it works correctly
export function SearchResults({
  results,
  isLoading,
  hasSearched,
  onInsertProduct,
  selectedProductIds = [],
  multiSelectMode = false,
}: SearchResultsProps) {
  // Optimize initial rendering
  const [isRendered, setIsRendered] = useState(false)

  useEffect(() => {
    if (results.length > 0 && !isRendered) {
      deferExecution(() => {
        setIsRendered(true)
      }, 50)
    }
  }, [results, isRendered])

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-white animate-spin mb-4" />
        <p className="text-white">Loading LK Bennett products...</p>
      </div>
    )
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-white text-lg">No products found</p>
        <p className="text-white/80 text-sm mt-2">Try a different search term</p>
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Search className="h-16 w-16 text-white/40 mb-4" />
        <h3 className="text-white text-xl font-medium mb-2">Search for Products</h3>
        <p className="text-white/70 text-center max-w-md">
          Enter a search term above to find LK Bennett products. Try searching for items like "dress", "shoes", or
          "bag".
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {["Dress", "Shoes", "Bag", "Jacket", "Skirt"].map((term) => (
            <button
              key={term}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm"
              onClick={() => document.querySelector("input[type=search]")?.setAttribute("value", term)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Render only a subset of results initially for better performance
  const visibleResults = isRendered ? results : results.slice(0, 12)

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "10px",
        padding: "0px",
        maxHeight: "70vh",
        overflowY: "auto",
        backgroundColor: "transparent",
      }}
    >
      {visibleResults.map((product) => (
        <ProductCardComponent
          key={product.id}
          product={product}
          onInsert={onInsertProduct}
          isSelected={selectedProductIds.includes(product.id)}
          multiSelectMode={multiSelectMode}
        />
      ))}
    </div>
  )
}

export default memo(SearchResults)
