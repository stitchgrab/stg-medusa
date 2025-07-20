# Google OAuth Setup Guide

## 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)

## 2. Environment Variables

Create a `.env.local` file in the `stg-storefront` directory with:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## 3. Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## 4. Testing

1. Start your development server
2. Navigate to `/auth/sign-in`
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen

## 5. Production Deployment

Remember to:
- Update `NEXTAUTH_URL` to your production domain
- Add your production domain to Google OAuth authorized redirect URIs
- Set environment variables in your hosting platform 