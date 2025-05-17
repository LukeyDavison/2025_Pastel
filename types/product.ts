export type Product = {
  id: string
  name?: string
  titles?: { default: string; [key: string]: string }
  description?: string
  category?: string
  price?: number | string
  pricing?: {
    price: number | string
    was?: number | string
  }
  wasPrice?: number | string
  imageUrl?: string
  image_url?: string
  image?: string
  media?: {
    default?: {
      src?: string
    }
    [key: string]: any
  }
  properties?: {
    swatches?: Array<{
      id?: string
      colour?: string
      hex?: string
      images?: string[]
      sizes?: Array<any>
    }>
    [key: string]: any
  }
  variants?: Array<any>
  stock?: {
    available?: boolean
    uk_stock?: number
    global_stock?: number
    [key: string]: any
  }
  inStock?: boolean
  sizes?: Array<{
    size?: string
    name?: string
    titles?: {
      default?: string
      uk?: string
      [key: string]: string
    }
    stock?: {
      available?: boolean
      uk_stock?: number
      global_stock?: number
      [key: string]: any
    }
    [key: string]: any
  }>
  options?: Array<{
    name: string
    values: string[]
  }>
  swatches?: Array<any>
  [key: string]: any
}
