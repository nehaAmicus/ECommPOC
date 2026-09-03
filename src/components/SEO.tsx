import { Helmet } from 'react-helmet-async'

export interface SEOProps {
  title: string
  description: string
  canonical?: string
  image?: string
  robots?: 'index,follow' | 'noindex,nofollow'
}

export function SEO({
  title,
  description,
  canonical,
  image,
  robots = 'index,follow',
}: SEOProps) {
  const canonicalUrl = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `https://mystore.example.com${canonical}`
    : undefined

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}
