import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  updateProductCategoriesWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function updateCategories({
  container,
}: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Starting category update...")

  // First, let's check if categories already exist
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle", "parent_category_id"],
  })

  logger.info(`Found ${existingCategories.length} existing categories`)

  // Create a set of existing handles for conflict checking
  const existingHandles = new Set(existingCategories.map(cat => cat.handle))

  // Define the new category structure with unique handles
  const categoryStructure = {
    mainCategories: [
      {
        name: "Men",
        handle: "men",
        description: "Shop all men's clothing and accessories",
        is_active: true,
        subcategories: [
          { name: "Denim", handle: "men-denim", description: "Men's denim collection" },
          { name: "Shirts", handle: "men-shirts", description: "Men's shirts collection" },
          { name: "Shorts", handle: "men-shorts", description: "Men's shorts collection" },
          { name: "Tops", handle: "men-tops", description: "Men's tops collection" },
          { name: "Vintage", handle: "men-vintage", description: "Men's vintage collection" },
          { name: "Streetwear", handle: "men-streetwear", description: "Men's streetwear collection" },
          { name: "Swim", handle: "men-swim", description: "Men's swimwear collection" },
          { name: "Sports Apparel", handle: "men-sports-apparel", description: "Men's sports apparel collection" },
          { name: "Hoodies", handle: "men-hoodies", description: "Men's hoodies collection" },
          { name: "Sneakers", handle: "men-sneakers", description: "Men's sneakers collection" },
          { name: "Accessories", handle: "men-accessories", description: "Men's accessories collection" },
        ]
      },
      {
        name: "Women",
        handle: "women",
        description: "Shop all women's clothing and accessories",
        is_active: true,
        subcategories: [
          { name: "Tops", handle: "women-tops", description: "Women's tops collection" },
          { name: "Bottoms", handle: "women-bottoms", description: "Women's bottoms collection" },
          { name: "Shoes", handle: "women-shoes", description: "Women's shoes collection" },
          { name: "Swimwear", handle: "women-swimwear", description: "Women's swimwear collection" },
          { name: "Vintage", handle: "women-vintage", description: "Women's vintage collection" },
          { name: "Dresses", handle: "women-dresses", description: "Women's dresses collection" },
          { name: "T-Shirt", handle: "women-t-shirt", description: "Women's t-shirt collection" },
          { name: "Denim", handle: "women-denim", description: "Women's denim collection" },
          { name: "Shorts", handle: "women-shorts", description: "Women's shorts collection" },
          { name: "Accessories", handle: "women-accessories", description: "Women's accessories collection" },
        ]
      },
      {
        name: "Brands",
        handle: "brands",
        description: "Shop by brand",
        is_active: true,
        subcategories: [] // Brands don't have subcategories as per requirements
      }
    ]
  }

  // Check for handle conflicts with main categories
  const conflictingMainCategories = categoryStructure.mainCategories.filter(cat =>
    existingHandles.has(cat.handle)
  )

  if (conflictingMainCategories.length > 0) {
    logger.info(`Found conflicting main categories: ${conflictingMainCategories.map(c => c.name).join(', ')}`)
    logger.info("Skipping creation of conflicting categories")
  }

  // Create main categories that don't conflict
  const nonConflictingMainCategories = categoryStructure.mainCategories.filter(cat =>
    !existingHandles.has(cat.handle)
  )

  if (nonConflictingMainCategories.length > 0) {
    logger.info("Creating non-conflicting main categories...")
    const mainCategoriesData = nonConflictingMainCategories.map(cat => ({
      name: cat.name,
      handle: cat.handle,
      description: cat.description,
      is_active: cat.is_active,
    }))

    const { result: newMainCategories } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: mainCategoriesData,
      },
    })

    logger.info(`Created ${newMainCategories.length} new main categories`)
  }

  // Get all main categories (both existing and newly created)
  const { data: allMainCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle", "parent_category_id"],
  })

  const mainCategories = allMainCategories.filter(cat => !cat.parent_category_id)

  // Create subcategories for Men and Women
  for (const mainCategory of categoryStructure.mainCategories) {
    if (mainCategory.subcategories.length > 0) {
      const parentCategory = mainCategories.find(cat => cat.name === mainCategory.name)

      if (parentCategory) {
        logger.info(`Creating subcategories for ${mainCategory.name}...`)

        // Filter out subcategories that would conflict
        const nonConflictingSubcategories = mainCategory.subcategories.filter(subcat =>
          !existingHandles.has(subcat.handle)
        )

        if (nonConflictingSubcategories.length > 0) {
          const subcategoriesData = nonConflictingSubcategories.map(subcat => ({
            name: subcat.name,
            handle: subcat.handle,
            description: subcat.description,
            is_active: true,
            parent_category_id: parentCategory.id,
          }))

          const { result: subcategories } = await createProductCategoriesWorkflow(container).run({
            input: {
              product_categories: subcategoriesData,
            },
          })

          logger.info(`Created ${subcategories.length} subcategories for ${mainCategory.name}`)
        } else {
          logger.info(`All subcategories for ${mainCategory.name} already exist`)
        }
      }
    }
  }

  logger.info("Category update completed successfully!")

  // Log the final structure
  const { data: finalCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle", "parent_category_id"],
  })

  logger.info("Final category structure:")
  const mainCats = finalCategories.filter(cat => !cat.parent_category_id)
  for (const mainCat of mainCats) {
    logger.info(`- ${mainCat.name} (${mainCat.handle})`)
    const subCats = finalCategories.filter(cat => cat.parent_category_id === mainCat.id)
    for (const subCat of subCats) {
      logger.info(`  - ${subCat.name} (${subCat.handle})`)
    }
  }
} 