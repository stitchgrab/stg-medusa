import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { retrieveCustomer } from "@lib/data/customer"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileCartButton from "@modules/layout/components/mobile-cart-button"
import ProfileDropdown from "@modules/layout/components/profile-dropdown"
import SideMenu from "@modules/layout/components/side-menu"
import SearchBar from "@modules/layout/components/search-bar"
import ShopDropdown from "@modules/layout/components/shop-dropdown"
import MobileSearchToggle from "@modules/layout/components/mobile-search-toggle"
import LocationToggle from "@modules/layout/components/location-toggle"
import User from "@modules/common/icons/user"
import Cart from "@modules/common/icons/cart"

export default async function Nav() {
  let regions: StoreRegion[] = []
  let productCategories: any[] = []
  let customer: any = null

  try {
    regions = await listRegions().then((regions: StoreRegion[]) => regions)
  } catch (error) {
    console.warn('Failed to fetch regions in Nav component:', error)
  }

  try {
    productCategories = await listCategories()
  } catch (error) {
    console.warn('Failed to fetch categories in Nav component:', error)
  }

  try {
    customer = await retrieveCustomer()
  } catch (error) {
    console.warn('Failed to fetch customer in Nav component:', error)
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 sm:h-20 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container flex items-center justify-between w-full h-full px-3 sm:px-4 lg:px-6">

          {/* Left Section - Desktop Navigation Links / Mobile Menu */}
          <div className="flex items-center flex-1">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <SideMenu regions={regions} />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <LocalizedClientLink
                href="/store?new=true"
                className="text-sm font-medium hover:text-gray-700 transition-colors"
                data-testid="nav-new-in-link"
              >
                NEW IN
              </LocalizedClientLink>

              <ShopDropdown categories={productCategories} />

              <LocalizedClientLink
                href="/brands"
                className="text-sm font-medium hover:text-gray-700 transition-colors"
                data-testid="nav-brands-link"
              >
                BRANDS
              </LocalizedClientLink>
            </div>
          </div>

          {/* Center Section - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-auto lg:transform-none flex items-center justify-center">
            <LocalizedClientLink
              href="/"
              className="hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              <img
                src="/stitchgrab-logo.png"
                alt="STITCHGRAB"
                className="h-8 sm:h-10 lg:h-12 w-auto"
              />
            </LocalizedClientLink>
          </div>

          {/* Right Section - Icons/Actions */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-1 justify-end">
            {/* Search - Icon on small screens, full search bar on large screens */}
            <div className="hidden lg:block">
              <SearchBar />
            </div>
            <MobileSearchToggle />

            {/* Location - Icon only on small/medium, text + icon on large */}
            <LocationToggle />

            {/* Cart - Icon only on small/medium, enhanced on large */}
            <div className="hidden lg:block">
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="hover:text-ui-fg-base flex gap-2 items-center"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    Cart (0)
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid="nav-cart-link"
                >
                  <Cart size="18" className="sm:w-5 sm:h-5 text-gray-600" />
                </LocalizedClientLink>
              }
            >
              <MobileCartButton />
            </Suspense>

            {/* User Profile Dropdown */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  href="/account"
                  data-testid="nav-account-link"
                >
                  <User size="18" className="sm:w-5 sm:h-5 text-gray-600" />
                </LocalizedClientLink>
              }
            >
              <ProfileDropdown customer={customer} />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}

