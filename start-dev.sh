#!/bin/bash

# Start both Medusa backend and vendor dashboard
echo "🚀 Starting StitchGrab development environment..."

# Function to cleanup background processes on exit
cleanup() {
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $VENDORS_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start Medusa backend
echo "📦 Starting Medusa backend on port 9000..."
cd stg && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start vendor dashboard
echo "🛍️  Starting vendor dashboard on port 3001..."
cd stg-vendors && npm run dev &
VENDORS_PID=$!

echo "✅ Both services are starting..."
echo "   - Medusa Backend: http://localhost:9000"
echo "   - Vendor Dashboard: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for both processes
wait 