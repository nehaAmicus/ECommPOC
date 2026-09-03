import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { AuthState, AuthUser } from '../types'

const getStoredUser = (): Partial<AuthState> => {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false, token: null }
  }

  const token = localStorage.getItem('authToken')
  const storedUser = localStorage.getItem('authUser')

  return {
    user: storedUser ? (JSON.parse(storedUser) as AuthUser) : null,
    isAuthenticated: Boolean(token),
    token,
  }
}

const initialState: AuthState = {
  user: getStoredUser().user ?? null,
  isAuthenticated: getStoredUser().isAuthenticated ?? false,
  token: getStoredUser().token ?? null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>,
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true

      localStorage.setItem('authToken', action.payload.token)
      localStorage.setItem('authUser', JSON.stringify(action.payload.user))
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem('authUser', JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
    },
  },
})

export const { setCredentials, setUser, logout } = authSlice.actions
export default authSlice.reducer
