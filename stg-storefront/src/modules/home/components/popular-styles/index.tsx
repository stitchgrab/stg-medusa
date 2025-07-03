import { Button } from "@medusajs/ui"

const styles = [
  {
    name: "Hats",
    description: "Trendy headwear",
    image: "/images/styles/hats.jpg",
    href: "/store?categories=hats",
    icon: "🧢"
  },
  {
    name: "Dresses",
    description: "Elegant dresses",
    image: "/images/styles/dresses.jpg",
    href: "/store?categories=dresses",
    icon: "👗"
  },
  {
    name: "Hoodies",
    description: "Comfortable hoodies",
    image: "/images/styles/hoodies.jpg",
    href: "/store?categories=hoodies",
    icon: "🧥"
  },
  {
    name: "Sportswear",
    description: "Athletic wear",
    image: "/images/styles/sportswear.jpg",
    href: "/store?categories=sportswear",
    icon: "🏃‍♀️"
  }
]

const PopularStyles = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stitchgrab-primary mb-4">
            POPULAR STYLES
          </h2>
          <p className="text-lg text-stitchgrab-text-light max-w-2xl mx-auto">
            Fan-favorite styles: Shop popular looks delivered today
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {styles.map((style) => (
            <div
              key={style.name}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-stitchgrab-secondary to-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-4xl mb-3">
                    {style.icon}
                  </div>
                  <h3 className="font-bold text-stitchgrab-primary text-lg mb-1">
                    {style.name}
                  </h3>
                  <p className="text-sm text-stitchgrab-text-light">
                    {style.description}
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

export default PopularStyles 