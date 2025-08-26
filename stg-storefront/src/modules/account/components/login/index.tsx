import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import GoogleIcon from "components/icons/GoogleIcon";
import { signIn } from "next-auth/react";
import AppleIcon from "components/icons/AppleIcon"
import "styles/auth.css"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div className="max-w-sm w-full flex flex-col items-center" data-testid="login-page">
      <h1 className="text-large-semi mb-3 text-center">
        Welcome to <span className="auth-heading-brand">STITCHGRAB</span>?
      </h1>
      <span className="mb-3 text-center d-block auth-subtitle">
          Login to unlock your shopping cart and continue
      </span>

      <button
        className="btn btn-outline-dark w-100 mb-3 rounded-pill border-1 position-relative d-flex align-items-center justify-content-center social-button"
        onClick={() => signIn("google")}
        type="button"
      >
        <span className="social-icon-container"><GoogleIcon height={29} width={24} /></span>
        Continue with Google
      </button>
      <button className="btn btn-outline-dark w-100 mb-3 rounded-pill border-1 position-relative d-flex align-items-center justify-content-center social-button">
        <span className="social-icon-container"><AppleIcon height={29} width={24} /></span>
        Continue with Apple
      </button>
      <div className="d-flex align-items-center mb-3 w-100" style={{ minWidth: "0" }}>
        <hr className="flex-grow-1 m-0 custom-separator"/>
        <span className="mx-2">or</span>
        <hr className="flex-grow-1 m-0 custom-separator"/>
      </div>
      <form className="w-full" action={formAction}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Username or email address <span className="required-asterisk">*</span></label>
          <input type="email" id="email" name="email" autoComplete="email" title="Enter a valid email address." data-testid="email-input" className="form-control" required/>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password <span className="required-asterisk">*</span></label>
          <input type="password" id="password" name="password" autoComplete="current-password" data-testid="password-input"  className="form-control" required/>
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="btn btn-dark w-100 rounded-pill border-1">
          Login
        </SubmitButton>
      </form>
      <span className="text-center d-block terms-text">
        By clicking "Log In", you agree to STITCHGRAB Terms of Use and Privacy Policy.
      </span>
      <span className="mt-3 d-flex flex-column flex-sm-row justify-content-between align-items-left w-100 gap-2">
        <span className="account-text">Don't have a STITCHGRAB account?</span>
        <button onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)} className="underline ms-1 auth-link" data-testid="register-button">
          Sign Up
        </button>
        .
      </span>
    </div>
  )
}

export default Login
