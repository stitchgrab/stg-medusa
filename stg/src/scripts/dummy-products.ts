import { ExecArgs } from "@medusajs/framework/types"
import { faker } from "@faker-js/faker"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"
import { getRandomProductTemplate, generateHandle } from "./product-templates"

// Function to generate product images using Unsplash
async function generateProductImages(searchTerm: string): Promise<string[]> {
  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not found, falling back to Faker images')
    return generateFakerImages()
  }

  try {
    console.log(`Searching Unsplash for: ${searchTerm}`)

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=3&orientation=portrait&order_by=relevant`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        return data.results.map((photo: any) => photo.urls.regular)
      } else {
        console.warn(`No Unsplash results for "${searchTerm}", falling back to Faker`)
        return generateFakerImages()
      }
    } else {
      console.warn(`Unsplash API error: ${response.status}, falling back to Faker`)
      return generateFakerImages()
    }
  } catch (error) {
    console.warn('Failed to fetch Unsplash images, falling back to Faker:', error)
    return generateFakerImages()
  }
}

// Function to generate Faker images as fallback
function generateFakerImages(): string[] {
  return [
    faker.image.urlLoremFlickr({
      category: 'fashion',
      width: 800,
      height: 600,
    }),
    faker.image.urlLoremFlickr({
      category: 'fashion',
      width: 800,
      height: 600,
    }),
    faker.image.urlLoremFlickr({
      category: 'fashion',
      width: 800,
      height: 600,
    }),
  ]
}

export default async function seedDummyProducts({
  container,
}: ExecArgs) {
  const salesChannelModuleService = container.resolve(
    Modules.SALES_CHANNEL
  )
  const logger = container.resolve(
    ContainerRegistrationKeys.LOGGER
  )
  const query = container.resolve(
    ContainerRegistrationKeys.QUERY
  )

  const defaultSalesChannel = await salesChannelModuleService
    .listSalesChannels({
      name: "Default Sales Channel",
    })

  const sizeOptions = ["S", "M", "L", "XL", "XXL"]
  const colorOptions = ["Black", "White", "Red", "Blue", "Navy", "Gray"]
  const currency_code = "usd"
  const productsPerCategory = 10

  // Check for existing products to avoid duplicates
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["handle"],
  })
  const existingHandles = new Set(existingProducts.map((product) => product.handle))

  // Fetch all categories and subcategories
  const { data: allCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle", "parent_category_id"],
  })

  // Only use leaf categories (subcategories), but if a main category has no subcategories, use it too
  const mainCategories = allCategories.filter(cat => !cat.parent_category_id)
  const subCategories = allCategories.filter(cat => cat.parent_category_id)
  const leafCategories = [
    ...subCategories,
    ...mainCategories.filter(mainCat => !subCategories.some(sub => sub.parent_category_id === mainCat.id)),
  ]

  logger.info(`Generating products for ${leafCategories.length} categories/subcategories...`)

  let productsData: any[] = []
  let productIndex = 0
  for (const category of leafCategories) {
    logger.info(`Generating products for category: ${category.name}`)

    for (let i = 0;i < productsPerCategory;i++) {
      // Get a random product template for this category
      const template = getRandomProductTemplate(category.name)

      // Create a unique handle from the product name
      let handle = generateHandle(template.name)

      // Ensure handle is unique
      let counter = 1
      const originalHandle = handle
      while (existingHandles.has(handle)) {
        handle = `${originalHandle}-${counter}`
        counter++
      }
      existingHandles.add(handle)

      // Generate images using the template's search term
      const imageUrls = await generateProductImages(template.searchTerm)

      // Generate a realistic price within the template's range
      const price = faker.number.int(template.priceRange)

      productsData.push({
        title: template.name,
        handle,
        is_giftcard: false,
        description: template.description,
        status: ProductStatus.PUBLISHED,
        category_ids: [category.id],
        options: [
          {
            title: "Size",
            values: sizeOptions,
          },
          {
            title: "Color",
            values: colorOptions,
          },
        ],
        images: imageUrls.map(url => ({ url })),
        variants: new Array(5).fill(0).map((_, variantIndex) => ({
          title: `${template.name} ${variantIndex}`,
          sku: `variant-${productIndex}-${variantIndex}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          prices: [
            {
              currency_code,
              amount: price,
            },
          ],
          options: {
            Size: sizeOptions[Math.floor(Math.random() * sizeOptions.length)],
            Color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
          },
        })),
        shipping_profile_id: "sp_123",
        sales_channels: [
          {
            id: defaultSalesChannel[0].id,
          },
        ],
      })
      productIndex++
    }
  }

  logger.info(`Seeding ${productsData.length} products...`)
  const { result: products } = await createProductsWorkflow(container).run({
    input: {
      products: productsData,
    },
  })

  logger.info(`Seeded ${products.length} products.`)

  logger.info("Seeding inventory levels.")

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  })

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  // Check for existing inventory levels to avoid duplicates
  const { data: existingInventoryLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id", "location_id"],
  })

  // Create a set of existing inventory level keys for quick lookup
  const existingKeys = new Set(
    existingInventoryLevels.map(
      (level) => `${level.inventory_item_id}_${level.location_id}`
    )
  )

  // Filter out inventory items that already have inventory levels
  const newInventoryLevels = inventoryItems
    .filter((inventoryItem) => {
      const key = `${inventoryItem.id}_${stockLocations[0].id}`
      return !existingKeys.has(key)
    })
    .map((inventoryItem) => ({
      location_id: stockLocations[0].id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    }))

  if (newInventoryLevels.length > 0) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: newInventoryLevels,
      },
    })
    logger.info(`Created ${newInventoryLevels.length} new inventory levels.`)
  } else {
    logger.info("All inventory levels already exist, skipping creation.")
  }

  logger.info("Finished seeding inventory levels data.")
}