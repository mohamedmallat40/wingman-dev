# Wingman - Enterprise-Grade Next.js 15 Platform

A comprehensive, scalable web application built with cutting-edge technologies including **Next.js 15**, **React 19**, **TypeScript**, **HeroUI**, **TailwindCSS**, and advanced architectural patterns. This platform features authentication, talent management, document systems, broadcast communications, team collaboration, and comprehensive user profiles.

## 🏗️ Complete Project Architecture

```
wingman/
├── 📁 src/
│   ├── 📁 app/                                    # Next.js 15 App Router
│   │   ├── 📁 (public)/                          # 🌐 Public Routes (Marketing & Auth)
│   │   │   ├── 📁 components/
│   │   │   │   ├── basic-navbar.tsx               # Public navigation
│   │   │   │   ├── footer.tsx                     # Site footer
│   │   │   │   └── login.tsx                      # Login component
│   │   │   ├── 📁 register/                       # 📋 Registration System
│   │   │   │   ├── 📁 components/                 # Registration components
│   │   │   │   │   ├── billing-address-form.tsx   # Billing forms
│   │   │   │   │   ├── billing-form.tsx
│   │   │   │   │   ├── category-selection-form.tsx
│   │   │   │   │   ├── category-selection.tsx
│   │   │   │   │   ├── email-password-form.tsx
│   │   │   │   │   ├── personal-info-form.tsx
│   │   │   │   │   ├── plan-selection-form.tsx
│   │   │   │   │   ├── plan-selection.tsx
│   │   │   │   │   ├── premium-wizard.tsx         # Premium registration flow
│   │   │   │   │   ├── registration-details-form.tsx
│   │   │   │   │   ├── registration-wizard.tsx    # Main wizard controller
│   │   │   │   │   ├── simple-wizard.tsx          # Simple registration flow
│   │   │   │   │   └── terms-checkbox.tsx
│   │   │   │   └── page.tsx                       # Registration entry point
│   │   │   ├── layout.tsx                         # Public layout wrapper
│   │   │   └── page.tsx                           # Landing page
│   │   ├── 📁 private/                            # 🔒 Protected Routes (Dashboard)
│   │   │   ├── 📁 broadcasts/                     # 📢 Broadcast Communication System
│   │   │   │   ├── 📁 [id]/
│   │   │   │   │   └── page.tsx                   # Individual broadcast view
│   │   │   │   ├── 📁 components/
│   │   │   │   │   ├── 📁 cards/
│   │   │   │   │   │   ├── PostCard.tsx           # Enhanced post display
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 filters/
│   │   │   │   │   │   ├── BroadcastFilters.tsx   # Advanced filtering system
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 headers/
│   │   │   │   │   │   └── TopicFeedHeader.tsx    # Topic navigation
│   │   │   │   │   ├── 📁 lists/
│   │   │   │   │   │   ├── BroadcastFeed.tsx      # Main feed container
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 modals/
│   │   │   │   │   │   ├── ContentCreator.tsx     # Advanced post creator
│   │   │   │   │   │   ├── DeleteConfirmationModal.tsx
│   │   │   │   │   │   ├── ImageCarouselModal.tsx
│   │   │   │   │   │   ├── NotificationCenter.tsx
│   │   │   │   │   │   ├── PostAttachmentModal.tsx
│   │   │   │   │   │   ├── 📁 content-creator/    # Content creation system
│   │   │   │   │   │   │   ├── AdvancedTab.tsx    # Advanced options
│   │   │   │   │   │   │   ├── ContentTab.tsx     # Content editing
│   │   │   │   │   │   │   ├── FooterActions.tsx  # Action buttons
│   │   │   │   │   │   │   ├── MediaTab.tsx       # Media upload/management
│   │   │   │   │   │   │   ├── PreviewSection.tsx # Live preview
│   │   │   │   │   │   │   ├── types.ts           # Content creator types
│   │   │   │   │   │   │   └── utils.ts           # Utility functions
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 navigation/
│   │   │   │   │   │   ├── LiveActivityBar.tsx    # Real-time activity
│   │   │   │   │   │   ├── TopicSidebar.tsx       # Topic navigation
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 states/
│   │   │   │   │   │   ├── BroadcastFeedSkeleton.tsx # Loading states
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 ui/
│   │   │   │   │   │   ├── ReactionPicker.tsx     # Reaction system
│   │   │   │   │   │   ├── SmartSearch.tsx        # Smart search component
│   │   │   │   │   │   ├── SkillsInput.tsx        # Skills input component
│   │   │   │   │   │   ├── SmartMediaPreview.tsx  # Media preview
│   │   │   │   │   │   ├── PostCardSkeleton.tsx   # Post loading skeleton
│   │   │   │   │   │   └── TopicSidebarSkeleton.tsx # Sidebar skeleton
│   │   │   │   │   └── index.ts
│   │   │   │   ├── 📁 hooks/
│   │   │   │   │   ├── useBroadcasts.ts           # Main broadcast hooks
│   │   │   │   │   ├── useCreatePost.ts           # Post creation
│   │   │   │   │   ├── usePostById.ts             # Single post fetching
│   │   │   │   │   ├── useSaveDraft.ts            # Draft management
│   │   │   │   │   └── index.ts
│   │   │   │   ├── 📁 services/
│   │   │   │   │   └── broadcast.service.ts       # API integration
│   │   │   │   ├── 📁 store/
│   │   │   │   │   └── useBroadcastStore.ts       # State management
│   │   │   │   ├── types.ts                       # TypeScript definitions
│   │   │   │   └── page.tsx                       # Main broadcasts page
│   │   │   ├── 📁 community/
│   │   │   │   └── page.tsx                       # Community features
│   │   │   ├── 📁 components/
│   │   │   │   ├── avatar.tsx                     # Shared avatar component
│   │   │   │   └── confirm-delete.tsx             # Shared delete confirmation
│   │   │   ├── 📁 dashboard/                      # 📊 Main Dashboard System
│   │   │   │   ├── 📁 community/
│   │   │   │   │   └── page.tsx                   # Community dashboard
│   │   │   │   ├── 📁 components/
│   │   │   │   │   ├── 📁 header-container/
│   │   │   │   │   │   └── header-container.tsx   # Dashboard header
│   │   │   │   │   ├── 📁 quick-actions/
│   │   │   │   │   │   └── quick-actions.tsx      # Quick action buttons
│   │   │   │   │   └── 📁 tabs/
│   │   │   │   │       └── tabs-routing.tsx       # Tab navigation
│   │   │   │   ├── 📁 solutions/
│   │   │   │   │   └── page.tsx                   # Solutions dashboard
│   │   │   │   ├── layout.tsx                     # Dashboard layout
│   │   │   │   └── page.tsx                       # Main dashboard
│   │   │   ├── 📁 documents/                      # 📄 Document Management System
│   │   │   │   ├── 📁 components/
│   │   │   │   │   ├── DocumentViewerDrawer.tsx   # Document viewer
│   │   │   │   │   ├── 📁 cards/
│   │   │   │   │   │   ├── DocumentCard.tsx       # Document display card
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 filters/
│   │   │   │   │   │   ├── DocumentFiltersPanel.tsx # Advanced filtering
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 lists/
│   │   │   │   │   │   ├── DocumentListContainer.tsx # Document listing
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 modals/
│   │   │   │   │   │   ├── DocumentShareModal.tsx  # Sharing system
│   │   │   │   │   │   ├── DocumentUploadModal.tsx # Upload interface
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 navigation/
│   │   │   │   │   │   ├── DocumentTabs.tsx        # Document navigation
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 states/
│   │   │   │   │   │   ├── DocumentEmptyState.tsx  # Empty states
│   │   │   │   │   │   ├── DocumentErrorState.tsx  # Error handling
│   │   │   │   │   │   ├── DocumentLoadingSkeleton.tsx # Loading states
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── 📁 constants/
│   │   │   │   │   └── index.ts                    # Document constants
│   │   │   │   ├── 📁 hooks/
│   │   │   │   │   ├── useDebouncedSearch.ts       # Optimized search
│   │   │   │   │   ├── useDocumentFilters.ts       # Filter management
│   │   │   │   │   ├── useDocumentState.ts         # State management
│   │   │   │   │   └── index.ts
│   │   │   │   ├── 📁 utils/
│   │   │   │   │   ├── document-utilities.ts       # Document utilities
│   │   │   │   │   └── index.ts
│   │   │   │   ├── types.ts                        # Document types
│   │   │   │   ├── README.md                       # Documentation
│   │   │   │   └── page.tsx                        # Main documents page
│   │   │   ├── 📁 my-challenges/
│   │   │   │   └── page.tsx                        # User challenges
│   │   │   ├── 📁 profile/                         # 👤 Unified Profile System
│   │   │   │   ├── 📁 [id]/                        # Dynamic profile routes
│   │   │   │   │   ├── 📁 components/
│   │   │   │   │   │   ├── ActionButtons.tsx       # Reusable action buttons
│   │   │   │   │   │   ├── CVUploadDrawer.tsx      # CV upload & parsing
│   │   │   │   │   │   ├── ErrorState.tsx          # Error handling
│   │   │   │   │   │   ├── ProfileClient.tsx       # Main client component
│   │   │   │   │   │   ├── ProfileContent.tsx      # Content layout
│   │   │   │   │   │   ├── ProfileHeader.tsx       # Profile header with completion
│   │   │   │   │   │   ├── 📁 cards/
│   │   │   │   │   │   │   ├── ExperienceCard.tsx  # Experience display
│   │   │   │   │   │   │   └── SocialAccountCard.tsx # Social accounts
│   │   │   │   │   │   ├── 📁 forms/
│   │   │   │   │   │   │   ├── CertificationsForm.tsx # Certifications editing
│   │   │   │   │   │   │   ├── EducationForm.tsx    # Education editing
│   │   │   │   │   │   │   ├── EnhancedLanguagesForm.tsx # Language skills
│   │   │   │   │   │   │   ├── ExperienceForm.tsx   # Experience editing
│   │   │   │   │   │   │   ├── PersonalInfoForm.tsx # Personal info editing
│   │   │   │   │   │   │   ├── SkillsForm.tsx       # Skills management
│   │   │   │   │   │   │   ├── SocialAccountsForm.tsx # Social accounts
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   ├── 📁 modals/               # Legacy modals (being phased out)
│   │   │   │   │   │   │   ├── about-me.tsx
│   │   │   │   │   │   │   ├── edit-personal-data.tsx
│   │   │   │   │   │   │   ├── education-modal.tsx
│   │   │   │   │   │   │   ├── experience-modal.tsx
│   │   │   │   │   │   │   ├── language-modal.tsx
│   │   │   │   │   │   │   ├── notes-modal.tsx
│   │   │   │   │   │   │   ├── projects-modal.tsx
│   │   │   │   │   │   │   ├── services-modal.tsx
│   │   │   │   │   │   │   ├── skills-modal.tsx
│   │   │   │   │   │   │   └── testimonials-modal.tsx
│   │   │   │   │   │   └── 📁 sections/
│   │   │   │   │   │       ├── EducationSection.tsx # Self-contained education
│   │   │   │   │   │       ├── ExperienceSection.tsx # Self-contained experience
│   │   │   │   │   │       ├── LanguagesSection.tsx # Self-contained languages
│   │   │   │   │   │       ├── notes-section.tsx    # Notes management
│   │   │   │   │   │       ├── projects-section.tsx # Projects showcase
│   │   │   │   │   │       ├── services-section.tsx # Services offered
│   │   │   │   │   │       ├── testimonials-section.tsx # Testimonials
│   │   │   │   │   │       └── index.ts
│   │   │   │   │   ├── 📁 services/
│   │   │   │   │   │   ├── cv-service.ts            # CV parsing service
│   │   │   │   │   │   └── language-service.ts      # Language data service
│   │   │   │   │   ├── 📁 utils/
│   │   │   │   │   │   ├── profile-styles.ts        # HeroUI styling utilities
│   │   │   │   │   │   └── profileCompletion.ts     # Completion calculations
│   │   │   │   │   ├── types.ts                     # Profile TypeScript types
│   │   │   │   │   └── page.tsx                     # Dynamic profile page
│   │   │   │   └── page.tsx                         # Current user redirect
│   │   │   ├── 📁 skills/                           # 🎯 Skills Management System
│   │   │   │   ├── 📁 hooks/
│   │   │   │   │   ├── useCreateSkill.ts            # Skill creation
│   │   │   │   │   └── useSkills.ts                 # Skills management
│   │   │   │   ├── 📁 services/
│   │   │   │   │   └── skills.service.ts            # Skills API
│   │   │   │   └── types.ts                         # Skills types
│   │   │   ├── 📁 solutions/
│   │   │   │   └── page.tsx                         # Solutions marketplace
│   │   │   ├── 📁 talent-pool/                      # ⭐ Advanced Talent Discovery
│   │   │   │   ├── 📁 components/
│   │   │   │   │   ├── 📁 cards/
│   │   │   │   │   │   ├── TalentCard.tsx           # Individual talent display
│   │   │   │   │   │   ├── TalentGroupCard.tsx      # Group/team cards
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 filters/
│   │   │   │   │   │   ├── AvailabilityFilter.tsx   # Availability filtering
│   │   │   │   │   │   ├── CountryFilter.tsx        # Location filtering
│   │   │   │   │   │   ├── ExperienceFilter.tsx     # Experience level
│   │   │   │   │   │   ├── ProfessionFilter.tsx     # Profession filtering
│   │   │   │   │   │   ├── TalentFiltersPanel.tsx   # Main filter panel
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 lists/
│   │   │   │   │   │   ├── AgencyList.tsx           # Agency listings
│   │   │   │   │   │   ├── FreelancerList.tsx       # Freelancer listings
│   │   │   │   │   │   ├── TalentListContainer.tsx  # Main container
│   │   │   │   │   │   ├── TeamList.tsx             # Team listings
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 modals/
│   │   │   │   │   │   ├── InviteTalentModal.tsx    # Invitation system
│   │   │   │   │   │   ├── TalentGroupModal.tsx     # Group management
│   │   │   │   │   │   ├── TalentNoteModal.tsx      # Notes system
│   │   │   │   │   │   ├── TalentTagsModal.tsx      # Tagging system
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 navigation/
│   │   │   │   │   │   ├── TalentPoolTabs.tsx       # Tab navigation
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── 📁 states/
│   │   │   │   │   │   ├── TalentEmptyState.tsx     # Empty states
│   │   │   │   │   │   ├── TalentErrorState.tsx     # Error handling
│   │   │   │   │   │   ├── TalentLoadingSkeleton.tsx # Loading states
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── 📁 constants/
│   │   │   │   │   └── index.ts                     # Talent pool constants
│   │   │   │   ├── 📁 data/
│   │   │   │   │   └── countries.ts                 # Country data
│   │   │   │   ├── 📁 hooks/
│   │   │   │   │   ├── useDebouncedSearch.ts        # Search optimization
│   │   │   │   │   ├── useFilterMemoization.ts      # Filter optimization
│   │   │   │   │   ├── useTalentPoolState.ts        # State management
│   │   │   │   │   └── index.ts
│   │   │   │   ├── 📁 utils/
│   │   │   │   │   ├── country-flags.ts             # Flag utilities
│   │   │   │   │   ├── countryUtils.ts              # Country utilities
│   │   │   │   │   ├── search-utilities.ts          # Search utilities
│   │   │   │   │   ├── skill-icons.ts               # Skill icon mapping
│   │   │   │   │   └── talent-utilities.ts          # Core utilities
│   │   │   │   ├── types.ts                         # Talent pool types
│   │   │   │   └── page.tsx                         # Main talent pool page
│   │   │   ├── 📁 teams/                            # 👥 Team Management System
│   │   │   │   ├── 📁 [id]/                         # Dynamic team routes
│   │   │   │   │   ├── 📁 components/
│   │   │   │   │   │   ├── constants.ts             # Team constants
│   │   │   │   │   │   ├── 📁 tabs/
│   │   │   │   │   │   │   ├── members.tsx          # Team members tab
│   │   │   │   │   │   │   ├── overview.tsx         # Team overview
│   │   │   │   │   │   │   ├── projects-tab.tsx     # Projects management
│   │   │   │   │   │   │   └── tools-tab.tsx        # Tools & resources
│   │   │   │   │   │   ├── teams-header.tsx         # Team header
│   │   │   │   │   │   └── teams-navigation.tsx     # Team navigation
│   │   │   │   │   ├── 📁 hooks/
│   │   │   │   │   │   └── useTeamsDetails.ts       # Team data hooks
│   │   │   │   │   ├── 📁 services/
│   │   │   │   │   │   └── teams.services.ts        # Team API
│   │   │   │   │   ├── types.ts                     # Team types
│   │   │   │   │   └── page.tsx                     # Team detail page
│   │   │   │   └── page.tsx                         # Teams listing
│   │   │   ├── layout.tsx                           # Private layout wrapper
│   │   │   └── private-navbar.tsx                   # Private navigation
│   │   ├── 📁 api/                                  # API Routes
│   │   │   └── 📁 health/
│   │   │       └── route.ts                         # Health check endpoint
│   │   ├── layout.tsx                               # Root layout
│   │   ├── loading.tsx                              # Global loading component
│   │   └── sitemap.ts                               # SEO sitemap
│   ├── 📁 components/                               # Shared UI Components
│   │   ├── 📁 landing/                              # Landing page sections
│   │   ├── 📁 providers/                            # Context providers
│   │   ├── 📁 ui/                                   # Reusable UI elements
│   │   └── 📁 layouts/                              # Layout components
│   ├── 📁 hooks/                                    # Global Custom Hooks
│   ├── 📁 lib/                                      # Utilities and Configurations
│   │   ├── 📁 types/                                # Global TypeScript types
│   │   ├── axios.ts                                 # API client setup
│   │   └── seo.ts                                   # SEO utilities
│   └── 📁 styles/                                   # Global Styles
├── 📁 modules/                                      # Feature Modules
│   ├── 📁 auth/                                     # 🔐 Authentication System
│   │   ├── 📁 hooks/
│   │   │   ├── use-login.tsx                        # Login hooks
│   │   │   ├── use-oauth.ts                         # OAuth integration
│   │   │   └── use-register.tsx                     # Registration hooks
│   │   ├── 📁 schema/
│   │   │   ├── login-schema.ts                      # Login validation
│   │   │   └── register-schema.ts                   # Registration validation
│   │   ├── 📁 services/
│   │   │   └── auth.service.ts                      # Authentication API
│   │   └── 📁 store/
│   │       └── use-user-store.tsx                   # User state management
│   ├── 📁 documents/                                # 📄 Document Module Services
│   │   ├── 📁 hooks/
│   │   │   ├── use-documents.ts                     # Document hooks
│   │   │   └── useUpload.ts                         # Upload hooks
│   │   └── 📁 services/
│   │       ├── documents.service.ts                 # Document API
│   │       └── upload.service.ts                    # Upload API
│   ├── 📁 invitations/                              # 📬 Invitations System
│   │   └── 📁 services/
│   │       └── invitations.service.ts               # Invitations API
│   └── 📁 profile/                                  # 👤 Profile Module Services
│       ├── 📁 hooks/
│       │   ├── profile.server.tsx                   # Server-side profile hooks
│       │   ├── use-basic-profile.tsx                # Basic profile data
│       │   └── use-profile.tsx                      # Full profile management
│       ├── 📁 services/
│       │   └── profile.service.ts                   # Profile API
│       └── types.ts                                 # Profile module types
├── 📁 messages/                                     # 🌍 Internationalization (i18n)
│   ├── en.json                                      # English translations
│   ├── nl.json                                      # Dutch translations
│   └── fr.json                                      # French translations
└── 📁 public/                                       # Static Assets
```

