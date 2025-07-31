import { SpecialHours, Holiday, Vacation, SpecialEvent, TemporaryClosure, BusinessHours } from '../types/vendor'

export interface VendorStatus {
  isOpen: boolean
  currentHours?: BusinessHours
  message?: string
  bannerMessage?: string
  productsHidden: boolean
  specialEvent?: Holiday | Vacation | SpecialEvent | TemporaryClosure
}

export class VendorHoursManager {
  private specialHours: SpecialHours
  private businessHours: BusinessHours

  constructor(specialHours: SpecialHours, businessHours: BusinessHours) {
    this.specialHours = specialHours
    this.businessHours = businessHours
  }

  /**
   * Get current vendor status based on special hours
   */
  getCurrentStatus(): VendorStatus {
    const now = new Date()
    const today = now.toISOString().split('T')[0] // YYYY-MM-DD
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM

    // Check for active special events
    const activeEvent = this.getActiveSpecialEvent(now)

    if (activeEvent) {
      return {
        isOpen: activeEvent.type !== 'closed',
        currentHours: activeEvent.hours,
        message: activeEvent.message,
        bannerMessage: 'bannerMessage' in activeEvent ? activeEvent.bannerMessage : undefined,
        productsHidden: activeEvent.productsHidden,
        specialEvent: activeEvent
      }
    }

    // Check regular business hours
    const dayOfWeek = this.getDayOfWeek(now)
    const todayHours = this.businessHours[dayOfWeek]

    if (!todayHours || todayHours.closed) {
      return {
        isOpen: false,
        productsHidden: false,
        message: 'Closed today'
      }
    }

    const isOpen = this.isTimeBetween(currentTime, todayHours.open, todayHours.close)

    return {
      isOpen,
      currentHours: { [dayOfWeek]: todayHours },
      productsHidden: false,
      message: isOpen ? 'Open now' : 'Closed now'
    }
  }

  /**
   * Get active special event for a given date
   */
  private getActiveSpecialEvent(date: Date): Holiday | Vacation | SpecialEvent | TemporaryClosure | null {
    const dateStr = date.toISOString().split('T')[0]

    // Check holidays
    if (this.specialHours.holidays) {
      const holiday = this.specialHours.holidays.find(h => h.date === dateStr)
      if (holiday) return holiday
    }

    // Check vacations
    if (this.specialHours.vacations) {
      const vacation = this.specialHours.vacations.find(v =>
        dateStr >= v.startDate && dateStr <= v.endDate
      )
      if (vacation) return vacation
    }

    // Check special events
    if (this.specialHours.specialEvents) {
      const event = this.specialHours.specialEvents.find(e =>
        dateStr >= e.startDate && dateStr <= e.endDate
      )
      if (event) return event
    }

    // Check temporary closures
    if (this.specialHours.temporaryClosures) {
      const closure = this.specialHours.temporaryClosures.find(c =>
        dateStr >= c.startDate && dateStr <= c.endDate
      )
      if (closure) return closure
    }

    return null
  }

  /**
   * Add a holiday
   */
  addHoliday(holiday: Omit<Holiday, 'id'>): void {
    if (!this.specialHours.holidays) {
      this.specialHours.holidays = []
    }

    this.specialHours.holidays.push({
      ...holiday,
      id: this.generateId()
    })
  }

  /**
   * Add a vacation
   */
  addVacation(vacation: Omit<Vacation, 'id'>): void {
    if (!this.specialHours.vacations) {
      this.specialHours.vacations = []
    }

    this.specialHours.vacations.push({
      ...vacation,
      id: this.generateId()
    })
  }

  /**
   * Add a special event
   */
  addSpecialEvent(event: Omit<SpecialEvent, 'id'>): void {
    if (!this.specialHours.specialEvents) {
      this.specialHours.specialEvents = []
    }

    this.specialHours.specialEvents.push({
      ...event,
      id: this.generateId()
    })
  }

  /**
   * Add a temporary closure
   */
  addTemporaryClosure(closure: Omit<TemporaryClosure, 'id'>): void {
    if (!this.specialHours.temporaryClosures) {
      this.specialHours.temporaryClosures = []
    }

    this.specialHours.temporaryClosures.push({
      ...closure,
      id: this.generateId()
    })
  }

  /**
   * Remove expired events
   */
  cleanupExpiredEvents(): void {
    const today = new Date().toISOString().split('T')[0]

    if (this.specialHours.vacations) {
      this.specialHours.vacations = this.specialHours.vacations.filter(v => v.endDate >= today)
    }

    if (this.specialHours.specialEvents) {
      this.specialHours.specialEvents = this.specialHours.specialEvents.filter(e => e.endDate >= today)
    }

    if (this.specialHours.temporaryClosures) {
      this.specialHours.temporaryClosures = this.specialHours.temporaryClosures.filter(c => c.endDate >= today)
    }
  }

  /**
   * Get upcoming special events
   */
  getUpcomingEvents(days: number = 30): Array<Holiday | Vacation | SpecialEvent | TemporaryClosure> {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + days)

    const events: Array<Holiday | Vacation | SpecialEvent | TemporaryClosure> = []

    if (this.specialHours.holidays) {
      events.push(...this.specialHours.holidays.filter(h => h.date >= today.toISOString().split('T')[0]))
    }

    if (this.specialHours.vacations) {
      events.push(...this.specialHours.vacations.filter(v => v.startDate >= today.toISOString().split('T')[0]))
    }

    if (this.specialHours.specialEvents) {
      events.push(...this.specialHours.specialEvents.filter(e => e.startDate >= today.toISOString().split('T')[0]))
    }

    if (this.specialHours.temporaryClosures) {
      events.push(...this.specialHours.temporaryClosures.filter(c => c.startDate >= today.toISOString().split('T')[0]))
    }

    return events.sort((a, b) => {
      const dateA = 'date' in a ? a.date : a.startDate
      const dateB = 'date' in b ? b.date : b.startDate
      return dateA.localeCompare(dateB)
    })
  }

  private getDayOfWeek(date: Date): keyof BusinessHours {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[date.getDay()] as keyof BusinessHours
  }

  private isTimeBetween(current: string, start: string, end: string): boolean {
    return current >= start && current <= end
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
} 