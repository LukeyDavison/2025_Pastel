"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function OptimizedImage({ src, alt, width, height, className, priority = false }: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const [imgRef, setImgRef] = useState<HTMLDivElement | null>(null)

  // Check if element is in viewport
  useEffect(() => {
    if (!imgRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: "200px" }, // Load images 200px before they enter viewport
    )

    observer.observe(imgRef)

    return () => {
      observer.disconnect()
    }
  }, [imgRef])

  // Generate a low-quality placeholder URL
  const placeholderUrl = `${src}?quality=10&width=${Math.floor(width / 10)}&height=${Math.floor(height / 10)}`

  return (
    <div ref={setImgRef} className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Low quality placeholder */}
      {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}

      {/* Only load the actual image when in view or if priority is true */}
      {(inView || priority) && (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  )
}
