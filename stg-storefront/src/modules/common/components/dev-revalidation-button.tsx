"use client"

import { useEffect } from "react"
import { addDevRevalidationButton } from "@lib/utils/dev-revalidate-client"

const DevRevalidationButton = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      addDevRevalidationButton()
    }
  }, [])

  // This component doesn't render anything visible in production
  return null
}

export default DevRevalidationButton 