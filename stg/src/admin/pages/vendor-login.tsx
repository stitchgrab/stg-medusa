import { definePageConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  Text,
  Button,
  Card,
  Input,
  useToggleState
} from "@medusajs/ui"
import {
  User,
  LockClosed,
  Eye,
  EyeSlash
} from "@medusajs/icons"
import { useState } from "react"

const VendorLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/vendors/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Login successful! Redirecting to dashboard...")
        // In a real implementation, you would redirect to the vendor dashboard
        setTimeout(() => {
          window.location.href = "/vendor/dashboard"
        }, 1000)
      } else {
        setError(data.message || "Login failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Text className="text-white font-bold text-xl">SG</Text>
            </div>
            <Heading level="h1" className="text-2xl font-bold text-gray-900 mb-2">
              Vendor Login
            </Heading>
            <Text className="text-gray-600">
              Access your StitchGrab vendor dashboard
            </Text>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Text>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Password
              </Text>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlash className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <LockClosed className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <Text className="text-red-600 text-sm">{error}</Text>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <Text className="text-green-600 text-sm">{success}</Text>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Text className="text-sm font-medium text-blue-900 mb-2">
                Demo Credentials
              </Text>
              <Text className="text-xs text-blue-700">
                Email: vendor@stitchgrab.com<br />
                Password: any password (for demo)
              </Text>
            </div>

            {/* Additional Links */}
            <div className="text-center">
              <Text className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => {
                    // In a real implementation, this would navigate to vendor registration
                    alert("Contact support to create a vendor account")
                  }}
                >
                  Contact Support
                </button>
              </Text>
            </div>
          </form>
        </Card>
      </div>
    </Container>
  )
}

export const config = definePageConfig({
  zone: "vendor.login",
})

export default VendorLogin 