/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/store/:path*',
        destination: '/store/:path*',
      },
      {
        source: '/drivers/:path*',
        destination: '/drivers/:path*',
      },
      {
        source: '/vendors/:path*',
        destination: '/vendors/:path*',
      },
    ]
  },
  env: {
    NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  }
}

module.exports = nextConfig
