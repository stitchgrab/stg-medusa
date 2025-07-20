import { Provider } from "next-auth/providers";
import AppleSignin from "apple-signin-auth";

export default function AppleProvider(): Provider {
  return {
    id: "apple",
    name: "Apple",
    type: "oauth",
    wellKnown: "https://appleid.apple.com/.well-known/openid-configuration",
    authorization: {
      url: "https://appleid.apple.com/auth/authorize",
      params: {
        scope: "name email",
        response_mode: "form_post",
        response_type: "code id_token",
      },
    },
    token: "https://appleid.apple.com/auth/token",
    userinfo: "https://appleid.apple.com/auth/userinfo",
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name?.firstName + " " + profile.name?.lastName,
        email: profile.email,
        image: null,
      };
    },
    style: {
      logo: "/apple-logo.svg",
      logoDark: "/apple-logo.svg",
      bg: "#000",
      text: "#fff",
      bgDark: "#000",
      textDark: "#fff",
    },
  };
} 