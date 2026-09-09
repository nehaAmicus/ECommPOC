/**
 * Centralized Tailwind CSS class patterns for consistent styling
 * Reduces duplication and makes theming easier
 */

export const buttonStyles = {
  base: 'rounded-lg px-4 py-2.5 text-sm font-medium transition outline-none disabled:cursor-not-allowed',
  primary: 'bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-60',
  secondary: 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 disabled:opacity-50',
  danger: 'bg-red-600 text-white hover:bg-red-500 disabled:opacity-60',
  dark: 'bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60',
  success: 'bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-60',
}

export const inputStyles = {
  base: 'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition',
  focus: 'focus:border-sky-500 focus:ring-2 focus:ring-sky-100',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-100',
}

export const cardStyles = {
  base: 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
  hover: 'hover:shadow-md transition-shadow',
  outlined: 'border-2 border-slate-300',
}

export const badgeStyles = {
  base: 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
  primary: 'bg-sky-50 text-sky-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  error: 'bg-red-50 text-red-700',
  slate: 'bg-slate-100 text-slate-700',
}

export const alertStyles = {
  base: 'rounded-lg border p-3 text-sm',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  error: 'border-red-200 bg-red-50 text-red-700',
}

export const loaderStyles = {
  base: 'rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600',
}

export const labelStyles = {
  base: 'mb-1 block text-sm font-medium text-slate-700',
}

// Helper function to combine classes
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