## 🚀 Feature Breakdown by Category

### 🔐 Authentication & User Management

**Location**: `modules/auth/`, `app/(public)/register/`

**Features**:

- **Multi-step Registration Wizards**: Simple and Premium flows with billing integration
- **OAuth Integration**: Social login with Google, LinkedIn, and other providers
- **Form Validation**: Zod schema validation with real-time feedback
- **Role-based Access Control**: Protected routes with user permissions
- **State Management**: Persistent user state with Zustand

**Key Components**:

- `registration-wizard.tsx` - Main wizard controller
- `simple-wizard.tsx` - Streamlined registration flow
- `premium-wizard.tsx` - Premium tier registration with billing
- `billing-form.tsx` - Payment and billing information
- `category-selection.tsx` - User type selection (Freelancer, Company, Agency)

### 👤 Unified Profile System

**Location**: `app/private/profile/[id]/`, `modules/profile/`

**Features**:

- **Dynamic Profile Viewing**: Universal profile viewer with contextual editing
- **CV Import & Parsing**: Professional CV upload with data extraction and review
- **Self-contained Sections**: Independent sections with CRUD operations
- **Real-time Completion Tracking**: Profile completion percentage with guidance
- **Connection Management**: Invitation system with status tracking
- **Responsive Design**: Mobile-optimized with progressive enhancement

