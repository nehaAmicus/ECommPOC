# EcommPOC - React + TypeScript eCommerce Project

This project is an e-commerce proof of concept built with a real public API instead of fake/mock data. It uses React, TypeScript, Redux Toolkit, RTK Query, React Router, and Tailwind CSS.

The goal is to create a clean foundation for a real-world storefront that can scale as features grow.

---

## What this project is

This app is a starter storefront for browsing products from the public DummyJSON API.

We are not using mock product data. Instead, we are calling the actual API at:

- https://dummyjson.com

This gives us a real backend-like experience while keeping the app clean and production-ready in structure.

---

## Why we used these tools

### React
React helps us build the UI in small components.

Why use it:
- component-based structure
- easier to scale
- widely used in real product apps

### TypeScript
TypeScript adds strict typing so we catch mistakes early.

Why use it:
- fewer runtime bugs
- better code editor support
- easier to maintain as the project grows

### Redux Toolkit
Redux Toolkit gives us a predictable global state layer.

Why use it:
- central place for app data
- easier state management for auth and compare features
- works well with RTK Query

### RTK Query
RTK Query is used for API communication.

Why use it:
- keeps API logic in one place
- handles caching, loading, and errors
- avoids writing repetitive fetch logic
- makes API calls consistent and easier to test later

### React Router
React Router handles page navigation.

Why use it:
- separate pages such as products, detail, login, cart
- route protection for user-only pages
- clean navigation structure

### Tailwind CSS
Tailwind helps us style the app quickly using utility classes.

Why use it:
- fast UI development
- maintains consistency
- easy to build modern interfaces

### React Hook Form
This is included in the project setup and is useful when we build forms for login, add product, and edit product.

Why use it:
- cleaner form management
- easy validation
- reduces boilerplate code

### React Testing Library
This is included for future UI testing.

Why use it:
- tests real user behavior
- helps ensure the app keeps working as features grow

---

## Step-by-step: what we did and why

### 1) Created the React app
We created a Vite React + TypeScript project.

Why:
- fast setup
- modern React environment
- strong TypeScript support

### 2) Installed the necessary packages
We installed:
- @reduxjs/toolkit
- react-redux
- react-router-dom
- react-hook-form
- tailwindcss
- @tailwindcss/vite

Why:
- state management
- routing
- forms
- styling

### 3) Enabled strict TypeScript
We updated the TypeScript config to use strict mode.

Why:
- better type safety
- fewer unpredictable bugs
- easier refactoring later

### 4) Set up Tailwind
Tailwind was added to Vite and imported into the app stylesheet.

Why:
- build modern UI without writing large custom CSS files
- keeps styling consistent and scalable

### 5) Created the folder structure
We structured the project as:

- api/
- components/
- pages/
- store/
- routes/
- types/
- hooks/

Why:
- easier to find files
- better project scaling
- follows a clean feature-based layout

### 6) Built the API layer using RTK Query
We created files such as:

- src/api/productsApi.ts
- src/api/cartApi.ts
- src/api/authApi.ts

Why:
- all backend requests go through RTK Query
- API logic is isolated from UI
- loading, error, and caching behavior is handled centrally

### 7) Built the Redux store
We created:

- src/store/store.ts
- src/store/authSlice.ts
- src/store/compareSlice.ts

Why:
- global state like auth and compare list needs a single source of truth
- keeps UI state and API cache organized

### 8) Added page placeholders and app shell
We created base pages and a header, plus the main router setup.

Why:
- gives the project a real app structure before business features are added
- helps us prepare the routes for future screens

### 9) Added route protection
We created a ProtectedRoute component.

Why:
- pages like add/edit product should only be available to authenticated users
- prevents unauthorized access in a clean way

### 10) Added live product data integration
We connected the Products page to the DummyJSON products API.

Why:
- this is the first real feature of the app
- confirms the app works with live data instead of fake data
- proves the API layer is working correctly

### 11) Added product detail fetching
We added a ProductDetail page that reads the route param and fetches the selected product.

Why:
- users can open a product and see its details
- demonstrates dynamic routing and real data usage

### 12) Added URL-driven search and pagination
We updated the Products page so that the search text and current page are stored directly in the browser URL.

Example URL:

```text
/products?search=phone&page=2
```

Why:
- refresh keeps the current page and search value
- browser back/forward works naturally
- the app shares a direct, readable state in the URL
- no duplicate search state is kept in Redux

This was implemented with:
- `useSearchParams` from React Router
- a debounced search delay of 400ms
- `limit` and `skip` passed to the API
- `total` from DummyJSON used to calculate page count
- page reset to 1 whenever the search changes

### 13) Added category filtering
We added category-based filtering to the product list.

