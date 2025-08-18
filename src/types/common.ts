/**
 * Common/shared types used across the application
 */

// Base entity interface that most entities should extend
export interface BaseEntity {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt?: string;
}

// API Response wrapper types
export interface ApiResponse<T> {
  readonly data: T;
  readonly success: boolean;
  readonly message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
  };
}

// Error types
export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

// User role types - using union instead of enum for better tree-shaking
export type UserRole = 'AGENCY' | 'FREELANCER' | 'COMPANY' | 'ADMIN';

// Permission types
export type Permission = 'read' | 'write' | 'admin' | 'owner';

// Date range utility type
export interface DateRange {
  readonly from?: string;
  readonly to?: string;
}

// File types
export interface FileInfo {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly lastModified: number;
}

// Tag interface for reusable tag system
export interface Tag extends BaseEntity {
  readonly name: string;
  readonly color?: string;
  readonly description?: string;
}

// Category interface for reusable category system
export interface Category extends BaseEntity {
  readonly name: string;
  readonly description?: string;
  readonly parentId?: string;
}

// Status interface for reusable status system
export interface Status extends BaseEntity {
  readonly name: string;
  readonly color?: string;
  readonly description?: string;
}

// Generic filter interface
export interface BaseFilters {
  readonly search?: string;
  readonly dateRange?: DateRange;
  readonly tags?: readonly string[];
  readonly status?: string;
  readonly category?: string;
}

// Utility types for making properties required
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Utility type for creating DTOs
export type CreateDto<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDto<T extends BaseEntity> = Partial<CreateDto<T>>;

// View mode type - commonly used across features
export type ViewMode = 'list' | 'grid' | 'card';

// Sort direction
export type SortDirection = 'asc' | 'desc';

// Sort configuration
export interface SortConfig<T extends string = string> {
  readonly field: T;
  readonly direction: SortDirection;
}
