# StitchGrab Vendor Portal

A comprehensive vendor management system built with Next.js and Medusa.js, allowing vendors to manage their products, orders, payments, and business operations on the StitchGrab marketplace platform.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-based vendor authentication** with secure session management
- **Role-based access control** for vendor admins
- **CORS configuration** for cross-origin requests
- **Automatic session validation** and logout functionality
- **Secure token storage** in localStorage with proper cleanup

### 🛒 Order Management System
- **Complete order visibility**: View all orders containing vendor products
- **Detailed order views**: Comprehensive order information with customer details
- **Vendor-specific calculations**: See only your portion of order totals
- **Multi-vendor order handling**: Smart proportional calculations for mixed orders
- **Real-time updates**: Live order status tracking
- **Smart filtering**: Search and filter orders by various criteria
- **Contextual sidebar**: Order details appear in sidebar when viewing specific orders

### 💳 Stripe Connect Integration
- **Stripe Connect onboarding**: Complete vendor account setup process
- **Real-time payment status updates**: Live webhook processing
- **Automated vendor status management**: Status updates based on Stripe events
- **Payment processing**: Secure payment handling for vendor transactions
- **Account verification**: Automated verification status tracking

### 📦 Product Management
- **Product creation and editing**: Full CRUD operations for products
- **Inventory tracking**: Real-time stock management
- **Product variant management**: Handle multiple product options
- **Bulk operations**: Efficient management of large product catalogs
- **Vendor-specific product isolation**: Secure product ownership

### 📊 Dashboard & Analytics
- **Real-time business metrics**: Live performance indicators
- **Order analytics**: Comprehensive order tracking and analysis
- **Revenue tracking**: Accurate vendor revenue calculations
- **Performance insights**: Business intelligence and reporting

### 🏪 Store Management
- **Store profile management**: Complete store information handling
- **Location management**: Multiple store locations support
- **Business hours**: Flexible operating hours configuration
- **Store branding**: Logo and store customization

## 🏗️ Architecture

### Frontend (Next.js 15)
- **React 19** with TypeScript for type safety
- **Tailwind CSS** for responsive styling
- **Medusa UI components** for consistent design
- **Server-side rendering** for optimal performance
- **Client-side routing** with Next.js App Router

### Backend (Medusa.js)
- **RESTful API** with comprehensive endpoints
- **JWT authentication** with secure token handling
- **Database integration** with PostgreSQL
- **Webhook processing** for real-time updates
- **Middleware system** for request processing

### Key Technologies
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Medusa.js**: E-commerce backend framework
- **Stripe**: Payment processing and Connect platform
- **JWT**: Authentication and session management

## 📋 Vendor Portal Features

### Authentication System

#### Login Flow
```typescript
// Vendor login with email/password
const session = await vendorLogin(email, password)
// Returns: { authenticated: true, vendor_admin: {...}, vendor: {...} }
```

#### Session Management
- **Automatic session checking** on page load
- **Persistent login** with JWT tokens
- **Secure logout** with token cleanup
- **Session validation** on protected routes

#### Security Features
- **JWT token validation** on all API requests
- **CORS protection** for cross-origin requests
- **Route protection** for authenticated pages
- **Token expiration** handling

### Order Management System

#### Order List View (`/vendors/dashboard/orders`)
- **Comprehensive order listing**: Shows all orders containing vendor products
- **Smart filtering**: Search by order ID, customer email, or status
- **Vendor-specific totals**: Displays only the vendor's portion of order totals
- **Mixed order indicators**: Shows when orders contain products from multiple vendors
- **Clickable navigation**: Click any order row to view details
- **Pagination**: Handle large numbers of orders efficiently

#### Order Details View (`/vendors/dashboard/orders/[id]`)
- **Complete order breakdown**: Full order information with vendor-specific calculations
- **Customer information**: Customer details, shipping, and billing addresses
- **Item details**: Product variants, options, quantities, and pricing
- **Fulfillment tracking**: Shipping status, tracking numbers, and delivery information
- **Payment information**: Payment status, provider details, and transaction history
- **Order timeline**: Complete order lifecycle tracking

#### Smart Sidebar Integration
- **Contextual information**: Order details appear in sidebar when viewing specific orders
- **Quick navigation**: Easy access to order information and navigation
- **Real-time updates**: Order status and information updates automatically
- **Breadcrumb navigation**: Clear indication of current location

### Stripe Connect Integration

#### Onboarding Process
1. **Vendor initiates onboarding** from settings page
2. **Stripe Connect account creation** with business information
3. **Document verification** and identity checks
4. **Account activation** when verification is complete
5. **Real-time status updates** via webhook processing

#### Webhook Processing
- **Account updates**: Real-time status changes
- **Payment processing**: Transaction status updates
- **Verification events**: Document and identity verification
- **Automated vendor status management**

#### Payment Features
- **Secure payment processing** through Stripe
- **Multi-currency support** for international vendors
- **Automatic payouts** to vendor bank accounts
- **Transaction history** and reporting

### Product Management

#### Product Operations
- **Create products** with full variant support
- **Edit existing products** with real-time updates
- **Inventory management** with stock tracking
- **Bulk operations** for efficient management
- **Product categorization** and organization

#### Product Features
- **Multiple variants** (size, color, etc.)
- **Pricing management** with currency support
- **Image upload** and management
- **SEO optimization** with meta descriptions
- **Product status** management (active/inactive)

### Dashboard Analytics

#### Business Metrics
- **Total revenue** with currency formatting
- **Order count** and trends
- **Product performance** analytics
- **Customer insights** and behavior
- **Sales trends** and forecasting

#### Real-time Updates
- **Live order notifications**
- **Payment status updates**
- **Inventory alerts**
- **Performance indicators**

## 🔌 API Integration

### Authentication Endpoints

#### Vendor Login
```http
POST /vendors/auth/login
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "securepassword"
}
```

#### Session Validation
```http
GET /vendors/auth/session
Authorization: Bearer <jwt_token>
```

#### Vendor Logout
```http
POST /vendors/auth/logout
Authorization: Bearer <jwt_token>
```

### Order Management Endpoints

#### Get Vendor Orders
```http
GET /vendors/orders?limit=50&offset=0&search=order123&status=confirmed
Authorization: Bearer <jwt_token>
```

#### Get Order Details
```http
GET /vendors/orders/{orderId}
Authorization: Bearer <jwt_token>
```

### Stripe Integration Endpoints

#### Create Stripe Connect Account
```http
POST /vendors/stripe/connect
Authorization: Bearer <jwt_token>
```

#### Get Stripe Account Status
```http
GET /vendors/stripe/status
Authorization: Bearer <jwt_token>
```

### Product Management Endpoints

#### Create Product
```http
POST /vendors/products
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Premium T-Shirt",
  "description": "High-quality cotton t-shirt",
  "variants": [...],
  "options": [...]
}
```

#### Get Vendor Products
```http
GET /vendors/products?limit=50&offset=0
Authorization: Bearer <jwt_token>
```

## 🎨 User Interface

### Design System
- **Consistent component library** using Medusa UI
- **Responsive design** for all screen sizes
- **Accessibility compliance** with WCAG guidelines
- **Dark/light mode support** (future enhancement)

### Navigation
- **Sidebar navigation** with collapsible sections
- **Breadcrumb navigation** for clear location tracking
- **Quick actions** for common tasks
- **Search functionality** across all sections

### Interactive Elements
- **Loading states** for all async operations
- **Error handling** with user-friendly messages
- **Success notifications** for completed actions
- **Form validation** with real-time feedback

## 🔧 Development Setup

