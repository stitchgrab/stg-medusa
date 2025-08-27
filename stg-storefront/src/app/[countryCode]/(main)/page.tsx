import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Categories from "@modules/home/components/categories"
import ShopSneakers from "@modules/home/components/shop-sneakers"
import BestSellers from "@modules/home/components/best-sellers"
import PopularStyles from "@modules/home/components/popular-styles"
import BrandSpotlight from "@modules/home/components/brand-spotlight"
import Swimwear from "@modules/home/components/swimwear"
import PopularBrands from "@modules/home/components/popular-brands"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "StitchGrab - Same Day Fashion Delivery",
  description:
    "A marketplace offering same-day fashion delivery from both local and major brands in South Florida.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  let region = null
  let collections: any[] = []

  try {
    region = await getRegion(countryCode)
  } catch (error) {
    console.warn('Failed to fetch region in Home page:', error)
  }

  try {
    const { collections: fetchedCollections } = await listCollections({
      fields: "id, handle, title",
    })
    collections = fetchedCollections || []
  } catch (error) {
    console.warn('Failed to fetch collections in Home page:', error)
  }

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <Categories />
      <ShopSneakers region={region} />
      <BestSellers />
      <PopularStyles />
      <BrandSpotlight />
      <Swimwear region={region} />
      <PopularBrands />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
