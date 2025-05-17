/**
 * Performance utilities for optimizing application performance
 */

/**
 * Defers execution of a function to the next tick to improve UI responsiveness
 * @param fn The function to execute
 * @param delay Optional delay in milliseconds
 */
export function deferExecution(fn: () => void, delay = 0): void {
  setTimeout(fn, delay)
}

/**
 * Debounces a function to delay its execution until after a period of inactivity
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Throttles a function to limit how often it can be called
 * @param fn Function to throttle
 * @param limit Time limit in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= limit) {
      lastCall = now
      return fn(...args)
    }
  }
}

/**
 * Optimizes image loading by setting loading="lazy" and decoding="async"
 * @param imgElement Image element to optimize
 */
export function optimizeImageLoading(imgElement: HTMLImageElement) {
  if (imgElement) {
    imgElement.loading = "lazy"
    imgElement.decoding = "async"
  }
}

/**
 * Optimizes all images in a container
 * @param container Container element
 */
export function optimizeAllImages(container: HTMLElement) {
  if (!container) return

  const images = container.querySelectorAll("img")
  images.forEach((img) => {
    optimizeImageLoading(img)
  })
}

/**
 * Batches DOM operations to reduce layout thrashing
 * @param operations Array of functions that perform DOM operations
 */
export function batchDOMOperations(operations: Array<() => void>) {
  // Request animation frame to batch operations
  requestAnimationFrame(() => {
    // Force a style recalculation
    document.body.getBoundingClientRect()

    // Execute all operations
    operations.forEach((operation) => operation())
  })
}

/**
 * Checks if the Intersection Observer API is available
 */
export function isIntersectionObserverSupported(): boolean {
  return "IntersectionObserver" in window
}

/**
 * Creates a lazy loader for elements using Intersection Observer
 * @param callback Function to call when element is visible
 * @param options Intersection Observer options
 */
export function createLazyLoader(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = { rootMargin: "100px", threshold: 0 },
) {
  if (!isIntersectionObserverSupported()) {
    return {
      observe: () => {}, // No-op if not supported
      unobserve: () => {},
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry)
      }
    })
  }, options)

  return observer
}