### Prerequisites
- **Node.js 18+** for development
- **Medusa.js backend** running on port 9000
- **Stripe account** for payment processing
- **PostgreSQL database** for data storage

### Environment Variables
```env
# Backend Configuration
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# CORS Configuration
VENDORS_NGROK_URL=https://your-ngrok-url.ngrok.io
VENDORS_PROD_URL=https://vendors.yourdomain.com
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development Commands
```bash
# Run tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint

# Build and export
npm run export
```

## 🚀 Deployment

### Production Build
```bash
# Create production build
npm run build

# Start production server
npm start
```

### Environment Configuration
- **Set production backend URL**
- **Configure Stripe production keys**
- **Set up proper CORS origins**
- **Configure database connections**

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment option
- **AWS**: For enterprise deployments
- **Docker**: Containerized deployment

## 🧪 Testing

### Test Coverage
- **Unit tests** for utility functions
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows
- **Component tests** for UI elements

### Testing Tools
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Cypress**: E2E testing
- **MSW**: API mocking

## 🔒 Security

### Authentication Security
- **JWT token validation** on all requests
- **Secure token storage** in localStorage
- **Automatic token refresh** handling
- **Session timeout** management

### Data Protection
- **Vendor data isolation** - vendors only see their data
- **Product ownership validation** before access
- **Order access control** based on product ownership
- **CORS protection** for cross-origin requests

### API Security
- **Rate limiting** to prevent abuse
- **Input validation** on all endpoints
- **SQL injection protection** through parameterized queries
- **XSS protection** through proper encoding

## 📊 Monitoring & Analytics

### Performance Monitoring
- **API response times** tracking
- **Error rate monitoring** by endpoint
- **User activity patterns** analysis
- **Resource usage** optimization

### Business Analytics
- **Vendor performance metrics**
- **Order processing efficiency**
- **Payment success rates**
- **Customer satisfaction tracking**

## 🐛 Troubleshooting

### Common Issues

#### Authentication Problems
1. **Check JWT token validity**
2. **Verify vendor session exists**
3. **Ensure CORS is properly configured**
4. **Check environment variables**

#### Order Data Issues
1. **Verify products are associated with vendors**
2. **Check vendor has products in the system**
3. **Ensure proper product-vendor relationships**
4. **Validate order access permissions**

#### Stripe Integration Issues
1. **Verify Stripe API keys are correct**
2. **Check webhook endpoint configuration**
3. **Ensure Stripe Connect account is active**
4. **Validate webhook signature verification**

#### CORS Errors
1. **Check backend CORS configuration**
2. **Verify allowed origins in environment**
3. **Ensure OPTIONS requests are handled**
4. **Check authentication middleware configuration**

### Debug Mode
```bash
# Enable debug logging
DEBUG=medusa:* npm run dev

# Check API responses
curl -H "Authorization: Bearer <token>" http://localhost:9000/vendors/orders
```

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests for new functionality**
5. **Update documentation**
6. **Submit a pull request**

### Code Standards
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Conventional commits** for commit messages

### Testing Requirements
- **Unit tests** for new functions
- **Integration tests** for new endpoints
- **E2E tests** for critical flows
- **Documentation updates** for new features

## 📞 Support

### Technical Support
- **Check troubleshooting section** above
- **Review API documentation** in `/docs` folder
- **Check GitHub issues** for known problems
- **Contact development team** with specific error details

### Documentation
- **API Documentation**: `/docs/VENDOR_ORDERS_API.md`
- **Component Documentation**: Inline code comments
- **Setup Guides**: This README and related docs
- **Video Tutorials**: Available in team resources

### Contact Information
- **Development Team**: dev@stitchgrab.com
- **Technical Issues**: github.com/stitchgrab/vendor-portal/issues
- **Feature Requests**: github.com/stitchgrab/vendor-portal/discussions

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Maintainer**: StitchGrab Development Team  
**License**: Proprietary - StitchGrab Inc.
