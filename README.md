# Yoga & Meditation - Premium Wellness Platform

A modern, premium, responsive web application for Yoga, Meditation, Mindfulness, Spiritual Growth, and Wellness.

## 🌟 Features

### Authentication
- ✅ Email/Password Registration & Login
- ✅ Google OAuth SSO
- ✅ Email Verification
- ✅ Forgot & Reset Password
- ✅ JWT with Refresh Tokens
- ✅ Session Management
- ✅ Device Tracking

### User Profile
- ✅ Comprehensive Profile Management
- ✅ Preferences (Meditation/Yoga Level, Notifications, Reminders)
- ✅ Personal Information (DOB, Gender, Location, Timezone)
- ✅ Avatar/Photo Upload

### Subscriptions
- ✅ Multiple Plans (Monthly, Half-Yearly, Yearly)
- ✅ Plan Management (Buy, Upgrade, Renew, Cancel)
- ✅ Subscription Lifecycle (Active, Expired, Pending, Cancelled)
- ✅ Payment Integration Ready (Stripe/Razorpay)

### Referral Program
- ✅ Unique Referral Codes
- ✅ Multi-Level Referral (3 Levels)
- ✅ Commission Tracking
- ✅ Referral Dashboard
- ✅ Referral Tree & History
- ✅ Configurable Commission Rules

### Content Library
- ✅ Yoga Videos
- ✅ Meditation Audios
- ✅ Breathing Exercises
- ✅ Spiritual Talks
- ✅ Healing Sessions
- ✅ Filters (Difficulty, Duration, Category, Language)
- ✅ Bookmarks, Favorites, Recently Viewed
- ✅ Continue Watching

### Admin Dashboard
- ✅ User Management
- ✅ Subscription Management
- ✅ Content Management (Videos/Audio)
- ✅ Payment Processing
- ✅ Referral Analytics
- ✅ Reports & Analytics
- ✅ Email Templates
- ✅ Push Notifications
- ✅ Site Settings
- ✅ SEO Management

### Security
- ✅ Private S3/R2 Bucket
- ✅ Signed URLs with Expiration
- ✅ Streaming Only (No Direct Downloads)
- ✅ Token Validation
- ✅ Subscriber-Only Access
- ✅ Rate Limiting
- ✅ CSRF Protection
- ✅ XSS Protection
- ✅ SQL Injection Prevention
- ✅ Secure HTTP Headers
- ✅ Audit Logs

### UI/UX
- ✅ Modern, Elegant, Peaceful Design
- ✅ Premium Color Palette
- ✅ Dark/Light Mode
- ✅ Fully Responsive
- ✅ Smooth Animations
- ✅ Glassmorphism Effects
- ✅ Accessibility

### Additional Features
- ✅ Multi-Language Support (i18n)
- ✅ Progressive Web App (PWA)
- ✅ SEO Optimized (Sitemap, Robots.txt, Schema.org)
- ✅ Email Notifications
- ✅ In-App Notifications
- ✅ Blog & FAQ
- ✅ Contact Us Form
- ✅ Newsletter

## 🛠 Tech Stack

### Frontend
- **Next.js 15+** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js Route Handlers** - API routes
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **NextAuth/Auth.js** - Authentication
- **JWT** - Token-based auth
- **bcrypt** - Password hashing

### Storage
- **AWS S3** - Private video/audio storage
- **Cloudflare R2** - Alternative storage

### Payment
- **Stripe** - Payment processing (configurable)
- **Razorpay** - Payment processing (configurable)

### Deployment
- **Git-based** deployment
- **Docker** support
- **Vercel** ready

## 📦 Project Structure

```
yogaAndMeditation/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages
│   │   ├── (dashboard)/       # User dashboard
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── common/            # Reusable components
│   │   ├── forms/             # Form components
│   │   ├── ui/                # UI components
│   │   └── admin/             # Admin components
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts            # Auth utilities
│   │   ├── db.ts              # Database client
│   │   ├── storage.ts         # S3/R2 utilities
│   │   └── email.ts           # Email utilities
│   ├── types/                 # TypeScript types
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Zustand stores
│   ├── services/              # API services
│   ├── middleware.ts          # Next.js middleware
│   └── env.ts                 # Environment variables
├── prisma/
│   ├── schema.prisma          # Prisma schema
│   ├── seed.ts                # Database seeding
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── tests/                     # Test files
├── docker/                    # Docker configuration
├── .github/                   # GitHub configuration
│   └── workflows/             # CI/CD workflows
├── .env.example               # Environment template
├── .gitignore                 # Git ignore
├── .prettierrc                # Prettier config
├── .eslintrc.json             # ESLint config
├── next.config.js             # Next.js config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9
- PostgreSQL database
- AWS S3 bucket (or Cloudflare R2)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/priyanka-sankhala/yogaAndMeditation.git
   cd yogaAndMeditation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Setup database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Authentication Flow](./docs/AUTHENTICATION.md)
- [Security Guidelines](./docs/SECURITY.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Component Library](./docs/COMPONENTS.md)

## 🔐 Security

This application implements enterprise-level security:

- ✅ Private S3/R2 buckets with signed URLs
- ✅ Rate limiting
- ✅ CSRF protection
- ✅ XSS protection
- ✅ SQL injection prevention
- ✅ Secure HTTP headers
- ✅ JWT rotation
- ✅ Audit logging
- ✅ Session timeout
- ✅ Device tracking

See [Security Guidelines](./docs/SECURITY.md) for detailed information.

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 📝 Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Database
npm run prisma:migrate  # Run migrations
npm run prisma:generate # Generate Prisma client
npm run prisma:studio   # Open Prisma Studio
npm run prisma:seed     # Seed database

# Testing
npm test                # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## 🌐 Environment Variables

See `.env.example` for all required environment variables.

Key sections:
- Database configuration
- Authentication (NextAuth, Google OAuth, JWT)
- Cloud storage (AWS S3 or Cloudflare R2)
- Email configuration
- Payment gateways (Stripe, Razorpay)
- Application settings

## 📚 Features in Detail

### Authentication
Implements email/password and Google OAuth with JWT tokens, refresh tokens, and session management.

### Subscription Management
Supports multiple subscription plans with automatic renewal, upgrades, and cancellations.

### Referral Program
3-level multi-tier referral system with commission tracking and admin-configurable rules.

### Content Management
Secure video/audio delivery using signed URLs, preventing direct downloads.

### Admin Dashboard
Comprehensive admin interface for managing users, subscriptions, content, payments, and analytics.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

## 📞 Support

For support, email support@yogaandmeditation.com or open an issue.

## 🙏 Acknowledgments

Inspired by Calm, Headspace, Sadhguru, and Art of Living.

---

**Built with ❤️ for peaceful living**
