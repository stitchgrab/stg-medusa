# Vendor Dashboard Login Guide

This guide explains how to login as a vendor and access the new vendor dashboard.

## 🚀 Quick Start

### 1. Start the Medusa Backend

```bash
cd stg
npm run dev
```

### 2. Seed a Demo Vendor Account

#### **Default Vendor (Quick Start)**
```bash
npm run seed:vendor
```

This creates a demo vendor account with the following credentials:
- **Email**: `vendor@stitchgrab.com`
- **Password**: Any password (for demo purposes)

#### **Custom Vendor with Environment Variables**
```bash
VENDOR_EMAIL=your-email@example.com VENDOR_FIRST_NAME=John VENDOR_LAST_NAME=Doe VENDOR_NAME="My Custom Vendor" npm run seed:vendor:custom
```

**Available Environment Variables:**
- `VENDOR_EMAIL` - Vendor admin email (default: vendor@stitchgrab.com)
- `VENDOR_FIRST_NAME` - First name (default: Demo)
- `VENDOR_LAST_NAME` - Last name (default: Vendor)
- `VENDOR_NAME` - Vendor business name (default: StitchGrab Demo Vendor)
- `VENDOR_HANDLE` - Vendor handle/URL slug (default: auto-generated)

**Examples:**
```bash
# Create vendor with custom email
VENDOR_EMAIL=john@mycompany.com npm run seed:vendor:custom

# Create vendor with full details
VENDOR_EMAIL=alice@fashionstore.com VENDOR_FIRST_NAME=Alice VENDOR_LAST_NAME=Smith VENDOR_NAME="Fashion Store Inc" npm run seed:vendor:custom

# Create vendor with custom handle
VENDOR_EMAIL=bob@techshop.com VENDOR_HANDLE=tech-shop-bob npm run seed:vendor:custom
```

#### **Cleanup Existing Vendors**
If you get an error about existing vendors, clean them up first:
```bash
npm run cleanup:vendor
```

### 3. Access the Vendor Login Page

Navigate to: `http://localhost:9000/vendor/login`

Or if you have the admin interface running, you can access it through the admin panel.

## 🔐 Authentication System

### API Endpoints

The vendor authentication system includes these endpoints:

- **POST** `/vendors/auth/login` - Vendor login
- **POST** `/vendors/auth/logout` - Vendor logout  
- **GET** `/vendors/auth/session` - Check vendor session

### Session Management

- Sessions are managed via HTTP-only cookies
- Session tokens are valid for 24 hours
- Vendors are automatically logged out when sessions expire

## 📊 Dashboard Features

Once logged in, vendors can access:

### 1. **Dashboard Overview** (`/vendor/dashboard`)
- Key performance metrics
- Revenue, orders, products, and customer stats
- Recent orders table
- Top products list
- Performance charts

### 2. **Product Management** (`/vendor/products`)
- Add, edit, and delete products
- Search and filter products
- Inventory tracking
- Status management (published, draft, archived)

### 3. **Order Management** (`/vendor/orders`)
- View and manage orders
- Update order status
- Process fulfillments
- Customer information

### 4. **Analytics** (`/vendor/analytics`)
- Business performance insights
- Revenue and order trends
- Customer segmentation
- Geographic distribution

### 5. **Settings** (`/vendor/settings`)
- Profile management
- Business information
- Notification preferences
- Shipping settings

## 🧩 Dashboard Widgets

The dashboard includes several widgets:

- **Stats Widget**: Key performance metrics with growth indicators
- **Quick Actions Widget**: Easy access to common tasks
- **Recent Activity Widget**: Latest updates and notifications

## 🔧 Development Notes

### Current Implementation

- **Mock Data**: The dashboard currently uses mock data for demonstration
- **Authentication**: Basic session-based authentication (not production-ready)
- **Password Verification**: Currently accepts any password for demo purposes

### Production Considerations

For production use, you should:

1. **Implement proper password hashing** in the vendor admin model
2. **Use JWT tokens** instead of simple session tokens
3. **Add password reset functionality**
4. **Implement proper role-based access control**
5. **Add rate limiting** to authentication endpoints
6. **Integrate with real data** instead of mock data

### Integration with Real Data

To connect the dashboard with real data:

1. **Update API calls** in dashboard components to use actual endpoints
2. **Implement proper error handling** for API failures
3. **Add loading states** for data fetching
4. **Implement real-time updates** for order status changes

## 🎯 Demo Workflow

1. **Start the backend**: `npm run dev`
2. **Seed vendor data**: `npm run seed:vendor`
3. **Access login page**: Navigate to the vendor login URL
4. **Login with demo credentials**: `vendor@stitchgrab.com` / any password
5. **Explore the dashboard**: Navigate through different sections
6. **Test features**: Try adding products, viewing orders, etc.

## 🔍 Troubleshooting

### Common Issues

1. **"Vendor admin not found"**: Run `npm run seed:vendor` to create the demo account
2. **"Network error"**: Ensure the backend is running on the correct port
3. **"Invalid session"**: Clear browser cookies and login again
4. **Dashboard not loading**: Check browser console for JavaScript errors

### Debug Commands

```bash
# Check if vendor was created
curl http://localhost:9000/vendors/auth/session

# Test login endpoint
curl -X POST http://localhost:9000/vendors/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@stitchgrab.com","password":"demo"}'
```

## 📝 Next Steps

1. **Customize the dashboard** for your specific needs
2. **Add real data integration** with your existing vendor APIs
3. **Implement proper authentication** with password hashing
4. **Add more vendor-specific features** like inventory management
5. **Create vendor registration flow** for new vendors
6. **Add notification system** for order updates

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify the backend is running correctly
3. Ensure all dependencies are installed
4. Check the Medusa logs for backend errors

The vendor dashboard is now ready for use! 🎉 