"use client"

import { Fragment } from "react"
import { Popover, Transition } from "@headlessui/react"
import { useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import User from "@modules/common/icons/user"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

type ProfileDropdownProps = {
  customer?: HttpTypes.StoreCustomer | null
}

const ProfileDropdown = ({ customer }: ProfileDropdownProps) => {
  const { countryCode } = useParams() as { countryCode: string }

  const menuItems = [
    {
      label: "Manage My Account",
      href: "/account",
    },
    {
      label: "My Orders",
      href: "/account/orders",
    },
    {
      label: "My Returns & Cancellations",
      href: "/account/returns",
    },
    {
      label: "Setting",
      href: "/account/settings",
    },
  ]

  const handleSignOut = async () => {
    await signout(countryCode)
  }

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            {customer ? (
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {customer.first_name ? (
                  <span className="text-sm font-medium text-gray-700">
                    {customer.first_name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size="18" className="sm:w-5 sm:h-5 text-gray-600" />
                )}
              </div>
            ) : (
              <User size="18" className="sm:w-5 sm:h-5 text-gray-600" />
            )}
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {/* Pointer triangle */}
              <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
              
              <div className="p-6">
                {customer ? (
                  <>
                    {/* User Info Section */}
                    <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                        {customer.first_name ? (
                          <span className="text-lg font-medium text-gray-700">
                            {customer.first_name.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <User size="24" className="text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-base">
                          {customer.first_name && customer.last_name
                            ? `${customer.first_name} ${customer.last_name}`
                            : customer.first_name || "User"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {customer.email}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-2">
                      {menuItems.map((item) => (
                        <LocalizedClientLink
                          key={item.href}
                          href={item.href}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                          onClick={() => close()}
                        >
                          {item.label}
                        </LocalizedClientLink>
                      ))}
                      
                      <button
                        onClick={() => {
                          handleSignOut()
                          close()
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Not logged in state */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User size="24" className="text-gray-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Sign in to access your account
                      </p>
                      <LocalizedClientLink
                        href="/account"
                        className="inline-block bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                        onClick={() => close()}
                      >
                        Sign In
                      </LocalizedClientLink>
                    </div>
                  </>
                )}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

export default ProfileDropdown 