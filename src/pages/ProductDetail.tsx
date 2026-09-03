import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useDispatch } from 'react-redux'

import { SEO } from '../components/SEO'
import {
  getStoredCartId,
  setStoredCartId,
  useCreateCartMutation,
  useGetCartQuery,
  useUpdateCartMutation,
} from '../api/cartApi'
import { useDeleteProductMutation, useGetProductByIdQuery } from '../api/productsApi'
import { useAppSelector } from '../hooks/useAppSelector'
import { addToCart } from '../store/cartSlice'
import { addToCompare, removeFromCompare } from '../store/compareSlice'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const productId = Number(id)
  const user = useAppSelector((state) => state.auth.user)
  const compareIds = useAppSelector((state) => state.compare.items)
  const localCartItems = useAppSelector((state) => state.cart.items)
  const cartId = user?.id ?? getStoredCartId()
  const { data: product, isLoading, isError } = useGetProductByIdQuery(productId)
  const { data: cart } = useGetCartQuery(cartId)
  const [createCart, { isLoading: isCreatingCart }] = useCreateCartMutation()
  const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation()
  const [deleteProduct, { isLoading: isDeletingProduct, isError: isDeleteError, error: deleteError }] = useDeleteProductMutation()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setToastMessage(null)
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [toastMessage])

  const handleAddToCart = async () => {
    if (!product) {
      return
    }

    const alreadyInCart = localCartItems.some((item) => item.productId === product.id)
    dispatch(addToCart({ productId: product.id, quantity: 1 }))

    try {
      if (cart) {
        const existingItem = cart.products.find((item) => item.id === product.id)
        const nextProducts = existingItem
          ? cart.products.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
            )
          : [...cart.products, { id: product.id, quantity: 1 }]

        await updateCart({
          id: cart.id,
          products: nextProducts.map(({ id, quantity }) => ({ id, quantity })),
        }).unwrap()

        setToastMessage(alreadyInCart ? 'Quantity increased' : 'Added to cart')
        return
      }

      const createdCart = await createCart({
        userId: user?.id ?? cartId,
        products: [{ id: product.id, quantity: 1 }],
      }).unwrap()

      setStoredCartId(createdCart.id)
      setToastMessage(alreadyInCart ? 'Quantity increased' : 'Added to cart')
    } catch (addError) {
      console.error('Add to cart failed', addError)
      setToastMessage('Unable to add to cart')
    }
  }

  const handleDeleteProduct = async () => {
    if (!product || isDeletingProduct) {
      return
    }

    try {
      await deleteProduct(product.id).unwrap()
      setShowDeleteConfirm(false)
      navigate('/products', {
        replace: true,
        state: {
          message:
            'Product marked as deleted by DummyJSON demo mode. The API simulates deletion and does not permanently remove the product from the server.',
        },
      })
    } catch (deleteFailure) {
      console.error('Delete product failed', deleteFailure)
      setToastMessage('Unable to delete product')
      setShowDeleteConfirm(false)
    }
  }

  const isCompared = compareIds.includes(productId)
  const isCompareLimitReached = compareIds.length >= 3 && !isCompared

  const toggleCompare = () => {
    if (isCompared) {
      dispatch(removeFromCompare(productId))
      return
    }

    if (!isCompareLimitReached) {
      dispatch(addToCompare(productId))
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
          Loading product...
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          Product could not be loaded.
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`${product.title} | MyStore`}
        description={product.description}
        image={product.thumbnail}
        canonical={`/products/${product.id}`}
      />

      <div className="mx-auto max-w-5xl p-6">
        <Link to="/products" className="mb-6 inline-block text-sm font-medium text-sky-600 hover:text-sky-700">
          ← Back to products
        </Link>

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white shadow-lg">
            {toastMessage}
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-slate-900">Delete product?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                This will simulate a delete request to DummyJSON. The API does not permanently remove the product from its demo dataset.
              </p>

              {isDeleteError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {(deleteError as { data?: { message?: string } })?.data?.message ?? 'Delete failed.'}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProduct}
                  disabled={isDeletingProduct}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeletingProduct ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-96 w-full rounded-xl object-cover"
              />

              <div className="mt-4 grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <img
                    key={`${product.id}-${index}`}
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className="h-20 w-full rounded-md object-cover"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="mb-2 inline-flex w-fit rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                {product.category}
              </span>

              <h1 className="text-3xl font-bold text-slate-900">{product.title}</h1>
              <p className="mt-3 text-sm text-slate-500">{product.brand}</p>

              <div className="mt-5 flex items-center gap-4">
                <span className="text-3xl font-bold text-slate-900">${product.price}</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {product.discountPercentage}% off
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <span>Rating: {product.rating}</span>
                <span>•</span>
                <span>{product.stock} in stock</span>
              </div>

              <p className="mt-6 text-base leading-7 text-slate-700">{product.description}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isCreatingCart || isUpdatingCart}
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreatingCart || isUpdatingCart ? 'Adding...' : 'Add to cart'}
                </button>

                {user && (
                  <>
                    <button
                      type="button"
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                      className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-2.5 text-sm font-medium text-sky-700 transition hover:border-sky-400 hover:bg-sky-100"
                    >
                      Edit Product
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isDeletingProduct}
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeletingProduct ? 'Deleting...' : 'Delete Product'}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={toggleCompare}
                  disabled={isCompareLimitReached}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                    isCompared
                      ? 'border-sky-600 bg-sky-100 text-sky-700 hover:bg-sky-200'
                      : isCompareLimitReached
                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {isCompared ? 'Remove from compare' : isCompareLimitReached ? 'Compare limit reached' : 'Compare'}
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}
