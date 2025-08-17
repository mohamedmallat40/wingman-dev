/**
 * Document sharing specific types
 */

import type { Document, DocumentShare, Permission } from './document';
import type { UserSummary } from '@/types';

// Sharing configuration
export interface SharingConfig {
  readonly allowPublicSharing: boolean;
  readonly allowExternalSharing: boolean;
  readonly defaultPermission: Permission;
  readonly maxSharesPerDocument: number;
  readonly requireEmailVerification: boolean;
  readonly allowPasswordProtection: boolean;
  readonly enableExpirationDates: boolean;
  readonly defaultExpirationDays: number;
}

// Share link configuration
export interface ShareLink {
  readonly id: string;
  readonly documentId: string;
  readonly token: string;
  readonly permission: Permission;
  readonly expiresAt?: string;
  readonly isPasswordProtected: boolean;
  readonly accessCount: number;
  readonly maxAccessCount?: number;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly lastAccessedAt?: string;
  readonly isActive: boolean;
}

// Bulk sharing payload
export interface BulkSharePayload {
  readonly documentIds: readonly string[];
  readonly userEmails: readonly string[];
  readonly permission: Permission;
  readonly message?: string;
  readonly expiresAt?: string;
  readonly notifyUsers: boolean;
}

// Sharing analytics
export interface SharingAnalytics {
  readonly documentId: string;
  readonly totalShares: number;
  readonly activeShares: number;
  readonly expiredShares: number;
  readonly sharesByPermission: Record<Permission, number>;
  readonly recentActivity: readonly ShareActivity[];
  readonly topSharedWith: readonly UserSummary[];
}

export interface ShareActivity {
  readonly id: string;
  readonly type: ShareActivityType;
  readonly userId: string;
  readonly user: UserSummary;
  readonly documentId: string;
  readonly timestamp: string;
  readonly metadata?: Record<string, unknown>;
}

export type ShareActivityType =
  | 'shared'
  | 'accessed'
  | 'downloaded'
  | 'permission_changed'
  | 'revoked'
  | 'expired';

// Share invitation
export interface ShareInvitation {
  readonly id: string;
  readonly documentId: string;
  readonly document: Document;
  readonly inviterEmail: string;
  readonly inviterName: string;
  readonly inviteeEmail: string;
  readonly permission: Permission;
  readonly message?: string;
  readonly token: string;
  readonly expiresAt?: string;
  readonly acceptedAt?: string;
  readonly rejectedAt?: string;
  readonly status: InvitationStatus;
  readonly createdAt: string;
}

export type InvitationStatus = 
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'cancelled';

// Share permissions with detailed capabilities
export interface DetailedPermission {
  readonly level: Permission;
  readonly capabilities: readonly ShareCapability[];
  readonly description: string;
}

export type ShareCapability =
  | 'view'
  | 'download'
  | 'comment'
  | 'annotate'
  | 'share'
  | 'edit_metadata'
  | 'delete'
  | 'manage_permissions';

// Component props for sharing components
export interface ShareModalProps {
  readonly document: Document | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onShareComplete?: (shares: readonly DocumentShare[]) => void;
  readonly onError?: (error: string) => void;
  readonly config?: Partial<SharingConfig>;
  readonly className?: string;
}

export interface ShareFormProps {
  readonly document: Document;
  readonly onSubmit: (payload: BulkSharePayload) => Promise<void>;
  readonly isSubmitting?: boolean;
  readonly config?: Partial<SharingConfig>;
  readonly className?: string;
}

export interface ShareListProps {
  readonly shares: readonly DocumentShare[];
  readonly onPermissionChange: (shareId: string, permission: Permission) => Promise<void>;
  readonly onRevoke: (shareId: string) => Promise<void>;
  readonly onResend: (shareId: string) => Promise<void>;
  readonly isLoading?: boolean;
  readonly className?: string;
}

export interface ShareLinkProps {
  readonly link: ShareLink | null;
  readonly onCreate: (config: Partial<ShareLink>) => Promise<ShareLink>;
  readonly onUpdate: (linkId: string, changes: Partial<ShareLink>) => Promise<ShareLink>;
  readonly onRevoke: (linkId: string) => Promise<void>;
  readonly isLoading?: boolean;
  readonly className?: string;
}

export interface ShareAnalyticsProps {
  readonly analytics: SharingAnalytics;
  readonly dateRange?: { from: string; to: string };
  readonly onDateRangeChange?: (range: { from: string; to: string }) => void;
  readonly className?: string;
}

export interface PermissionSelectorProps {
  readonly currentPermission: Permission;
  readonly availablePermissions: readonly DetailedPermission[];
  readonly onChange: (permission: Permission) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export interface UserSelectorProps {
  readonly selectedUsers: readonly UserSummary[];
  readonly onSelectionChange: (users: readonly UserSummary[]) => void;
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly suggestions: readonly UserSummary[];
  readonly isLoading?: boolean;
  readonly maxUsers?: number;
  readonly className?: string;
}