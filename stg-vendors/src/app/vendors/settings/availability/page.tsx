'use client'

import { useState, useEffect } from 'react'
import { Button, Text, Heading, Input, Label, Badge } from '@medusajs/ui'
import { Clock, Calendar, Plus, Trash } from '@medusajs/icons'
import { getFromBackend, putToBackend } from '@/utils/fetch'

interface DayHours {
  open: string
  close: string
  closed: boolean
}

interface BusinessHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

interface Holiday {
  id: string
  name: string
  date: string
  message?: string
  productsHidden: boolean
}

interface Vacation {
  id: string
  name: string
  startDate: string
  endDate: string
  message?: string
  productsHidden: boolean
  autoResume: boolean
}

interface SpecialEvent {
  id: string
  name: string
  startDate: string
  endDate: string
  message?: string
  productsHidden: boolean
  showBanner: boolean
}

interface TemporaryClosure {
  id: string
  reason: string
  startDate: string
  endDate: string
  message?: string
  productsHidden: boolean
  autoResume: boolean
  type: 'closed'
  hours?: BusinessHours
}

interface SpecialHours {
  holidays: Holiday[]
  vacations: Vacation[]
  specialEvents: SpecialEvent[]
  temporaryClosures: TemporaryClosure[]
}

interface AvailabilityData {
  businessHours: BusinessHours
  specialHours: SpecialHours
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
]

