import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="relative h-[80vh] w-full bg-gradient-to-br from-stitchgrab-secondary to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-stitchgrab-accent rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-stitchgrab-accent rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-stitchgrab-accent rounded-full"></div>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6 small:p-32 gap-8">
        <div className="max-w-4xl">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-stitchgrab-accent text-white text-sm font-semibold rounded-full mb-4">
              NEW IN
            </span>
          </div>

          <Heading
            level="h1"
            className="text-5xl md:text-7xl leading-tight text-stitchgrab-primary font-bold mb-6"
          >
            STITCHGRAB
          </Heading>

          <Heading
            level="h2"
            className="text-2xl md:text-3xl leading-relaxed text-stitchgrab-text-light font-normal mb-8"
          >
            SAME DAY FASHION DELIVERY
          </Heading>

          <p className="text-lg text-stitchgrab-text-light mb-8 max-w-2xl mx-auto">
            A marketplace offering same-day fashion delivery from both local and major brands in South Florida.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="large"
              className="bg-stitchgrab-accent hover:bg-stitchgrab-accent/90 text-white px-8 py-4 text-lg font-semibold rounded-lg"
            >
              Shop Now
            </Button>
            <Button
              variant="secondary"
              size="large"
              className="border-2 border-stitchgrab-primary text-stitchgrab-primary hover:bg-stitchgrab-primary hover:text-white px-8 py-4 text-lg font-semibold rounded-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Delivery Badge */}
      <div className="absolute bottom-8 left-8 bg-white shadow-lg rounded-full px-6 py-3 flex items-center gap-3">
        <div className="w-3 h-3 bg-stitchgrab-success rounded-full animate-pulse"></div>
        <span className="text-sm font-semibold text-stitchgrab-primary">Same Day Delivery Available</span>
      </div>
    </div>
  )
}

export default Hero
