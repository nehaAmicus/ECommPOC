import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Cart } from '../types'

export interface CartProductInput {
  id: number
  quantity: number
}

export const getStoredCartId = (): number => {
  if (typeof window === 'undefined') {
    return 1
  }

  const storedCartId = Number(localStorage.getItem('demoCartId') ?? '1')
  return Number.isFinite(storedCartId) && storedCartId > 0 ? storedCartId : 1
}

export const setStoredCartId = (id: number) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('demoCartId', String(id))
  }
}

export const clearStoredCartId = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demoCartId')
  }
}

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com',
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<Cart, number>({
      query: (id) => `/carts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Cart', id }],
    }),

    createCart: builder.mutation<
      Cart,
      { userId: number; products: CartProductInput[] }
    >({
      query: (body) => ({
        url: '/carts/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    updateCart: builder.mutation<
      Cart,
      { id: number; products: CartProductInput[]; merge?: boolean }
    >({
      query: ({ id, products, merge = false }) => ({
        url: `/carts/${id}`,
        method: 'PUT',
        body: { merge, products },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Cart', id: arg.id }],
    }),

    deleteCart: builder.mutation<Cart, number>({
      query: (id) => ({
        url: `/carts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Cart', id }],
    }),

    updateCartItemQuantity: builder.mutation<
      Cart,
      { id: number; productId: number; quantity: number }
    >({
      query: ({ id, productId, quantity }) => ({
        url: `/carts/${id}`,
        method: 'PATCH',
        body: {
          merge: false,
          products: [{ id: productId, quantity }],
        },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Cart', id: arg.id }],
    }),

    removeCartItem: builder.mutation<Cart, { id: number; productId: number }>({
      query: ({ id, productId }) => ({
        url: `/carts/${id}/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Cart', id: arg.id }],
    }),

    clearCart: builder.mutation<Cart, { id: number }>({
      query: ({ id }) => ({
        url: `/carts/${id}`,
        method: 'PUT',
        body: {
          merge: false,
          products: [],
        },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Cart', id: arg.id }],
    }),
  }),
})

export const {
  useGetCartQuery,
  useCreateCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi
