"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selected, setSelected] = useState(0)

  if (!images || images.length === 0) return null

  return (
    <div className="flex gap-6 items-start">
      {/* Thumbnails */}
      <div className="flex flex-col gap-3">
        {images.map((image, idx) => (
          <button
            key={image.id}
            onClick={() => setSelected(idx)}
            className={`relative w-16 h-16 rounded border overflow-hidden focus:outline-none transition-all ${selected === idx ? 'border-gray-900 ring-2 ring-gray-900' : 'border-gray-200'}`}
            aria-label={`Show image ${idx + 1}`}
            tabIndex={0}
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${idx + 1}`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
      {/* Main Image */}
      <div className="relative aspect-square w-full max-w-[600px] rounded-lg overflow-hidden flex items-center justify-center">
        <Image
          src={images[selected].url}
          alt={`Product image ${selected + 1}`}
          fill
          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 400px, 600px"
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}

export default ImageGallery
