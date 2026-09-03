import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { useGetProductByIdQuery } from '../api/productsApi'
import { SEO } from '../components/SEO'
import { useAppSelector } from '../hooks/useAppSelector'
import { clearCompare } from '../store/compareSlice'
import type { Product } from '../types'

const compareFields = [
  { key: 'title', label: 'Title' },
  { key: 'price', label: 'Price' },
  { key: 'brand', label: 'Brand' },
  { key: 'category', label: 'Category' },
  { key: 'rating', label: 'Rating' },
  { key: 'stock', label: 'Stock' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'weight', label: 'Weight' },
  { key: 'tags', label: 'Tags' },
] as const

function renderValue(key: (typeof compareFields)[number]['key'], product: Product) {
  switch (key) {
    case 'price':
      return `$${product.price}`
    case 'rating':
      return `${product.rating} / 5`
    case 'dimensions':
      return product.dimensions
        ? `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} ${product.dimensions.unit}`
        : 'N/A'
    case 'weight':
      return product.weight ? `${product.weight} kg` : 'N/A'
    case 'tags':
      return product.tags?.length ? product.tags.join(', ') : 'N/A'
    case 'title':
      return product.title
    case 'brand':
      return product.brand
    case 'category':
      return product.category
    case 'stock':
      return product.stock
    default:
      return 'N/A'
  }
}

export function Compare() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const selectedIds = useAppSelector((state) => state.compare.items)

  const firstQuery = useGetProductByIdQuery(selectedIds[0], { skip: !selectedIds[0] })
  const secondQuery = useGetProductByIdQuery(selectedIds[1], { skip: !selectedIds[1] })
  const thirdQuery = useGetProductByIdQuery(selectedIds[2], { skip: !selectedIds[2] })

  const products = [firstQuery.data, secondQuery.data, thirdQuery.data].filter(
    (product): product is Product => Boolean(product),
  )

  if (!selectedIds.length) {
    return (
      <>
        <SEO
          title="Compare Products | MyStore"
          description="Compare products side by side."
          robots="noindex,nofollow"
        />
        <div className="mx-auto max-w-4xl p-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">No products selected</h1>
            <p className="mt-2 text-sm text-slate-600">Choose up to three products to compare their specifications.</p>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="mt-5 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500"
            >
              Browse products
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Compare Products | MyStore"
        description="Compare products side by side."
        robots="noindex,nofollow"
      />

      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Compare products</h1>
          <p className="mt-1 text-sm text-slate-600">Side-by-side specs for your selected items.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(clearCompare())}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400"
          >
            Clear comparison
          </button>
          <Link
            to="/products"
            className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500"
          >
            Back to products
          </Link>
        </div>
      </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-slate-200 bg-slate-50 p-4 text-left text-sm font-semibold text-slate-700">Feature</th>
                {products.map((product) => (
                  <th key={product.id} className="border-b border-l border-slate-200 bg-slate-50 p-4 text-left align-top">
                    <Link to={`/products/${product.id}`} className="block text-base font-semibold text-sky-700 hover:text-sky-800">
                      {product.title}
                    </Link>
                    <p className="mt-1 text-sm text-slate-500">{product.brand}</p>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {compareFields.map((field) => (
                <tr key={field.key} className="align-top">
                  <td className="border-b border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                    {field.label}
                  </td>
                  {products.map((product) => (
                    <td key={`${field.key}-${product.id}`} className="border-b border-l border-slate-200 p-4 text-sm text-slate-700">
                      {renderValue(field.key, product)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
