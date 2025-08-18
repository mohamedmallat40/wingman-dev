# Types Organization

This directory contains **shared/common types** that are used across multiple features in the application.

## Structure

```
src/types/
├── index.ts        # Barrel file for all shared types
├── common.ts       # Base interfaces, API responses, utility types
├── user.ts         # User-related types shared across features
└── README.md       # This file
```

## Guidelines

### ✅ What goes in `/src/types/`:

- **Common interfaces**: `BaseEntity`, `ApiResponse<T>`, `PaginatedResponse<T>`
- **Shared utilities**: `CreateDto<T>`, `UpdateDto<T>`, `ViewMode`
- **Cross-feature types**: `User`, `UserSummary`, `UserRole`
- **Global constants**: Permission types, common enums

### ❌ What does NOT go here:

- **Feature-specific types**: Document types, Profile types, etc.
- **Component prop interfaces**: Should be near the components
- **Domain-specific business logic types**

## Feature-Specific Types

Each feature should maintain its own types in a dedicated folder:

```
src/app/private/documents/types/
├── index.ts        # Feature barrel file
├── document.ts     # Core document types
├── upload.ts       # Upload-specific types
├── viewer.ts       # Viewer-specific types
├── sharing.ts      # Sharing-specific types
└── filters.ts      # Filtering-specific types
```

## Import Guidelines

### From shared types:

```typescript
import type { ApiResponse, BaseEntity, User } from '@/types';
```

### From feature types:

```typescript
// Within the same feature
import type { Document, DocumentFilters } from './types';
import type { UploadProgress } from './types/upload';

// From other features (avoid if possible)
import type { Document } from '@/app/private/documents/types';
```

## Benefits

1. **Clear separation of concerns** - Shared vs feature-specific
2. **Better tree-shaking** - Only import what you need
3. **Reduced coupling** - Features are more independent
4. **Easier maintenance** - Types are close to their usage
5. **Scalability** - New features don't pollute shared types