Why:
- category filters are a standard e-commerce pattern
- they improve product discovery
- they reduce the number of results shown at once
- filtering works naturally with search, sorting, and pagination

Implementation details:
- categories are fetched from the DummyJSON public categories API
- category state is also stored in the URL
- selecting a category updates the query string and resets to page 1
- the query string stays shareable and refresh-safe
- the category filter is passed to the backend as part of the API request

Example URL:

```text
/products?category=smartphones
```

### 14) Added sorting by product fields
We added sorting to the product listing so the user can sort by price, rating, or product name.

Supported options:
- Price low to high
- Price high to low
- Rating high to low
- Rating low to high
- Name A-Z
- Name Z-A

Why:
- users can easily reorder products by value or popularity
- sorting works naturally with search and pagination
- it matches common e-commerce browsing behavior
- it reflects real shopping flows where users compare price and rating quickly

Implementation details:
- sort choice is stored in the URL
- `sortBy` and `order` are passed to DummyJSON
- page resets to 1 when sorting changes
- search and sorting remain active together
- category filtering and sorting can be combined without losing state
- the list still works correctly with pagination

Example URL:

```text
/products?search=phone&category=smartphones&sortBy=price&order=asc&page=1
```

### 15) Added a real authentication flow with DummyJSON
We implemented login using the real DummyJSON auth API.

Why:
- real authentication is required for protected pages like cart and compare
- demoing a fake user would not match the real backend contract
- this keeps the app realistic and closer to production behavior

Implementation details:
- `authApi.ts` defines the login mutation and current-user query
- the request uses `POST https://dummyjson.com/auth/login`
- the API requires `username` and `password`
- a token is returned after a successful login
- the token is stored in localStorage for this POC
- the current user is fetched after login and stored in Redux
- protected routes check the auth state before allowing access

This is intentionally separated from UI logic so the Login page stays focused on form behavior and navigation, while the API and Redux logic handle the actual auth flow.

### 16) Implemented route protection
We added a central ProtectedRoute pattern.

Why:
- the app should enforce access rules in one place
- pages like add/edit product, cart, and compare should not duplicate auth checks
- it keeps security and routing logic predictable

Behavior:
- if a user is not authenticated and tries to access a protected route, redirect to /login
- preserve the original requested URL as router state
- after login, redirect back to the originally requested page
- public pages remain accessible without auth

This is the right architecture for a real SPA because app access rules live at the route boundary rather than being repeated in each page component.

### 17) Implemented product comparison
We added a product comparison flow that keeps the Redux state lean and uses the live DummyJSON product API for detail fetches.

Why:
- users often want to compare multiple products side by side
- comparison should be fast and lightweight
- the app should not duplicate full product objects in Redux

Implementation details:
- each product card includes a Compare toggle
- the compare slice stores only product IDs in an array
- a maximum of 3 products can be selected at one time
- selected products are shown in a comparison bar above the list
- clicking the bar opens the /compare route
- the compare page fetches the selected product details using RTK Query
- the comparison table displays product title, price, brand, category, rating, stock, dimensions, weight, and tags side by side

This keeps the store small and avoids duplicating the full product payload in app state while still making comparison easy and fast.

### 18) Added product edit and delete flows
We extended the product detail experience to support product updates and simulated removals.

Why:
- real storefronts need both editing and deletion actions
- the app should allow users to update an existing product without duplicating logic across pages
- DummyJSON simulates delete/update behavior, so the UI must explain the limitation clearly

Implementation details:
- the Edit Product route is /products/:id/edit
- the form reuses the same multi-step ProductFormWizard used by Add Product
- the form is prefilled with the existing product data before editing
- submit calls `PUT https://dummyjson.com/products/:id`
- the detail page includes an Edit Product button directly on the product screen
- the Delete Product action opens a confirmation modal before sending the delete request
- delete requests use `DELETE https://dummyjson.com/products/:id`
- the app handles loading, error, and cache invalidation states
- after deletion, the user is redirected back to the products list with a message explaining that DummyJSON only simulates deletion and does not permanently remove the item from the demo dataset

This gives the POC a realistic product management flow without assuming the demo API persists changes.

### 19) Added the Add Product action to the Products page
We added a primary action button near the Products heading:

```text
+ Add Product
```

Why:
- it gives users a clear entry point for creating a product
- it keeps the action near the product list where users naturally browse and discover items
- it follows a standard e-commerce flow where product creation is accessible from the listing screen

Behavior:
- if the user is already authenticated, clicking the button navigates to /products/add
- if the user is not authenticated, clicking the button navigates to /login
- the login redirect preserves the original protected destination and sends the user back there after auth succeeds

