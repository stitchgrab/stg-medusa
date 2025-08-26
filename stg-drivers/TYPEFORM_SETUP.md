# Typeform Integration Setup

This document explains how to set up the Typeform integration for driver signup using the embedded widget.

## Overview

The driver signup process now uses an embedded Typeform widget to collect all driver information, then redirects users to complete their account by setting a password.

## Setup Steps

### 1. Create Typeform

1. Go to [Typeform](https://typeform.com) and create a new form
2. Add the following fields to your form:

#### Personal Information
- **First Name** (Short text field)
  - Field ID: `first_name`
- **Last Name** (Short text field)
  - Field ID: `last_name`
- **Email** (Email field)
  - Field ID: `email`
- **Phone** (Phone field)
  - Field ID: `phone`

#### Driver Information
- **Driver Name** (Short text field)
  - Field ID: `driver_name`
- **Driver Handle** (Short text field)
  - Field ID: `driver_handle`
- **Driver License Number** (Short text field)
  - Field ID: `license_number`

#### Vehicle Information
- **Vehicle Make** (Short text field)
  - Field ID: `vehicle_make`
- **Vehicle Model** (Short text field)
  - Field ID: `vehicle_model`
- **Vehicle Year** (Short text field)
  - Field ID: `vehicle_year`
- **License Plate** (Short text field)
  - Field ID: `vehicle_plate`

#### Address Information
- **Street Address** (Long text field)
  - Field ID: `address_street`
- **City** (Short text field)
  - Field ID: `address_city`
- **State/Province** (Short text field)
  - Field ID: `address_state`
- **Postal Code** (Short text field)
  - Field ID: `address_postal_code`
- **Country** (Short text field)
  - Field ID: `address_country`

### 2. Configure Webhook

1. In your Typeform, go to **Settings** > **Integrations**
2. Add a **Webhook** integration
3. Set the webhook URL to: `https://your-backend-domain.com/typeform/webhook`
4. Select the event: **Form responses**
5. Save the webhook

### 3. Get Typeform ID

1. In your Typeform, go to **Settings** > **General**
2. Copy the **Form ID** (it's in the URL: `https://form.typeform.com/to/FORM_ID`)

### 4. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Backend URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Typeform Form ID (replace with your actual form ID)
NEXT_PUBLIC_TYPEFORM_ID=YOUR_FORM_ID
```

### 5. Backend Configuration

The backend includes the following endpoints:

- `POST /typeform/webhook` - Receives Typeform submissions
- `GET /typeform/temp-data/[token]` - Retrieves temporary form data
- `POST /typeform/complete-signup` - Completes signup with password

### 6. Flow Overview

1. User visits `/drivers/signup`
2. User clicks "Start Application" and the Typeform widget opens
3. User completes the embedded Typeform with all required information
4. Typeform sends webhook to backend with form data
5. Backend stores form data temporarily
6. User is redirected to `/drivers/complete-signup?token=[token]`
7. User creates password and completes account setup
8. User is redirected to dashboard

## Features

- **Embedded Experience**: Typeform is embedded directly in the application
- **Seamless Navigation**: Users stay within your application
- **Professional UI**: Consistent branding and styling
- **Close Button**: Users can close the form and return to signup page
- **Full Height**: Typeform takes full screen height for optimal experience

## Important Notes

- **Field IDs**: Make sure the field IDs in your Typeform match exactly with the ones expected by the webhook
- **Data Storage**: In production, implement proper data storage (database/Redis) instead of in-memory storage
- **Security**: Add webhook signature verification for production use
- **Email Verification**: Consider adding email verification step after password creation
- **Form ID**: Use the form ID, not the full URL

## Testing

1. Start your backend server
2. Start your frontend server
3. Visit `/drivers/signup`
4. Click "Start Application" to open the embedded Typeform
5. Complete the Typeform
6. Verify the webhook receives the data
7. Complete the password creation process
8. Verify the driver account is created successfully

## Troubleshooting

- **Widget not loading**: Check that `NEXT_PUBLIC_TYPEFORM_ID` is set correctly
- **Webhook not receiving data**: Verify webhook URL and Typeform settings
- **Form submission issues**: Check browser console for errors
- **Redirect issues**: Ensure webhook is properly configured to redirect after submission
