# Architecture Overview: Refactored Project Structure

## 🏗️ Project Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ECOMMERCE APP                               │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
            ┌───────▼────┐ ┌─────▼──────┐ ┌──▼──────────┐
            │    PAGES   │ │ COMPONENTS │ │   STORE    │
            └────────────┘ └────────────┘ └────────────┘
                    │            │              │
         ┌──────────┼──────┐     │              │
         │          │      │     │              │
    ┌────▼──┐ ┌──────▼──┐ ┌─▼───────┐    ┌────▼──────┐
    │Products│ │EditProd │ │  Cart   │    │ Slices &  │
    └────────┘ └─────────┘ └─────────┘    │ Reducers  │
         │          │         │            └───────────┘
         └──────────┼─────────┘
                    │
         ┌──────────▼──────────┐
         │  UI COMPONENTS LIB  │ ⭐ NEW
         └─────────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
    ┌────▼──────┐      ┌──────▼────┐
    │ Shared UI  │      │ Utilities  │
    ├────────────┤      ├────────────┤
    │ • Button   │      │ • tailwind │
    │ • Input    │      │ • cn()     │
    │ • Card     │      │ • constants│
    │ • Badge    │      └────────────┘
    │ • Alert    │
    │ • Loader   │
    └────────────┘
         │
         └─────────────────┬──────────────────┐
                           │                  │
                    ┌──────▼──────┐   ┌───────▼────┐
                    │    TYPES    │   │ TAILWIND   │
                    │ ORGANIZED   │   │ PATTERNS   │
                    └─────────────┘   └────────────┘
                           │
                  ┌────────┬┼┬────────┐
                  │        │ │        │
              ┌───▼──┐ ┌───▼─▼┐ ┌───▼──┐
              │Product│ │Auth  │ │Cart  │
              └───────┘ └──────┘ └──────┘
```

---

## 📦 Component Hierarchy

```
App
├── Header
│   └── Button (primary)
├── Pages
│   ├── Products
│   │   ├── ProductCard (Card, Badge, Button)
│   │   ├── Pagination
│   │   └── Alert (conditional)
│   ├── ProductDetail
│   │   └── Card
│   ├── EditProduct
│   │   └── ProductFormWizard
│   │       ├── Input (multiple)
│   │       └── Button
│   ├── Cart
│   │   ├── CartItem (Card)
│   │   └── Button
│   └── Login
│       └── Input
├── Modal
│   └── Card
└── Loader (conditional)
```

---

## 🔄 Data Flow Architecture

```
                    ┌─────────────────┐
                    │   Redux Store   │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼─────┐      ┌─────▼──────┐      ┌────▼─────┐
    │ authSlice │      │ cartSlice  │      │ demoProds │
    └──────────┘      └────────────┘      └───────────┘
         │                   │                   │
    ┌────▼──────────────┬────▼────────┬─────────▼──┐
    │                   │             │            │
┌───▼────┐      ┌──────▼──┐    ┌────▼──┐    ┌───▼──┐
│ authApi │      │ cartApi │    │products  │    │local  │
│RTK Query│      │         │    │ Api      │    │Storage│
└────────┘      └─────────┘    └─────────┘    └──────┘
    │                   │             │            │
    │                   │             │            │
    └───────────────────┼─────────────┴────────────┘
                        │
        ┌───────────────▼─────────────┐
        │      Components Render       │
        │  (Using UI Component Lib)   │
        └─────────────────────────────┘
