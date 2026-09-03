import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useGetCategoriesQuery } from '../api/productsApi'

export const productFormSchema = z.object({
  category: z.string().trim().min(2, 'Select a category.'),
  tags: z.string().trim().min(1, 'Add at least one tag.'),
  brand: z.string().trim().min(2, 'Brand is required.'),
  width: z.number({ error: 'Width is required.' }).positive('Width must be greater than 0.'),
  height: z.number({ error: 'Height is required.' }).positive('Height must be greater than 0.'),
  depth: z.number({ error: 'Depth is required.' }).positive('Depth must be greater than 0.'),
  unit: z.enum(['cm', 'in'], {
    message: 'Choose a dimension unit.',
  }),
  price: z.number({ error: 'Price is required.' }).positive('Price must be greater than 0.'),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export const defaultProductFormValues: ProductFormValues = {
  category: '',
  tags: '',
  brand: '',
  width: 0,
  height: 0,
  depth: 0,
  unit: 'cm',
  price: 0,
}

const stepFields: Record<number, Array<keyof ProductFormValues>> = {
  0: ['category'],
  1: ['tags', 'brand'],
  2: ['width', 'height', 'depth', 'unit'],
  3: ['price'],
}

const steps = [
  { title: 'Category', description: 'Choose the product category.' },
  { title: 'Tags + Brand', description: 'Give the product a brand and tags.' },
  { title: 'Dimensions', description: 'Set width, height, and depth.' },
  { title: 'Price', description: 'Set the selling price.' },
]

interface ProductFormWizardProps {
  defaultValues?: ProductFormValues
  isLoading: boolean
  isError?: boolean
  error?: unknown
  submitLabel: string
  submitLoadingLabel: string
  title: string
  subtitle: string
  note?: string
  onSubmit: (values: ProductFormValues) => Promise<void> | void
}

export function ProductFormWizard({
  defaultValues = defaultProductFormValues,
  isLoading,
  isError = false,
  error,
  submitLabel,
  submitLoadingLabel,
  title,
  subtitle,
  note,
  onSubmit,
}: ProductFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: 'onSubmit',
    defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  const currentStepIndex = Math.min(Math.max(currentStep, 0), steps.length - 1)
  const isLastStep = currentStepIndex === steps.length - 1

  const validateCurrentStep = async () => {
    const fields = stepFields[currentStepIndex] ?? []
    return form.trigger(fields)
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) {
      return
    }

    setCurrentStep((previousValue) => Math.min(previousValue + 1, steps.length - 1))
  }

  const previousStep = () => {
    setCurrentStep((previousValue) => Math.max(previousValue - 1, 0))
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sky-600">{subtitle}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            Step {currentStepIndex + 1} / {steps.length}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`rounded-full border px-2 py-2 text-center text-xs font-medium ${
                index <= currentStepIndex
                  ? 'border-sky-600 bg-sky-50 text-sky-700'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              {step.title}
            </div>
          ))}
        </div>

        {note && (
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {note}
          </div>
        )}

        {isError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {(error as { data?: { message?: string } })?.data?.message ?? 'Unable to complete this request.'}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{steps[currentStepIndex].title}</h2>
            <p className="mt-1 text-sm text-slate-600">{steps[currentStepIndex].description}</p>
          </div>

          {currentStepIndex === 0 && (
            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
                Category
              </label>

              {isCategoriesLoading ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                  Loading categories...
                </div>
              ) : (
                <>
                  <select
                    id="category"
                    {...form.register('category')}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  {form.formState.errors.category && (
                    <p className="mt-2 text-sm text-red-600">{form.formState.errors.category.message}</p>
                  )}
                </>
              )}
            </div>
          )}

          {currentStepIndex === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="tags" className="mb-1 block text-sm font-medium text-slate-700">
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  placeholder="wireless, premium, new"
                  {...form.register('tags')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {form.formState.errors.tags && (
                  <p className="mt-2 text-sm text-red-600">{form.formState.errors.tags.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="brand" className="mb-1 block text-sm font-medium text-slate-700">
                  Brand
                </label>
                <input
                  id="brand"
                  type="text"
                  placeholder="e.g. Apple"
                  {...form.register('brand')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {form.formState.errors.brand && (
                  <p className="mt-2 text-sm text-red-600">{form.formState.errors.brand.message}</p>
                )}
              </div>
            </div>
          )}

          {currentStepIndex === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="width" className="mb-1 block text-sm font-medium text-slate-700">
                    Width
                  </label>
                  <input
                    id="width"
                    type="number"
                    min="0"
                    step="0.01"
                    {...form.register('width', { valueAsNumber: true })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  {form.formState.errors.width && (
                    <p className="mt-2 text-sm text-red-600">{form.formState.errors.width.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="height" className="mb-1 block text-sm font-medium text-slate-700">
                    Height
                  </label>
                  <input
                    id="height"
                    type="number"
                    min="0"
                    step="0.01"
                    {...form.register('height', { valueAsNumber: true })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  {form.formState.errors.height && (
                    <p className="mt-2 text-sm text-red-600">{form.formState.errors.height.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="depth" className="mb-1 block text-sm font-medium text-slate-700">
                    Depth
                  </label>
                  <input
                    id="depth"
                    type="number"
                    min="0"
                    step="0.01"
                    {...form.register('depth', { valueAsNumber: true })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  {form.formState.errors.depth && (
                    <p className="mt-2 text-sm text-red-600">{form.formState.errors.depth.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="unit" className="mb-1 block text-sm font-medium text-slate-700">
                    Unit
                  </label>
                  <select
                    id="unit"
                    {...form.register('unit')}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </select>
                  {form.formState.errors.unit && (
                    <p className="mt-2 text-sm text-red-600">{form.formState.errors.unit.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStepIndex === 3 && (
            <div>
              <label htmlFor="price" className="mb-1 block text-sm font-medium text-slate-700">
                Price
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                {...form.register('price', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              {form.formState.errors.price && (
                <p className="mt-2 text-sm text-red-600">{form.formState.errors.price.message}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={previousStep}
              disabled={currentStepIndex === 0 || isLoading}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>

            {isLastStep ? (
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? submitLoadingLabel : submitLabel}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                disabled={isLoading}
                className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
