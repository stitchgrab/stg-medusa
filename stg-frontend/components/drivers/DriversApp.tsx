'use client'

import { useEffect, useState } from 'react'

export default function DriversApp() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading drivers dashboard...</div>
  }

  // This will be replaced with your actual drivers components
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Drivers Dashboard</h1>
        <p className="mt-4 text-gray-600">Your drivers dashboard content will go here</p>
      </div>
    </div>
  )
}