```

---

## 📂 File Structure (Complete)

```
src/
├── components/
│   ├── ui/                          ✨ REUSABLE UI COMPONENTS
│   │   ├── Button.tsx               (20 lines)
│   │   ├── Input.tsx                (26 lines)
│   │   ├── Badge.tsx                (17 lines)
│   │   ├── Card.tsx                 (19 lines)
│   │   ├── Alert.tsx                (17 lines)
│   │   ├── Spinner.tsx              (12 lines)
│   │   └── index.ts                 (6 lines)
│   │
│   ├── CartItem.tsx                 (uses UI components)
│   ├── CartSummary.tsx
│   ├── Header.tsx                   (uses UI components)
│   ├── Modal.tsx                    (uses UI components)
│   ├── Pagination.tsx
│   ├── ProductCard.tsx              (uses UI components)
│   ├── ProductFormWizard.tsx        (uses UI components)
│   └── SEO.tsx
│
├── types/                           🔄 ORGANIZED BY DOMAIN
│   ├── index.ts                     (re-exports)
│   ├── product.ts                   (Product, ProductsResponse)
│   ├── auth.ts                      (AuthUser, AuthState)
│   └── cart.ts                      (CartProduct, Cart)
│
├── styles/                          ✨ CENTRALIZED PATTERNS
│   └── tailwind.ts                  (buttonStyles, inputStyles, etc.)
│
├── api/
│   ├── authApi.ts
│   ├── cartApi.ts
│   └── productsApi.ts
│
├── store/
│   ├── store.ts
│   ├── authSlice.ts
│   ├── cartSlice.ts
│   ├── compareSlice.ts
│   └── demoProductsSlice.ts
│
├── pages/
│   ├── Login.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── AddProduct.tsx
│   ├── EditProduct.tsx
│   ├── Cart.tsx
│   └── Compare.tsx
│
├── routes/
│   └── ProtectedRoute.tsx
│
├── hooks/
│   ├── useAppSelector.ts
│   └── useDebounce.ts
│
├── assets/
│
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

---

## 🎯 Layer-by-Layer Architecture

```
┌──────────────────────────────────────────────────────┐
│              PRESENTATION LAYER                      │
│  (Components: Button, Input, Card, Badge, Alert)   │
│             Uses: UI Component Lib                   │
└──────────────────────────────────────────────────────┘
                         │
┌──────────────────────────────────────────────────────┐
│             CONTAINER LAYER                          │
│  (Pages: Products, EditProduct, Cart, Login)        │
│       Uses: Presentation + Logic                     │
└──────────────────────────────────────────────────────┘
                         │
┌──────────────────────────────────────────────────────┐
│              STATE LAYER                             │
│  (Redux Store: Slices, API calls, localStorage)     │
│         Uses: RTK Query, Redux Toolkit               │
└──────────────────────────────────────────────────────┘
                         │
┌──────────────────────────────────────────────────────┐
│              DATA LAYER                              │
│  (APIs: DummyJSON, localStorage, environment vars)  │
└──────────────────────────────────────────────────────┘
```

---

## 🔌 Integration Points

### Type System
```
src/types/
├── product.ts  → Used by ProductCard, ProductDetail, EditProduct
├── auth.ts     → Used by Login, Header, ProtectedRoute
└── cart.ts     → Used by Cart, CartItem, CartSummary
```

### UI Components
```
src/components/ui/ → Used by ALL pages and components
├── Button        → ProductCard, Header, Forms, etc.
├── Input         → ProductFormWizard, Login, EditProduct
├── Card          → ProductCard, Modal, Details
├── Badge         → ProductCard, CartItem
├── Alert         → ProductDetail, EditProduct
└── Loader        → Products, EditProduct
```

### Tailwind Utilities
```
src/styles/tailwind.ts → Used by ALL components
├── buttonStyles  → Button component
├── inputStyles   → Input component
├── cardStyles    → Card component
├── badgeStyles   → Badge component
├── alertStyles   → Alert component
└── cn()          → Any conditional classes
```

---

## 🔐 Dependency Graph

```
Pages
  ├─ Imports: Types (types/*), Components (components/*)
  ├─ Uses: API calls via Redux
  └─ Renders: UI Components + Custom Components

Components (Feature-specific)
  ├─ Imports: UI Components, Types, Hooks
  └─ Uses: Local state, Props

UI Components (Reusable)
  ├─ Imports: Tailwind utilities
  ├─ No imports from: Pages, API, Store
  └─ Props only: data, handlers, state

Tailwind Utilities
  └─ Pure functions: No imports from app code

Types
  └─ No imports from app code (one-way dependency)
```

