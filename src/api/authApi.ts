import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { AuthUser } from '../types'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken')

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getCurrentUser: builder.query<AuthUser, void>({
      query: () => '/auth/me',
    }),
  }),
})

export const { useLoginMutation, useGetCurrentUserQuery } = authApi
