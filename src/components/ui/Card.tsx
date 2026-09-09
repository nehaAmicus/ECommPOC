import { cardStyles, cn } from '../../styles/tailwind'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  outlined?: boolean
}

export function Card({
  hoverable = false,
  outlined = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        cardStyles.base,
        hoverable && cardStyles.hover,
        outlined && cardStyles.outlined,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
