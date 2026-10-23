import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Product} from '../types';

interface RecentlyViewedState {
  items: Product[];
}

const STORAGE_KEY = 'recentlyViewed'

// Get from localStorage
const getStoredRecentlyViewed = (): Product[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to parse recently viewed:', error)
    return []
  }
}

const initialState: RecentlyViewedState = {
  items: getStoredRecentlyViewed(),
}

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addRecentlyViewed: (state, action: PayloadAction<Product>) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex !== -1) {
        state.items.splice(existingIndex, 1);
      }
      state.items.unshift(action.payload);
      if (state.items.length > 10) {
        state.items.pop();
      }
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
      }
    },
    

    
    clearRecentlyViewed: (state) => {
      state.items = []
      
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
  },
});

export const { addRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;