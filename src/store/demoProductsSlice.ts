import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Product } from '../types'

interface DemoProductsState {
  items: Product[]
}

const initialState: DemoProductsState = {
  items: [],
}

const demoProductsSlice = createSlice({
  name: 'demoProducts',
  initialState,
  reducers: {
    addDemoProduct: (state, action: PayloadAction<Product>) => {
      state.items.unshift(action.payload)
    },
  },
})

export const { addDemoProduct } = demoProductsSlice.actions
export default demoProductsSlice.reducer