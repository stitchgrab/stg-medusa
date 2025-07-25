import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/main_banner.png')"
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6 small:p-32 gap-8">
        <div className="max-w-4xl">
          <Heading
            level="h1"
            className="text-5xl md:text-7xl lg:text-8xl leading-tight text-white font-bold mb-6 drop-shadow-lg tracking-wide"
          >
            STITCHGRAB
          </Heading>

          <Heading
            level="h2"
            className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-200 font-normal mb-8 drop-shadow-md tracking-wide"
          >
            SAME DAY FASHION DELIVERY
          </Heading>

          <p className="text-sm md:text-base lg:text-lg text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md leading-relaxed">
            A marketplace offering same-day fashion delivery from both local and major brands
            <br />
            in South Florida.
          </p>

          <div className="flex justify-center">
            <Button
              size="large"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
