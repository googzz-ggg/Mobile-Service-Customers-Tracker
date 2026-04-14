# Moga - Device Repair Tracking & Management System

A premium, real-time device repair tracking and management web application built with React, tRPC, Express, and MySQL. Designed with a Samsung-inspired dark theme and glassmorphism effects.

## 🎯 Overview

Moga is a comprehensive solution for device repair businesses to:
- **Customers**: Track repair status in real-time with live updates
- **Technicians**: Manage repair jobs and communicate with customers
- **Admins**: Monitor performance, analyze trends, and generate AI-powered insights

## ✨ Key Features

### Customer-Facing Features
- **Real-Time Tracking Page** (`/track/:trackingCode`)
  - 5-stage repair timeline (Received → Diagnosing → Repairing → Quality Check → Ready for Pickup)
  - Live device status updates
  - Estimated completion time
  - Cost breakdown transparency

- **Live Messaging**
  - Direct communication with technicians
  - Message history and timestamps
  - Real-time notifications

- **QR Code Tracking**
  - Generate unique QR codes for each repair
  - Download QR codes as PNG
  - Share tracking links easily

- **Feedback & Ratings**
  - 1-5 star rating system
  - Multi-dimensional feedback (service speed, staff behavior, repair quality)
  - Written reviews and comments

- **In-App Notifications**
  - Status change alerts
  - Delay notifications
  - Feedback requests
  - Dismissible notification feed

### Admin/Technician Dashboard
- **Job Management** (`/admin`)
  - Create new repair jobs
  - Search and filter by status, customer, or tracking code
  - View detailed job information
  - Update repair stages with timestamps
  - Assign technicians

- **Analytics Dashboard**
  - Jobs by status distribution
  - Customer satisfaction metrics
  - Average repair duration
  - Weekly repair volume

- **AI Insights Panel** (Admin-only)
  - LLM-powered repair trend analysis
  - Common issues detection
  - Technician performance metrics
  - Actionable recommendations

- **Feedback Management**
  - View all customer reviews
  - Track satisfaction scores
  - Identify improvement areas

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Express 4, tRPC 11, Node.js
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth
- **AI Integration**: LLM for insights generation
- **Charts**: Recharts for analytics visualization

### Database Schema
- `users` - User accounts with roles (admin, technician, user)
- `repairJobs` - Core repair job records
- `repairStages` - Timeline stages with timestamps and notes
- `messages` - Customer-technician communication
- `feedback` - Customer ratings and reviews
- `notifications` - Status change and alert notifications
- `analyticsSnapshots` - Daily/weekly metrics
- `aiInsights` - AI-generated analysis and trends

### API Routes (tRPC)
- `repairs.*` - Job CRUD and stage management
- `messages.*` - Messaging system
- `feedback.*` - Rating and review system
- `notifications.*` - Notification management
- `analytics.*` - Performance metrics
- `system.*` - Owner notifications

## 🎨 Design System

### Samsung Dark Theme
- **Background**: Deep navy (`oklch(0.1 0.01 262)`)
- **Accent**: Electric blue (`oklch(0.65 0.22 262)`)
- **Cards**: Glassmorphism with backdrop blur
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design

### Components
- Glassmorphic cards with blur effects
- Timeline visualization for repair stages
- Interactive charts and metrics
- Loading skeletons
- Empty states
- Error boundaries

## 🚀 Getting Started

### Development
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Environment Variables
Required system variables (auto-injected):
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - OAuth application ID
- `OAUTH_SERVER_URL` - OAuth backend URL
- `BUILT_IN_FORGE_API_URL` - LLM and API endpoint
- `BUILT_IN_FORGE_API_KEY` - API authentication key

## 📱 Routes

### Public Routes
- `/` - Landing page with tracking entry
- `/track/:trackingCode` - Customer tracking page

### Protected Routes
- `/admin` - Admin dashboard (admin/technician only)
  - `?tab=jobs` - Job management
  - `?tab=analytics` - Analytics dashboard
  - `?tab=insights` - AI insights panel

## 🔐 Authentication

- **OAuth Integration**: Manus OAuth for secure authentication
- **Role-Based Access**: Admin, Technician, and User roles
- **Protected Procedures**: tRPC procedures with role validation
- **Session Management**: Secure cookie-based sessions

## 📊 Analytics & Insights

### Metrics Tracked
- Jobs by status distribution
- Customer satisfaction scores (1-5 stars)
- Average repair duration per stage
- Weekly repair volume
- Technician performance metrics
- Common repair issues

### AI Insights
- Repair trend analysis
- Performance recommendations
- Issue pattern detection
- Technician efficiency metrics

## 🧪 Testing

- **Backend**: 16+ vitest unit tests for tRPC procedures
- **Coverage**: Auth, CRUD operations, stage updates, feedback, analytics
- **Test Command**: `pnpm test`

## 🎯 Key Workflows

### Customer Repair Tracking
1. Customer receives tracking code
2. Visits landing page and enters code
3. Views real-time repair status
4. Receives notifications on stage changes
5. Communicates with technician via live chat
6. Submits feedback after completion
7. Downloads QR code for future reference

### Admin Job Management
1. Create new repair job with device details
2. Assign to technician
3. Monitor progress through dashboard
4. Update stages as work progresses
5. View customer feedback
6. Analyze trends with AI insights

## 📈 Performance Optimizations

- Lazy loading for analytics charts
- Optimistic updates for messaging
- Efficient database queries with Drizzle
- Response caching where applicable
- Mobile-first responsive design
- Minimal CSS with Tailwind utilities

## 🔄 Real-Time Features

- Live messaging between customers and technicians
- Status change notifications
- Real-time analytics updates
- Notification feed with auto-refresh

## 🛠️ Development Guidelines

### Adding New Features
1. Update database schema in `drizzle/schema.ts`
2. Generate migrations: `pnpm drizzle-kit generate`
3. Add database helpers in `server/db.ts`
4. Create tRPC procedures in `server/routers.ts`
5. Build UI components in `client/src/components/`
6. Write tests in `server/*.test.ts`
7. Run tests: `pnpm test`

### Code Structure
```
client/
  ├── src/
  │   ├── pages/          # Page components
  │   ├── components/     # Reusable UI components
  │   ├── lib/            # Utilities and helpers
  │   └── index.css       # Global styles
server/
  ├── db.ts               # Database helpers
  ├── routers.ts          # tRPC procedures
  └── _core/              # Framework internals
drizzle/
  └── schema.ts           # Database schema
```

## 🌟 Premium Features

### Current
- Real-time tracking
- Live messaging
- QR code generation
- AI insights
- Analytics dashboard
- Multi-dimensional feedback

### Future Enhancements
- Gamification (loyalty points)
- Pickup/delivery tracking
- Branch queue visibility
- Technician leaderboard
- Advanced search and filtering
- Report export functionality
- WhatsApp integration
- SMS notifications

## 📝 License

Proprietary - Moga Device Repair Service

## 🤝 Support

For issues or feature requests, contact the Moga development team.

---

**Moga** - Professional Device Repair Tracking Made Simple
