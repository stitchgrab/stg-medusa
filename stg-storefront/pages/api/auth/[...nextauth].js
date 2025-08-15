// import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Helper: Medusa Admin API client
async function medusaAdminFetch(path, init = {}) {
  const baseUrl = process.env.MEDUSA_BACKEND_URL
  const adminToken = process.env.MEDUSA_ADMIN_API_TOKEN
  if (!baseUrl || !adminToken) {
    console.error('Missing MEDUSA_BACKEND_URL or MEDUSA_ADMIN_API_TOKEN')
    throw new Error('Missing MEDUSA_BACKEND_URL or MEDUSA_ADMIN_API_TOKEN')
  }
  const url = `${baseUrl.replace(/\/$/, '')}${path}`
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // Admin auth headers
    'x-medusa-access-token': adminToken,
    Authorization: `Bearer ${adminToken}`,
    ...(init.headers || {}),
  }
  const res = await fetch(url, { ...init, headers })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Medusa Admin ${init.method || 'GET'} ${path} failed: ${res.status} ${text}`)
  }
  return res.json()
}

async function findCustomerByEmail(email) {
  // Try email filter; fallback to q query if needed
  try {
    const data = await medusaAdminFetch(`/admin/customers?email=${encodeURIComponent(email)}`)
    if (data?.customers?.length) {
      return data.customers.find((c) => c.email?.toLowerCase() === email.toLowerCase()) || null
    }
  } catch {
    // ignore and try q
  }
  try {
    const data = await medusaAdminFetch(`/admin/customers?q=${encodeURIComponent(email)}`)
    if (data?.customers?.length) {
      return data.customers.find((c) => c.email?.toLowerCase() === email.toLowerCase()) || null
    }
  } catch {
    // ignore
  }
  return null
}

async function createCustomerAdmin(payload) {
  const data = await medusaAdminFetch(`/admin/customers`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data?.customer || data
}

async function updateCustomerAdmin(id, payload) {
  const data = await medusaAdminFetch(`/admin/customers/${id}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data?.customer || data
}

function splitName(fullName) {
  if (!fullName) return { first_name: undefined, last_name: undefined }
  const parts = fullName.trim().split(/\s+/)
  return {
    first_name: parts[0],
    last_name: parts.length > 1 ? parts.slice(1).join(' ') : undefined,
  }
}

async function upsertMedusaCustomerFromGoogle(user) {
  const email = user?.email
  if (!email) throw new Error('Google user missing email')
  const { first_name, last_name } = splitName(user.name)

  let customer = await findCustomerByEmail(email)

  if (!customer) {
    customer = await createCustomerAdmin({
      email,
      first_name,
      last_name,
      // You can store provider info in metadata for traceability
      metadata: { oauth_provider: 'google' },
    })
  } else {
    const patch = {}
    if (!customer.first_name && first_name) patch.first_name = first_name
    if (!customer.last_name && last_name) patch.last_name = last_name
    if (Object.keys(patch).length) {
      customer = await updateCustomerAdmin(customer.id, patch)
    }
  }

  return customer
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Keep existing credentials provider if needed
    {
      id: 'medusa-credentials',
      name: 'Medusa Store',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (credentials?.email && credentials?.password) {
            // Implement actual Medusa auth here
            return {
              id: '1',
              email: credentials.email,
              name: 'User'
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    }
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const medusaCustomer = await upsertMedusaCustomerFromGoogle(user)
          // Attach to user for initial JWT population
          user.medusaCustomer = {
            id: medusaCustomer.id,
            email: medusaCustomer.email,
            first_name: medusaCustomer.first_name,
            last_name: medusaCustomer.last_name,
          }
          return true
        } catch (error) {
          console.error('Error syncing Google user with Medusa:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user
        if (user.medusaCustomer?.id) {
          token.medusaCustomerId = user.medusaCustomer.id
        }
      }
      if (account) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      session.user = token.user
      session.provider = token.provider
      if (token.medusaCustomerId) {
        session.medusaCustomerId = token.medusaCustomerId
      }
      return session
    }
  },
  pages: {
    signIn: '/account/login',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET
})
