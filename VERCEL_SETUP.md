# Moga - Vercel Deployment Guide

## 🚀 Quick Start

Your Moga app is ready to deploy on Vercel! Follow these steps:

### Step 1: Import Repository
1. Visit: https://vercel.com/new/import
2. Paste repository URL: `https://github.com/googzz-ggg/Mobile-Service-Customers-Tracker`
3. Click "Continue"

### Step 2: Configure Environment Variables

Add these environment variables in Vercel:

```
DATABASE_URL=your_mysql_connection_string
JWT_SECRET=your_random_secret_key
VITE_APP_ID=your_oauth_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
OWNER_NAME=your_name
OWNER_OPEN_ID=your_open_id
VITE_APP_TITLE=Moga
VITE_APP_LOGO=https://your-logo-url.png
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### Step 3: Deploy
Click "Deploy" and wait for the build to complete.

---

## 📋 Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL/TiDB connection string | `mysql://user:pass@host/db` |
| `JWT_SECRET` | Session signing secret | `super-secret-key-12345` |
| `VITE_APP_ID` | OAuth application ID | `1209964278` |
| `OAUTH_SERVER_URL` | Manus OAuth server | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | OAuth login portal | `https://oauth.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | Server-side API key | From Manus dashboard |
| `VITE_FRONTEND_FORGE_API_KEY` | Client-side API key | From Manus dashboard |
| `OWNER_NAME` | Your name | `Ahmed Goda` |
| `OWNER_OPEN_ID` | Your Manus ID | From Manus account |
| `VITE_APP_TITLE` | App name | `Moga` |
| `VITE_APP_LOGO` | Logo URL | CDN URL to your logo |

---

## 🔧 Build Configuration

The `vercel.json` file is already configured:
- **Framework**: Vite
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Node Version**: 18.x

---

## ✅ Post-Deployment Checklist

After deployment:
- [ ] Test customer tracking page
- [ ] Test admin dashboard login
- [ ] Test messaging system
- [ ] Test QR code generation
- [ ] Verify database connection
- [ ] Test Arabic/English language switching
- [ ] Check analytics dashboard

---

## 🆘 Troubleshooting

### Build Fails
- Check Node version (should be 18+)
- Verify all environment variables are set
- Check `package.json` for correct dependencies

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Ensure database is accessible from Vercel
- Check database credentials

### OAuth Not Working
- Verify `VITE_APP_ID` and `OAUTH_SERVER_URL`
- Check redirect URLs in OAuth settings
- Ensure `VITE_OAUTH_PORTAL_URL` is correct

---

## 📞 Support

For issues, check:
1. Vercel deployment logs
2. Environment variables configuration
3. Database connectivity
4. GitHub repository access

---

**Repository**: https://github.com/googzz-ggg/Mobile-Service-Customers-Tracker
**Manus Hosting**: https://smarttrack-frvsuvab.manus.space (Already Live!)
