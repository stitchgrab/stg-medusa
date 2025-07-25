import { Button, Heading } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface BrandSpotlightProps {
  brandName?: string
  subtitle?: string
  description?: string
  heroImage?: string
  ctaText?: string
  ctaLink?: string
}

const BrandSpotlight = ({
  brandName = "KASIOPYA",
  subtitle = "& Other Sustainable Item",
  description = "Shop all swim & resort wear and have it delivered today",
  heroImage = "/images/brand-spotlight/kasiopya.png", // ✅ Available asset
  ctaText = "SHOP NOW",
  ctaLink = "/brands/kasiopya"
}: BrandSpotlightProps) => {
  return (
    <section className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={`${brandName} Brand Spotlight`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-start">
        <div className="content-container">
          <div className="max-w-2xl text-white">
            {/* "FEATURING" Label */}
            <p className="text-sm lg:text-base mb-4 tracking-widest font-medium">
              FEATURING
            </p>
            
            {/* Brand Name */}
            <Heading 
              level="h2" 
              className="text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 tracking-wider drop-shadow-lg"
            >
              {brandName}
            </Heading>
            
            {/* Subtitle */}
            <p className="text-lg lg:text-xl xl:text-2xl mb-6 italic font-light opacity-90 drop-shadow-md">
              {subtitle}
            </p>
            
            {/* CTA Button */}
            <LocalizedClientLink href={ctaLink}>
              <Button
                size="large"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-base font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105"
              >
                {ctaText} →
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Additional branding element - optional */}
      <div className="absolute bottom-8 right-8 hidden lg:block">
        <div className="text-white/70 text-sm font-medium">
          Same Day Delivery Available
        </div>
      </div>
    </section>
  )
}

export default BrandSpotlight 