**Key Components**:

- `ProfileClient.tsx` - Main client-side orchestrator
- `ProfileHeader.tsx` - Header with completion tracking and CV upload
- `CVUploadDrawer.tsx` - Advanced CV parsing and import system
- `ExperienceSection.tsx` - Self-contained experience management
- `EducationSection.tsx` - Education history management
- `LanguagesSection.tsx` - Language skills with proficiency levels

**Advanced Features**:

- **CV Parsing Service**: Extract data from uploaded CVs with review interface
- **Profile Completion Calculator**: Smart completion tracking with weighted sections
- **Social Account Integration**: Link and manage social media profiles
- **Skills Management**: Dynamic skills with autocomplete and validation

### ⭐ Advanced Talent Discovery

**Location**: `app/private/talent-pool/`

**Features**:

- **Multi-category Browsing**: Freelancers, Agencies, Teams with specialized interfaces
- **Advanced Filtering**: Location, skills, availability, experience, rates
- **Search Optimization**: Debounced search with memoized results
- **Invitation System**: Direct talent invitation with custom messages
- **Connection Management**: Track invitation status and manage connections
- **Performance Optimization**: Memoized filters and lazy loading

**Key Components**:

- `TalentCard.tsx` - Individual talent showcase with actions
- `TalentFiltersPanel.tsx` - Advanced filtering interface
- `InviteTalentModal.tsx` - Invitation system with custom messaging
- `TalentListContainer.tsx` - Main listing container with pagination

