import { Button } from "@medusajs/ui"

const swimwearItems = [
  {
    name: "Swim & Resort Wear Lady Faith",
    price: "$25.00",
    delivery: "Today",
    discount: "-20%",
    image: "/images/swimwear/lady-faith.jpg"
  },
  {
    name: "Super Marraine bracelet MYA BAY",
    price: "$50.00",
    delivery: "Today",
    discount: "-20%",
    image: "/images/swimwear/mya-bay.jpg"
  }
]

const Swimwear = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stitchgrab-primary mb-4">
            LET'S GET WAVY
          </h2>
          <p className="text-lg text-stitchgrab-text-light max-w-2xl mx-auto mb-8">
            Shop All Swim & Resort Wear And Have It Delivered Today
          </p>
          <Button
            size="large"
            className="bg-stitchgrab-accent hover:bg-stitchgrab-accent/90 text-white px-8 py-4 text-lg font-semibold rounded-lg"
          >
            SHOP NOW
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {swimwearItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center p-6">
                <div className="text-center w-full">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-stitchgrab-accent text-white text-sm font-semibold rounded-full">
                      {item.discount}
                    </span>
                  </div>

                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {item.name.split(' ').map(word => word.charAt(0)).join('').slice(0, 3)}
                    </span>
                  </div>

                  <h3 className="font-bold text-stitchgrab-primary text-lg mb-2">
                    {item.name}
                  </h3>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-stitchgrab-accent">
                      {item.price}
                    </span>
                    <span className="text-sm text-stitchgrab-success font-semibold">
                      Delivery: {item.delivery}
                    </span>
                  </div>

                  <Button
                    variant="secondary"
                    size="small"
                    className="w-full bg-stitchgrab-accent text-white hover:bg-stitchgrab-accent/90"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-stitchgrab-primary mb-6">
            Popular Brands
          </h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-stitchgrab-text-light">
            <span>Legends of Miami</span>
            <span>LNF</span>
            <span>Mabel Love</span>
            <span>Sweet Penelope</span>
            <span>SB</span>
            <span>TRTH BRAND</span>
            <span>MALY</span>
            <span>Kasiopya</span>
            <span>MITA</span>
            <span>Hot Box</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Swimwear 