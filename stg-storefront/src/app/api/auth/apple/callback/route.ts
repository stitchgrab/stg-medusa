import { NextRequest, NextResponse } from "next/server";
import AppleSignin from "apple-signin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const code = body.get("code") as string;
    const idToken = body.get("id_token") as string;
    const state = body.get("state") as string;

    if (!code || !idToken) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Verify the ID token
    const jwtClaims = await AppleSignin.verifyIdToken(idToken, {
      audience: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
    });

    // Exchange the authorization code for tokens
    const tokenResponse = await AppleSignin.getAuthorizationToken(code, {
      clientID: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
      redirectUri: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    });

    // Here you would typically:
    // 1. Create or find the user in your database
    // 2. Create a session
    // 3. Return user data or redirect to success page

    return NextResponse.json({
      success: true,
      user: {
        id: jwtClaims.sub,
        email: jwtClaims.email,
      },
    });
  } catch (error) {
    console.error("Apple callback error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
} 