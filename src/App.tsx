import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { Header } from './components/Header'
import { AddProduct } from './pages/AddProduct'
import { Cart } from './pages/Cart'
import { Compare } from './pages/Compare'
import { EditProduct } from './pages/EditProduct'
import { Login } from './pages/Login'
import { ProductDetail } from './pages/ProductDetail'
import { Products } from './pages/Products'
import { ProtectedRoute } from './routes/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-color)] transition-colors duration-200">
        <Header />

        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/products/add"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:id/edit"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <Compare />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
