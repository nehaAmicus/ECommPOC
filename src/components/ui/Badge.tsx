import { badgeStyles, cn } from '../../styles/tailwind'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'slate'
}

export function Badge({
  variant = 'slate',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        badgeStyles.base,
        badgeStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
