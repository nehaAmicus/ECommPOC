interface CartSummaryProps {
  subtotal: number
  totalItems: number
  isClearing?: boolean
  isDeleting?: boolean
  onClearCart: () => void
  onDeleteCart: () => void
}

export function CartSummary({
  subtotal,
  totalItems,
  isClearing = false,
  isDeleting = false,
  onClearCart,
  //onDeleteCart,
}: CartSummaryProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Summary</h2>

      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Items</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onClearCart}
          disabled={isClearing || isDeleting}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isClearing ? 'Clearing cart...' : 'Clear cart'}
        </button>

        {/* <button
          type="button"
          onClick={onDeleteCart}
          disabled={isClearing || isDeleting}
          className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? 'Deleting cart...' : 'Delete cart'}
        </button> */}
      </div>
    </aside>
  )
}
