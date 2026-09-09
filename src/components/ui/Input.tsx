import { inputStyles, labelStyles, cn } from '../../styles/tailwind'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({
  label,
  error,
  helperText,
  className,
  ...props
}: InputProps) {
  return (
    <div>
      {label && (
        <label className={labelStyles.base}>
          {label}
        </label>
      )}
      <input
        className={cn(
          inputStyles.base,
          inputStyles.focus,
          error && inputStyles.error,
          className,
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  )
}
