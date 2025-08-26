'use client'

import { useEffect, useState } from 'react'

export default function StorefrontApp() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading storefront...</div>
  }

  // This will be replaced with your actual storefront components
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Storefront</h1>
        <p className="mt-4 text-gray-600">Your storefront content will go here</p>
      </div>
    </div>
  )
}
