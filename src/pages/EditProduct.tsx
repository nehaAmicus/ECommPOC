import { useNavigate, useParams } from 'react-router-dom'

import { useGetProductByIdQuery, useUpdateProductMutation } from '../api/productsApi'
import { SEO } from '../components/SEO'
import {
  ProductFormWizard,
  type ProductFormValues,
} from '../components/ProductFormWizard'

export function EditProduct() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)

  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
  } = useGetProductByIdQuery(productId)
  const [updateProduct, { isLoading, isError, error }] = useUpdateProductMutation()

  const defaultValues: ProductFormValues | undefined = product
    ? {
        category: product.category,
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        brand: product.brand,
        width: Number(product.dimensions?.width ?? 0),
        height: Number(product.dimensions?.height ?? 0),
        depth: Number(product.dimensions?.depth ?? 0),
        unit: product.dimensions?.unit === 'in' ? 'in' : 'cm',
        price: Number(product.price ?? 0),
      }
    : undefined

  const handleSubmit = async (values: ProductFormValues) => {
    if (isLoading || !product) {
      return
    }

    const payload = {
      title: `${values.brand} ${values.category}`.trim(),
      description: `Updated ${values.category} product from ${values.brand}.`,
      category: values.category,
      tags: values.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      brand: values.brand,
      dimensions: {
        width: Number(values.width),
        height: Number(values.height),
        depth: Number(values.depth),
        unit: values.unit,
      },
      price: Number(values.price),
    }

    try {
      await updateProduct({
        id: product.id,
        body: payload,
      }).unwrap()

      navigate(`/products/${product.id}`, {
        replace: true,
        state: {
          message:
            'Product update sent to DummyJSON demo mode. The server does not persist updates, so this change will not remain after refresh.',
        },
      })
    } catch (submitError) {
      console.error('Update product failed', submitError)
    }
  }

  if (isProductLoading) {
    return (
      <>
        <SEO
          title="Edit Product | MyStore"
          description="Edit this product."
          robots="noindex,nofollow"
        />
        <div className="mx-auto max-w-3xl p-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            Loading product details...
          </div>
        </div>
      </>
    )
  }

  if (isProductError || !product || !defaultValues) {
    return (
      <>
        <SEO
          title="Edit Product | MyStore"
          description="Edit this product."
          robots="noindex,nofollow"
        />
        <div className="mx-auto max-w-3xl p-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {(productError as { data?: { message?: string } })?.data?.message ?? 'Unable to load this product for editing.'}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title={`Edit ${product.title} | MyStore`}
        description={`Edit ${product.title} in the MyStore product catalog.`}
        robots="noindex,nofollow"
      />

      <ProductFormWizard
        defaultValues={defaultValues}
        isLoading={isLoading}
        isError={isError}
        error={error}
        submitLabel="Save changes"
        submitLoadingLabel="Saving..."
        title="Edit product"
        subtitle="Update product"
        note="DummyJSON demo mode does not persist updates server-side. This form simulates the change in the UI only."
        onSubmit={handleSubmit}
      />
    </>
  )
}
