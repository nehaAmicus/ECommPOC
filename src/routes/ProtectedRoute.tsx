import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAppSelector } from '../hooks/useAppSelector'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