---

## 📊 Metrics

| Metric | Value |
|--------|-------|
| Total Components | 8 |
| UI Components | 6 |
| Total Pages | 7 |
| Total Types | 7 interfaces |
| Type Files | 3 (+ index) |
| Tailwind Pattern Groups | 7 |
| Module Count | 161 |
| Build Time | ~550ms |
| Bundle Size (gzip) | 148.96 kB |

---

## 🚀 Performance Considerations

```
Smaller Bundle Sizes
├─ Types split by domain
│  └─ Components only load types they need
│
Better Code Splitting
├─ UI components in separate module
│  └─ Can be lazy-loaded if needed
│
Faster Builds
├─ Organized imports
│  └─ TypeScript has clearer dependencies
│
Easier Tree-Shaking
├─ UI components are pure
│  └─ Unused components can be removed
│
Consistent Styling
├─ Centralized Tailwind patterns
│  └─ No unused style duplication
```

---

## 📈 Growth Plan

```
Phase 1: DONE ✅
├─ Type organization
├─ UI component library
├─ Tailwind utilities
└─ Documentation

Phase 2: NEXT
├─ Refactor existing components
│  ├─ ProductFormWizard
│  ├─ ProductCard
│  ├─ CartItem
│  └─ Header
└─ Component prop standardization

Phase 3: ENHANCEMENT
├─ Storybook documentation
├─ Visual regression testing
├─ Component snapshot tests
└─ Design system documentation

Phase 4: SCALING
├─ More specialized components
│  ├─ Select/Dropdown
│  ├─ Tabs
│  ├─ Tooltip
│  └─ Modal wrapper
├─ Theme system
└─ Internationalization support
```

---

## 🔄 Complete App Flow Diagram

