import React from "react"

import { IconProps } from "types/icon"

const YouTube: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8386 5.15941C21.4979 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4S5.12 4 3.4 4.46C2.92921 4.59318 2.50211 4.84824 2.16138 5.19941C1.82066 5.55057 1.57881 5.98541 1.46 6.46C1.14257 8.20556 0.991266 9.97631 1.01 11.75C0.988418 13.537 1.13972 15.3213 1.46 17.08C1.59094 17.5398 1.8379 17.9581 2.17774 18.2945C2.51758 18.6308 2.93842 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46S18.88 19.46 20.6 19C21.0708 18.8668 21.4979 18.6118 21.8386 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 23.0036 13.5103 22.99 11.75C23.0116 9.96295 22.8603 8.1787 22.54 6.42Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 15.02L15.5 11.75L9.75 8.48V15.02Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default YouTube 