import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign in | StitchGrab",
  description: "Sign in to your StitchGrab account.",
}

export default function Login() {
  return <LoginTemplate />
}
