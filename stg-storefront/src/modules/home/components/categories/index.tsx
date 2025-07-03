import { Button } from "@medusajs/ui"

const categories = [
  {
    name: "Men",
    description: "Shop All Men",
    image: "/images/categories/men.jpg",
    href: "/store?categories=men",
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Women",
    description: "Shop All Women",
    image: "/images/categories/women.jpg",
    href: "/store?categories=women",
    color: "from-pink-500 to-pink-600"
  },
  {
    name: "Vintage",
    description: "Vintage Collection",
    image: "/images/categories/vintage.jpg",
    href: "/store?categories=vintage",
    color: "from-amber-500 to-amber-600"
  },
  {
    name: "Streetwear",
    description: "Streetwear Styles",
    image: "/images/categories/streetwear.jpg",
    href: "/store?categories=streetwear",
    color: "from-gray-500 to-gray-600"
  },
  {
    name: "Accessories",
    description: "Fashion Accessories",
    image: "/images/categories/accessories.jpg",
    href: "/store?categories=accessories",
    color: "from-purple-500 to-purple-600"
  },
  {
    name: "Denim",
    description: "Denim Collection",
    image: "/images/categories/denim.jpg",
    href: "/store?categories=denim",
    color: "from-indigo-500 to-indigo-600"
  }
]

const Categories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stitchgrab-primary mb-4">
            SHOP BY CATEGORIES
          </h2>
          <p className="text-lg text-stitchgrab-text-light max-w-2xl mx-auto">
            Discover our curated collections with same-day delivery
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-stitchgrab-secondary to-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-bold text-stitchgrab-primary text-lg mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-stitchgrab-text-light">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="small"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-stitchgrab-primary hover:bg-stitchgrab-accent hover:text-white"
                >
                  Shop Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories 