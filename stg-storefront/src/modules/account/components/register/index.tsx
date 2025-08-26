"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import GoogleIcon from "components/icons/GoogleIcon";
import { signIn } from "next-auth/react";
import AppleIcon from "components/icons/AppleIcon"
import "styles/auth.css"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div className="max-w-sm flex flex-col items-center" data-testid="register-page">
      <h2 className="mb-2 text-center auth-heading">
        Welcome to <span className="auth-heading-brand">STITCHGRAB</span>?
      </h2>
      <span className="mb-3 text-center d-block auth-subtitle">
        Create your account to get started
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
      <form className="w-full flex flex-col" action={formAction}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">Full Name <span className="required-asterisk">*</span></label>
          <input 
            type="text" 
            id="first_name" 
            name="first_name"  
            data-testid="first-name-input"
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">Last Name <span className="required-asterisk">*</span></label>
          <input 
            type="text" 
            id="last_name" 
            name="last_name"  
            data-testid="last-name-input"
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email <span className="required-asterisk">*</span></label>
          <input 
            id="email" 
            type="email" 
            name="email"  
            autoComplete="email"
            className="form-control"
            data-testid="email-input"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input 
            id="phone" 
            type="tel" 
            name="phone"  
            autoComplete="tel"
            className="form-control"
            data-testid="phone-input"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password <span className="required-asterisk">*</span></label>
          <input 
            id="password" 
            type="password" 
            name="password"  
            autoComplete="new-password"
            className="form-control"
            data-testid="password-input"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirm-password" className="form-label">Confirm Password <span className="required-asterisk">*</span></label>
          <input 
            id="confirm-password" 
            type="password" 
            name="confirm-password"  
            autoComplete="new-password"
            className="form-control"
            data-testid="confirm-password-input"
            required
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        {/* <span className="text-center text-ui-fg-base text-small-regular mt-6">
          By create an account, you agree to Medusa Store&apos;s{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </span> */}
        <SubmitButton className="w-full mt-6 btn btn-dark w-100 rounded-pill border-1" data-testid="register-button">
          Sign Up
        </SubmitButton>
      </form>
      <span className="text-center d-block terms-text">
        By clicking "Sign Up", you agree to STITCHGRAB Terms of Use and Privacy Policy.
      </span>
      <div className="mt-3 d-flex flex-column flex-sm-row justify-content-between align-items-left w-100 gap-2">
        <span className="account-text">Already have a STITCHGRAB account?</span>
        <button onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)} className="underline ms-1 auth-link">Sign in</button>
      </div>
    </div>
  )
}

export default Register