**Performance Features**:

- `useFilterMemoization.ts` - Optimized filter performance
- `useDebouncedSearch.ts` - Efficient search with reduced API calls
- `useTalentPoolState.ts` - Centralized state management

### 📄 Document Management System

**Location**: `app/private/documents/`, `modules/documents/`

**Features**:

- **File Organization**: Advanced categorization, tagging, and folder structures
- **Upload System**: Drag-and-drop with progress tracking and validation
- **Search & Filter**: Real-time search with multiple filter criteria
- **Sharing & Collaboration**: Team document sharing with permission controls
- **Version Control**: Document versioning and history tracking
- **Preview System**: In-app document preview for multiple file types

**Key Components**:

- `DocumentCard.tsx` - Rich document display with metadata
- `DocumentUploadModal.tsx` - Advanced upload interface
- `DocumentFiltersPanel.tsx` - Comprehensive filtering system
- `DocumentViewerDrawer.tsx` - Document preview and viewing

**Advanced Features**:

- **Smart Categorization**: Automatic document categorization
- **Bulk Operations**: Multi-select for batch operations
- **Access Control**: Granular sharing permissions
- **Search Intelligence**: Content-based search with OCR support

### 📢 Broadcast Communication System

**Location**: `app/private/broadcasts/`

**Features**:

