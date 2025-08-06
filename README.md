# Wingman - Next.js 15 TypeScript & HeroUI Platform

A modern, scalable web application built with cutting-edge technologies including **Next.js 15**, **React 19**, **TypeScript**, **HeroUI**, **TailwindCSS**, and more. This platform features authentication, user management, talent pools, and a comprehensive dashboard system.

## 🏗️ Project Architecture

```
wingman/
├── 📁 src/
│   ├── 📁 app/                    # Next.js 15 App Router
│   │   ├── 📁 (public)/           # Public routes (marketing, auth)
│   │   │   ├── 📁 components/     # Public-specific components
│   │   │   ├── 📁 register/       # Registration flow with wizards
│   │   │   ├── layout.tsx         # Public layout wrapper
│   │   │   └── page.tsx           # Landing page
│   │   ├── 📁 private/            # Protected routes (dashboard, profile)
│   │   │   ├── 📁 dashboard/      # Main dashboard with tabs
│   │   │   ├── 📁 profile/        # User profile management
│   │   │   ├── 📁 settings/       # User settings tabs
│   │   │   ├── 📁 talent-pool/    # ⭐ Featured talent management
│   │   │   ├── 📁 challenges/     # Challenge system
│   │   │   ├── 📁 community/      # Community features
│   │   │   ├── 📁 solutions/      # Solutions marketplace
│   │   │   └── private-navbar.tsx # Private navigation
│   │   ├── 📁 api/                # API routes
│   │   └── layout.tsx             # Root layout
│   ├── 📁 components/             # Shared UI components
│   │   ├── 📁 landing/            # Landing page sections
│   │   ├── 📁 providers/          # Context providers
│   │   ├── 📁 ui/                 # Reusable UI elements
│   │   └── 📁 layouts/            # Layout components
│   ├── 📁 hooks/                  # Custom React hooks
│   ├── 📁 lib/                    # Utilities and configurations
│   │   ├── 📁 types/              # Global TypeScript types
│   │   ├── axios.ts               # API client setup
│   │   └── seo.ts                 # SEO utilities
│   └── 📁 styles/                 # Global styles
├── 📁 modules/                    # Feature modules
│   ├── 📁 auth/                   # Authentication system
│   ├── 📁 profile/                # Profile management
│   └── 📁 settings/               # Settings schemas
└── 📁 messages/                   # i18n translations
```

## Talent Pool Architecture

The talent pool feature showcases a modern, scalable component architecture with infinite scroll, animations, and type-safe utilities:

```
talent-pool/
├── components/
│   ├── TalentCard.tsx      # 🎯 SHARED component used by freelancer/agency lists
│   ├── FreelancerList.tsx  # ✅ List 1: Displays freelancers using TalentCard
│   ├── AgencyList.tsx      # ✅ List 2: Displays agencies using TalentCard
│   ├── TeamList.tsx        # ✅ List 3: Displays teams using GroupCard
│   ├── GroupCard.tsx       # 🎯 SHARED component for team listings
│   ├── HeroTabs.tsx        # 🎛️ Tab navigation between list types
│   └── shared/             # 🔄 Reusable UI components
│       ├── LoadingSkeleton.tsx
│       ├── EmptyState.tsx
│       └── ErrorState.tsx
├── utils/
│   └── talent-utils.ts     # 🛠️ Type-safe utility functions
├── types.ts                # 📝 TypeScript type definitions
└── page.tsx                # 📄 Main talent pool page
```

### Key Features:

- **Infinite Scroll**: Smooth loading with optimized animations (only new cards animate)
- **Shared Components**: Reusable TalentCard for both freelancers and agencies
- **Type Safety**: Strict TypeScript with proper type definitions
- **Responsive Design**: Mobile-first approach with HeroUI components
- **Performance**: Optimized with React hooks and proper state management

## 🚀 Application Features

### 🔐 Authentication & User Management

- **Multi-step Registration**: Simple and Premium wizard flows with billing integration
- **OAuth Integration**: Social login with multiple providers
- **Protected Routes**: Role-based access control
- **Profile Management**: Comprehensive user profile editing with tabbed interface

### 💼 Dashboard System

- **Overview Dashboard**: Metrics, quick actions, and activity feeds
- **Tabbed Navigation**: Organized content with smooth routing
- **Responsive Layout**: Optimized for all screen sizes
- **Real-time Updates**: Live status indicators and notifications

### 🎨 Modern UI/UX

- **HeroUI Design System**: Consistent, accessible components
- **Dark/Light Mode**: Theme switching with system preference detection
- **Animations**: Framer Motion for smooth interactions
- **Loading States**: Detailed skeleton screens and progress indicators
- **Responsive Design**: Mobile-first approach with progressive enhancement

## 🛠️ Technology Stack

| Category                 | Technologies                     |
| ------------------------ | -------------------------------- |
| **Frontend**             | Next.js 15, React 19, TypeScript |
| **UI Framework**         | HeroUI, TailwindCSS              |
| **Animations**           | Framer Motion                    |
| **State Management**     | Zustand, React Hooks             |
| **Forms**                | React Hook Form, Zod validation  |
| **API Client**           | Axios                            |
| **Internationalization** | next-intl                        |
| **Code Quality**         | ESLint, Prettier, Husky          |
| **Package Manager**      | pnpm                             |

## 📱 Route Structure

### Public Routes (Marketing & Auth)

```
/(public)/
├── page.tsx              # Landing page with hero, features, pricing
├── register/
│   ├── page.tsx          # Registration entry point
│   └── components/       # Multi-step wizard components
└── components/           # Public-specific components (navbar, footer)
```

### Private Routes (Dashboard)

```
/private/
├── dashboard/            # Main dashboard with overview
├── talent-pool/          # Advanced talent discovery system
├── profile/              # User profile management
├── settings/             # Account settings with tabs
├── challenges/           # Challenge management
├── community/            # Social features
├── solutions/            # Solutions marketplace
└── documents/            # Document management
```

## 🔧 Development

### Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Format code
pnpm format
```

### Project Structure Benefits

- **Feature-based Organization**: Related code stays together
- **Barrel Exports**: Clean import paths with index.ts files
- **Type Safety**: Comprehensive TypeScript coverage
- **Modular Architecture**: Easy to test, maintain, and scale
- **Developer Experience**: Fast development with hot reload and type checking

This architecture ensures scalability, maintainability, and excellent developer experience while delivering a modern, performant web application.