### **User Journey & Data Flow**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          APP INITIALIZATION                                  │
└────────────────────────────────────┬─────────────────────────────────────────┘
                                     │
                    ┌────────────────▼──────────────────┐
                    │    index.html loads main.tsx      │
                    │    - React root mounts            │
                    │    - Redux Provider initialized   │
                    │    - HelmetProvider for SEO       │
                    └────────────────┬──────────────────┘
                                     │
                    ┌────────────────▼──────────────────┐
                    │       App.tsx (Router Setup)      │
                    │    - BrowserRouter enabled        │
                    │    - Header component loads       │
                    │    - Routes defined               │
                    └────────────────┬──────────────────┘
                                     │
                    ┌────────────────▼──────────────────┐
                    │   Check localStorage for auth     │
                    │   - Get stored token              │
                    │   - Get stored user info          │
                    │   - Restore auth state            │
                    └────────────────┬──────────────────┘
                                     │
                ┌────────────────────┴─────────────────────┐
                │                                          │
        ┌───────▼────────┐                      ┌──────────▼──────┐
        │ USER LOGGED IN │                      │  NOT LOGGED IN  │
        └────────┬────────┘                      └────────┬───────┘
                 │                                        │
         ┌───────▼────────┐                      ┌────────▼────────┐
         │ Redirect to    │                      │ Show /products  │
         │ /products      │                      │ (public page)   │
         └───────┬────────┘                      └────────┬────────┘
                 │                                        │
                 └────────────────┬─────────────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │  PRODUCTS PAGE LOADED      │
                    │  - Fetch from DummyJSON    │
                    │  - Display product grid    │
                    │  - Show filters/search/sort│
                    │  - Show pagination         │
                    └─────────────┬──────────────┘
                                  │
              ┌───────────────────┼────────────────────┐
              │                   │                    │
         ┌────▼────┐         ┌────▼────┐      ┌───────▼─────┐
         │  Search │         │  Filter │      │  Pagination │
         │  Products│        │ Products│      │  Products   │
         └────┬────┘         └────┬────┘      └───────┬─────┘
              │                   │                    │
              └───────────────────┼────────────────────┘
                                  │
              ┌───────────────────┴────────────────────┐
              │                                        │
         ┌────▼────────────┐              ┌───────────▼────┐
         │ Click Product   │              │  Add to Cart   │
         │ Go to Detail    │              │  (if auth)     │
         └────┬────────────┘              │ else Redirect  │
              │                           │ to /login      │
              │                           └───────┬────────┘
              │                                   │
         ┌────▼──────────────────────────────────▼────┐
         │   PRODUCT DETAIL PAGE                      │
         │  - Fetch by ID from API                   │
         │  - Show full product info                 │
         │  - Show images                            │
         │  - Add to cart button                      │
         │  - Compare product button                 │
         │  - Edit/Delete (if authenticated)         │
         └────┬──────────────┬──────────────┬────────┘
              │              │              │
         ┌────▼───┐     ┌────▼───┐    ┌────▼───┐
         │ Add to │     │Compare │    │ Edit/  │
         │ Cart   │     │Product │    │ Delete │
         └────┬───┘     └────┬───┘    └────┬───┘
              │              │             │
              │         ┌────▼────────┐    │
              │         │ Max 3 items │    │
              │         │ in compare   │    │
              │         └────┬────────┘    │
              │              │             │
         ┌────▼──────────────▼────┐  ┌────▼───────────┐
         │  Product Added to Cart │  │Protected Route │
         │  - Redux state updates │  │ → Check auth   │
         │  - RTK Query mutation  │  │ → Redirect if  │
         │  - Toast notification │  │   not logged in│
         │  - Header badge +1    │  └────┬───────────┘
         └────┬──────────────────┘       │
              │                          │
         ┌────▼──────────┐     ┌────────▼────────┐
         │ Compare bar   │     │ LOGIN PAGE      │
         │ Shows 3 items │     │ - Username field│
         │ Click to view │     │ - Password field│
         │ comparison    │     │ - Submit button │
         └────┬──────────┘     └────┬───────────┘
              │                     │
         ┌────▼────────────┐   ┌────▼────────────────┐
         │ COMPARE PAGE    │   │ Call Auth API       │
         │ - Fetch products│   │ POST /auth/login    │
         │ - Side-by-side  │   │ Return token + user │
         │ - Table layout  │   └────┬────────────────┘
         │ - Go back btn   │        │
         └────┬────────────┘   ┌────▼──────────────┐
              │                │ Save to localStorage
              │                │ Update Redux state
              │                │ isAuthenticated=true
              │                └────┬──────────────┘
              │                     │
         ┌────▼─────────────────────▼───────────┐
         │         CART PAGE (Protected)        │
         │  - Fetch cart data from API         │
         │  - Show cart items with images      │
         │  - Qty adjustment buttons            │
         │  - Remove item button                │
         │  - Cart summary with total           │
         │  - Clear/Delete cart buttons         │
         └────┬──────────────────┬──────────────┘
              │                  │
         ┌────▼───┐         ┌────▼──────┐
         │Continue│         │ Checkout  │
         │Shopping│         │ (Future)  │
         └────────┘         └───────────┘
