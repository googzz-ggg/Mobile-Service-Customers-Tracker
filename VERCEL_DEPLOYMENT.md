# Moga - Vercel Deployment Guide

## Overview
This guide will help you deploy the Moga Device Repair Tracking System to Vercel.

## Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository (already set up at https://github.com/googzz-ggg/Mobile-Service-Customers-Tracker)
- Environment variables from your Manus deployment

## Deployment Steps

### Step 1: Start Vercel Import
Click this link to begin the import process:
https://vercel.com/new/import?framework=vite&hasTrialAvailable=1&id=1209964278&name=Mobile-Service-Customers-Tracker&owner=googzz-ggg&project-name=mobile-service-customers-tracker&provider=github&remainingProjects=1&s=https%3A%2F%2Fgithub.com%2Fgoogzz-ggg%2FMobile-Service-Customers-Tracker&totalProjects=1&teamSlug=googzzs-projects&deploymentIds=dpl_F1JD7phhJF3mpii7CGLJmgpSZSc7

### Step 2: Connect GitHub Repository
- Vercel will ask to connect your GitHub account
- Select the `Mobile-Service-Customers-Tracker` repository
- Click "Continue"

### Step 3: Configure Project Settings
- **Project Name:** `mobile-service-customers-tracker` (or your preferred name)
- **Framework:** Vite (should be auto-detected)
- **Build Command:** `pnpm build`
- **Output Directory:** `dist`

### Step 4: Add Environment Variables
Add the following environment variables in the Vercel dashboard:

```
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
VITE_APP_ID=your_oauth_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_ANALYTICS_ENDPOINT=your_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=your_analytics_website_id
VITE_APP_TITLE=Moga
VITE_APP_LOGO=your_logo_url
```

### Step 5: Deploy
- Click "Deploy"
- Wait for the build to complete (usually 2-5 minutes)
- Once deployed, you'll get a Vercel URL like: `https://mobile-service-customers-tracker.vercel.app`

## Post-Deployment

### Update OAuth Redirect URIs
After deployment, update your OAuth application settings to include the new Vercel URL:
- Add redirect URI: `https://your-vercel-url.vercel.app/api/oauth/callback`

### Enable Auto-Deployments
Vercel automatically deploys on every push to the main branch. To disable:
1. Go to Vercel Project Settings
2. Navigate to "Git"
3. Toggle "Deploy on Push" as needed

### Custom Domain (Optional)
To use a custom domain:
1. Go to Vercel Project Settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set correctly
- Verify `package.json` scripts are correct

### Database Connection Issues
- Verify `DATABASE_URL` is correct and accessible from Vercel
- Ensure database allows connections from Vercel's IP ranges
- Check database credentials and permissions

### OAuth Errors
- Verify `VITE_APP_ID` and OAuth secrets are correct
- Update OAuth redirect URIs to include Vercel URL
- Check `OAUTH_SERVER_URL` is accessible

## Monitoring

### View Logs
- Go to Vercel Project Dashboard
- Click on recent deployments to view build and runtime logs

### Performance Monitoring
- Use Vercel Analytics to monitor performance
- Check Core Web Vitals in Vercel Dashboard

## Rollback

To rollback to a previous deployment:
1. Go to Vercel Project Dashboard
2. Click on "Deployments"
3. Find the deployment you want to rollback to
4. Click the three dots menu
5. Select "Promote to Production"

## Support

For issues or questions:
- Check Vercel documentation: https://vercel.com/docs
- Review Moga README: See README.md in the repository
- Check application logs for errors

---

**Note:** The Moga app is also available on Manus hosting at https://smarttrack-frvsuvab.manus.space. You can use either Vercel or Manus hosting depending on your needs.
