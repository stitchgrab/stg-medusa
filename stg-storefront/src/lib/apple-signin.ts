import AppleSignin from "apple-signin-auth";

export interface AppleSignInResponse {
  authorization: {
    id_token: string;
    code: string;
    state: string;
  };
  user: {
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
  };
}

export const signInWithApple = async (): Promise<AppleSignInResponse | null> => {
  try {
    if (typeof window === "undefined") return null;

    // Create the authorization URL
    const authorizationUrl = AppleSignin.getAuthorizationUrl({
      clientID: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
      redirectUri: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || "",
      scope: "name email",
      state: "origin:web",
      responseMode: "form_post",
    });

    // For now, redirect to the authorization URL
    // In a full implementation, you'd handle this with a popup or redirect
    window.location.href = authorizationUrl;

    return null;
  } catch (error) {
    console.error("Apple Sign In error:", error);
    return null;
  }
}; 