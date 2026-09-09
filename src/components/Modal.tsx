import type { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-lg bg-white p-4 sm:p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">{title ?? 'Modal'}</h2>
          <button type="button" onClick={onClose} className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
