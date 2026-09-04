import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Product, ProductCategory, ProductsResponse } from '../types'

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com',
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getCategories: builder.query<ProductCategory[], void>({
      query: () => '/products/categories',
    }),

    getProducts: builder.query<
      ProductsResponse,
      {
        limit?: number
        skip?: number
        search?: string
        category?: string
        sortBy?: string
        order?: 'asc' | 'desc'
      }
    >({
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs
      },
      queryFn: async ({
        limit = 10,
        skip = 0,
        search = '',
        category = '',
        sortBy = '',
        order = 'asc',
      } = {}) => {
        const normalizeText = (value: string) => value.toLowerCase().trim()
        const sortItems = (items: Product[]) => {
          if (!sortBy) {
            return items
          }

          const direction = order === 'desc' ? -1 : 1

          return [...items].sort((a, b) => {
            const left = sortBy === 'title' ? a.title.toLowerCase() : Number(a[sortBy as 'price' | 'rating'])
            const right = sortBy === 'title' ? b.title.toLowerCase() : Number(b[sortBy as 'price' | 'rating'])

            if (typeof left === 'string' && typeof right === 'string') {
              return left.localeCompare(right) * direction
            }

            return (Number(left) - Number(right)) * direction
          })
        }

        const filterItems = (items: Product[]) => {
          const trimmedSearch = normalizeText(search)

          if (!trimmedSearch) {
            return items
          }

          return items.filter((item) => {
            const haystack = [item.title, item.description, item.brand, item.category]
              .join(' ')
              .toLowerCase()

            return haystack.includes(trimmedSearch)
          })
        }

        try {
          let endpoint = '/products'
          const params = new URLSearchParams({
            limit: String(limit),
            skip: String(skip),
          })

          if (search && !category) {
            endpoint = '/products/search'
            params.set('q', search)
          }

          if (sortBy) {
            params.set('sortBy', sortBy)
            params.set('order', order)
          }

          if (category && !search) {
            endpoint = `/products/category/${encodeURIComponent(category)}`
          }

          if (category && search) {
            const response = await fetch(
              `https://dummyjson.com/products/category/${encodeURIComponent(category)}`,
            )

            if (!response.ok) {
              throw new Error('Category products request failed')
            }

            const payload = (await response.json()) as { products?: Product[] }
            const filteredProducts = filterItems(payload.products ?? [])
            const sortedProducts = sortItems(filteredProducts)
            const paginatedProducts = sortedProducts.slice(skip, skip + limit)

            return {
              data: {
                products: paginatedProducts,
                total: filteredProducts.length,
                skip,
                limit,
              },
            }
          }

          const response = await fetch(`https://dummyjson.com${endpoint}?${params.toString()}`)

          if (!response.ok) {
            throw new Error('Products request failed')
          }

          const payload = (await response.json()) as { products?: Product[]; total?: number }
          const items = payload.products ?? []
          const filteredItems = filterItems(items)
          const sortedItems = sortItems(filteredItems)

          return {
            data: {
              products: sortedItems,
              total: payload.total || filteredItems.length || 0,
              skip,
              limit,
            },
          }
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          }
        }
      },
      providesTags: (result) =>
        result
          ? [{ type: 'Product', id: 'LIST' }]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: '/products/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateProduct: builder.mutation<Product, { id: number; body: Partial<Product> }>({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Product', id: arg.id }],
    }),

    deleteProduct: builder.mutation<
      { id: number; isDeleted: boolean; deletedOn: string },
      number
    >({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi
