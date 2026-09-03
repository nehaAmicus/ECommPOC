import { configureStore } from '@reduxjs/toolkit'

import { authApi } from '../api/authApi'
import { cartApi } from '../api/cartApi'
import { productsApi } from '../api/productsApi'
import authReducer from './authSlice'
import cartReducer from './cartSlice'
import compareReducer from './compareSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    compare: compareReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      cartApi.middleware,
      authApi.middleware,
    ),
})

store.subscribe(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('localCart', JSON.stringify(store.getState().cart.items))
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
