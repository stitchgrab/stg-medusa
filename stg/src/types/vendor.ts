// Vendor Special Hours Types
export interface SpecialHours {
  holidays?: Holiday[]
  vacations?: Vacation[]
  specialEvents?: SpecialEvent[]
  temporaryClosures?: TemporaryClosure[]
}

export interface Holiday {
  id: string
  name: string
  date: string // ISO date string
  type: 'closed' | 'reduced_hours' | 'special_hours'
  hours?: BusinessHours // For reduced/special hours
  message?: string // "Closed for Christmas"
  productsHidden: boolean
}

export interface Vacation {
  id: string
  name: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  type: 'closed' | 'reduced_hours'
  hours?: BusinessHours // For reduced hours during vacation
  message?: string // "On vacation until Jan 15"
  productsHidden: boolean
  autoResume: boolean // Automatically resume normal hours after vacation
}

export interface SpecialEvent {
  id: string
  name: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  type: 'extended_hours' | 'special_hours' | 'sale'
  hours?: BusinessHours
  message?: string // "Extended hours for Black Friday"
  bannerMessage?: string // "20% off everything!"
  productsHidden: boolean
  showBanner: boolean
}

export interface TemporaryClosure {
  id: string
  reason: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  message?: string // "Temporarily closed for renovations"
  productsHidden: boolean
  autoResume: boolean
  type: 'closed' // Temporary closures are always closed
  hours?: BusinessHours // Optional hours for partial closures
}

// Business Hours Types
export interface BusinessHours {
  monday?: DayHours
  tuesday?: DayHours
  wednesday?: DayHours
  thursday?: DayHours
  friday?: DayHours
  saturday?: DayHours
  sunday?: DayHours
}

export interface DayHours {
  open: string // "09:00"
  close: string // "17:00"
  closed?: boolean
  breakStart?: string // "12:00"
  breakEnd?: string // "13:00"
}

// Vendor Model Types
export interface Vendor {
  id: string
  handle: string
  name: string
  logo?: string
  businessHours?: BusinessHours
  specialHours?: SpecialHours
  address?: VendorAddress
}

export interface VendorAddress {
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  postal_code?: string
  province?: string
} 