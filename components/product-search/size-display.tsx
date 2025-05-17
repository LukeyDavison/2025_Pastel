"use client"

import { useState } from "react"

interface SizeDisplayProps {
  sizes: Array<any>
  maxDisplay?: number
}

export function SizeDisplay({ sizes, maxDisplay = 40 }: SizeDisplayProps) {
  const [expanded, setExpanded] = useState(false)

  if (!sizes || sizes.length === 0) {
    return null
  }

  // Normalize size data from different formats
  const normalizedSizes = sizes.map((size) => {
    // Handle different size formats
    const sizeLabel = size.titles?.default || size.size || size.name || (typeof size === "string" ? size : "")

    // Handle different stock formats
    const isAvailable =
      size.stock?.available !== false ||
      (size.stock?.uk_stock && size.stock.uk_stock > 0) ||
      (size.stock?.global_stock && size.stock.global_stock > 0)

    return {
      label: sizeLabel,
      available: isAvailable,
    }
  })

  // Display only a subset if there are many sizes
  const displaySizes = expanded ? normalizedSizes : normalizedSizes.slice(0, maxDisplay)
  const hasMore = normalizedSizes.length > maxDisplay

  return (
    <div className="flex flex-wrap gap-1">
      {displaySizes.map((size, index) => (
        <span
          key={index}
          className={`text-xs px-1.5 py-0.5 rounded border ${
            size.available ? "border-gray-300 bg-gray-100" : "border-gray-200 bg-gray-50 text-gray-400 line-through"
          }`}
        >
          {size.label}
        </span>
      ))}

      {hasMore && (
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-blue-600 underline">
          {expanded ? "Show less" : `+${normalizedSizes.length - maxDisplay} more`}
        </button>
      )}
    </div>
  )
}
