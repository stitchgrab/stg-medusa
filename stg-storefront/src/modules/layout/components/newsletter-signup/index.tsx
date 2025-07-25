"use client"

import { useState } from "react"
import { Button } from "@medusajs/ui"

const NewsletterSignup = () => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true)
      setIsSubmitting(false)
      setEmail("")
    }, 1000)
  }

  if (isSubscribed) {
    return (
      <div className="text-green-600 text-sm">
        ✓ Thank you for subscribing!
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? "..." : "Subscribe"}
      </Button>
    </form>
  )
}

export default NewsletterSignup 