import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { ProductCard } from '../components/ProductCard'
import { Pagination } from '../components/Pagination'
import { SEO } from '../components/SEO'
import { useGetCategoriesQuery, useGetProductsQuery } from '../api/productsApi'
import { useDebounce } from '../hooks/useDebounce'
import { useAppSelector } from '../hooks/useAppSelector'
import { clearCompare } from '../store/compareSlice'

const PRODUCTS_PER_PAGE = 12

const sortOptions = [
  { label: 'Default', value: '', order: '' },
  { label: 'Price low to high', value: 'price', order: 'asc' },
  { label: 'Price high to low', value: 'price', order: 'desc' },
  { label: 'Rating high to low', value: 'rating', order: 'desc' },
  { label: 'Rating low to high', value: 'rating', order: 'asc' },
  { label: 'Name A-Z', value: 'title', order: 'asc' },
  { label: 'Name Z-A', value: 'title', order: 'desc' },
] as const

export function Products() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const compareIds = useAppSelector((state) => state.compare.items)
  const demoProducts = useAppSelector((state) => state.demoProducts.items)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const search = searchParams.get('search') ?? ''
  const category = searchParams.get('category') ?? ''
  const pageParam = Number(searchParams.get('page') ?? '1')
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1
  const sortBy = searchParams.get('sortBy') ?? ''
  const rawOrder = searchParams.get('order') ?? ''
  const order: 'asc' | 'desc' | undefined =
    rawOrder === 'asc' || rawOrder === 'desc' ? rawOrder : undefined

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery()
  const debouncedSearch = useDebounce(search, 400)
  const skip = (page - 1) * PRODUCTS_PER_PAGE

  const { data, isLoading, isError } = useGetProductsQuery({
    limit: PRODUCTS_PER_PAGE,
    skip,
    search: debouncedSearch,
    category,
    sortBy,
    order,
  })

  const matchingDemoProducts = useMemo(() => {
    const normalizedSearch = debouncedSearch.toLowerCase().trim()

    return demoProducts.filter((product) => {
      const matchesCategory = !category || product.category === category
      const matchesSearch =
        !normalizedSearch ||
        [product.title, product.description, product.brand, product.category]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [category, debouncedSearch, demoProducts])

  const displayedProducts = useMemo(() => {
    if (!data) {
      return matchingDemoProducts
    }

    return page === 1 ? [...matchingDemoProducts, ...data.products] : data.products
  }, [data, matchingDemoProducts, page])

  const totalPages = useMemo(
    () => (data ? Math.max(1, Math.ceil(data.total / PRODUCTS_PER_PAGE)) : 1),
    [data],
  )

  const selectedSort =
    sortOptions.find((option) => option.value === sortBy && option.order === order) ??
    sortOptions[0]

  const handleSearchChange = (nextValue: string) => {
    const nextParams = new URLSearchParams(searchParams)

    if (nextValue.trim()) {
      nextParams.set('search', nextValue.trim())
    } else {
      nextParams.delete('search')
    }

    nextParams.set('page', '1')
    setSearchParams(nextParams)
  }

  const handleSortChange = (value: string) => {
    const selected = sortOptions.find((option) => option.label === value)
    const nextParams = new URLSearchParams(searchParams)

    if (selected) {
      if (selected.value && selected.order) {
        nextParams.set('sortBy', selected.value)
        nextParams.set('order', selected.order)
      } else {
        nextParams.delete('sortBy')
        nextParams.delete('order')
      }

      nextParams.set('page', '1')
      setSearchParams(nextParams)
    }
  }

  const handleCategoryChange = (nextCategory: string) => {
    const nextParams = new URLSearchParams(searchParams)

    if (nextCategory) {
      nextParams.set('category', nextCategory)
    } else {
      nextParams.delete('category')
    }

    nextParams.set('page', '1')
    setSearchParams(nextParams)
  }

  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('search')
    nextParams.delete('category')
    nextParams.delete('sortBy')
    nextParams.delete('order')
    nextParams.set('page', '1')
    setSearchParams(nextParams)
  }

  const handlePageChange = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages)
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', String(safePage))
    setSearchParams(nextParams)
  }

  const successMessage = (location.state as { message?: string } | null)?.message

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setToastMessage(null)
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [toastMessage])

  const handleAddProductClick = () => {
    if (isAuthenticated) {
      navigate('/products/add')
      return
    }

    navigate('/login', { state: { from: { pathname: '/products/add' } } })
  }

  const handleAddToCartToast = (productId: number, alreadyInCart: boolean) => {
    void productId
    setToastMessage(alreadyInCart ? 'Quantity increased' : 'Added to cart')
  }

  const dispatch = useDispatch()

  return (
    <>
      <SEO
        title="Products | MyStore"
        description="Browse our collection of products."
        canonical="/products"
      />

      <div className="mx-auto max-w-7xl p-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white shadow-lg">
          {toastMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse the live catalog from the public DummyJSON API.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddProductClick}
          className="inline-flex h-[42px] shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-sky-600 px-10 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500"
        >
          + Add Product
        </button>

        <div className="flex w-full max-w-3xl items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search products"
            className="h-[42px] w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />

          <select
            aria-label="Sort products"
            value={selectedSort.label}
            onChange={(event) => handleSortChange(event.target.value)}
            className="h-[42px] rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            {sortOptions.map((option) => (
              <option key={`${option.label}-${option.value || 'default'}`} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Categories
          </h2>

          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-sky-600 hover:text-sky-700"
          >
            Clear Filters
          </button>
        </div>

        {isCategoriesLoading ? (
          <p className="text-sm text-slate-500">Loading categories...</p>
        ) : (
          <div className="max-w-xs">
            <select
              aria-label="Filter products by category"
              value={category || ''}
              onChange={(event) => handleCategoryChange(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {compareIds.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-800">Compare shortlist</p>
            <p className="text-xs text-sky-700">{compareIds.length} of 3 selected</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/compare')}
              className="rounded-lg bg-sky-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
            >
              Compare now
            </button>
            <button
              type="button"
              onClick={() => dispatch(clearCompare())}
              className="rounded-lg border border-sky-200 bg-white px-3.5 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
          Loading products...
        </div>
      )}

      {!isLoading && isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          Unable to load products right now. Please try again later.
        </div>
      )}

      {!isLoading && !isError && data && displayedProducts.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
          No products match your filters.
        </div>
      )}

      {!isLoading && !isError && data && displayedProducts.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {displayedProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="block">
                <ProductCard product={product} onAddToCart={handleAddToCartToast} />
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
      </div>
    </>
  )
}
