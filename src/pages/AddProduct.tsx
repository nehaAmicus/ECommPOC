import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useAddProductMutation } from '../api/productsApi'
import { SEO } from '../components/SEO'
import {
  ProductFormWizard,
  type ProductFormValues,
  defaultProductFormValues,
} from '../components/ProductFormWizard'
import { addDemoProduct } from '../store/demoProductsSlice'

export function AddProduct() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [addProduct, { isLoading, isError, error }] = useAddProductMutation()

  const handleSubmit = async (values: ProductFormValues) => {
    if (isLoading) {
      return
    }

    const productPayload = {
      title: `${values.brand} ${values.category}`.trim(),
      description: `A ${values.category} product from ${values.brand}.`,
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
      const createdProduct = await addProduct(productPayload).unwrap()
      dispatch(
        addDemoProduct({
          ...createdProduct,
          discountPercentage: createdProduct.discountPercentage ?? 0,
          rating: createdProduct.rating ?? 0,
          stock: createdProduct.stock ?? 0,
          thumbnail:
            createdProduct.thumbnail ??
            `https://placehold.co/640x480/e2e8f0/334155?text=${encodeURIComponent(createdProduct.title)}`,
          images: createdProduct.images ?? [],
        }),
      )

      navigate('/products', {
        replace: true,
        state: {
          message:
            'Product created successfully in DummyJSON demo mode. This simulates creation only and will not persist after refresh.',
        },
      })
    } catch (submitError) {
      console.error('Add product failed', submitError)
    }
  }

  return (
    <>
      <SEO
        title="Add Product | MyStore"
        description="Add a new product."
        robots="noindex,nofollow"
      />

      <ProductFormWizard
        defaultValues={defaultProductFormValues}
        isLoading={isLoading}
        isError={isError}
        error={error}
        submitLabel="Create product"
        submitLoadingLabel="Creating..."
        title="Add a new product"
        subtitle="Create product"
        note="DummyJSON simulates product creation in demo mode and does not persist changes after refresh."
        onSubmit={handleSubmit}
      />
    </>
  )
}
