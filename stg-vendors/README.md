# StitchGrab Vendor Dashboard

A Next.js application for vendors to manage their products and orders on the StitchGrab platform.

## Features

- **Vendor Login**: Secure authentication with the Medusa backend
- **Dashboard**: Overview of orders, products, and quick actions
- **Session Management**: Automatic session checking and logout functionality
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- Medusa backend running on `http://localhost:9000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3001](http://localhost:3001) in your browser.

## URL Structure

- `/vendors/login` - Vendor login page
- `/vendors/dashboard` - Main vendor dashboard (requires authentication)

## Development

The application connects to the Medusa backend API endpoints:

- `POST /vendors/auth/login` - Authenticate vendor
- `GET /vendors/auth/session` - Check session status
- `POST /vendors/auth/logout` - Logout vendor

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 19** - UI library

## Project Structure

```
src/
├── app/
│   ├── vendors/
│   │   ├── login/
│   │   │   └── page.tsx      # Login page
│   │   └── dashboard/
│   │       └── page.tsx      # Dashboard page
│   └── page.tsx              # Root redirect
└── ...
```
