import { Button } from "@medusajs/ui"

const brands = [
  {
    name: "New Balance",
    description: "Premium athletic footwear",
    image: "/images/brands/new-balance.jpg",
    href: "/store?brands=new-balance"
  },
  {
    name: "Soleman Fine footwear",
    description: "Handcrafted luxury shoes",
    image: "/images/brands/soleman.jpg",
    href: "/store?brands=soleman"
  },
  {
    name: "Trth Brand",
    description: "Sustainable fashion",
    image: "/images/brands/trth.jpg",
    href: "/store?brands=trth"
  },
  {
    name: "Na Lei Boho Clothier",
    description: "Bohemian style clothing",
    image: "/images/brands/na-lei.jpg",
    href: "/store?brands=na-lei"
  }
]

const BestSellers = () => {
  return (
    <section className="py-16 bg-stitchgrab-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stitchgrab-primary mb-4">
            BEST SELLERS
          </h2>
          <p className="text-lg text-stitchgrab-text-light max-w-2xl mx-auto">
            Top trends, no wait: best sellers delivered same day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stitchgrab-accent flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {brand.name.split(' ').map(word => word.charAt(0)).join('')}
                    </span>
                  </div>
                  <h3 className="font-bold text-stitchgrab-primary text-xl mb-2">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-stitchgrab-text-light mb-4">
                    {brand.description}
                  </p>
                  <Button
                    variant="secondary"
                    size="small"
                    className="bg-stitchgrab-accent text-white hover:bg-stitchgrab-accent/90"
                  >
                    Shop Brand
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="large"
            className="bg-stitchgrab-primary text-white hover:bg-stitchgrab-primary/90 px-8 py-4 text-lg font-semibold rounded-lg"
          >
            View All Brands
          </Button>
        </div>
      </div>
    </section>
  )
}

export default BestSellers 