# StitchGrab Deployment Guide

## Prerequisites
- Heroku CLI installed
- Node.js 18.x
- Git
- GitHub repository

## Environment Setup

### Staging Environment
- **App Name**: `stitchgrab-staging`
- **URL**: `https://stitchgrab-staging-bec4050caec5.herokuapp.com`
- **Branch**: `staging` (or `main`)

### Production Environment
- **App Name**: `stitchgrab`
- **URL**: `https://stitchgrab.com`
- **Branch**: `main`

## Step-by-Step Heroku Setup

### 1. Create Heroku Apps
```bash
# Create staging app
heroku create stitchgrab-staging

# Create production app
heroku create stitchgrab
```

### 2. Set Up Buildpacks
```bash
# Set Node.js buildpack for staging
heroku buildpacks:set heroku/nodejs --app stitchgrab-staging

# Set Node.js buildpack for production
heroku buildpacks:set heroku/nodejs --app stitchgrab
```

### 3. Set Up Database
```bash
# Add PostgreSQL to staging
heroku addons:create heroku-postgresql:mini --app stitchgrab-staging

# Add PostgreSQL to production
heroku addons:create heroku-postgresql:mini --app stitchgrab
```

### 4. Configure Environment Variables

#### Staging Environment
```bash
# Backend (stitchgrab-staging)
heroku config:set DATABASE_URL=your_staging_database_url --app stitchgrab-staging
heroku config:set JWT_SECRET=your_jwt_secret --app stitchgrab-staging
heroku config:set COOKIE_SECRET=your_cookie_secret --app stitchgrab-staging
heroku config:set STRIPE_API_KEY=your_stripe_secret_key --app stitchgrab-staging
heroku config:set DRIVERS_STRIPE_WEBHOOK_SECRET=your_webhook_secret --app stitchgrab-staging
heroku config:set VENDORS_STRIPE_WEBHOOK_SECRET=your_webhook_secret --app stitchgrab-staging
heroku config:set STORE_CORS=https://stitchgrab-staging-bec4050caec5.herokuapp.com --app stitchgrab-staging
heroku config:set ADMIN_CORS=https://stitchgrab-staging-bec4050caec5.herokuapp.com/admin --app stitchgrab-staging
heroku config:set AUTH_CORS=https://stitchgrab-staging-bec4050caec5.herokuapp.com,https://stitchgrab-staging-bec4050caec5.herokuapp.com/admin,https://stitchgrab-staging-bec4050caec5.herokuapp.com/vendors,https://stitchgrab-staging-bec4050caec5.herokuapp.com/drivers --app stitchgrab-staging

# Frontend (stitchgrab-staging)
heroku config:set NODE_ENV=production --app stitchgrab-staging
heroku config:set NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://stitchgrab-staging-bec4050caec5.herokuapp.com --app stitchgrab-staging
heroku config:set NEXT_PUBLIC_STRIPE_KEY=pk_test_... --app stitchgrab-staging
heroku config:set NEXT_PUBLIC_BASE_URL=https://stitchgrab-staging-bec4050caec5.herokuapp.com --app stitchgrab-staging
```

#### Production Environment
```bash
# Backend (stitchgrab)
heroku config:set DATABASE_URL=your_production_database_url --app stitchgrab
heroku config:set JWT_SECRET=your_jwt_secret --app stitchgrab
heroku config:set COOKIE_SECRET=your_cookie_secret --app stitchgrab
heroku config:set STRIPE_API_KEY=your_stripe_secret_key --app stitchgrab
heroku config:set DRIVERS_STRIPE_WEBHOOK_SECRET=your_webhook_secret --app stitchgrab
heroku config:set VENDORS_STRIPE_WEBHOOK_SECRET=your_webhook_secret --app stitchgrab
heroku config:set STORE_CORS=https://stitchgrab.com --app stitchgrab
heroku config:set ADMIN_CORS=https://stitchgrab.com --app stitchgrab
heroku config:set AUTH_CORS=https://stitchgrab.com --app stitchgrab

# Frontend (stitchgrab)
heroku config:set NODE_ENV=production --app stitchgrab
heroku config:set NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://stitchgrab.com --app stitchgrab
heroku config:set NEXT_PUBLIC_STRIPE_KEY=pk_live_... --app stitchgrab
heroku config:set NEXT_PUBLIC_BASE_URL=https://stitchgrab.com --app stitchgrab
```
#### Add any other environment variables as needed


