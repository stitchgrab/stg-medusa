import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Store | StitchGrab",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams
  const region = await getRegion(params.countryCode)
  const products = await listProducts({
    queryParams: {
      order: sortBy,
      limit: 100,
    },
    countryCode: params.countryCode,
  }).then(({ response }) => response.products)

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      region={region!}
      products={products}
    />
  )
}
