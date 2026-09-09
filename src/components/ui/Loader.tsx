import { alertStyles, cn } from '../../styles/tailwind'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error'
}

export function Alert({
  variant = 'info',
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        alertStyles.base,
        alertStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
