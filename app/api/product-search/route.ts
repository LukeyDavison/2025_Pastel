import { NextResponse } from "next/server"
import { logInfo, logError, logWarn } from "@/lib/error-handling/error-logger"

export async function POST(request: Request) {
  try {
    logInfo("Product search API route called", {}, "ProductSearchAPI")

    // Parse the request body with error handling
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
        },
        { status: 400 },
      )
    }

    const searchText = body.search_text || ""
    logInfo(`Search query: ${searchText}`, {}, "ProductSearchAPI")

    const apiKey = process.env.LKBENNETT_API_KEY
    const secretKey = process.env.LKBENNETT_SECRET_KEY

    // Check if we have API credentials
    if (!apiKey || !secretKey) {
      logError("Missing API credentials", {}, "ProductSearchAPI")
      return NextResponse.json(
        {
          success: false,
          error: "API credentials not configured",
        },
        { status: 500 },
      )
    }

    const token = Buffer.from(`${apiKey}:${secretKey}`).toString("base64")

    // Use a more reliable endpoint and structure for the request
    const requestBody = {
      format: "json",
      search_text: searchText || "dress", // Default to "dress" if empty
      filters: {},
      user: { uid: "product-search", sid: "live-preview" },
      template: "search", // Using search template for more reliable results
      page_size: 20, // Request more products
    }

    logInfo(`Searching LK Bennett for: ${requestBody.search_text}`, {}, "ProductSearchAPI")

    // Set a timeout for the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch("https://lkb-1.store-uk1.advancedcommerce.services/api/js/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${token}`,
          "X-Requested-With": "GrapheneFetch",
          "X-Referer": "https://www.lkbennett.com",
          Origin: "https://www.lkbennett.com",
        },
        body: JSON.stringify(requestBody),
        cache: "no-store",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        logError(`LKB API error: ${response.status}`, { statusText: response.statusText }, "ProductSearchAPI")
        return NextResponse.json(
          {
            success: false,
            error: `API returned status ${response.status}: ${response.statusText}`,
          },
          { status: response.status },
        )
      }

      const data = await response.json()
      logInfo("API response received", { structure: Object.keys(data) }, "ProductSearchAPI")

      // Extract products from the response - handle different response structures
      let products = []

      // Try to extract from search results first
      if (data?.elements?.search?.products?.results) {
        products = data.elements.search.products.results.map(({ item }) => ({
          id: item.id,
          titles: item.titles,
          media: item.media,
          pricing: item.pricing,
          stock: item.stock,
          properties: item.properties,
          variants: Array.isArray(item.variants) ? item.variants : [],
        }))
      }
      // Try autocomplete results as fallback
      else if (data?.elements?.autocomplete?.products?.results) {
        products = data.elements.autocomplete.products.results.map(({ item }) => ({
          id: item.id,
          titles: item.titles,
          media: item.media,
          pricing: item.pricing,
          stock: item.stock,
          properties: item.properties,
          variants: Array.isArray(item.variants) ? item.variants : [],
        }))
      }
      // Try direct results as another fallback
      else if (data?.results) {
        products = data.results.map((item) => ({
          id: item.id,
          titles: item.titles,
          media: item.media,
          pricing: item.pricing,
          stock: item.stock,
          properties: item.properties,
          variants: Array.isArray(item.variants) ? item.variants : [],
        }))
      }

      logInfo(`Found ${products.length} products from API`, {}, "ProductSearchAPI")

      // If we still don't have products, return an appropriate message
      if (products.length === 0) {
        logWarn("No products found in API response", { searchText }, "ProductSearchAPI")
        return NextResponse.json(
          {
            success: true,
            products: [],
            message: "No products found for your search",
          },
          { status: 200 },
        )
      }

      return NextResponse.json({
        success: true,
        products,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)

      // Handle fetch errors (network issues, timeouts, etc.)
      logError(`Fetch error: ${fetchError.message}`, { stack: fetchError.stack }, "ProductSearchAPI")

      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch from API: ${fetchError.message}`,
        },
        { status: 503 },
      )
    }
  } catch (error) {
    // Handle any other unexpected errors
    logError(`Unexpected error: ${error.message || "Unknown error"}`, { stack: error.stack }, "ProductSearchAPI")

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

// Handle GET requests as well
export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q") || ""

  // Create a POST request body
  const body = { search_text: query }

  // Call the POST handler
  return POST(
    new Request(request.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),
  )
}