- **Content Creation**: Advanced post creator with rich media support
- **Topic Management**: Organized content by topics with following system
- **Smart Search**: Auto-complete search with suggestions and recent searches
- **Reaction System**: Advanced reactions beyond basic likes (Love, Laugh, Wow, etc.)
- **Media Handling**: Support for images, videos, documents with smart previews
- **Real-time Updates**: Live activity feeds and notifications

**Key Components**:

- `ContentCreator.tsx` - Advanced post creation interface
- `PostCard.tsx` - Enhanced post display with glassmorphism design
- `TopicSidebar.tsx` - Topic navigation with smart search
- `ReactionPicker.tsx` - Advanced reaction system
- `BroadcastFilters.tsx` - Content filtering and discovery

**Advanced Features**:

- **Smart Search**: `SmartSearch.tsx` with auto-complete and suggestions
- **Reaction System**: Multiple reaction types with counts and animations
- **Media Management**: Smart media preview and carousel
- **Topic Following**: Subscribe to topics for personalized feeds

### 👥 Team Collaboration

**Location**: `app/private/teams/`

**Features**:

- **Team Management**: Create and manage teams with role-based permissions
- **Project Tracking**: Monitor team projects and deliverables
- **Member Management**: Add/remove team members with role assignments
- **Tools Integration**: Integrate with external tools and services
- **Performance Analytics**: Team performance metrics and insights

