export interface CartProduct {
  id: number
  quantity: number
  title?: string
  price?: number
  total?: number
  discountPercentage?: number
  discountedPrice?: number
  thumbnail?: string
}

export interface Cart {
  id: number
  userId: number
  products: CartProduct[]
  total: number
  discountedTotal: number
  totalProducts: number
  totalQuantity: number
  isDeleted?: boolean
  deletedOn?: string
}