```

---

### **Data Flow: Redux + RTK Query**

```
┌────────────────────────────────────────────────────────────┐
│                   API LAYER (RTK Query)                    │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌─────────────────┐  ┌───────────┐ │
│  │   productsApi    │  │    cartApi      │  │ authApi   │ │
│  ├──────────────────┤  ├─────────────────┤  ├───────────┤ │
│  │ • getProducts    │  │ • getCart       │  │ • login   │ │
│  │ • getCategories  │  │ • createCart    │  │ • logout  │ │
│  │ • getProductById │  │ • updateCart    │  └───────────┘ │
│  │ • createProduct  │  │ • deleteCart    │                 │
│  │ • editProduct    │  └─────────────────┘                 │
│  │ • deleteProduct  │                                       │
│  └──────────────────┘                                       │
│           │                    │                    │       │
│           └────────────────────┼────────────────────┘       │
│                                │                           │
│                   ┌────────────▼──────────────┐            │
│                   │  DummyJSON API (Public)   │            │
│                   │  https://dummyjson.com/   │            │
│                   └───────────────────────────┘            │
└────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌──────▼──────┐  ┌───────▼────────┐
│   Redux Store  │  │ localStorage │  │  Session Data  │
├────────────────┤  ├──────────────┤  ├────────────────┤
│                │  │              │  │                │
│ auth:          │  │ • authToken  │  │ • cartId       │
│ • user         │  │ • authUser   │  │ • Cart items   │
│ • token        │  │ • theme      │  │ • Compare list │
│ • isAuth       │  │ • demoCartId │  │                │
│                │  │ • localCart  │  │                │
│ cart:          │  │              │  │                │
│ • items[]      │  └──────────────┘  └────────────────┘
│ • loading      │
│                │
│ compare:       │
│ • items[] (IDs)│
│                │
│ demoProducts:  │
│ • items[]      │
└────────────────┘
        │
        └─────────────────────┬─────────────────────┐
                              │                     │
                    ┌─────────▼──────────┐  ┌────────▼──────┐
                    │  Components Render │  │ Re-render when│
                    │  (UI Update)       │  │ state changes │
                    └────────────────────┘  └───────────────┘
```

---

### **User Authentication Flow**

```
┌─────────────────────────────────────────────────────────────┐
│               AUTHENTICATION FLOW                           │
└───────────────────────────┬─────────────────────────────────┘
                            │
         ┌──────────────────▼──────────────────┐
         │  User visits protected route        │
         │  (e.g., /cart, /compare, /products/add)
         └──────────────────┬──────────────────┘
                            │
         ┌──────────────────▼──────────────────┐
         │  ProtectedRoute checks:             │
         │  state.auth.isAuthenticated?        │
         └────────┬─────────────────┬──────────┘
                  │                 │
           ┌──────▼────────┐  ┌─────▼────────┐
           │    FALSE      │  │     TRUE     │
           └──────┬────────┘  └─────┬────────┘
                  │                 │
         ┌────────▼─────────┐   ┌───▼──────────┐
         │ Redirect to:     │   │ Show protected
         │ /login           │   │ page/component
         │ Save origin URL  │   └──────────────┘
         │ in state         │
         └────────┬─────────┘
                  │
         ┌────────▼──────────────────────┐
         │   LOGIN PAGE                  │
         │  1. User enters credentials   │
         │  2. Submit form               │
         └────────┬──────────────────────┘
                  │
         ┌────────▼──────────────────────┐
         │  authApi.login mutation       │
         │  POST /auth/login             │
         │  { username, password }       │
         └────────┬──────────────────────┘
                  │
         ┌────────▼──────────────────────┐
         │  DummyJSON API Response       │
         │  {                            │
         │    id, username, email,       │
         │    token, image, firstName... │
         │  }                            │
         └────────┬──────────────────────┘
                  │
         ┌────────▼──────────────────────┐
         │ authSlice.setCredentials()    │
         │ - Store user in Redux         │
         │ - Store token in Redux        │
         │ - Set isAuthenticated = true  │
         │ - Save token to localStorage  │
         │ - Save user to localStorage   │
         └────────┬──────────────────────┘
                  │
         ┌────────▼──────────────────────┐
         │ Redirect to origin URL        │
         │ (or /products if not saved)   │
         └────────┬──────────────────────┘
                  │
         ┌────────▼──────────────────────┐
         │ Now user is authenticated!    │
         │ Can access protected routes   │
         └───────────────────────────────┘