**Key Components**:

- `teams-header.tsx` - Team overview and key metrics
- `members.tsx` - Team member management interface
- `projects-tab.tsx` - Project tracking and management
- `tools-tab.tsx` - Tools and integrations management

### 📊 Dashboard System

**Location**: `app/private/dashboard/`

**Features**:

- **Overview Dashboard**: Comprehensive metrics and KPI tracking
- **Quick Actions**: Fast access to common operations
- **Activity Feeds**: Recent activity across all platform features
- **Customizable Layout**: Personalized dashboard configuration
- **Real-time Updates**: Live data updates and notifications

**Key Components**:

- `header-container.tsx` - Dashboard header with metrics
- `quick-actions.tsx` - Fast action buttons and shortcuts
- `tabs-routing.tsx` - Tabbed navigation system

### 🎯 Skills Management

**Location**: `app/private/skills/`

**Features**:

- **Skill Creation**: Create and validate new skills
- **Skill Hierarchy**: Organized skill categories and relationships
- **Proficiency Levels**: Track skill proficiency and certification
- **Skill Matching**: Match skills between users and opportunities

### 🛠️ Technical Architecture

#### Component Organization Patterns

**Feature-based Structure**:

```
feature/
├── components/
│   ├── cards/          # Display components
│   ├── forms/          # Input and editing components
│   ├── modals/         # Modal dialogs
│   ├── lists/          # List containers
│   ├── filters/        # Filtering components
│   ├── navigation/     # Navigation elements
│   └── states/         # Loading, error, empty states
├── hooks/              # Feature-specific hooks
├── services/           # API integration
├── utils/              # Utility functions
├── types.ts            # TypeScript definitions
└── page.tsx            # Route component
```

