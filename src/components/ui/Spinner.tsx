import { loaderStyles, cn } from '../../styles/tailwind'

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
}

export function Loader({ message = 'Loading...', className, ...props }: LoaderProps) {
  return (
    <div className={cn(loaderStyles.base, className)} {...props}>
      {message}
    </div>
  )
}
