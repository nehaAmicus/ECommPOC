import { useDispatch } from 'react-redux'

import { useCreateCartMutation } from '../api/cartApi'
import { useAppSelector } from '../hooks/useAppSelector'
import { addToCart } from '../store/cartSlice'
import { addToCompare, removeFromCompare } from '../store/compareSlice'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: number, alreadyInCart: boolean) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const dispatch = useDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const selectedIds = useAppSelector((state) => state.compare.items)
  const localCartItems = useAppSelector((state) => state.cart.items)
  const [createCart] = useCreateCartMutation()
  const isSelected = selectedIds.includes(product.id)
  const isMaxReached = selectedIds.length >= 3 && !isSelected

  const toggleCompare = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isSelected) {
      dispatch(removeFromCompare(product.id))
      return
    }

    if (!isMaxReached) {
      dispatch(addToCompare(product.id))
    }
  }

  const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const alreadyInCart = localCartItems.some((item) => item.productId === product.id)
    dispatch(addToCart({ productId: product.id, quantity: 1 }))
    onAddToCart?.(product.id, alreadyInCart)

    try {
      await createCart({
        userId: user?.id ?? 1,
        products: [{ id: product.id, quantity: 1 }],
      }).unwrap()
    } catch (error) {
      console.error('Add to cart failed', error)
    }
  }

  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-slate-600">
          {product.category}
        </span>

        <button
          type="button"
          onClick={toggleCompare}
          disabled={isMaxReached}
          className={`rounded-full border px-2 sm:px-2.5 py-1 text-xs font-medium transition whitespace-nowrap ${
            isSelected
              ? 'border-sky-600 bg-sky-100 text-sky-700'
              : isMaxReached
                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
          }`}
        >
          {isSelected ? 'Selected' : isMaxReached ? 'Max 3' : 'Compare'}
        </button>
      </div>

      <img src={product.thumbnail} alt={product.title} className="mt-3 sm:mt-4 aspect-square w-full rounded-md object-cover" />
      <div className="mt-3 sm:mt-4 flex-1 space-y-2">
        <h2 className="line-clamp-2 text-sm sm:text-base font-semibold text-slate-900">{product.title}</h2>
        {/* <p className="text-sm text-slate-600">{product.brand}</p> */}
        <div className="flex items-center justify-between">
          <span className="text-base sm:text-lg font-bold text-slate-900">${product.price}</span>
          <span className="text-xs text-emerald-600">{product.stock} in stock</span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-slate-800"
          style={{
            backgroundColor: 'var(--button-bg)',
            color: 'var(--button-text)',
            }}
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}
