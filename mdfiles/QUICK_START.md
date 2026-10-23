# Quick Start: Using the Refactored Structure

## 🎯 Quick Reference

### Import UI Components
```typescript
import { Button, Input, Badge, Card, Alert, Loader } from '@/components/ui'
```

### Import Types (New Structure)
```typescript
// Recommended: Domain-specific imports
import type { Product } from '@/types/product'
import type { AuthUser } from '@/types/auth'
import type { Cart } from '@/types/cart'

// Still works: Backward compatible
import type { Product, AuthUser, Cart } from '@/types'
```

### Import Tailwind Utilities
```typescript
import { buttonStyles, inputStyles, cardStyles, cn } from '@/styles/tailwind'
```

---

## 📦 Component Cheat Sheet

### Button
```tsx
<Button 
  variant="primary" | "secondary" | "danger" | "dark" | "success"
  isLoading={false}
  loadingLabel="Loading..."
  fullWidth={false}
  disabled={false}
>
  Click me
</Button>
```

### Input
```tsx
<Input
  label="Field Name"
  type="text" | "email" | "number" | "password"
  error={errorMessage}
  helperText="Helper text"
  placeholder="..."
/>
```

### Badge
```tsx
<Badge variant="primary" | "success" | "warning" | "error" | "slate">
  Status
</Badge>
```

### Card
```tsx
<Card hoverable={false} outlined={false}>
  Card content here
</Card>
```

### Alert
```tsx
<Alert variant="info" | "success" | "warning" | "error">
  Alert message
</Alert>
```

### Loader
```tsx
<Loader message="Loading..." />
```

---

## 🎨 Tailwind Utilities Cheat Sheet

### Button Styles
```typescript
buttonStyles.base       // Base styles
buttonStyles.primary    // Blue variant
buttonStyles.secondary  // White with border
buttonStyles.danger     // Red variant
buttonStyles.dark       // Dark gray variant
buttonStyles.success    // Green variant
```

### Input Styles
```typescript
inputStyles.base        // Base input styles
inputStyles.focus       // Focus ring styles
inputStyles.error       // Error state styles
```

### Combining Classes
```typescript
import { cn } from '@/styles/tailwind'

className={cn(
  buttonStyles.base,
  buttonStyles.primary,
  isActive && 'ring-2'
)}
```

---

## 📁 File Locations

| Resource | Location |
|----------|----------|
| Button | `src/components/ui/Button.tsx` |
| Input | `src/components/ui/Input.tsx` |
| Badge | `src/components/ui/Badge.tsx` |
| Card | `src/components/ui/Card.tsx` |
| Alert | `src/components/ui/Alert.tsx` |
| Loader | `src/components/ui/Spinner.tsx` |
| UI Exports | `src/components/ui/index.ts` |
| Tailwind Utils | `src/styles/tailwind.ts` |
| Product Types | `src/types/product.ts` |
| Auth Types | `src/types/auth.ts` |
| Cart Types | `src/types/cart.ts` |
| All Types | `src/types/index.ts` |

---

## 💡 Real-World Examples

### Example 1: Form with Validation
```tsx
import { Input, Button } from '@/components/ui'
import { useForm } from 'react-hook-form'

export function LoginForm() {
  const { register, formState: { errors }, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button variant="primary" fullWidth>
        Sign In
      </Button>
    </form>
  )
}
```

### Example 2: Product Card
```tsx
import { Card, Badge, Button } from '@/components/ui'
import type { Product } from '@/types/product'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card hoverable>
      <img src={product.thumbnail} alt={product.title} />
      <h3 className="mt-2 font-semibold">{product.title}</h3>
      <Badge variant="primary">{product.category}</Badge>
      <p className="text-sm text-slate-600">${product.price}</p>
      <Button variant="primary" fullWidth>
        Add to Cart
      </Button>
    </Card>
  )
}
```

### Example 3: Error Handling
```tsx
import { Alert, Loader } from '@/components/ui'

export function ProductList() {
  const { data, isLoading, isError } = useGetProductsQuery()

  if (isLoading) return <Loader message="Loading products..." />
  
  if (isError) return <Alert variant="error">Failed to load products</Alert>
  
  if (data?.products.length === 0) {
    return <Alert variant="info">No products found</Alert>
  }

  return (
    <div>
      {data?.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Example 4: Dynamic Button State
```tsx
<Button
  variant="success"
  isLoading={isSaving}
  loadingLabel="Saving..."
  onClick={handleSave}
>
  Save Changes
</Button>
```

---

## 🚀 Common Patterns

### Conditional Classes
```typescript
import { cn, buttonStyles } from '@/styles/tailwind'

className={cn(
  buttonStyles.base,
  isActive ? buttonStyles.primary : buttonStyles.secondary
)}
```

### Type-Safe Props
```typescript
// Component receives type-safe props
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'dark' | 'success'
  isLoading?: boolean
}

// TypeScript catches invalid variants at compile time
<Button variant="invalid" /> // ❌ Error
<Button variant="primary" /> // ✅ OK
```

### Consistent Spacing
```tsx
<Card>
  <h2>Title</h2>
  <p>Content</p>
  <div className="mt-4 flex gap-2">
    <Button>Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </div>
</Card>
```

---

## ✅ Do's and Don'ts

### ✅ DO
```tsx
import { Button } from '@/components/ui'

<Button variant="primary">Save</Button>
```

### ❌ DON'T
```tsx
<button className="rounded-lg bg-sky-600 px-4 py-2.5...">
  Save
</button>
```

### ✅ DO
```tsx
import type { Product } from '@/types/product'
```

### ❌ DON'T
```tsx
import type { Product } from '@/types'
// (when you only need Product)
```

### ✅ DO
```tsx
import { cn, buttonStyles } from '@/styles/tailwind'
className={cn(buttonStyles.base, buttonStyles.primary)}
```

### ❌ DON'T
```tsx
className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm..."
```

---

## 📚 Documentation Links

- **Full Guide:** `REFACTORING_GUIDE.md`
- **Before/After Examples:** `BEFORE_AFTER_EXAMPLES.md`
- **Implementation Summary:** `REFACTORING_SUMMARY.md`

---

## 🆘 Troubleshooting

**Q: "Cannot find module '@/components/ui'"**
A: Make sure the import path is correct. Check `tsconfig.json` for path aliases.

**Q: "Type 'XXX' not found"**
A: Import from the specific type file: `import type { Product } from '@/types/product'`

**Q: "Button classes not applying"**
A: Make sure you're using the `Button` component, not a plain `<button>` tag.

**Q: How do I add a new variant?**
A: Edit `src/styles/tailwind.ts`, add the variant to the style object, update component's type definition.

---

**Build Status:** ✅ Passing (161 modules)
**Last Updated:** September 9, 2026
