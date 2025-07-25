import { Metadata } from "next"
import { Button, Heading, Text } from "@medusajs/ui"
import { MapPin, ArrowLeft } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ComingSoonTemplate from "@modules/coming-soon/templates"

export const metadata: Metadata = {
  title: "Coming Soon to Your Area | StitchGrab",
  description: "StitchGrab is expanding! We'll be in your area soon. Enter your email to be notified when we launch in your location.",
}

export default function ComingSoonPage() {
  return <ComingSoonTemplate />
} 