### 5. Set Up GitHub Integration

#### Connect GitHub Repository
```bash
# For staging app
heroku pipelines:create stitchgrab-pipeline --app stitchgrab-staging --stage staging

# For production app
heroku pipelines:add stitchgrab-pipeline --app stitchgrab --stage production
```

#### Connect GitHub Repository
```bash
# Connect staging app to GitHub
heroku pipelines:connect stitchgrab-pipeline --repo your-github-username/your-repo-name

# Enable automatic deploys
heroku pipelines:enable-reviewapps --app stitchgrab-staging
```

#### Set Up Automatic Deploys in Heroku Dashboard
1. Go to Heroku Dashboard
2. Navigate to your app
3. Go to "Deploy" tab
4. Connect to GitHub repository
5. Enable automatic deploys for:
   - Staging: `staging` branch (or `main`)
   - Production: `main` branch

### 6. Run Database Migrations
```bash
# Run migrations on staging
heroku run npx medusa db:migrate --app stitchgrab-staging

# Run migrations on production
heroku run npx medusa db:migrate --app stitchgrab

# Seed database (if needed)
heroku run npx medusa db:seed --app stitchgrab-staging
heroku run npx medusa db:seed --app stitchgrab
```

### 7. Enable SSL 
```bash
# Enable SSL for production (if not enabled already)
heroku certs:auto:enable --app stitchgrab
```

### 8. Scale Apps (TBD)
```bash
# Scale staging app
heroku ps:scale web=1 --app stitchgrab-staging

# Scale production app
heroku ps:scale web=1 --app stitchgrab
```

## Deployment Process

### Simple Deployment (Recommended)
```bash
# Push to staging branch
git push origin staging

# Push to main branch (production)
git push origin main
```

### Manual Deployment (if needed)
```bash
# Deploy staging
git push heroku staging:main

# Deploy production
git push heroku main:main
```

## URLs After Deployment

### Staging
- Storefront: https://stitchgrab-staging-bec4050caec5.herokuapp.com/store
- Drivers: https://stitchgrab-staging-bec4050caec5.herokuapp.com/drivers
- Vendors: https://stitchgrab-staging-bec4050caec5.herokuapp.com/vendors
- Admin: https://stitchgrab-staging-bec4050caec5.herokuapp.com/app

### Production
- Storefront: https://stitchgrab.com/store
- Drivers: https://stitchgrab.com/drivers
- Vendors: https://stitchgrab.com/vendors
- Admin: https://stitchgrab.com/app

## Monitoring

### Check App Status
```bash
# Check staging app status
heroku ps --app stitchgrab-staging

# Check production app status
heroku ps --app stitchgrab
```

### View Logs
```bash
# View staging logs
heroku logs --tail --app stitchgrab-staging

# View production logs
heroku logs --tail --app stitchgrab
```

### Monitor Deployments
- Go to Heroku Dashboard
- Navigate to your app
- Go to "Activity" tab to see deployment history

## Simple Workflow

1. **Make changes to your code**
2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin staging  # for staging
   git push origin main     # for production
   ```
3. **Heroku automatically deploys** from GitHub
4. **Monitor deployment** in Heroku Dashboard

## Branch Strategy
- `staging` branch → deploys to `stitchgrab-staging`
- `main` branch → deploys to `stitchgrab` (production)

## Troubleshooting

### Common Issues
1. **Build fails**: Check build logs in Heroku Dashboard
2. **Database connection issues**: Verify DATABASE_URL environment variable
3. **CORS errors**: Ensure CORS environment variables are set correctly
4. **App not starting**: Check app logs for startup errors

### Useful Commands
```bash
# Check environment variables
heroku config --app stitchgrab-staging
heroku config --app stitchgrab

# Restart apps
heroku restart --app stitchgrab-staging
heroku restart --app stitchgrab

# Check buildpack
heroku buildpacks --app stitchgrab-staging
heroku buildpacks --app stitchgrab
```
