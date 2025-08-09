import { BusinessHours, SpecialHours } from '../types/vendor'

export interface VendorStatus {
  isOpen: boolean
  message?: string
  productsHidden: boolean
  showBanner: boolean
  bannerMessage?: string
}

export class VendorAvailabilityChecker {
  private businessHours: BusinessHours
  private specialHours: SpecialHours

  constructor(businessHours: BusinessHours, specialHours: SpecialHours) {
    this.businessHours = businessHours
    this.specialHours = specialHours
  }

  /**
   * Check if the vendor is currently open and if products should be hidden
   */
  checkCurrentStatus(): VendorStatus {
    const now = new Date()
    const currentDay = this.getDayOfWeek(now)
    const currentTime = this.formatTime(now)

    // Check for active special events first
    const activeSpecialEvent = this.getActiveSpecialEvent(now)
    if (activeSpecialEvent) {
      return {
        isOpen: false,
        message: activeSpecialEvent.message || `${activeSpecialEvent.name} - Closed`,
        productsHidden: activeSpecialEvent.productsHidden,
        showBanner: 'showBanner' in activeSpecialEvent ? activeSpecialEvent.showBanner : false,
        bannerMessage: activeSpecialEvent.message,
      }
    }

    // Check regular business hours
    const dayHours = this.businessHours[currentDay]
    if (!dayHours || dayHours.closed) {
      return {
        isOpen: false,
        message: 'Closed today',
        productsHidden: false,
        showBanner: false,
      }
    }

    const isOpen = this.isTimeBetween(currentTime, dayHours.open, dayHours.close)

    return {
      isOpen,
      message: isOpen ? 'Open' : 'Closed',
      productsHidden: false,
      showBanner: false,
    }
  }

  /**
   * Get active special event (holiday, vacation, special event, or temporary closure)
   */
  getActiveSpecialEvent(date: Date): any {
    const dateString = date.toISOString().split('T')[0]
    const currentTime = date.getTime()

    // Check holidays
    for (const holiday of this.specialHours.holidays || []) {
      if (holiday.date === dateString) {
        return holiday
      }
    }

    // Check vacations
    for (const vacation of this.specialHours.vacations || []) {
      const startDate = new Date(vacation.startDate)
      const endDate = new Date(vacation.endDate)
      if (currentTime >= startDate.getTime() && currentTime <= endDate.getTime()) {
        return vacation
      }
    }

    // Check special events
    for (const event of this.specialHours.specialEvents || []) {
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)
      if (currentTime >= startDate.getTime() && currentTime <= endDate.getTime()) {
        return event
      }
    }

    // Check temporary closures
    for (const closure of this.specialHours.temporaryClosures || []) {
      const startDate = new Date(closure.startDate)
      const endDate = new Date(closure.endDate)
      if (currentTime >= startDate.getTime() && currentTime <= endDate.getTime()) {
        return closure
      }
    }

    return null
  }

  /**
   * Check if products should be hidden for a specific vendor
   */
  shouldHideProducts(): boolean {
    const status = this.checkCurrentStatus()
    return status.productsHidden
  }

  /**
   * Get banner information for the vendor
   */
  getBannerInfo(): { show: boolean; message?: string } {
    const status = this.checkCurrentStatus()
    return {
      show: status.showBanner,
      message: status.bannerMessage,
    }
  }

  /**
   * Get vendor status message
   */
  getStatusMessage(): string {
    const status = this.checkCurrentStatus()
    return status.message || 'Status unavailable'
  }

  /**
   * Check if vendor is currently open
   */
  isCurrentlyOpen(): boolean {
    const status = this.checkCurrentStatus()
    return status.isOpen
  }

  /**
   * Get upcoming special events
   */
  getUpcomingEvents(days: number = 30): Array<any> {
    const now = new Date()
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    const upcoming: Array<any> = []

    // Check holidays
    for (const holiday of this.specialHours.holidays || []) {
      const holidayDate = new Date(holiday.date)
      if (holidayDate >= now && holidayDate <= futureDate) {
        upcoming.push({ ...holiday, type: 'holiday' })
      }
    }

    // Check vacations
    for (const vacation of this.specialHours.vacations || []) {
      const startDate = new Date(vacation.startDate)
      if (startDate >= now && startDate <= futureDate) {
        upcoming.push({ ...vacation, type: 'vacation' })
      }
    }

    // Check special events
    for (const event of this.specialHours.specialEvents || []) {
      const startDate = new Date(event.startDate)
      if (startDate >= now && startDate <= futureDate) {
        upcoming.push({ ...event, type: 'specialEvent' })
      }
    }

    // Check temporary closures
    for (const closure of this.specialHours.temporaryClosures || []) {
      const startDate = new Date(closure.startDate)
      if (startDate >= now && startDate <= futureDate) {
        upcoming.push({ ...closure, type: 'temporaryClosure' })
      }
    }

    return upcoming.sort((a, b) => {
      const aDate = new Date(a.startDate || a.date)
      const bDate = new Date(b.startDate || b.date)
      return aDate.getTime() - bDate.getTime()
    })
  }

  /**
   * Helper methods
   */
  private getDayOfWeek(date: Date): keyof BusinessHours {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[date.getDay()] as keyof BusinessHours
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5)
  }

  private isTimeBetween(current: string, start: string, end: string): boolean {
    return current >= start && current <= end
  }
}

/**
 * Factory function to create a vendor availability checker
 */
export function createVendorAvailabilityChecker(
  businessHours: BusinessHours,
  specialHours: SpecialHours
): VendorAvailabilityChecker {
  return new VendorAvailabilityChecker(businessHours, specialHours)
} 