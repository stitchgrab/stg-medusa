'use client'

import { useEffect, useState } from 'react'

export default function VendorsApp() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading vendors dashboard...</div>
  }

  // This will be replaced with your actual vendors components
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendors Dashboard</h1>
        <p className="mt-4 text-gray-600">Your vendors dashboard content will go here</p>
      </div>
    </div>
  )
}