export default function AvailabilityPage() {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'business' | 'special'>('business')

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const data = await getFromBackend('/vendors/availability', { withCredentials: true })
        setAvailabilityData(data)
      } catch (error) {
        console.error('Failed to load availability:', error)
        setError('Failed to load availability settings')
      } finally {
        setLoading(false)
      }
    }
    loadAvailability()
  }, [])

  const handleBusinessHoursChange = (day: string, field: keyof DayHours, value: string | boolean) => {
    if (!availabilityData) return

    setAvailabilityData({
      ...availabilityData,
      businessHours: {
        ...availabilityData.businessHours,
        [day]: {
          ...availabilityData.businessHours[day as keyof BusinessHours],
          [field]: value,
        },
      },
    })
  }

  const handleSpecialHoursChange = (type: keyof SpecialHours, items: any[]) => {
    if (!availabilityData) return

    setAvailabilityData({
      ...availabilityData,
      specialHours: {
        ...availabilityData.specialHours,
        [type]: items,
      },
    })
  }

  const addSpecialHoursItem = (type: keyof SpecialHours, item: any) => {
    if (!availabilityData) return

    const newItem = {
      ...item,
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    handleSpecialHoursChange(type, [...availabilityData.specialHours[type], newItem])
  }

  const removeSpecialHoursItem = (type: keyof SpecialHours, id: string) => {
    if (!availabilityData) return

    handleSpecialHoursChange(
      type,
      availabilityData.specialHours[type].filter(item => item.id !== id)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await putToBackend('/vendors/availability', {
        businessHours: availabilityData?.businessHours,
        specialHours: availabilityData?.specialHours,
      }, { withCredentials: true })

      setAvailabilityData(response)
      setSuccess('Availability settings updated successfully!')
    } catch (error) {
      console.error('Failed to update availability:', error)
      setError('Failed to update availability settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-gray-600" />
          <Heading level="h1">Availability Settings</Heading>
        </div>
        <div className="text-center py-8">
          <Text>Loading availability settings...</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6 text-gray-600" />
        <Heading level="h1">Availability Settings</Heading>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <Text className="text-red-800">{error}</Text>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <Text className="text-green-800">{success}</Text>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('business')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'business'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Business Hours
            </button>
            <button
              onClick={() => setActiveTab('special')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'special'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Special Hours
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'business' && availabilityData && (
            <div className="space-y-6">
              <div>
                <Heading level="h2" className="text-lg font-semibold mb-4">Regular Business Hours</Heading>
                <div className="space-y-4">
                  {DAYS.map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-4">
                      <div className="w-24">
                        <Text className="font-medium">{label}</Text>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`${key}-closed`}
                          checked={availabilityData.businessHours[key as keyof BusinessHours].closed}
                          onChange={(e) => handleBusinessHoursChange(key, 'closed', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`${key}-closed`}>Closed</Label>
                      </div>
                      {!availabilityData.businessHours[key as keyof BusinessHours].closed && (
                        <>
                          <Input
                            type="time"
                            value={availabilityData.businessHours[key as keyof BusinessHours].open}
                            onChange={(e) => handleBusinessHoursChange(key, 'open', e.target.value)}
                            className="w-32"
                          />
                          <Text>to</Text>
                          <Input
                            type="time"
                            value={availabilityData.businessHours[key as keyof BusinessHours].close}
                            onChange={(e) => handleBusinessHoursChange(key, 'close', e.target.value)}
                            className="w-32"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'special' && availabilityData && (
            <div className="space-y-8">
              {/* Holidays */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Heading level="h2" className="text-lg font-semibold">Holidays</Heading>
                  <Button
                    variant="transparent"
                    size="small"
                    onClick={() => addSpecialHoursItem('holidays', {
                      name: '',
                      date: '',
                      message: '',
                      productsHidden: false,
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Holiday
                  </Button>
                </div>
                <div className="space-y-4">
                  {availabilityData.specialHours.holidays.map((holiday, index) => (
                    <div key={holiday.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Text className="font-medium">Holiday {index + 1}</Text>
                        <Button
                          variant="transparent"
                          size="small"
                          onClick={() => removeSpecialHoursItem('holidays', holiday.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={holiday.name}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.holidays]
                              updated[index] = { ...holiday, name: e.target.value }
                              handleSpecialHoursChange('holidays', updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={holiday.date}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.holidays]
                              updated[index] = { ...holiday, date: e.target.value }
                              handleSpecialHoursChange('holidays', updated)
                            }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Message (Optional)</Label>
                          <Input
                            value={holiday.message || ''}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.holidays]
                              updated[index] = { ...holiday, message: e.target.value }
                              handleSpecialHoursChange('holidays', updated)
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`holiday-${index}-hidden`}
                            checked={holiday.productsHidden}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.holidays]
                              updated[index] = { ...holiday, productsHidden: e.target.checked }
                              handleSpecialHoursChange('holidays', updated)
                            }}
                          />
                          <Label htmlFor={`holiday-${index}-hidden`}>Hide products during holiday</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vacations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Heading level="h2" className="text-lg font-semibold">Vacations</Heading>
                  <Button
                    variant="transparent"
                    size="small"
                    onClick={() => addSpecialHoursItem('vacations', {
                      name: '',
                      startDate: '',
                      endDate: '',
                      message: '',
                      productsHidden: false,
                      autoResume: true,
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vacation
                  </Button>
                </div>
                <div className="space-y-4">
                  {availabilityData.specialHours.vacations.map((vacation, index) => (
                    <div key={vacation.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Text className="font-medium">Vacation {index + 1}</Text>
                        <Button
                          variant="transparent"
                          size="small"
                          onClick={() => removeSpecialHoursItem('vacations', vacation.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={vacation.name}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.vacations]
                              updated[index] = { ...vacation, name: e.target.value }
                              handleSpecialHoursChange('vacations', updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={vacation.startDate}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.vacations]
                              updated[index] = { ...vacation, startDate: e.target.value }
                              handleSpecialHoursChange('vacations', updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            value={vacation.endDate}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.vacations]
                              updated[index] = { ...vacation, endDate: e.target.value }
                              handleSpecialHoursChange('vacations', updated)
                            }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Message (Optional)</Label>
                          <Input
                            value={vacation.message || ''}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.vacations]
                              updated[index] = { ...vacation, message: e.target.value }
                              handleSpecialHoursChange('vacations', updated)
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`vacation-${index}-hidden`}
                            checked={vacation.productsHidden}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.vacations]
                              updated[index] = { ...vacation, productsHidden: e.target.checked }
                              handleSpecialHoursChange('vacations', updated)
                            }}
                          />
                          <Label htmlFor={`vacation-${index}-hidden`}>Hide products during vacation</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`vacation-${index}-resume`}
                            checked={vacation.autoResume}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.vacations]
                              updated[index] = { ...vacation, autoResume: e.target.checked }
                              handleSpecialHoursChange('vacations', updated)
                            }}
                          />
                          <Label htmlFor={`vacation-${index}-resume`}>Auto-resume after vacation</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Events */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Heading level="h2" className="text-lg font-semibold">Special Events</Heading>
                  <Button
                    variant="transparent"
                    size="small"
                    onClick={() => addSpecialHoursItem('specialEvents', {
                      name: '',
                      startDate: '',
                      endDate: '',
                      message: '',
                      productsHidden: false,
                      showBanner: true,
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Special Event
                  </Button>
                </div>
                <div className="space-y-4">
                  {availabilityData.specialHours.specialEvents.map((event, index) => (
                    <div key={event.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Text className="font-medium">Special Event {index + 1}</Text>
                        <Button
                          variant="transparent"
                          size="small"
                          onClick={() => removeSpecialHoursItem('specialEvents', event.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={event.name}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.specialEvents]
                              updated[index] = { ...event, name: e.target.value }
                              handleSpecialHoursChange('specialEvents', updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={event.startDate}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.specialEvents]
                              updated[index] = { ...event, startDate: e.target.value }
                              handleSpecialHoursChange('specialEvents', updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            value={event.endDate}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.specialEvents]
                              updated[index] = { ...event, endDate: e.target.value }
                              handleSpecialHoursChange('specialEvents', updated)
                            }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Message (Optional)</Label>
                          <Input
                            value={event.message || ''}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.specialEvents]
                              updated[index] = { ...event, message: e.target.value }
                              handleSpecialHoursChange('specialEvents', updated)
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`event-${index}-hidden`}
                            checked={event.productsHidden}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.specialEvents]
                              updated[index] = { ...event, productsHidden: e.target.checked }
                              handleSpecialHoursChange('specialEvents', updated)
                            }}
                          />
                          <Label htmlFor={`event-${index}-hidden`}>Hide products during event</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`event-${index}-banner`}
                            checked={event.showBanner}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.specialEvents]
                              updated[index] = { ...event, showBanner: e.target.checked }
                              handleSpecialHoursChange('specialEvents', updated)
                            }}
                          />
                          <Label htmlFor={`event-${index}-banner`}>Show banner during event</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Temporary Closures */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Heading level="h2" className="text-lg font-semibold">Temporary Closures</Heading>
                  <Button
                    variant="transparent"
                    size="small"
                    onClick={() => addSpecialHoursItem('temporaryClosures', {
                      reason: '',
                      startDate: '',
                      endDate: '',
                      message: '',
                      productsHidden: false,
                      autoResume: true,
                      type: 'closed' as const,
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Temporary Closure
                  </Button>
                </div>
                <div className="space-y-4">
                  {availabilityData.specialHours.temporaryClosures.map((closure, index) => (
                    <div key={closure.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Text className="font-medium">Temporary Closure {index + 1}</Text>
                        <Button
                          variant="transparent"
                          size="small"
                          onClick={() => removeSpecialHoursItem('temporaryClosures', closure.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Reason</Label>
                          <Input
                            value={closure.reason}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.temporaryClosures]
                              updated[index] = { ...closure, reason: e.target.value }
                              handleSpecialHoursChange('temporaryClosures', updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={closure.startDate}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.temporaryClosures]
                              updated[index] = { ...closure, startDate: e.target.value }
                              handleSpecialHoursChange('temporaryClosures', updated)
                            }}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            value={closure.endDate}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.temporaryClosures]
                              updated[index] = { ...closure, endDate: e.target.value }
                              handleSpecialHoursChange('temporaryClosures', updated)
                            }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Message (Optional)</Label>
                          <Input
                            value={closure.message || ''}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.temporaryClosures]
                              updated[index] = { ...closure, message: e.target.value }
                              handleSpecialHoursChange('temporaryClosures', updated)
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`closure-${index}-hidden`}
                            checked={closure.productsHidden}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.temporaryClosures]
                              updated[index] = { ...closure, productsHidden: e.target.checked }
                              handleSpecialHoursChange('temporaryClosures', updated)
                            }}
                          />
                          <Label htmlFor={`closure-${index}-hidden`}>Hide products during closure</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`closure-${index}-resume`}
                            checked={closure.autoResume}
                            onChange={(e) => {
                              const updated = [...availabilityData.specialHours.temporaryClosures]
                              updated[index] = { ...closure, autoResume: e.target.checked }
                              handleSpecialHoursChange('temporaryClosures', updated)
                            }}
                          />
                          <Label htmlFor={`closure-${index}-resume`}>Auto-resume after closure</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
} 