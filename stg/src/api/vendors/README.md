# Vendor Authentication System

This system provides secure authentication for vendors using JWT tokens and bcrypt password hashing.

## Authentication Flow

### 1. Vendor Signup (`POST /vendors/auth/signup`)

Creates a new vendor account with hashed password and JWT token.

**Request Body:**
```json
{
  "email": "vendor@example.com",
  "password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe",
  "vendor_name": "My Store",
  "vendor_handle": "my-store",
  "phone": "+1234567890"
}
```

**Response:**
- Sets `vendor_session` cookie with JWT token
- Returns vendor and vendor admin information

### 2. Vendor Login (`POST /vendors/auth/login`)

Authenticates vendor with email and password.

**Request Body:**
```json
{
  "email": "vendor@example.com",
  "password": "SecurePass123"
}
```

**Response:**
- Sets `vendor_session` cookie with JWT token
- Returns vendor and vendor admin information

### 3. Vendor Logout (`POST /vendors/auth/logout`)

Clears the vendor session cookie.

## Using Authentication in Endpoints

### Option 1: Use the helper function

```typescript
import { getCurrentVendorAdmin } from "../../../utils/vendor-auth.js"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const vendorAdmin = await getCurrentVendorAdmin(req)
    
    res.json({
      vendor_admin: vendorAdmin,
      // ... other data
    })
  } catch (error) {
    res.status(401).json({
      message: "Authentication required"
    })
  }
}
```

### Option 2: Use the middleware

```typescript
import { vendorAuthMiddleware } from "../middleware.js"

// Apply middleware to your endpoint
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply middleware first
  await vendorAuthMiddleware(req, res, () => {
    // Your endpoint logic here
    const vendorContext = req.vendor_context
    // ... rest of your code
  })
}
```

## JWT Token Structure

The JWT token contains:
- `vendor_admin_id`: ID of the vendor admin
- `vendor_id`: ID of the vendor
- `email`: Vendor admin email
- `type`: Always 'vendor'
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (24 hours)

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
2. **JWT Tokens**: Secure JWT tokens with 24-hour expiration
3. **HTTP-Only Cookies**: Session tokens stored in secure HTTP-only cookies
4. **CORS Support**: Proper CORS headers for cross-origin requests
5. **Password Validation**: Strong password requirements (8+ chars, uppercase, lowercase, number)

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- Can include special characters: @$!%*?&

## Error Handling

- `401 Unauthorized`: Invalid credentials or missing authentication
- `409 Conflict`: Email or vendor handle already exists
- `400 Bad Request`: Invalid input data
- `500 Internal Server Error`: Server-side errors 