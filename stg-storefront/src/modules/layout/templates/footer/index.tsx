import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import NewsletterSignup from "@modules/layout/components/newsletter-signup"
import Instagram from "@modules/common/icons/instagram"
import Facebook from "@modules/common/icons/facebook"
import Twitter from "@modules/common/icons/twitter"
import YouTube from "@modules/common/icons/youtube"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200">
      <div className="content-container py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* ABOUT Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">ABOUT</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <LocalizedClientLink
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About StitchGrab
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/careers"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Careers
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/sustainability"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sustainability
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/press"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Press & Media
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/investors"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Investor Relations
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* SUPPORT Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">SUPPORT</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <LocalizedClientLink
                  href="/help"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Help Center
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/size-guide"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Size Guide
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/shipping"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Shipping Info
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/returns"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Returns & Exchanges
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* INFORMATION Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">INFORMATION</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <LocalizedClientLink
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/terms"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/cookies"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cookie Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/accessibility"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Accessibility
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/sitemap"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sitemap
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* FOLLOW US Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">FOLLOW US</h3>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mb-6">
              <a
                href="https://instagram.com/stitchgrab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram size="24" />
              </a>
              <a
                href="https://facebook.com/stitchgrab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook size="24" />
              </a>
              <a
                href="https://twitter.com/stitchgrab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter size="24" />
              </a>
              <a
                href="https://youtube.com/stitchgrab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Follow us on YouTube"
              >
                <YouTube size="24" />
              </a>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-900">Newsletter</h4>
              <p className="text-xs text-gray-600 mb-3">
                Get the latest updates on new arrivals and exclusive offers
              </p>
              <NewsletterSignup />
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <LocalizedClientLink
                href="/"
                className="text-xl font-bold hover:text-gray-700 transition-colors text-gray-900"
              >
                STITCHGRAB
              </LocalizedClientLink>
              <Text className="text-sm text-gray-600">
                © {new Date().getFullYear()} StitchGrab. All rights reserved.
              </Text>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Same-day fashion delivery in South Florida</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
