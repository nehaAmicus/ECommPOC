import type { CartProduct } from '../types'

interface CartItemProps {
  item: CartProduct
  onQuantityChange: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
  isUpdating?: boolean
}

export function CartItem({ item, onQuantityChange, onRemove, isUpdating = false }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <img
        src={item.thumbnail ?? 'https://placehold.co/120x120?text=Product'}
        alt={item.title ?? `Product ${item.id}`}
        className="h-20 w-20 rounded-lg object-cover"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-slate-900">{item.title ?? `Product #${item.id}`}</h3>
        <p className="mt-1 text-sm text-slate-500">
          ${(item.price ?? 0).toFixed(2)} each
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onQuantityChange(item.id, Math.max(0, item.quantity - 1))}
          disabled={isUpdating}
          className="h-8 w-8 rounded-md border border-slate-300 text-lg text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          −
        </button>

        <span className="min-w-8 text-center text-sm font-medium text-slate-700">
          {item.quantity}
        </span>

        <button
          type="button"
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          disabled={isUpdating}
          className="h-8 w-8 rounded-md border border-slate-300 text-lg text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-slate-900">
          ${(item.total ?? (item.price ?? 0) * item.quantity).toFixed(2)}
        </p>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={isUpdating}
          className="mt-2 text-xs font-medium text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
