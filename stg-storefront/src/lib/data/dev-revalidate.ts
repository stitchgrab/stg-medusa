import { revalidateTag } from "next/cache"

export const devRevalidate = async (tag: string) => {
  if (process.env.NODE_ENV === "development") {
    // Force revalidation in development
    revalidateTag(tag)

    // Also revalidate related tags
    const relatedTags = [
      "carts",
      "customers",
      "orders",
      "products",
      "regions",
      "payment_providers"
    ]

    relatedTags.forEach(relatedTag => {
      if (relatedTag !== tag) {
        revalidateTag(relatedTag)
      }
    })
  }
}

export const forceRevalidateAll = async () => {
  if (process.env.NODE_ENV === "development") {
    const tags = [
      "carts",
      "customers",
      "orders",
      "products",
      "regions",
      "payment_providers",
      "fulfillment"
    ]

    tags.forEach(tag => revalidateTag(tag))
  }
} 