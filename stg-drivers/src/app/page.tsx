'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/drivers/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h4 className="text-2xl font-bold mb-4">Redirecting to dashboard...</h4>
      </div>
    </div>
  )
}
