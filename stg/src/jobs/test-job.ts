import { MedusaContainer } from "@medusajs/framework/types"

export default async function testJob(container: MedusaContainer) {
  const logger = container.resolve("logger")
  // logger.info("🧪 Test job is running!")
}

export const config = {
  name: "test-job",
  schedule: "* * * * *", // Every minute for testing
} 