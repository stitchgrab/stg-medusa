"use client";

import Link from "next/link";
import React from "react";
import GoogleIcon from "../../../../../components/icons/GoogleIcon";
import AppleIcon from "../../../../../components/icons/AppleIcon";
import { useAuthForm } from "../../../../../hooks/useAuthForm";
import "../../../../../styles/auth.css";

export default function SignUpPage() {
  const {
    formData,
    passwordMatch,
    isConfirmPasswordTouched,
    handleInputChange,
    handleConfirmPasswordBlur,
    handleSubmit
  } = useAuthForm();

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center auth-container px-3">
      <div className="card p-3 p-md-4 border-0 auth-card">
        <h2 className="mb-2 text-center auth-heading">
          Welcome to <span className="auth-heading-brand">STITCHGRAB</span>?
        </h2>
        <span className="mb-3 text-center d-block auth-subtitle">
          Create your account to get started
        </span>
        <button className="btn btn-outline-dark w-100 mb-3 rounded-pill border-1 position-relative d-flex align-items-center justify-content-center social-button">
          <span className="social-icon-container"><GoogleIcon height={29} width={24} /></span>
          Continue with Google
        </button>
        <button className="btn btn-outline-dark w-100 mb-3 rounded-pill border-1 position-relative d-flex align-items-center justify-content-center social-button">
          <span className="social-icon-container"><AppleIcon height={29} width={24} /></span>
          Continue with Apple
        </button>
        <div className="d-flex align-items-center mb-3">
          <hr className="flex-grow-1 m-0" />
          <span className="mx-2">or</span>
          <hr className="flex-grow-1 m-0" />
        </div>
        <form onSubmit={handleSubmit}>
          {/* <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name <span className="required-asterisk">*</span></label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleInputChange}
              required 
              className="form-control" 
            />
          </div> */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address <span className="required-asterisk">*</span></label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleInputChange}
              required 
              className="form-control" 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Create a Password <span className="required-asterisk">*</span></label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleInputChange}
              required 
              className="form-control" 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirm-password" className="form-label">Confirm Password <span className="required-asterisk">*</span></label>
            <input 
              type="password" 
              id="confirm-password" 
              name="confirmPassword" 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleConfirmPasswordBlur}
              required 
              className={`form-control ${isConfirmPasswordTouched && !passwordMatch ? 'is-invalid' : ''}`}
            />
            {isConfirmPasswordTouched && !passwordMatch && (
              <div className="invalid-feedback">
                Passwords do not match
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-dark w-100 rounded-pill border-1">Sign Up</button>
        </form>
        <span className="text-center d-block terms-text">
          By clicking "Sign Up", you agree to STITCHGRAB Terms of Use and Privacy Policy.
        </span>
        <div className="mt-3 d-flex flex-column flex-sm-row justify-content-between align-items-left w-100 gap-2">
          <span className="account-text">Already have a STITCHGRAB account?</span>
          <Link href="/auth/sign-in" className="ms-1 auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
} 