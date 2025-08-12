# Wingman - Next.js 15 TypeScript & HeroUI Platform

A modern, scalable web application built with cutting-edge technologies including **Next.js 15**, **React 19**, **TypeScript**, **HeroUI**, **TailwindCSS**, and more. This platform features authentication, user management, talent pools, document management, broadcasts, and a comprehensive dashboard system.

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
│   │   │   ├── 📁 profile/        # 🆕 Unified profile system
│   │   │   │   ├── [id]/          # Dynamic user profiles
│   │   │   │   └── page.tsx       # Current user redirect
│   │   │   ├── 📁 talent-pool/    # ⭐ Featured talent management
│   │   │   ├── 📁 documents/      # 📄 Document management system
│   │   │   ├── 📁 broadcasts/     # 📢 Broadcast center
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
└── 📁 messages/                   # i18n translations
```

## 🔥 Recent Major Updates

### 🆕 Unified Profile System

**Complete redesign and consolidation of profile functionality:**

- **Clean Route Structure**:
  - `/private/profile` → Redirects to current user's profile
  - `/private/profile/[id]` → Universal profile viewer with dynamic edit capabilities
- **Smart Edit Detection**: Pen icons automatically appear when viewing your own profile
- **Enhanced UI**: Beautiful design based on talent-pool components with improved layouts
- **Contextual Actions**: Different action sets for own vs. other users' profiles
- **Connection Management**: Integrated invitation system with real-time status updates
- **Dead Code Cleanup**: Removed all legacy profile code and consolidated into single system

### 📄 Document Management System

**Complete document management platform with enterprise-grade features:**

```
documents/
├── components/
│   ├── cards/              # Document display components
│   ├── filters/            # Advanced filtering system
│   ├── lists/              # Document list containers
│   ├── modals/             # Upload, share, and management modals
│   ├── navigation/         # Document navigation tabs
│   └── states/             # Loading, empty, and error states
├── hooks/
│   ├── useDocumentState.ts    # Document state management
│   ├── useDocumentFilters.ts  # Filter state management
│   └── useDebouncedSearch.ts  # Optimized search
├── utils/
│   └── document-utils.ts      # Document utilities and helpers
├── types.ts                   # Document type definitions
└── page.tsx                   # Main documents page
```

**Key Features:**

- **Advanced Filtering**: Filter by type, date, size, tags, and more
- **File Upload**: Drag-and-drop with progress tracking
- **Search & Sort**: Real-time search with multiple sorting options
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Type Safety**: Comprehensive TypeScript integration

### 📢 Broadcast Center

**Professional announcement and communication system:**

```
broadcasts/
├── components/
│   ├── cards/              # Broadcast display cards
│   ├── navigation/         # Broadcast navigation and banners
│   └── onboarding/         # Welcome screens and tutorials
├── types.ts                # Broadcast type definitions
└── page.tsx                # Main broadcasts page
```

**Features:**

- **Scrolling Banners**: Dynamic announcement displays
- **Gradient Backgrounds**: Beautiful full-bleed designs
- **Onboarding Flow**: Welcome screens for new users
- **Responsive Design**: Mobile-optimized layouts

### ⭐ Enhanced Talent Pool

**Advanced talent discovery system with improved architecture:**

```
talent-pool/
├── components/
│   ├── cards/              # TalentCard, TalentGroupCard, TeamCard
│   ├── filters/            # Advanced filtering panels
│   ├── lists/              # Freelancer, Agency, Team lists
│   ├── modals/             # Invite, notes, tags, groups
│   ├── navigation/         # Tab navigation system
│   └── states/             # Loading, empty, error states
├── hooks/
│   ├── useTalentPoolState.ts  # Centralized state management
│   ├── useFilterMemoization.ts # Performance optimization
│   └── useDebouncedSearch.ts   # Search optimization
├── utils/
│   ├── talent-utils.ts         # Core utility functions
│   ├── country-flags.ts        # Country/flag utilities
│   └── skill-icons.ts          # Skill icon mapping
├── constants/              # Configuration and constants
├── types.ts                # TypeScript definitions
└── page.tsx                # Main talent pool interface
```

**Enhanced Features:**

- **Profile Integration**: Seamless navigation to unified profile system
- **Connection Management**: Improved invitation and connection flow
- **Performance**: Optimized filtering and search with memoization
- **Type Safety**: Comprehensive TypeScript coverage
- **Responsive Design**: Enhanced mobile experience

## 🚀 Application Features

### 🔐 Authentication & User Management

- **Multi-step Registration**: Simple and Premium wizard flows with billing integration
- **OAuth Integration**: Social login with multiple providers
- **Protected Routes**: Role-based access control
- **Unified Profile System**: Complete profile management with contextual editing

### 💼 Dashboard System

- **Overview Dashboard**: Metrics, quick actions, and activity feeds
- **Tabbed Navigation**: Organized content with smooth routing
- **Responsive Layout**: Optimized for all screen sizes
- **Real-time Updates**: Live status indicators and notifications

### 📄 Document Management

- **File Organization**: Advanced categorization and tagging
- **Search & Filter**: Powerful search with multiple filter options
- **Upload System**: Drag-and-drop with progress tracking
- **Sharing & Collaboration**: Team document sharing features

### 📢 Communication Hub

- **Broadcast Center**: Professional announcement system
- **Talent Pool**: Advanced talent discovery and connection
- **Profile System**: Unified user profiles with edit capabilities
- **Messaging**: Integrated communication features

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
| **API Client**           | Axios with interceptors          |
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
├── profile/              # 🆕 Unified profile system
│   ├── [id]/            # Dynamic user profiles
│   └── page.tsx         # Current user redirect
├── talent-pool/          # Enhanced talent discovery system
├── documents/            # 🆕 Complete document management
├── broadcasts/           # 🆕 Professional broadcast center
├── challenges/           # Challenge management
├── community/            # Social features
└── solutions/            # Solutions marketplace
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

### Recent Development Improvements

- **Code Architecture**: Feature-based organization with barrel exports
- **Performance**: Optimized state management with memoization
- **Type Safety**: Enhanced TypeScript coverage across all modules
- **Clean Code**: Removed legacy code and consolidated systems
- **Developer Experience**: Improved development workflow and hot reload

### Project Structure Benefits

- **Feature-based Organization**: Related code stays together
- **Unified Systems**: Consolidated profile, document, and broadcast features
- **Type Safety**: Comprehensive TypeScript coverage
- **Modular Architecture**: Easy to test, maintain, and scale
- **Performance**: Optimized with advanced React patterns
- **Developer Experience**: Fast development with excellent tooling

## 🎯 Architecture Highlights

### Component Reusability

- **Shared Components**: Reusable cards, filters, and navigation elements
- **Consistent Patterns**: Standardized hooks, utilities, and type definitions
- **Barrel Exports**: Clean import paths with organized exports

### Performance Optimizations

- **Memoization**: Strategic use of React.memo and useMemo
- **Debounced Search**: Optimized search with reduced API calls
- **Lazy Loading**: Code splitting and dynamic imports
- **State Management**: Efficient state updates and subscriptions

### User Experience

- **Responsive Design**: Mobile-first with progressive enhancement
- **Loading States**: Comprehensive skeleton screens and progress indicators
- **Error Handling**: Graceful error states with retry mechanisms
- **Accessibility**: Full ARIA support and keyboard navigation

This architecture ensures scalability, maintainability, and excellent developer experience while delivering a modern, performant web application with enterprise-grade features.
