import { buttonStyles, cn } from '../../styles/tailwind'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'dark' | 'success'
  isLoading?: boolean
  loadingLabel?: string
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  isLoading = false,
  loadingLabel,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        buttonStyles.base,
        buttonStyles[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading ? loadingLabel || children : children}
    </button>
  )
}
