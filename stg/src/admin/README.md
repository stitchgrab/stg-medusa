# Admin Customizations

You can extend the Medusa Admin to add widgets and new pages. Your customizations interact with API routes to provide merchants with custom functionalities.

> Learn more about Admin Extensions in [this documentation](https://docs.medusajs.com/learn/fundamentals/admin).

## Vendor Dashboard

A comprehensive vendor dashboard has been created that provides vendors with tools to manage their business on the StitchGrab marketplace. The dashboard includes:

### Pages

1. **Vendor Dashboard** (`vendor-dashboard.tsx`)
   - Overview of business performance
   - Key metrics and statistics
   - Recent orders and top products
   - Performance charts

2. **Vendor Products** (`vendor-products.tsx`)
   - Product catalog management
   - Add, edit, and delete products
   - Inventory tracking
   - Product status management

3. **Vendor Orders** (`vendor-orders.tsx`)
   - Order management and fulfillment
   - Order status updates
   - Customer information
   - Shipping details

4. **Vendor Analytics** (`vendor-analytics.tsx`)
   - Business performance insights
   - Revenue and order trends
   - Customer segmentation
   - Geographic distribution

5. **Vendor Settings** (`vendor-settings.tsx`)
   - Profile management
   - Business information
   - Notification preferences
   - Shipping and payment settings

### Widgets

1. **Vendor Stats Widget** (`vendor-stats-widget.tsx`)
   - Key performance metrics
   - Growth indicators
   - Goal progress tracking

2. **Vendor Quick Actions Widget** (`vendor-quick-actions-widget.tsx`)
   - Quick access to common tasks
   - Navigation shortcuts

3. **Vendor Recent Activity Widget** (`vendor-recent-activity-widget.tsx`)
   - Latest activities and updates
   - Order and product notifications

### Components

1. **Vendor Navigation** (`vendor-navigation.tsx`)
   - Responsive navigation menu
   - Mobile-friendly design
   - Easy access to all vendor pages

## Example: Create a Widget

A widget is a React component that can be injected into an existing page in the admin dashboard.

For example, create the file `src/admin/widgets/product-widget.tsx` with the following content:

```tsx title="src/admin/widgets/product-widget.tsx"
import { defineWidgetConfig } from "@medusajs/admin-sdk"

// The widget
const ProductWidget = () => {
  return (
    <div>
      <h2>Product Widget</h2>
    </div>
  )
}

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductWidget
```

This inserts a widget with the text "Product Widget" at the end of a product's details page.

## Available Zones

The vendor dashboard uses the following zones:

- `vendor.dashboard` - Main vendor dashboard page
- `vendor.products` - Products management page
- `vendor.orders` - Orders management page
- `vendor.analytics` - Analytics page
- `vendor.settings` - Settings page
- `vendor.dashboard.after` - Widgets displayed after the main dashboard content

## Features

### Dashboard Features
- Real-time performance metrics
- Order tracking and management
- Product catalog management
- Business analytics and insights
- Settings and configuration management

### UI Components
- Modern, responsive design
- Consistent with Medusa admin styling
- Mobile-friendly interface
- Interactive charts and graphs
- Modal dialogs for editing

### Data Management
- Mock data for demonstration
- Ready for API integration
- Form validation and error handling
- Real-time updates

## Getting Started

1. The vendor dashboard is automatically available when you start the Medusa server
2. Access the dashboard through the admin interface
3. All pages and widgets are pre-configured and ready to use
4. Customize the styling and functionality as needed

## Customization

You can customize the vendor dashboard by:

1. **Modifying existing pages** - Edit the page components in `src/admin/pages/`
2. **Adding new widgets** - Create new widget components in `src/admin/widgets/`
3. **Updating styling** - Modify the Tailwind CSS classes
4. **Integrating APIs** - Replace mock data with real API calls
5. **Adding features** - Extend functionality as needed

## API Integration

The dashboard is designed to work with the existing vendor API endpoints:

- `/vendors` - Vendor management
- `/vendors/orders` - Order management
- `/vendors/products` - Product management

Replace the mock data in each component with actual API calls to integrate with your backend.