import { faker } from "@faker-js/faker"

export interface ProductTemplate {
  name: string
  description: string
  searchTerm: string
  priceRange: { min: number; max: number }
}

export interface CategoryProducts {
  [categoryName: string]: ProductTemplate[]
}

// Realistic product templates for each category
export const productTemplates: CategoryProducts = {
  // Men's Denim
  'Denim': [
    {
      name: "Classic Blue Denim Jeans",
      description: "Timeless straight-leg jeans in premium denim. Perfect for everyday wear with a comfortable fit and durable construction.",
      searchTerm: "men blue jeans denim",
      priceRange: { min: 8000, max: 15000 }
    },
    {
      name: "Slim Fit Black Jeans",
      description: "Modern slim-fit jeans in black denim. Versatile and stylish for both casual and semi-formal occasions.",
      searchTerm: "men black jeans slim",
      priceRange: { min: 7000, max: 12000 }
    },
    {
      name: "Vintage Washed Denim Jacket",
      description: "Classic denim jacket with vintage wash. Features a comfortable fit and timeless style that never goes out of fashion.",
      searchTerm: "men denim jacket vintage",
      priceRange: { min: 6000, max: 11000 }
    },
    {
      name: "Distressed Denim Shorts",
      description: "Casual distressed denim shorts perfect for summer. Comfortable fit with authentic vintage styling.",
      searchTerm: "men denim shorts distressed",
      priceRange: { min: 5000, max: 9000 }
    },
    {
      name: "Premium Selvedge Denim",
      description: "High-quality selvedge denim jeans with superior craftsmanship. Made from the finest Japanese denim.",
      searchTerm: "men selvedge denim jeans",
      priceRange: { min: 12000, max: 20000 }
    }
  ],

  // Men's Shirts
  'Shirts': [
    {
      name: "Oxford Cotton Button-Down Shirt",
      description: "Classic Oxford cotton shirt with button-down collar. Perfect for business casual or smart casual occasions.",
      searchTerm: "men oxford shirt button down",
      priceRange: { min: 6000, max: 12000 }
    },
    {
      name: "Linen Summer Shirt",
      description: "Breathable linen shirt perfect for warm weather. Lightweight and comfortable with a relaxed fit.",
      searchTerm: "men linen shirt summer",
      priceRange: { min: 5000, max: 10000 }
    },
    {
      name: "Plaid Flannel Shirt",
      description: "Cozy flannel shirt in classic plaid pattern. Warm and comfortable for cooler weather.",
      searchTerm: "men flannel shirt plaid",
      priceRange: { min: 7000, max: 13000 }
    },
    {
      name: "Slim Fit Dress Shirt",
      description: "Professional slim-fit dress shirt. Perfect for office wear and formal occasions.",
      searchTerm: "men dress shirt slim fit",
      priceRange: { min: 8000, max: 15000 }
    },
    {
      name: "Casual Chambray Shirt",
      description: "Versatile chambray shirt with a casual, comfortable fit. Great for everyday wear.",
      searchTerm: "men chambray shirt casual",
      priceRange: { min: 6000, max: 11000 }
    }
  ],

  // Men's Shorts
  'Shorts': [
    {
      name: "Cargo Shorts with Pockets",
      description: "Functional cargo shorts with multiple pockets. Comfortable fit perfect for outdoor activities.",
      searchTerm: "men cargo shorts pockets",
      priceRange: { min: 4000, max: 8000 }
    },
    {
      name: "Athletic Performance Shorts",
      description: "Lightweight performance shorts for sports and workouts. Moisture-wicking and comfortable.",
      searchTerm: "men athletic shorts performance",
      priceRange: { min: 3000, max: 7000 }
    },
    {
      name: "Casual Cotton Shorts",
      description: "Comfortable cotton shorts for everyday wear. Relaxed fit with a classic style.",
      searchTerm: "men cotton shorts casual",
      priceRange: { min: 3500, max: 6500 }
    },
    {
      name: "Swim Trunks",
      description: "Quick-dry swim trunks perfect for beach and pool. Comfortable fit with secure closure.",
      searchTerm: "men swim trunks beach",
      priceRange: { min: 4000, max: 8000 }
    },
    {
      name: "Linen Summer Shorts",
      description: "Breathable linen shorts for hot weather. Lightweight and stylish for summer days.",
      searchTerm: "men linen shorts summer",
      priceRange: { min: 5000, max: 9000 }
    }
  ],

  // Men's Tops
  'Tops': [
    {
      name: "Classic Crew Neck T-Shirt",
      description: "Essential crew neck t-shirt in soft cotton. Perfect for everyday wear with a comfortable fit.",
      searchTerm: "men crew neck tshirt",
      priceRange: { min: 2000, max: 5000 }
    },
    {
      name: "V-Neck Cotton Tee",
      description: "Comfortable v-neck t-shirt in premium cotton. Versatile style for casual occasions.",
      searchTerm: "men vneck tshirt cotton",
      priceRange: { min: 2500, max: 5500 }
    },
    {
      name: "Henley Long Sleeve Shirt",
      description: "Classic henley shirt with button placket. Perfect for layering or wearing alone.",
      searchTerm: "men henley shirt long sleeve",
      priceRange: { min: 4000, max: 8000 }
    },
    {
      name: "Polo Shirt",
      description: "Classic polo shirt in breathable cotton. Perfect for smart casual occasions.",
      searchTerm: "men polo shirt cotton",
      priceRange: { min: 5000, max: 10000 }
    },
    {
      name: "Tank Top",
      description: "Comfortable tank top for workouts and casual wear. Lightweight and breathable.",
      searchTerm: "men tank top athletic",
      priceRange: { min: 1500, max: 4000 }
    }
  ],

  // Men's Vintage
  'Vintage': [
    {
      name: "Vintage Denim Jacket",
      description: "Authentic vintage denim jacket with classic styling. Unique character and timeless appeal.",
      searchTerm: "vintage denim jacket men",
      priceRange: { min: 8000, max: 15000 }
    },
    {
      name: "Retro Graphic T-Shirt",
      description: "Vintage-inspired graphic t-shirt with retro design. Soft cotton with authentic vintage feel.",
      searchTerm: "vintage graphic tshirt men",
      priceRange: { min: 3000, max: 7000 }
    },
    {
      name: "Classic Leather Jacket",
      description: "Timeless leather jacket with vintage styling. Premium leather with authentic vintage character.",
      searchTerm: "vintage leather jacket men",
      priceRange: { min: 15000, max: 25000 }
    },
    {
      name: "Retro Sweater",
      description: "Vintage-inspired sweater with classic patterns. Warm and comfortable for cooler weather.",
      searchTerm: "vintage sweater men retro",
      priceRange: { min: 6000, max: 12000 }
    },
    {
      name: "Classic Work Shirt",
      description: "Vintage work shirt with authentic styling. Durable construction with timeless appeal.",
      searchTerm: "vintage work shirt men",
      priceRange: { min: 5000, max: 10000 }
    }
  ],

  // Men's Streetwear
  'Streetwear': [
    {
      name: "Oversized Hoodie",
      description: "Trendy oversized hoodie with streetwear styling. Comfortable fit with modern urban appeal.",
      searchTerm: "oversized hoodie streetwear men",
      priceRange: { min: 8000, max: 15000 }
    },
    {
      name: "Graphic Street T-Shirt",
      description: "Urban graphic t-shirt with streetwear design. Bold prints and comfortable fit.",
      searchTerm: "graphic tshirt streetwear men",
      priceRange: { min: 4000, max: 8000 }
    },
    {
      name: "Cargo Pants",
      description: "Streetwear cargo pants with multiple pockets. Comfortable fit with urban styling.",
      searchTerm: "cargo pants streetwear men",
      priceRange: { min: 7000, max: 13000 }
    },
    {
      name: "Track Jacket",
      description: "Classic track jacket with streetwear appeal. Lightweight and comfortable for everyday wear.",
      searchTerm: "track jacket streetwear men",
      priceRange: { min: 6000, max: 12000 }
    },
    {
      name: "Street Sneakers",
      description: "Urban street sneakers with modern design. Comfortable and stylish for everyday wear.",
      searchTerm: "street sneakers men urban",
      priceRange: { min: 10000, max: 20000 }
    }
  ],

  // Men's Swim
  'Swim': [
    {
      name: "Classic Swim Trunks",
      description: "Comfortable swim trunks perfect for beach and pool. Quick-dry fabric with secure fit.",
      searchTerm: "men swim trunks classic",
      priceRange: { min: 4000, max: 8000 }
    },
    {
      name: "Board Shorts",
      description: "Durable board shorts for surfing and water sports. Comfortable fit with secure closure.",
      searchTerm: "men board shorts surfing",
      priceRange: { min: 5000, max: 10000 }
    },
    {
      name: "Rash Guard",
      description: "Protective rash guard for water sports. UV protection with comfortable fit.",
      searchTerm: "men rash guard swimming",
      priceRange: { min: 3000, max: 7000 }
    },
    {
      name: "Beach Shorts",
      description: "Casual beach shorts perfect for summer. Lightweight and comfortable for beach days.",
      searchTerm: "men beach shorts summer",
      priceRange: { min: 3500, max: 6500 }
    },
    {
      name: "Swim Briefs",
      description: "Classic swim briefs for competitive swimming. Comfortable fit with secure design.",
      searchTerm: "men swim briefs competitive",
      priceRange: { min: 2500, max: 5000 }
    }
  ],

  // Men's Sports Apparel
  'Sports Apparel': [
    {
      name: "Performance T-Shirt",
      description: "Moisture-wicking performance t-shirt for workouts. Comfortable fit with breathable fabric.",
      searchTerm: "men performance tshirt athletic",
      priceRange: { min: 3000, max: 7000 }
    },
    {
      name: "Athletic Shorts",
      description: "Lightweight athletic shorts for sports and workouts. Comfortable fit with moisture-wicking fabric.",
      searchTerm: "men athletic shorts sports",
      priceRange: { min: 4000, max: 8000 }
    },
    {
      name: "Compression Shirt",
      description: "Performance compression shirt for enhanced performance. Moisture-wicking with comfortable fit.",
      searchTerm: "men compression shirt athletic",
      priceRange: { min: 5000, max: 10000 }
    },
    {
      name: "Track Pants",
      description: "Comfortable track pants for workouts and casual wear. Lightweight and breathable.",
      searchTerm: "men track pants athletic",
      priceRange: { min: 6000, max: 12000 }
    },
    {
      name: "Sports Jacket",
      description: "Lightweight sports jacket for outdoor activities. Windproof and comfortable fit.",
      searchTerm: "men sports jacket athletic",
      priceRange: { min: 8000, max: 15000 }
    }
  ],

  // Men's Hoodies
  'Hoodies': [
    {
      name: "Classic Pullover Hoodie",
      description: "Comfortable pullover hoodie in soft cotton. Perfect for casual wear with a relaxed fit.",
      searchTerm: "men pullover hoodie classic",
      priceRange: { min: 6000, max: 12000 }
    },
    {
      name: "Zip-Up Hoodie",
      description: "Versatile zip-up hoodie with front zipper. Comfortable fit perfect for layering.",
      searchTerm: "men zip hoodie casual",
      priceRange: { min: 7000, max: 13000 }
    },
    {
      name: "Fleece Lined Hoodie",
      description: "Warm fleece-lined hoodie for cold weather. Comfortable and cozy for winter days.",
      searchTerm: "men fleece hoodie warm",
      priceRange: { min: 8000, max: 15000 }
    },
    {
      name: "Athletic Hoodie",
      description: "Performance hoodie for workouts and sports. Moisture-wicking with comfortable fit.",
      searchTerm: "men athletic hoodie sports",
      priceRange: { min: 5000, max: 10000 }
    },
    {
      name: "Oversized Hoodie",
      description: "Trendy oversized hoodie with modern styling. Comfortable fit with urban appeal.",
      searchTerm: "men oversized hoodie trendy",
      priceRange: { min: 7000, max: 14000 }
    }
  ],

  // Men's Sneakers
  'Sneakers': [
    {
      name: "Classic White Sneakers",
      description: "Timeless white sneakers perfect for everyday wear. Comfortable fit with versatile styling.",
      searchTerm: "men white sneakers classic",
      priceRange: { min: 8000, max: 15000 }
    },
    {
      name: "Running Shoes",
      description: "Performance running shoes with superior comfort. Cushioned sole with breathable upper.",
      searchTerm: "men running shoes athletic",
      priceRange: { min: 12000, max: 20000 }
    },
    {
      name: "Casual Canvas Sneakers",
      description: "Comfortable canvas sneakers for casual wear. Lightweight and versatile for everyday use.",
      searchTerm: "men canvas sneakers casual",
      priceRange: { min: 6000, max: 12000 }
    },
    {
      name: "High-Top Sneakers",
      description: "Stylish high-top sneakers with ankle support. Perfect for streetwear and casual styling.",
      searchTerm: "men hightop sneakers streetwear",
      priceRange: { min: 10000, max: 18000 }
    },
    {
      name: "Slip-On Sneakers",
      description: "Convenient slip-on sneakers for easy wear. Comfortable fit with casual styling.",
      searchTerm: "men slip on sneakers casual",
      priceRange: { min: 7000, max: 13000 }
    }
  ],

  // Men's Accessories
  'Accessories': [
    {
      name: "Leather Belt",
      description: "Classic leather belt with durable construction. Perfect for formal and casual wear.",
      searchTerm: "men leather belt classic",
      priceRange: { min: 4000, max: 8000 }
    },
    {
      name: "Wristwatch",
      description: "Stylish wristwatch with classic design. Perfect accessory for any occasion.",
      searchTerm: "men wristwatch classic",
      priceRange: { min: 15000, max: 30000 }
    },
    {
      name: "Sunglasses",
      description: "Trendy sunglasses with UV protection. Stylish design perfect for sunny days.",
      searchTerm: "men sunglasses trendy",
      priceRange: { min: 8000, max: 15000 }
    },
    {
      name: "Wallet",
      description: "Classic leather wallet with multiple compartments. Durable construction for everyday use.",
      searchTerm: "men leather wallet classic",
      priceRange: { min: 3000, max: 7000 }
    },
    {
      name: "Baseball Cap",
      description: "Casual baseball cap with adjustable fit. Perfect for outdoor activities and casual wear.",
      searchTerm: "men baseball cap casual",
      priceRange: { min: 2000, max: 5000 }
    }
  ],

  // Women's categories (similar structure)
  'Bottoms': [
    {
      name: "High-Waisted Skinny Jeans",
      description: "Flattering high-waisted skinny jeans in stretch denim. Perfect for everyday wear with a comfortable fit.",
      searchTerm: "women high waisted skinny jeans",
      priceRange: { min: 8000, max: 15000 }
    },
    {
      name: "Wide-Leg Pants",
      description: "Elegant wide-leg pants perfect for office wear. Comfortable fit with professional styling.",
      searchTerm: "women wide leg pants office",
      priceRange: { min: 7000, max: 13000 }
    },
    {
      name: "Leather Leggings",
      description: "Stylish leather leggings with stretch fabric. Perfect for evening wear and special occasions.",
      searchTerm: "women leather leggings stylish",
      priceRange: { min: 6000, max: 12000 }
    },
    {
      name: "Paper Bag Shorts",
      description: "Trendy paper bag shorts with drawstring waist. Comfortable fit perfect for summer.",
      searchTerm: "women paper bag shorts trendy",
      priceRange: { min: 5000, max: 10000 }
    },
    {
      name: "Pleated Skirt",
      description: "Elegant pleated skirt perfect for office and casual wear. Comfortable fit with classic styling.",
      searchTerm: "women pleated skirt elegant",
      priceRange: { min: 6000, max: 11000 }
    }
  ],

  'Shoes': [
    {
      name: "Classic Heels",
      description: "Elegant classic heels perfect for formal occasions. Comfortable fit with timeless design.",
      searchTerm: "women classic heels elegant",
      priceRange: { min: 12000, max: 20000 }
    },
    {
      name: "Ankle Boots",
      description: "Stylish ankle boots perfect for fall and winter. Comfortable fit with versatile styling.",
      searchTerm: "women ankle boots stylish",
      priceRange: { min: 15000, max: 25000 }
    },
    {
      name: "Ballet Flats",
      description: "Comfortable ballet flats perfect for everyday wear. Classic design with versatile styling.",
      searchTerm: "women ballet flats comfortable",
      priceRange: { min: 8000, max: 15000 }
    },
    {
      name: "Sneakers",
      description: "Comfortable sneakers perfect for casual wear. Lightweight and versatile for everyday use.",
      searchTerm: "women sneakers comfortable",
      priceRange: { min: 10000, max: 18000 }
    },
    {
      name: "Sandals",
      description: "Stylish sandals perfect for summer. Comfortable fit with trendy design.",
      searchTerm: "women sandals summer",
      priceRange: { min: 6000, max: 12000 }
    }
  ],

  'Swimwear': [
    {
      name: "One-Piece Swimsuit",
      description: "Elegant one-piece swimsuit perfect for beach and pool. Comfortable fit with flattering design.",
      searchTerm: "women one piece swimsuit",
      priceRange: { min: 8000, max: 15000 }
    },
    {
      name: "Bikini Set",
      description: "Stylish bikini set perfect for summer. Comfortable fit with trendy design.",
      searchTerm: "women bikini set summer",
      priceRange: { min: 6000, max: 12000 }
    },
    {
      name: "Cover-Up Dress",
      description: "Elegant cover-up dress perfect for beach days. Lightweight and comfortable.",
      searchTerm: "women cover up dress beach",
      priceRange: { min: 5000, max: 10000 }
    },
    {
      name: "Swim Shorts",
      description: "Comfortable swim shorts perfect for water sports. Quick-dry fabric with secure fit.",
      searchTerm: "women swim shorts athletic",
      priceRange: { min: 4000, max: 8000 }
    },
    {
      name: "Beach Hat",
      description: "Stylish beach hat with UV protection. Perfect accessory for sunny days.",
      searchTerm: "women beach hat sun protection",
      priceRange: { min: 3000, max: 7000 }
    }
  ],

  'Dresses': [
    {
      name: "Little Black Dress",
      description: "Classic little black dress perfect for evening wear. Elegant design with flattering fit.",
      searchTerm: "women little black dress elegant",
      priceRange: { min: 12000, max: 20000 }
    },
    {
      name: "Summer Maxi Dress",
      description: "Beautiful summer maxi dress perfect for warm weather. Lightweight and comfortable.",
      searchTerm: "women maxi dress summer",
      priceRange: { min: 8000, max: 15000 }
    },
    {
      name: "Cocktail Dress",
      description: "Elegant cocktail dress perfect for special occasions. Sophisticated design with comfortable fit.",
      searchTerm: "women cocktail dress elegant",
      priceRange: { min: 15000, max: 25000 }
    },
    {
      name: "Casual Sundress",
      description: "Comfortable casual sundress perfect for everyday wear. Lightweight and versatile.",
      searchTerm: "women sundress casual",
      priceRange: { min: 6000, max: 12000 }
    },
    {
      name: "Wrap Dress",
      description: "Flattering wrap dress perfect for office and casual wear. Comfortable fit with elegant styling.",
      searchTerm: "women wrap dress flattering",
      priceRange: { min: 10000, max: 18000 }
    }
  ],

  'T-Shirt': [
    {
      name: "Classic V-Neck Tee",
      description: "Essential v-neck t-shirt in soft cotton. Perfect for everyday wear with a comfortable fit.",
      searchTerm: "women vneck tshirt classic",
      priceRange: { min: 3000, max: 7000 }
    },
    {
      name: "Crew Neck T-Shirt",
      description: "Comfortable crew neck t-shirt perfect for casual wear. Soft cotton with versatile styling.",
      searchTerm: "women crew neck tshirt",
      priceRange: { min: 2500, max: 6000 }
    },
    {
      name: "Graphic T-Shirt",
      description: "Trendy graphic t-shirt with unique design. Comfortable fit with stylish prints.",
      searchTerm: "women graphic tshirt trendy",
      priceRange: { min: 4000, max: 8000 }
    },
    {
      name: "Long Sleeve Tee",
      description: "Comfortable long sleeve t-shirt perfect for cooler weather. Soft fabric with relaxed fit.",
      searchTerm: "women long sleeve tshirt",
      priceRange: { min: 3500, max: 7000 }
    },
    {
      name: "Crop Top Tee",
      description: "Stylish crop top t-shirt perfect for summer. Comfortable fit with trendy styling.",
      searchTerm: "women crop top tshirt",
      priceRange: { min: 3000, max: 6000 }
    }
  ],

  // Brands (generic fashion items)
  'Brands': [
    {
      name: "Premium Cotton T-Shirt",
      description: "High-quality cotton t-shirt with superior comfort. Perfect for everyday wear.",
      searchTerm: "premium cotton tshirt fashion",
      priceRange: { min: 5000, max: 10000 }
    },
    {
      name: "Designer Jeans",
      description: "Premium designer jeans with superior fit and quality. Made from the finest materials.",
      searchTerm: "designer jeans premium",
      priceRange: { min: 15000, max: 25000 }
    },
    {
      name: "Luxury Handbag",
      description: "Elegant luxury handbag with premium craftsmanship. Perfect accessory for any occasion.",
      searchTerm: "luxury handbag designer",
      priceRange: { min: 20000, max: 40000 }
    },
    {
      name: "Designer Sunglasses",
      description: "Stylish designer sunglasses with UV protection. Premium quality with trendy design.",
      searchTerm: "designer sunglasses luxury",
      priceRange: { min: 12000, max: 20000 }
    },
    {
      name: "Premium Watch",
      description: "Luxury watch with superior craftsmanship. Perfect accessory for formal occasions.",
      searchTerm: "premium watch luxury",
      priceRange: { min: 25000, max: 50000 }
    }
  ]
}

// Function to get a random product template for a category
export function getRandomProductTemplate(categoryName: string): ProductTemplate {
  const templates = productTemplates[categoryName]
  if (!templates || templates.length === 0) {
    // Fallback template if category not found
    return {
      name: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
      description: faker.commerce.productDescription(),
      searchTerm: `${categoryName} fashion clothing`,
      priceRange: { min: 5000, max: 15000 }
    }
  }

  return templates[Math.floor(Math.random() * templates.length)]
}

// Function to generate a unique handle from product name
export function generateHandle(productName: string): string {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters except spaces
    .replace(/\s+/g, '-') // Replace spaces with single hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
} 