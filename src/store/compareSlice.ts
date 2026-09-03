import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface CompareState {
  items: number[]
}

const initialState: CompareState = {
  items: [],
}

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action: PayloadAction<number>) => {
      const alreadyAdded = state.items.includes(action.payload)

      if (!alreadyAdded && state.items.length < 3) {
        state.items.push(action.payload)
      }
    },
    removeFromCompare: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((id) => id !== action.payload)
    },
    clearCompare: (state) => {
      state.items = []
    },
  },
})

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions
export default compareSlice.reducer
