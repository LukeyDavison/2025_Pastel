import { type NextRequest, NextResponse } from "next/server"
import { mockProducts } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiKey = process.env.LKBENNETT_API_KEY
    const secretKey = process.env.LKBENNETT_SECRET_KEY

    // If API keys are not available, use mock data
    if (!apiKey || !secretKey) {
      console.log("Using mock data (API keys not available)")
      const filteredProducts = filterMockProducts(body.search_text || "")
      return NextResponse.json({ success: true, products: filteredProducts })
    }

    const token = Buffer.from(`${apiKey}:${secretKey}`).toString("base64")

    const requestBody = {
      format: "json",
      search_text: body.search_text || "blue dress",
      filters: {},
      user: { uid: "email-builder", sid: "live-preview" },
      template: "autocomplete",
    }

    console.log("Searching LK Bennett for:", requestBody.search_text)

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
      })

      if (!response.ok) {
        console.error(`LKB API error: ${response.status}`)
        throw new Error(`Status ${response.status}`)
      }

      const data = await response.json()

      // now drill into the hits…
      const hits = data?.elements?.autocomplete?.products?.results ?? []

      // and map _all_ the nested fields you rely on:
      const products = hits.map(({ item }) => ({
        id: item.id,
        // titles.default is the real name
        titles: item.titles,

        // pull across the full media object
        media: item.media,

        // pricing.was + pricing.price
        pricing: {
          price: item.pricing?.price ?? 0,
          was: item.pricing?.was,
        },

        // top‑level stock
        stock: item.stock,

        // copy your swatches array
        properties: {
          swatches: item.properties?.swatches ?? [],
        },

        // you'll also want .variants to get size‑stock info
        variants: item.variants,

        // if you use item.prices for GBP fallbacks, you can copy that too
        prices: item.prices,
      }))

      return NextResponse.json({ success: true, products })
    } catch (error) {
      console.error("Error fetching LKB API:", error)
      // fallback:
      const products = mockProducts.map((product) => ({
        id: product.id,
        titles: { default: product.name || "" },
        media: { default: { src: product.imageUrl || "" } },
        pricing: {
          price: product.price || 0,
          was: product.salePrice ? product.price : undefined,
        },
        stock: { available: true },
        properties: { swatches: product.properties?.swatches || [] },
        variants: [],
        prices: { GBP: product.price || 0 },
      }))
      return NextResponse.json({ success: true, products })
    }
  } catch (error) {
    console.error("Route error:", error)
    return NextResponse.json({ success: false, error: "Search failed", products: [] }, { status: 500 })
  }
}

// Helper function to filter mock products based on search query
function filterMockProducts(query: string) {
  if (!query) return mockProducts

  const normalizedQuery = query.toLowerCase()
  return mockProducts.filter(
    (product) =>
      (product.name && product.name.toLowerCase().includes(normalizedQuery)) ||
      (product.description && product.description.toLowerCase().includes(normalizedQuery)) ||
      (product.category && product.category.toLowerCase().includes(normalizedQuery)),
  )
}
