export interface Product {
  id: string
  name?: string
  titles?: {
    default?: string
  }
  imageUrl?: string
  media?: {
    default?: {
      src: string
    }
  }
  pricing: {
    price: number
    was?: number
  }
  properties?: {
    swatches?: {
      id: string
      colour: string
      hex: string
      images: string[][]
    }[]
  }
  selectedImage?: string
}
