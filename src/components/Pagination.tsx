interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-full sm:w-auto rounded border border-slate-300 px-3 py-2 text-xs sm:text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 transition"
      >
        ← Prev
      </button>

      <span className="text-xs sm:text-sm text-slate-700 whitespace-nowrap">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-full sm:w-auto rounded border border-slate-300 px-3 py-2 text-xs sm:text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 transition"
      >
        Next →
      </button>
    </div>
  )
}
