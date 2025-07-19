import React from "react";

const GoogleIcon: React.FC<{ width?: number; height?: number; className?: string }> = ({ width = 20, height = 20, className }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_17_40)">
      <path d="M47.5 24.5C47.5 22.5 47.3 20.7 47 19H24V29H37.5C36.7 32.5 34.2 35.2 30.7 37.1L39.1 43.6C43.6 39.5 47.5 32.7 47.5 24.5Z" fill="#4285F4"/>
      <path d="M24 48C30.6 48 36.1 45.9 39.1 43.6L30.7 37.1C29.1 38.1 26.9 38.8 24 38.8C17.7 38.8 12.2 34.7 10.4 29.1L1.6 35.1C5.5 42.1 13.1 48 24 48Z" fill="#34A853"/>
      <path d="M10.4 29.1C9.9 27.7 9.6 26.2 9.6 24.5C9.6 22.8 9.9 21.3 10.4 19.9L1.6 13.9C-0.5 17.9-0.5 23.1 1.6 27.1L10.4 29.1Z" fill="#FBBC05"/>
      <path d="M24 9.2C27.2 9.2 29.9 10.3 31.8 12.1L39.3 5.1C36.1 2.2 30.6 0 24 0C13.1 0 5.5 5.9 1.6 13.9L10.4 19.9C12.2 14.3 17.7 9.2 24 9.2Z" fill="#EA4335"/>
    </g>
    <defs>
      <clipPath id="clip0_17_40">
        <rect width="48" height="48" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export default GoogleIcon; 