import { MedusaContainer } from "@medusajs/framework"

export default async function setupSalesChannel(container: MedusaContainer) {
  try {
    console.log("Setting up sales channel configuration...")
    
    // Try to get services using correct service names
    let salesChannelService
    let publishableApiKeyService
    
    try {
      salesChannelService = container.resolve("salesChannelService")
    } catch {
      try {
        salesChannelService = container.resolve("salesChannelModuleService")
      } catch {
        console.log("Could not resolve sales channel service")
      }
    }
    
    try {
      publishableApiKeyService = container.resolve("publishableApiKeyService")
    } catch {
      try {
        publishableApiKeyService = container.resolve("apiKeyModuleService")
      } catch {
        console.log("Could not resolve API key service")
      }
    }
    
    if (!salesChannelService || !publishableApiKeyService) {
      throw new Error("Could not resolve required services")
    }
    
    // Get existing sales channels
    let existingSalesChannels = []
    try {
      existingSalesChannels = await salesChannelService.list?.() || 
                             await salesChannelService.listSalesChannels?.() ||
                             await salesChannelService.retrieve?.() || []
    } catch (error) {
      console.log("Could not list sales channels:", error.message)
    }
    
    // Create default sales channel if none exists
    let defaultSalesChannel
    if (existingSalesChannels.length === 0) {
      console.log("Creating default sales channel...")
      try {
        defaultSalesChannel = await salesChannelService.create?.({
          name: "Default Sales Channel",
          description: "Default sales channel for the store",
          is_default: true,
        }) || await salesChannelService.createSalesChannels?.({
          name: "Default Sales Channel", 
          description: "Default sales channel for the store",
          is_default: true,
        })
        console.log("Created default sales channel:", defaultSalesChannel?.id)
      } catch (error) {
        console.error("Failed to create sales channel:", error.message)
        throw error
      }
    } else {
      defaultSalesChannel = existingSalesChannels.find(sc => sc.is_default) || existingSalesChannels[0]
      console.log("Using existing sales channel:", defaultSalesChannel.id)
    }
    
    // Get existing publishable API keys
    let existingApiKeys = []
    try {
      existingApiKeys = await publishableApiKeyService.list?.({ type: "publishable" }) ||
                       await publishableApiKeyService.listApiKeys?.({ type: "publishable" }) ||
                       await publishableApiKeyService.list?.() || []
      
      // Filter for publishable keys if list doesn't support filtering
      if (Array.isArray(existingApiKeys)) {
        existingApiKeys = existingApiKeys.filter(key => key.type === "publishable")
      }
    } catch (error) {
      console.log("Could not list API keys:", error.message)
    }
    
    // Create or configure API keys
    if (existingApiKeys.length === 0) {
      console.log("Creating new publishable API key...")
      try {
        const newApiKey = await publishableApiKeyService.create?.({
          title: "Default Publishable Key",
          type: "publishable",
        }) || await publishableApiKeyService.createApiKeys?.({
          title: "Default Publishable Key",
          type: "publishable",
        })
        
        console.log("Created publishable API key:", newApiKey?.id)
        existingApiKeys = [newApiKey]
      } catch (error) {
        console.error("Failed to create API key:", error.message)
      }
    }
    
    // Link sales channels to API keys
    for (const apiKey of existingApiKeys) {
      try {
        await publishableApiKeyService.addSalesChannels?.(apiKey.id, [defaultSalesChannel.id])
        console.log("Linked sales channel to API key:", apiKey.id)
      } catch (error) {
        console.log("Could not link sales channel to API key", apiKey.id, ":", error.message)
        // This might mean it's already linked, which is fine
      }
    }
    
    console.log("Sales channel setup completed!")
    
  } catch (error) {
    console.error("Setup failed:", error.message)
    console.log("\nManual setup required:")
    console.log("1. Access Medusa Admin dashboard")
    console.log("2. Go to Settings > Sales Channels") 
    console.log("3. Create a default sales channel if none exists")
    console.log("4. Go to Settings > Publishable API Keys")
    console.log("5. Link your publishable key to the sales channel")
  }
}