This keeps the listing page functional while making product creation accessible without duplicating auth logic in the page itself.

### 19) Built the multi-step Add Product form
We created a multi-step product creation flow using React Hook Form and Zod.

Why:
- forms with many fields are easier to understand when split into steps
- each step can validate its own fields before moving forward
- users can keep values intact while navigating between steps
- the UX feels cleaner and more guided than a single giant form

Implementation details:
- a single shared form object keeps values across steps
- each step has its own validation rules using Zod
- navigation only advances when the current step passes validation
- the submit button is disabled while the product is being created
- duplicate submission is prevented by checking the request state before sending

The required step structure is:
1. Category
2. Tags + Brand
3. Dimensions
4. Price

Every step stores its values in the same form state, so the user does not lose progress when moving backward or forward.

### 20) Connected the form to the real DummyJSON product creation API
The form submits to the real DummyJSON endpoint:

```text
POST https://dummyjson.com/products/add
```

Why:
- this matches the project requirement to use the real public API
- it demonstrates how a production-like create flow behaves in a frontend app
- the app can show loading, success, and error states without custom mock logic

Important note:
DummyJSON simulates product creation and does not persist the product server-side. The app handles this clearly in the UI by showing a success message that explains the product was created in demo mode and will not survive a browser refresh.

This is a realistic behavior for a demo API and should be treated as a simulation, not a real backend persistence layer.

### 21) Implemented the cart flow using DummyJSON cart APIs
We added a real cart experience based on DummyJSON cart endpoints and kept the cart state in RTK Query instead of duplicating the full cart in Redux.

Additional UX details:
- a small success toast appears when an item is added to the cart
- the header shows a live cart badge with the current item count
- cart items can be updated, removed, and cleared through the page actions
- the cart has an empty state and a clear/delete cart action in the summary area

Why:
- users need immediate visual confirmation when adding items
- the cart summary should stay visible and updated globally
- cart actions should feel native to a real storefront

Implementation details:
- the cart page uses a server-backed query and mutation pattern from RTK Query
- the badge count is derived from the live cart quantity and displayed in the header
- the app uses localStorage for the demo cart ID when the user is not logged in
- deleting the cart shows the demo-mode limitation without pretending the API permanently removes data

Why:
- cart data is server-backed and changes frequently
- the cart should live near the API layer for caching and mutation handling
- this keeps the Redux store lean and avoids duplicating server state unnecessarily
- the project follows the same pattern used throughout the app for products and auth

Implemented operations:
- Get cart: `GET https://dummyjson.com/carts/{id}`
- Add cart: `POST https://dummyjson.com/carts/add`
- Update cart: `PUT https://dummyjson.com/carts/{id}`
- Delete cart: `DELETE https://dummyjson.com/carts/{id}`
- Update item quantity: `PATCH https://dummyjson.com/carts/{id}`
- Remove item: `DELETE https://dummyjson.com/carts/{id}/products/{productId}`
- Clear cart: `PUT https://dummyjson.com/carts/{id}` with an empty product list

Implementation details:
- the cart API is defined in `src/api/cartApi.ts`
- cart state is managed by RTK Query rather than a separate Redux slice
- the cart page reads from the server-backed query and renders loading, empty-state, and error states
- quantity updates, item removal, and cart clearing all use mutation loading states
- the Add to Cart action on the product detail page creates the cart when needed and appends items when a cart already exists

This keeps the source of truth on the server while still giving the UI fast and predictable state updates through RTK Query.

### 22) Kept all API calls inside RTK Query
We intentionally kept network requests out of page components and UI code.

Why:
- separation of concerns
- easier maintenance
- predictable caching and loading states
- faster future changes when the API evolves

This is especially important for search, products, auth, cart, and compare-related requests.

---

## Project structure

The app currently includes:

### API layer
- src/api/productsApi.ts
- src/api/cartApi.ts
- src/api/authApi.ts

These define the endpoints and how data is fetched.

### Components
- src/components/Header.tsx
- src/components/ProductCard.tsx
- src/components/Pagination.tsx
- src/components/Modal.tsx

These are reusable UI building blocks.

### Pages
- src/pages/Products.tsx
- src/pages/ProductDetail.tsx
- src/pages/AddProduct.tsx
- src/pages/EditProduct.tsx
- src/pages/Cart.tsx
- src/pages/Compare.tsx
- src/pages/Login.tsx

These represent the screens of the app.

### Store
- src/store/store.ts
- src/store/authSlice.ts
- src/store/compareSlice.ts

This manages app-level state.

### Types
- src/types/index.ts

This holds the TypeScript domain models for Product, Cart, AuthUser, etc.

