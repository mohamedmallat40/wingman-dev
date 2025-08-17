/**
 * Shared/common types barrel file for clean re-exports
 * Contains only types that are shared across multiple features
 * Feature-specific types should be kept within their respective feature folders
 */

// Common/shared types used across the application
export * from './common';

// User-related types (shared across features)
export * from './user';

// Re-export from lib/types for backward compatibility
export * from '../lib/types';