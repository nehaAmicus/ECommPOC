import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface CartLineItem {
  productId: number
  quantity: number
}

interface CartState {
  items: CartLineItem[]
}

const getStoredCartItems = (): CartLineItem[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedCart = localStorage.getItem('localCart')
    if (!storedCart) {
      return []
    }

    const parsedCart = JSON.parse(storedCart) as CartLineItem[]
    return Array.isArray(parsedCart) ? parsedCart : []
  } catch {
    return []
  }
}

const initialState: CartState = {
  items: getStoredCartItems(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ productId: number; quantity?: number }>,
    ) => {
      const { productId, quantity = 1 } = action.payload
      const existingItem = state.items.find((item) => item.productId === productId)

      if (existingItem) {
        existingItem.quantity += quantity
        return
      }

      state.items.push({ productId, quantity })
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) => {
      const existingItem = state.items.find((item) => item.productId === action.payload.productId)

      if (!existingItem) {
        return
      }

      existingItem.quantity = Math.max(1, action.payload.quantity)
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
