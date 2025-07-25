// South Miami launch zipcodes where StitchGrab is available
export const LAUNCH_ZIPCODES = [
  '33101', '33109', '33125', '33127', '33128', '33129', '33130', '33131', 
  '33132', '33133', '33134', '33135', '33136', '33137', '33138', '33139', 
  '33140', '33141', '33142', '33145', '33146', '33147', '33149', '33150', 
  '33151', '33153'
] as const

export type LaunchZipcode = typeof LAUNCH_ZIPCODES[number]

// Helper function to check if a zipcode is in our launch area
export const isZipcodeInLaunchArea = (zipcode: string): boolean => {
  return LAUNCH_ZIPCODES.includes(zipcode as LaunchZipcode)
}

// Helper function to get coordinates for South Florida (approximate center)
export const SOUTH_FLORIDA_CENTER = {
  lat: 25.7617,
  lng: -80.1918
}

// Radius in miles for vendor filtering (20 miles as specified)
export const VENDOR_RADIUS_MILES = 20 