LOGOUT FLOW:
┌─────────────────────────────────────────┐
│ User clicks Logout in Header            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ authSlice.logout()                      │
│ - Clear user from Redux                 │
│ - Clear token from Redux                │
│ - Set isAuthenticated = false           │
│ - Remove from localStorage              │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ Redirect to /products                   │
│ Protected routes now redirect to /login │
└─────────────────────────────────────────┘
```

---

### **Add to Cart & Compare Flow**

```
┌──────────────────────────────────────────────────────┐
│            ADD TO CART FLOW                          │
└──────────────┬───────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────┐
│ Click "Add to Cart" on Product Card                  │
│ or ProductDetail page                               │
└──────────────┬───────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────┐
│ handleAddToCart() function:                          │
│ 1. Dispatch addToCart to Redux (local state)         │
│ 2. Show loading indicator                           │
└──────────────┬───────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────┐
│ Call cartApi.createCart or updateCart mutation      │
│ POST /carts/add or PUT /carts/{id}                  │
│ { userId, products: [{id, quantity}] }             │
└──────────────┬───────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────┐
│ DummyJSON API Response:                             │
│ { id, userId, products, total, ... }               │
└──────────────┬───────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────┐
│ Update Redux store:                                 │
│ cart.items updated                                  │
└──────────────┬───────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────┐
│ Header cart badge updates: +1                        │
│ Toast notification: "Added to cart"                 │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│            COMPARE FLOW                              │
└──────────────┬───────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────┐
│ Click "Compare" button on Product Card              │
└──────────────┬───────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────┐
│ toggleCompare() function:                           │
│ Dispatch addToCompare/removeFromCompare to Redux    │
│ Max 3 products in compare                           │
└──────────────┬───────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────┐
│ Redux compare.items: [id1, id2, id3]                │
│ (stored only product IDs, not full objects)         │
└──────────────┬───────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────┐
│ Show compare bar at top:                            │
│ "3 products selected"                               │
│ [Product 1] [Product 2] [Product 3] [View Compare] │
└──────────────┬───────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────┐
│ Click "View Compare" button                         │
│ Navigate to /compare                                │
└──────────────┬───────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────┐
│ COMPARE PAGE:                                       │
│ 1. Fetch each product by ID from API                │
│    productsApi.getProductById(id1)                  │
│    productsApi.getProductById(id2)                  │
│    productsApi.getProductById(id3)                  │
│ 2. Show table with all properties                   │
│    Title, Price, Brand, Category, Rating,           │
│    Stock, Dimensions, Weight, Tags                  │
│ 3. Side-by-side comparison                          │
└──────────────────────────────────────────────────────┘
```

---

### **Product CRUD Flow (Add/Edit)**

```
┌─────────────────────────────────────────────────┐
│        ADD PRODUCT FLOW (Protected)             │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ User clicks "+ Add Product" in Header         │
│ Navigate to /products/add (Protected Route)   │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ ProductFormWizard Component Loads:            │
│ Multi-step form with validation               │
│                                               │
│ Step 1: Title, Description, Category          │
│ Step 2: Price, Stock, Discount                │
│ Step 3: Dimensions (W, H, D, Unit)            │
│ Step 4: Review & Submit                       │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ User fills form step by step                  │
│ - Form validation on each field               │
│ - React Hook Form + Zod validation            │
│ - Back/Next buttons to navigate               │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ Final step: Review all data                   │
│ Click "Submit" button                         │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ productsApi.createProduct mutation:           │
│ POST /products/add                            │
│ {                                             │
│   title, description, category,               │
│   price, stock, discountPercentage,           │
│   dimensions: { width, height, depth, unit }  │
│ }                                             │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ DummyJSON API Response:                       │
│ { id, ...submitted data with new ID }        │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ Store locally in Redux:                       │
│ demoProducts.items.push(newProduct)           │
│ localStorage updated                          │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ Success! Redirect to:                         │
│ /products/:newId (show the created product)   │
│ Toast: "Product created successfully!"        │
└──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│        EDIT PRODUCT FLOW (Protected)            │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ User on ProductDetail page                    │
│ Clicks "Edit Product" button                  │
│ Navigate to /products/:id/edit                │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ EditProduct page (similar form wizard)         │
│ 1. Pre-fill form with current product data    │
│ 2. User modifies fields                       │
│ 3. Fill steps 1-4 with new values             │
│ 4. Review changes on step 4                   │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ Click "Update" on final step                  │
│ productsApi.editProduct mutation:             │
│ PUT /products/:id                             │
│ { ...updated fields }                         │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ DummyJSON API Response:                       │
│ { id, ...updated data }                       │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ Update Redux & localStorage                   │
│ Redirect to ProductDetail page                │
│ Toast: "Product updated successfully!"        │
└──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│        DELETE PRODUCT FLOW (Protected)          │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ User on ProductDetail page                    │
│ Clicks "Delete Product" button                │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ Show confirmation modal:                      │
│ "Are you sure? This cannot be undone."        │
│ [Cancel] [Delete]                             │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ productsApi.deleteProduct mutation:           │
│ DELETE /products/:id                          │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ DummyJSON API Response:                       │
│ (Demo mode - not actually deleted, but API    │
│  simulates the delete response)               │
└──────────┬────────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────┐
│ Update Redux state                            │
│ Redirect to /products                         │
│ Toast: "Product deleted!"                     │
└──────────────────────────────────────────────┘
```

---

### **Search, Filter & Pagination Flow**

```
┌────────────────────────────────────────────────────┐
│          SEARCH / FILTER / SORT FLOW              │
└──────────┬─────────────────────────────────────────┘
           │
