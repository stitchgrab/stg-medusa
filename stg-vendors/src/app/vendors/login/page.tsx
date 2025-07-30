'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Text, Container, Heading } from '@medusajs/ui'
import Image from 'next/image'

export default function VendorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:9000/vendors/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }

      // Redirect to dashboard on successful login
      router.push('/vendors/dashboard')
    } catch (err) {
      console.error('Failed to login:', err)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Container className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Heading level="h1" className="text-3xl font-bold text-blue-600">
              <div className="flex items-center justify-center flex-col">
                <Image src="/stitchgrab-logo-transparent.png" alt="StitchGrab" width={250} height={250} />
              </div>
            </Heading>
            <Text className="text-sm text-gray-600 mt-4">Vendor Portal</Text>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full">
          <Heading level="h2" className="text-2xl font-bold mb-6 text-center text-blue-600">
            Sign In
          </Heading>

          {error && (
            <div className="mb-4 p-3 text-red-600 text-sm text-center bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                placeholder="Enter your password"
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              isLoading={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Text className="text-sm text-gray-500">
            © 2025 StitchGrab. All rights reserved.
          </Text>
        </div>
      </Container>
    </div>
  )
} 