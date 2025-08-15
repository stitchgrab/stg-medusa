# Apple Sign In Setup Guide

## 1. Create Apple Developer Account

1. Go to [Apple Developer](https://developer.apple.com/)
2. Sign in with your Apple ID
3. Enroll in the Apple Developer Program ($99/year)

## 2. Configure Sign in with Apple

1. Go to "Certificates, Identifiers & Profiles"
2. Click "Identifiers" → "+" → "App IDs"
3. Select "App" and click "Continue"
4. Fill in the form:
   - Description: Your app name
   - Bundle ID: com.yourcompany.yourapp
   - Check "Sign In with Apple" capability
5. Click "Continue" and "Register"

## 3. Create Service ID

1. Go to "Identifiers" → "+" → "Services IDs"
2. Fill in the form:
   - Description: Your service name
   - Identifier: com.yourcompany.yourapp.web
3. Check "Sign In with Apple" and click "Configure"
4. Add your domain and redirect URL:
   - Primary App ID: Select your app ID
   - Domains and Subdomains: yourdomain.com
   - Return URLs: https://yourdomain.com/api/auth/apple/callback
5. Click "Save" and "Continue"

## 4. Create Key

1. Go to "Keys" → "+"
2. Fill in the form:
   - Key Name: Your key name
   - Check "Sign In with Apple"
3. Click "Configure" and select your primary app ID
4. Click "Save" and download the key file (.p8)

## 5. Environment Variables

Add these to your `.env.local`:

```env
# Apple Sign In
NEXT_PUBLIC_APPLE_CLIENT_ID=com.yourcompany.yourapp.web
NEXT_PUBLIC_APPLE_REDIRECT_URI=https://yourdomain.com/api/auth/apple/callback
APPLE_CLIENT_SECRET=your-generated-client-secret
```

## 6. Generate Client Secret

Use the downloaded .p8 key to generate a client secret:

```bash
# Install jwt-cli
npm install -g jwt-cli

# Generate client secret
jwt encode --algorithm ES256 --audience https://appleid.apple.com --issuer YOUR_TEAM_ID --key-id YOUR_KEY_ID --secret @path/to/AuthKey_KEYID.p8
```

## 7. Testing

1. Start your development server
2. Navigate to `/auth/sign-in`
3. Click "Continue with Apple"
4. You should be redirected to Apple's sign-in page

## 8. Production Deployment

Remember to:
- Update redirect URIs for production domain
- Set environment variables in your hosting platform
- Ensure your domain is verified with Apple
- Test the complete flow in production

## 9. Implementation Notes

- The current implementation redirects to Apple's authorization URL
- You'll need to handle the callback response in your backend
- Consider implementing a popup flow for better UX
- Store user data securely after successful authentication 