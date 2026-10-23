import type { Metadata } from "next"
import '../index.css'
import StoreProvider from "./StoreProvide"
export const metadata: Metadata = {
  title: 'React App',
  description: 'Web site created with Next.js.',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body>
        <StoreProvider>{children}</StoreProvider>
    </body>
    </html>
  )
}