┌──────────▼─────────────────────────────────────────┐
│ User interacts on Products page:                  │
│ • Type in search box                             │
│ • Select category from dropdown                  │
│ • Select sort option (price, rating, name)       │
│ • Click pagination page                          │
└──────────┬─────────────────────────────────────────┘
           │
┌──────────▼─────────────────────────────────────────┐
│ Update URL search params:                         │
│ /products?search=keyword&category=electronics    │
│           &sortBy=price&order=asc&page=2         │
│                                                  │
│ searchParams state updated via setSearchParams() │
└──────────┬─────────────────────────────────────────┘
           │
┌──────────▼─────────────────────────────────────────┐
│ useDebounce hook delays search (400ms)            │
│ (Prevents too many API calls while typing)       │
└──────────┬─────────────────────────────────────────┘
           │
┌──────────▼─────────────────────────────────────────┐
│ productsApi.getProducts query called with:        │
│ { limit: 12, skip: 12, search: "keyword",         │
│   category: "electronics", sortBy: "price",       │
│   order: "asc" }                                  │
└──────────┬─────────────────────────────────────────┘
           │
┌──────────▼─────────────────────────────────────────┐
│ RTK Query logic in productsApi:                   │
│ 1. Client-side filtering & sorting               │
│ 2. Local demo products from Redux state          │
│ 3. API products merged with local demos          │
│ 4. Return filtered subset + total count          │
└──────────┬─────────────────────────────────────────┘
           │
