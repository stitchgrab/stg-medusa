import { getCacheTag } from "./cookies"

export const getDevelopmentCacheOptions = async (tag: string) => {
  if (process.env.NODE_ENV === "development") {
    return {
      tags: [await getCacheTag(tag)],
      revalidate: 0, // Always revalidate in development
    }
  }

  return {
    tags: [await getCacheTag(tag)],
    revalidate: 60, // Cache for 1 minute in production
  }
}

export const getCacheStrategy = () => {
  if (process.env.NODE_ENV === "development") {
    return "no-cache" // Always fetch fresh data in development
  }

  return "force-cache" // Use cache in production
} 