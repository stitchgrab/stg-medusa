# Utility Functions

This directory contains utility functions for common operations in the storefront.

## Filter Products (`filter-products.ts`)

Utility functions for filtering products by categories, price and options.

### Functions

#### `filterProductsBySubcategories(products, subcategoryFilter)`
Filters products by subcategory IDs.

**Parameters:**
- `products`: Array of `HttpTypes.StoreProduct`
- `subcategoryFilter`: Object with `subcategories` array containing subcategory IDs

**Returns:** Filtered array of products

**Example:**
```typescript
import { filterProductsBySubcategories } from "@lib/util/filter-products"

const filteredProducts = filterProductsBySubcategories(products, {
  subcategories: ["subcat-1", "subcat-2", "subcat-3"]
})
```

#### `filterProductsByPrice(products, priceFilter)`
Filters products by price range.

**Parameters:**
- `products`: Array of `HttpTypes.StoreProduct`
- `priceFilter`: Object with optional `minPrice` and `maxPrice` properties

**Returns:** Filtered array of products

**Example:**
```typescript
import { filterProductsByPrice } from "@lib/util/filter-products"

const filteredProducts = filterProductsByPrice(products, {
  minPrice: 10,
  maxPrice: 50
})
```

#### `filterProductsByOptions(products, optionFilter)`
Filters products by product options (e.g., size, color).

**Parameters:**
- `products`: Array of `HttpTypes.StoreProduct`
- `optionFilter`: Object where keys are option titles and values are arrays of acceptable values

**Returns:** Filtered array of products

**Example:**
```typescript
import { filterProductsByOptions } from "@lib/util/filter-products"

const filteredProducts = filterProductsByOptions(products, {
  "Size": ["S", "M", "L"],
  "Color": ["Red", "Blue"]
})
```

#### `filterProducts(products, subcategoryFilter?, priceFilter?, optionFilter?)`
Combines subcategory, price and option filtering.

**Parameters:**
- `products`: Array of `HttpTypes.StoreProduct`
- `subcategoryFilter`: Optional subcategory filter object
- `priceFilter`: Optional price filter object
- `optionFilter`: Optional option filter object

**Returns:** Filtered array of products

**Example:**
```typescript
import { filterProducts } from "@lib/util/filter-products"

const filteredProducts = filterProducts(
  products,
  { subcategories: ["subcat-1"] },
  { minPrice: 10, maxPrice: 50 },
  { "Size": ["S", "M"] }
)
```

#### `parseSearchParamsToFilters(searchParams)`
Parses URL search parameters into filter objects.

**Parameters:**
- `searchParams`: Object with URL search parameters

**Returns:** Object with `subcategoryFilter`, `priceFilter` and `optionFilter` properties

**Example:**
```typescript
import { parseSearchParamsToFilters } from "@lib/util/filter-products"

const { subcategoryFilter, priceFilter, optionFilter } = parseSearchParamsToFilters({
  subcategories: ["subcat-1", "subcat-2"],
  minPrice: "10",
  maxPrice: "50",
  opt_Size: ["S", "M"],
  opt_Color: "Red"
})
```

### Usage in Templates

```typescript
import { filterProducts, parseSearchParamsToFilters } from "@lib/util/filter-products"

// In your template component
const params = await searchParams
const filteredProducts = params ? (() => {
  const { subcategoryFilter, priceFilter, optionFilter } = parseSearchParamsToFilters(params)
  return filterProducts(allProducts, subcategoryFilter, priceFilter, optionFilter)
})() : allProducts
```

## Sort Products (`sort-products.ts`)

Utility function for sorting products by various criteria.

### Functions

#### `sortProducts(products, sortBy)`
Sorts products by the specified criteria.

**Parameters:**
- `products`: Array of `HttpTypes.StoreProduct`
- `sortBy`: Sort option ("price_asc", "price_desc", "created_at")

**Returns:** Sorted array of products

**Example:**
```typescript
import { sortProducts } from "@lib/util/sort-products"

const sortedProducts = sortProducts(products, "price_asc")
```

## Get Product Price (`get-product-price.ts`)

Utility function for extracting price information from products.

### Functions

#### `getProductPrice({ product, variantId? })`
Gets price information for a product.

**Parameters:**
- `product`: `HttpTypes.StoreProduct`
- `variantId`: Optional variant ID

**Returns:** Object with `cheapestPrice` and `variantPrice` properties

**Example:**
```typescript
import { getProductPrice } from "@lib/util/get-product-price"

const { cheapestPrice, variantPrice } = getProductPrice({
  product: myProduct,
  variantId: "variant-123"
})
``` 