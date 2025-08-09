# Vendor Availability Scheduled Job

## Overview

The `vendor-availability-checker.ts` job automatically manages vendor product visibility based on their availability settings. It runs every 6 hours and handles:

- **Auto-resume products** when vacations/temporary closures end
- **Hide products** when special events start
- **Resume products** when holidays end
- **Handle autoResume flag** for vacations and temporary closures

## How It Works

1. **Fetches all vendors** with their business hours and special hours
2. **Checks current availability status** for each vendor
3. **Determines product visibility** based on:
   - Active special events (holidays, vacations, special events, temporary closures)
   - Auto-resume settings for vacations and temporary closures
   - Whether products should be hidden or visible
4. **Updates product status** (published/draft) accordingly

## Schedule

- **Cron Expression**: `"0 */6 * * *"` (every 6 hours)
- **Runs**: 12:00 AM, 6:00 AM, 12:00 PM, 6:00 PM

## Configuration

The job is configured in the file itself:

```typescript
export const config = {
  name: "vendor-availability-checker",
  schedule: "0 */6 * * *", // Run every 6 hours
}
```

## Testing

Use the `test-vendor-availability.ts` file to manually test the job:

```typescript
// Uncomment the last line in test-vendor-availability.ts
testVendorAvailabilityJob()
```

## Logging

The job uses Medusa's logger to output:
- Job start/completion messages
- Vendor processing results
- Error messages for failed vendors
- Summary statistics

## Dependencies

- `@medusajs/framework/types` - For MedusaContainer
- `@medusajs/framework/utils` - For ContainerRegistrationKeys
- `@medusajs/medusa/core-flows` - For updateProductsWorkflow
- `../utils/vendor-availability` - For availability checking logic
