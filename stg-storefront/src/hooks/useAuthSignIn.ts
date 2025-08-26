import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { signInWithApple } from "lib/apple-signin";

interface UseAuthSignInReturn {
  session: any;
  handleGoogleSignIn: () => void;
  handleAppleSignIn: () => Promise<void>;
}

export const useAuthSignIn = (): UseAuthSignInReturn => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleAppleSignIn = async () => {
    try {
      const response = await signInWithApple();
      if (response) {
        // Handle successful Apple sign in
        console.log("Apple Sign In successful:", response);
        // You would typically send this to your backend to create/authenticate the user
        // For now, we'll just redirect to home
        router.push("/");
      }
    } catch (error) {
      console.error("Apple Sign In failed:", error);
    }
  };

  // Redirect if already signed in
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return {
    session,
    handleGoogleSignIn,
    handleAppleSignIn,
  };
}; 