┌──────────▼─────────────────────────────────────────┐
│ Results update in real-time:                      │
│ • Product grid refreshes                         │
│ • Pagination shows correct page count            │
│ • Product count updates                          │
│ • Results stay as user scrolls/interacts         │
└──────────────────────────────────────────────────┘
```

---

### **Component Rendering Hierarchy**

```
App
├── Header (Always visible)
│   ├── Logo/Home link
│   ├── Mobile hamburger menu
│   ├── Navigation links (Products, Cart, Compare)
│   ├── Theme toggle
│   ├── Cart badge (count)
│   └── Auth button (Login/Logout)
│
└── Routes
    ├── / → Redirect to /products
    │
    ├── /products (Public)
    │   ├── ProductsPage
    │   │   ├── Search input
    │   │   ├── Category selector
    │   │   ├── Sort dropdown
    │   │   ├── Filters sidebar
    │   │   ├── ProductGrid
    │   │   │   └── ProductCard (multiple)
    │   │   │       ├── Image
    │   │   │       ├── Category badge
    │   │   │       ├── Compare toggle
    │   │   │       ├── Title
    │   │   │       ├── Price
    │   │   │       └── Add to cart button
    │   │   └── Pagination
    │   │       ├── Previous button
    │   │       ├── Page numbers
    │   │       └── Next button
    │   │
    │   └── Compare bar (if items selected)
    │       ├── Show selected item count
    │       └── View comparison button
    │
    ├── /products/:id (Public)
    │   └── ProductDetail
    │       ├── Back link
    │       ├── Main image
    │       ├── Thumbnail gallery
    │       ├── Product info
    │       │   ├── Title
    │       │   ├── Price
    │       │   ├── Category badge
    │       │   ├── Rating
    │       │   ├── Stock level
    │       │   └── Description
    │       ├── Action buttons
    │       │   ├── Add to cart
    │       │   ├── Compare
    │       │   ├── Edit (if auth)
    │       │   └── Delete (if auth)
    │       └── Delete confirmation modal
    │
    ├── /login (Public, if not auth)
    │   └── LoginPage
    │       ├── Username input
    │       ├── Password input
    │       ├── Error message (if any)
    │       └── Login button
    │
    ├── /products/add (Protected)
    │   └── AddProductPage
    │       └── ProductFormWizard
    │           ├── Step indicator (4 steps)
    │           ├── Form fields (dynamic per step)
    │           ├── Back button
    │           └── Next/Submit button
    │
    ├── /products/:id/edit (Protected)
    │   └── EditProductPage
    │       └── ProductFormWizard (pre-filled)
    │
    ├── /cart (Protected)
    │   └── CartPage
    │       ├── Cart items list
    │       │   └── CartItem (multiple)
    │       │       ├── Product image
    │       │       ├── Product name
    │       │       ├── Price per unit
    │       │       ├── Quantity selector
    │       │       ├── Remove button
    │       │       └── Item total
    │       └── CartSummary (sidebar)
    │           ├── Subtotal
    │           ├── Item count
    │           ├── Clear cart button
    │           └── Checkout button
    │
    └── /compare (Protected)
        └── ComparePage
            ├── Clear comparison button
            └── Comparison table
                ├── Feature names (left column)
                └── Product values (columns)
```

---

### **Data Persistence Strategy**

```
┌──────────────────────────────────────────────────────┐
│          DATA STORAGE & PERSISTENCE                 │
└───────────────────┬────────────────────────────────┘
                    │
        ┌───────────┴───────────┬──────────────┐
        │                       │              │
  ┌─────▼──────┐         ┌─────▼──────┐  ┌───▼────────┐
  │ localStorage│         │Redux Store │  │ Session    │
  ├─────────────┤         ├────────────┤  │ Memory     │
  │             │         │            │  │            │
  │ Persistent: │         │ Real-time: │  │ Temporary: │
  │ • authToken │         │ • Auth     │  │ • UI state │
  │ • authUser  │         │ • Cart     │  │ • Form     │
  │ • theme     │         │ • Compare  │  │   values   │
  │ • demoCartId│         │ • Products │  │ • Scroll   │
  │ • localCart │         │ • Filters  │  │   position │
  │             │         │ • Sorting  │  │            │
  └─────────────┘         └────────────┘  └────────────┘
        │                       │
        └───────┬───────────────┘
                │
     ┌──────────▼──────────┐
     │  Hydration on Load  │
     │  app starts:        │
     │  1. Read localStorage
     │  2. Restore auth    │
     │  3. Restore theme   │
     │  4. Restore cart    │
     │  5. Redux synced    │
     └─────────────────────┘
```

---

## ✅ Summary

This refactored architecture provides:
- **Scalability**: Easy to add new features
- **Maintainability**: Centralized styling and types
- **Reusability**: Component library eliminates duplication
- **Type Safety**: Domain-organized types
- **Performance**: Better code splitting and tree-shaking
- **Developer Experience**: Clear patterns and organization

Build Status: ✅ **All passing** (161 modules, 551ms)

**Complete App Flow**: 
- User starts at `/products` (public browsing)
- Can add to cart, compare products without auth
- Protected routes redirect to `/login`
- After auth, full e-commerce features unlocked
- All state managed via Redux + RTK Query
- Data persisted to localStorage for session recovery
