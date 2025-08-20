# Driver Dashboard

A Next.js dashboard for delivery drivers to manage their deliveries, view earnings, and update their profile.

## Features

- **Authentication**: Secure login/logout system
- **Dashboard Overview**: Key metrics and recent deliveries
- **Deliveries Management**: View and track delivery assignments
- **Profile Management**: Update driver information and vehicle details
- **Earnings Tracking**: View earnings, tips, and performance metrics

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with:
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

3. Run the development server:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3002`.

## Pages

- `/drivers/login` - Driver login page
- `/drivers/dashboard` - Main dashboard overview
- `/drivers/dashboard/deliveries` - Delivery management
- `/drivers/dashboard/profile` - Profile management
- `/drivers/dashboard/earnings` - Earnings and financial tracking

## Backend Requirements

This dashboard requires the Medusa backend with the following:
- Driver models and workflows
- Driver authentication API routes
- Delivery management API routes
- Profile management API routes

## Technologies Used

- Next.js 15
- TypeScript
- Tailwind CSS
- Medusa UI Components
- Medusa Icons