### Hooks
- src/hooks/useDebounce.ts
- src/hooks/useAppSelector.ts

These are reusable logic helpers.

### Routes
- src/routes/ProtectedRoute.tsx

This protects private routes.

---

## Where the API configuration lives

The API configuration lives in the RTK Query files under src/api.

For example:
- src/api/productsApi.ts contains the product endpoints and base URL
- src/api/cartApi.ts contains cart endpoints
- src/api/authApi.ts contains login/auth endpoints

This is the best place for API setup because:
- the app stays organized
- request logic is centralized
- queries and mutations are easy to reuse
- base URLs and headers remain easy to manage

---

## How the app currently works

When you open the project:

1. the app loads with a browser router
2. the default route redirects to /products
3. the Products page calls the real API using RTK Query
4. categories, search, sorting, and pagination are applied through the URL state
5. products are shown in cards with pagination and filter controls
6. users can select up to 3 products for comparison from the card or detail view
7. the compare bar helps users confirm their shortlist before opening /compare
8. clicking a product opens the product detail page
9. the detail page fetches the selected product by ID and includes add-to-cart, edit, delete, and compare actions
10. protected routes redirect unauthenticated users to the login page
11. after login, the user returns to the original protected destination
12. auth state is managed globally and shared across the app
13. cart actions are handled through RTK Query and reflected in the header badge
14. editing and deleting products use the real demo API but clearly communicate the simulation behavior of DummyJSON

---

## SEO implementation notes

### Files added and changed
- src/main.tsx
  - wrapped the app in HelmetProvider from react-helmet-async
- src/components/SEO.tsx
  - reusable component for page title, description, robots, canonical URL, Open Graph, and Twitter metadata
- src/pages/Products.tsx
  - added public SEO metadata for the catalog page
- src/pages/ProductDetail.tsx
  - added dynamic SEO metadata using the live product data after successful load
- src/pages/Login.tsx
  - added private page metadata with noindex,nofollow
- src/pages/Cart.tsx
  - added private cart metadata with noindex,nofollow
- src/pages/Compare.tsx
  - added private compare metadata with noindex,nofollow
- src/pages/AddProduct.tsx
  - added private add-product metadata with noindex,nofollow
- src/pages/EditProduct.tsx
  - added private edit-product metadata with noindex,nofollow
- index.html
  - kept the essential global viewport metadata and default HTML shell values

### Why react-helmet-async was used
react-helmet-async is a lightweight and simple solution for a React SPA POC. It lets the app update the document head on the client without introducing a large SEO framework, server rendering, or extra architectural complexity. This keeps the implementation easy to understand and aligns with the requirement to keep the project simple.

### Which pages are indexable
The public pages are intended to be indexed by search engines:
- Products

These pages use:
```html
<meta name="robots" content="index,follow">
```

### Which pages are noindex
The private pages should not be indexed:
- Login
- Cart
- Compare
- Add Product
- Edit Product

These pages use:
```html
<meta name="robots" content="noindex,nofollow">
```

This is important because these screens are part of the app experience and not intended to be public landing pages.

### How dynamic SEO works on Product Detail
The Product Detail page pulls the live product from the DummyJSON API and only renders the SEO tags after the product has successfully loaded. This prevents empty or stale metadata from appearing while the request is still in flight.

The component sets:
- title: Product Title | MyStore
- description: product.description
- image: product.thumbnail
- canonical URL: /products/:id

This allows the metadata to stay accurate for each product without creating a custom SEO service or storing SEO state in Redux.

### Limitations of SEO in a client-rendered React SPA
This is a client-rendered SPA, so SEO is limited in the same way as most React apps:
- search engines may not fully evaluate the page title and meta tags the same way they do with server-rendered or prerendered pages
- metadata is updated after JavaScript runs, so there is no server-side rendered HTML for crawlers to inspect on the first request
- this is acceptable for a small POC, but a production storefront would usually use SSR, SSG, or a framework-specific SEO approach for stronger crawlability
- canonical tags and social metadata are still useful for sharing and previews even when full SEO rendering is limited

This setup is intentionally simple and appropriate for a POC, while still handling the major metadata needs for the app.

---

## Commands to run

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Build the app:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

---

## Notes

- No mock product data is used.
- No MSW is used.
- All API calls are kept inside RTK Query endpoints.
- URL state is used for search, sorting, category, and pagination so the app remains shareable and refresh-safe.
- Auth logic is centralized through Redux + RTK Query instead of being duplicated in pages.
- Protected routes use a single route-level guard to enforce access rules.
- The architecture is ready for future features like cart, login, filters, comparisons, and admin product management.

This is the working storefront foundation for a real e-commerce frontend with backend-driven product browsing and auth-aware navigation.