#### State Management Patterns

**Zustand Integration**:

- Global user state in `modules/auth/store/`
- Feature-specific stores (broadcasts, talent-pool)
- Persistent state with localStorage integration
- Optimistic updates for better UX

**React Hook Patterns**:

- Custom hooks for API integration
- Debounced search hooks for performance
- Memoized filter hooks for optimization
- State management hooks for complex forms

#### Performance Optimizations

**Memoization Strategies**:

- `React.memo` for expensive components
- `useMemo` for computed values
- `useCallback` for stable function references
- Filter memoization for search interfaces

**Code Splitting**:

- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy features
- Progressive enhancement patterns

#### Type Safety

**Comprehensive TypeScript Coverage**:

- Strict TypeScript configuration
- Feature-specific type definitions
- API response type safety
- Form validation with Zod schemas

## 🌍 Internationalization (i18n)

**Complete translation coverage** for English, Dutch, and French:

- **Broadcast System**: All UI text, messages, and interactions
- **Profile System**: Forms, labels, and user guidance
- **Talent Pool**: Filters, actions, and status messages
- **Document System**: File management and sharing text
- **Authentication**: Registration and login flows

**Translation Structure**:

```
messages/
├── en.json     # English (primary)
├── nl.json     # Dutch
└── fr.json     # French
```

## 🎨 UI/UX Design System

### Modern Design Language

**HeroUI Integration**:

- Consistent component library usage
- Dark/Light mode with system preference detection
- Accessible components with ARIA support
- Responsive design patterns

**Visual Enhancements**:

- **Glassmorphism Effects**: Modern backdrop-blur and transparency
- **Micro-animations**: Framer Motion for smooth interactions
- **Loading States**: Comprehensive skeleton screens and progress indicators
- **Hover Effects**: Interactive feedback with scale and shadow transforms

### Responsive Design

**Mobile-first Approach**:

- Progressive enhancement for larger screens
- Touch-optimized interactions
- Adaptive layouts for all device sizes
- Performance optimization for mobile networks

## 🚀 Development & Deployment

### Technology Stack

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

### Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm type-check       # TypeScript checking
pnpm lint             # Code linting
pnpm format           # Code formatting

# Feature-specific development
cd src/app/private/[feature]  # Navigate to feature
pnpm lint                     # Check feature code quality
```

### Architecture Benefits

**Scalability**:

- Feature-based organization keeps related code together
- Modular architecture allows independent feature development
- Clear separation of concerns between UI, logic, and data

**Maintainability**:

- Consistent patterns across features
- Comprehensive TypeScript coverage
- Clean component hierarchies
- Standardized error handling

**Performance**:

- Optimized with advanced React patterns
- Strategic memoization and lazy loading
- Efficient state management
- Minimal bundle sizes through code splitting

**Developer Experience**:

- Fast development with hot reload
- Excellent tooling and debugging
- Clear project structure and documentation
- Automated code quality checks

This architecture ensures a scalable, maintainable, and performant web application with enterprise-grade features and exceptional user experience.
