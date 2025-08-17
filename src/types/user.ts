/**
 * User-related types
 */

import type { BaseEntity, UserRole } from './common';

// Core User interface
export interface User extends BaseEntity {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly profileImage?: string;
  readonly role: UserRole;
  readonly isActive: boolean;
  readonly lastLoginAt?: string;
}

// User display information - for UI components
export interface UserDisplay {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly fullName: string;
  readonly profileImage?: string;
  readonly avatar?: string;
  readonly role?: UserRole;
}

// User profile summary - lightweight version for listings
export interface UserSummary {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly profileImage?: string;
  readonly avatar?: string; // For backward compatibility
  readonly role: UserRole;
}

// User creation payload
export interface CreateUserPayload {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly password: string;
  readonly role: UserRole;
}

// User update payload
export interface UpdateUserPayload {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly profileImage?: string;
}

// Authentication related types
export interface AuthUser extends User {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly permissions: readonly string[];
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterPayload extends CreateUserPayload {
  readonly confirmPassword: string;
  readonly acceptTerms: boolean;
}