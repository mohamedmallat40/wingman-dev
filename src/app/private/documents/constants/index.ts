// ============================================================================
// DOCUMENT CONSTANTS - ORGANIZED CONFIGURATION
// ============================================================================

// Breadcrumb configuration
export const BREADCRUMB_CONFIG = {
  HOME: {
    label: 'Home',
    href: '/private/dashboard',
    icon: 'solar:home-linear'
  },
  DOCUMENTS: {
    label: 'Documents',
    href: '/private/documents',
    icon: 'solar:document-text-linear'
  }
};

// Tab configuration
export const TAB_BREADCRUMB_LABELS = {
  'all-documents': 'All Documents',
  'shared-with-me': 'Shared with Me'
};

export const TAB_BREADCRUMB_ICONS = {
  'all-documents': 'solar:document-text-linear',
  'shared-with-me': 'solar:share-linear'
};

// Action items configuration
export const ACTION_ITEMS = [
  {
    key: 'upload',
    label: 'Upload Document',
    icon: 'solar:upload-linear',
    color: 'primary' as const,
    variant: 'solid' as const
  },
  {
    key: 'new-folder',
    label: 'New Folder',
    icon: 'solar:folder-plus-linear',
    color: 'secondary' as const,
    variant: 'bordered' as const
  }
];

// Document types
export const DOCUMENT_TYPES = ['INVOICE', 'QUOTE', 'CONTRACT', 'PROPOSAL', 'TEMPLATE'] as const;

// Document statuses
export const DOCUMENT_STATUSES = [
  'Draft',
  'Pending Review',
  'Issued',
  'Rejected',
  'Overdue',
  'Archived',
  'Cancelled',
  'Disputed'
] as const;

// File upload settings
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    '.pdf',
    '.doc',
    '.docx',
    '.txt',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.xlsx',
    '.xls',
    '.ppt',
    '.pptx'
  ],
  acceptedMimeTypes:
    'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/*,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint'
};

// View modes
export const VIEW_MODES = ['list', 'grid'] as const;

// Animation configurations
export const ANIMATIONS = {
  cardEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  modalEnter: {
    initial: { opacity: 0, scale: 0.95, y: -20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  tabTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  }
};
