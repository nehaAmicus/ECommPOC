import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { useGetProductsQuery } from '../api/productsApi'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'
import { SEO } from '../components/SEO'
import { useAppSelector } from '../hooks/useAppSelector'
import { clearCart, removeFromCart, updateQuantity } from '../store/cartSlice'

export function Cart() {
  const dispatch = useDispatch()
  const localCartItems = useAppSelector((state) => state.cart.items)
  const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery({ limit: 100 })

  const productMap = useMemo(
    () => new Map((productsData?.products ?? []).map((product) => [product.id, product])),
    [productsData],
  )

  const cartItems = useMemo(
    () =>
      localCartItems.map((item) => {
        const product = productMap.get(item.productId)

        return {
          id: item.productId,
          quantity: item.quantity,
          title: product?.title ?? `Product #${item.productId}`,
          price: product?.price ?? 0,
          total: (product?.price ?? 0) * item.quantity,
          thumbnail: product?.thumbnail,
        }
      }),
    [localCartItems, productMap],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity < 1) {
      dispatch(removeFromCart(productId))
      return
    }

    dispatch(updateQuantity({ productId, quantity }))
  }

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const handleDeleteCart = () => {
    dispatch(clearCart())
  }

  if (isProductsLoading && localCartItems.length > 0) {
    return (
      <>
        <SEO
          title="Shopping Cart | MyStore"
          description="View and manage your shopping cart."
          robots="noindex,nofollow"
        />
        <div className="mx-auto max-w-6xl p-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            Loading cart...
          </div>
        </div>
      </>
    )
  }

  if (localCartItems.length === 0) {
    return (
      <>
        <SEO
          title="Shopping Cart | MyStore"
          description="View and manage your shopping cart."
          robots="noindex,nofollow"
        />
        <div className="mx-auto max-w-4xl p-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
            <p className="mt-2 text-sm text-slate-600">Add some products to continue shopping.</p>
            <Link
              to="/products"
              className="mt-5 inline-flex rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Shopping Cart | MyStore"
        description="View and manage your shopping cart."
        robots="noindex,nofollow"
      />

      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Cart</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          <CartSummary
            subtotal={subtotal}
            totalItems={totalItems}
            onClearCart={handleClearCart}
            onDeleteCart={handleDeleteCart}
          />
        </div>
      </div>
    </>
  )
}
