# Vendor Portal Setup Guide

Quick setup guide for developers to get the StitchGrab Vendor Portal running locally.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Medusa.js backend running on port 9000
- Stripe account (for payment processing)
- Git access to the repository

### 1. Clone and Install
```bash
# Navigate to the vendor portal directory
cd stg-vendors

# Install dependencies
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the `stg-vendors` directory:

```env
# Backend Configuration
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Stripe Configuration (get from Stripe dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# Optional: For ngrok development
VENDORS_NGROK_URL=https://your-ngrok-url.ngrok.io
```

### 3. Start Development Server
```bash
npm run dev
```

The vendor portal will be available at `http://localhost:3001`

## 🔧 Backend Setup

### Medusa.js Backend Requirements
Ensure your Medusa backend has the following:

1. **Vendor tables** in the database
2. **JWT authentication** configured
3. **CORS settings** for vendor portal
4. **Stripe integration** with webhooks

### Required Backend Environment Variables
```env
# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CORS Configuration
VENDORS_NGROK_URL=https://your-ngrok-url.ngrok.io
VENDORS_PROD_URL=https://vendors.yourdomain.com
```

## 🧪 Testing the Setup

### 1. Test Authentication
- Navigate to `http://localhost:3001/vendors/login`
- Create a vendor account or use existing credentials
- Verify successful login and redirect to dashboard

### 2. Test Order Management
- Navigate to Orders section in the dashboard
- Verify orders are loading (if vendor has products)
- Test order details page navigation

### 3. Test Stripe Integration
- Navigate to Settings → Stripe
- Test the Connect onboarding flow
- Verify webhook processing (requires ngrok)

## 🔍 Common Issues & Solutions

### CORS Errors
```bash
# Check if backend CORS is configured
curl -H "Origin: http://localhost:3001" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS http://localhost:9000/vendors/auth/session
```

### Authentication Issues
1. **Check JWT token**: Verify token is being sent in Authorization header
2. **Check backend session**: Ensure vendor session exists in database
3. **Check environment variables**: Verify JWT_SECRET is set correctly

### Order Data Issues
1. **Verify vendor has products**: Check product-vendor relationships
2. **Check database connections**: Ensure backend can access database
3. **Verify API endpoints**: Test backend endpoints directly

### Stripe Integration Issues
1. **Check API keys**: Verify Stripe keys are correct
2. **Check webhook endpoint**: Ensure webhook URL is accessible
3. **Verify webhook signature**: Check webhook secret configuration

## 🛠️ Development Workflow

### Making Changes
1. **Create feature branch**: `git checkout -b feature/your-feature`
2. **Make changes**: Edit files in `src/` directory
3. **Test locally**: Ensure everything works
4. **Commit changes**: Use conventional commit format
5. **Push and create PR**: Submit for review

### Code Standards
- **TypeScript**: All new code should be typed
- **ESLint**: Run `npm run lint` before committing
- **Prettier**: Code formatting is automatic
- **Tests**: Add tests for new functionality

### File Structure
```
src/
├── app/                    # Next.js App Router pages
│   └── vendors/
│       ├── login/         # Authentication pages
│       └── dashboard/     # Main vendor dashboard
├── components/            # Reusable React components
├── utils/                 # Utility functions
│   ├── auth.ts           # Authentication utilities
│   └── fetch.ts          # API fetch utilities
└── types/                # TypeScript type definitions
```

## 📚 Additional Resources

### Documentation
- **Main README**: Comprehensive feature documentation
- **API Documentation**: `/docs/VENDOR_ORDERS_API.md`
- **Changelog**: `/CHANGELOG.md` for version history

### Useful Commands
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
npm run test            # Run tests

# Database
npx medusa db:migrate   # Run database migrations
npx medusa db:seed      # Seed database with test data
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=medusa:* npm run dev

# Check API responses
curl -H "Authorization: Bearer <token>" \
     http://localhost:9000/vendors/orders
```

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
VENDORS_PROD_URL=https://vendors.yourdomain.com
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js apps
- **Netlify**: Alternative deployment option
- **AWS**: For enterprise deployments

## 🤝 Getting Help

### Support Channels
- **GitHub Issues**: Report bugs and request features
- **Development Team**: dev@stitchgrab.com
- **Documentation**: Check the main README and API docs

### Troubleshooting Checklist
- [ ] Node.js version is 18+
- [ ] Medusa backend is running on port 9000
- [ ] Environment variables are set correctly
- [ ] Database has vendor tables and data
- [ ] Stripe API keys are valid
- [ ] CORS is configured properly
- [ ] JWT secret is set in backend

---

**Need Help?** Check the troubleshooting section in the main README or contact the development team.
