import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActionsWrapper from "./product-actions-wrapper"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import Accordion from "@modules/products/components/product-tabs/accordion"
import { TruckFast } from "@medusajs/icons"

// Placeholder for reviews
const reviews = [
  {
    name: "Danny",
    date: "Aug 30, 2024",
    rating: 5,
    text: "I got the one's that are White and Light Pumice. They are very nice. I'll wear them to the gym and for casual wear. The quality is good on these. No messed up or missed stitching. The combination of regular leather and suede on the upper is eye-catching. Neutral colors that can be worn with pretty much anything.",
  },
  {
    name: "Dana Nowlon",
    date: "Aug 12, 2024",
    rating: 5,
    text: "Great!!! Love all my dunks!! I have many pairs of dunks!!",
  },
  {
    name: "Jamarl Manning",
    date: "Jul 23, 2024",
    rating: 5,
    text: "Comfortable and clean, love that they came with additional shoelaces",
  },
]

const ProductTemplate: React.FC<{
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  category?: any
}> = ({ product, region, countryCode, category }) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Breadcrumb logic
  const parent = category?.parent_category

  return (
    <>
      {/* Breadcrumb */}
      <div className="content-container pt-6 pb-2 text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        {parent && (
          <>
            <span className="mx-1">&gt;</span>
            <Link href={`/categories/${parent.handle}`} className="hover:underline">{parent.name}</Link>
          </>
        )}
        {category && (
          <>
            <span className="mx-1">&gt;</span>
            <Link href={`/categories/${category.handle}`} className="hover:underline">{category.name}</Link>
          </>
        )}
        <span className="mx-1">&gt;</span>
        <span className="text-gray-700 font-medium">{product.title}</span>
      </div>

      {/* Main Layout */}
      <div className="content-container flex flex-col lg:flex-row gap-12 py-6 relative">
        {/* Gallery */}
        <div className="w-full lg:w-[625px] flex-shrink-0">
          <ImageGallery images={product?.images || []} />
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Title, Price, Delivery */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-gray-900">{product.title}</h1>
          </div>
          {/* Product Actions (Options, Add to Bag, Wishlist) */}
          <div className="mt-2">
            <Suspense fallback={<div className="h-32 bg-gray-100 rounded animate-pulse" />}>
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>
          {/* Delivery Estimate */}
          <div className="flex items-center gap-2">
            <TruckFast />
            <span className="text-sm text-gray-500">Get it between <span className="font-medium">Monday, Sep 23</span> - <span className="font-medium">Wednesday, Sep 25</span></span>
          </div>
          {/* Accordion for Description & About the Brand */}
          <div className="mt-2">
            <Accordion type="multiple" defaultValue={["description"]} borderless chevronTrigger>
              <Accordion.Item value="description" title="Description">
                <p className="text-gray-700 leading-relaxed text-sm">{product.description || 'Designed for basketball but adopted by skaters, the Nike Dunk Low helped define sneaker culture. Now this mid-80s icon is an easy score for your closet. With ankle padding and durable rubber traction, these are a slam dunk whether you’re learning to skate or getting ready for school.'}</p>
              </Accordion.Item>
              <Accordion.Item value="brand" title="About the Brand" chevronTrigger>
                <p className="text-gray-700 text-sm leading-relaxed">Nike is a world-renowned brand known for its innovation and quality in sportswear and sneakers.</p>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="content-container mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Reviews (5)</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-semibold">5.0</span>
            <span className="text-blue-400">{'★'.repeat(5)}</span>
            <span className="text-gray-500 ml-2">Start</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {reviews.map((review, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800">{review.name}</span>
                <span className="text-gray-400 text-xs">- {review.date}</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-blue-400">{'★'.repeat(review.rating)}</span>
              </div>
              <p className="text-gray-700 text-base">{review.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <a href="#" className="text-blue-600 hover:underline font-medium">More Reviews</a>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="content-container my-4 small:my-16">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
