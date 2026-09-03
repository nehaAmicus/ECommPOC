interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm text-slate-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
