"use client";

import Link from "next/link";
import React from "react";
import GoogleIcon from "../../../../../components/icons/GoogleIcon";
import AppleIcon from "../../../../../components/icons/AppleIcon";
import { useAuthSignIn } from "../../../../../hooks/useAuthSignIn";
import "../../../../../styles/auth.css";

export default function SignInPage() {
  const { handleGoogleSignIn, handleAppleSignIn } = useAuthSignIn();

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center auth-container px-3">
      <div className="card p-3 p-md-4 border-0 auth-card">
        <h2 className="mb-2 text-center auth-heading">
          Welcome to <span className="auth-heading-brand">STITCHGRAB</span>?
        </h2>
        <span className="mb-3 text-center d-block auth-subtitle">
            Login to unlock your shopping cart and continue
        </span>
        <button 
          onClick={handleGoogleSignIn}
          className="btn btn-outline-dark w-100 mb-3 rounded-pill border-1 position-relative d-flex align-items-center justify-content-center social-button"
        >
          <span className="social-icon-container"><GoogleIcon height={29} width={24} /></span>
          Continue with Google
        </button>
        <button 
          onClick={handleAppleSignIn}
          className="btn btn-outline-dark w-100 mb-3 rounded-pill border-1 position-relative d-flex align-items-center justify-content-center social-button"
        >
          <span className="social-icon-container"><AppleIcon height={29} width={24} /></span>
          Continue with Apple
        </button>
        <div className="d-flex align-items-center mb-3">
          <hr className="flex-grow-1 m-0" />
          <span className="mx-2">or</span>
          <hr className="flex-grow-1 m-0" />
        </div>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Username or email address <span className="required-asterisk">*</span></label>
            <input type="email" id="email" name="email" required className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password <span className="required-asterisk">*</span></label>
            <input type="password" id="password" name="password" required className="form-control" />
          </div>
          <button type="submit" className="btn btn-dark w-100 rounded-pill border-1">Login</button>
        </form>
        <span className="text-center d-block terms-text">
          By clicking "Log In", you agree to STITCHGRAB Terms of Use and Privacy Policy.
        </span>
        <div className="mt-3 d-flex flex-column flex-sm-row justify-content-between align-items-left w-100 gap-2">
          <span className="account-text">Don't have a STITCHGRAB account?</span>
          <Link href="/auth/sign-up" className="ms-1 auth-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
} 