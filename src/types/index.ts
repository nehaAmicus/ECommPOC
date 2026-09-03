export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  tags?: string[]
  weight?: number
  dimensions?: {
    width: number
    height: number
    depth: number
    unit: 'cm' | 'in'
  }
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductCategory {
  slug: string
  name: string
  url: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
}

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
