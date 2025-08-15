'use client';

import React from 'react';

import {
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export interface BroadcastError {
  code?: string;
  message: string;
  details?: Record<string, any>;
  timestamp?: Date;
  operation?: 'create' | 'update' | 'upload' | 'delete' | 'fetch';
  retryable?: boolean;
  field?: string;
}

interface BroadcastErrorHandlerProps {
  error: BroadcastError | Error | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
  className?: string;
}

// Error code to translation key mapping
const ERROR_CODE_MAP: Record<string, string> = {
  NETWORK_ERROR: 'networkError',
  SERVER_ERROR: 'serverError',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  TOO_MANY_REQUESTS: 'tooManyRequests',
  CONTENT_TOO_LONG: 'contentTooLong',
  INVALID_DATA: 'invalidData',
  SESSION_EXPIRED: 'sessionExpired',
  FILE_TOO_LARGE: 'fileTooLarge',
  INVALID_FILE_TYPE: 'invalidFileType',
  UPLOAD_FAILED: 'uploadFailed',
  PUBLISH_FAILED: 'publishFailed',
  UPDATE_FAILED: 'updateFailed',
  DRAFT_SAVE_FAILED: 'draftSaveFailed',
  SCHEDULE_FAILED: 'scheduleFailed'
};

// Error severity levels
const getErrorSeverity = (
  error: BroadcastError | Error
): 'low' | 'medium' | 'high' | 'critical' => {
  if (error instanceof Error) {
    return 'medium';
  }

  const criticalCodes = ['SESSION_EXPIRED', 'UNAUTHORIZED', 'SERVER_ERROR'];
  const highCodes = ['FORBIDDEN', 'PUBLISH_FAILED', 'UPLOAD_FAILED'];
  const mediumCodes = ['NETWORK_ERROR', 'INVALID_DATA', 'TOO_MANY_REQUESTS'];

  if (error.code && criticalCodes.includes(error.code)) return 'critical';
  if (error.code && highCodes.includes(error.code)) return 'high';
  if (error.code && mediumCodes.includes(error.code)) return 'medium';

  return 'low';
};

// Get error icon based on severity
const getErrorIcon = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'solar:danger-circle-linear';
    case 'high':
      return 'solar:close-circle-linear';
    case 'medium':
      return 'solar:warning-circle-linear';
    case 'low':
    default:
      return 'solar:info-circle-linear';
  }
};

// Get error color based on severity
const getErrorColor = (severity: string): 'danger' | 'warning' | 'primary' => {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'danger';
    case 'medium':
      return 'warning';
    case 'low':
    default:
      return 'primary';
  }
};

const BroadcastErrorHandler: React.FC<BroadcastErrorHandlerProps> = ({
  error,
  onRetry,
  onDismiss,
  showDetails = false,
  className = ''
}) => {
  const t = useTranslations('broadcasts.errors');
  const tCommon = useTranslations('common');
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!error) return null;

  const broadcastError: BroadcastError =
    error instanceof Error ? { message: error.message, code: 'UNKNOWN_ERROR' } : error;

  const severity = getErrorSeverity(broadcastError);
  const icon = getErrorIcon(severity);
  const color = getErrorColor(severity);

  // Get translated error message
  const getErrorMessage = (): string => {
    if (broadcastError.code && ERROR_CODE_MAP[broadcastError.code]) {
      return t(ERROR_CODE_MAP[broadcastError.code]);
    }
    return broadcastError.message || t('networkError');
  };

  // Check if error is retryable
  const isRetryable = (): boolean => {
    const retryableCodes = ['NETWORK_ERROR', 'SERVER_ERROR', 'TOO_MANY_REQUESTS', 'UPLOAD_FAILED'];
    return (
      broadcastError.retryable !== false &&
      (broadcastError.code ? retryableCodes.includes(broadcastError.code) : true)
    );
  };

  // Get retry suggestions based on error type
  const getRetrySuggestions = (): string[] => {
    const suggestions: string[] = [];

    switch (broadcastError.code) {
      case 'NETWORK_ERROR':
        suggestions.push('Check your internet connection');
        suggestions.push('Try again in a few moments');
        break;
      case 'TOO_MANY_REQUESTS':
        suggestions.push('Wait a few minutes before trying again');
        suggestions.push('You may have reached the rate limit');
        break;
      case 'FILE_TOO_LARGE':
        suggestions.push('Reduce file size or compress the media');
        suggestions.push('Split large files into smaller ones');
        break;
      case 'UPLOAD_FAILED':
        suggestions.push('Check your internet connection');
        suggestions.push('Try uploading files one at a time');
        break;
      case 'SESSION_EXPIRED':
        suggestions.push('Please log in again');
        suggestions.push('Your session has timed out');
        break;
      default:
        suggestions.push('Please try again');
        suggestions.push('Contact support if the problem persists');
    }

    return suggestions;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={className}
      >
        <Card className={`border-${color}-200 bg-${color}-50`}>
          <CardBody className='p-4'>
            <div className='flex items-start gap-3'>
              <Icon icon={icon} className={`h-5 w-5 text-${color}-500 mt-0.5 flex-shrink-0`} />

              <div className='flex-1 space-y-3'>
                {/* Error Message */}
                <div>
                  <h4 className={`font-semibold text-${color}-800`}>
                    {broadcastError.operation && (
                      <span className='capitalize'>{broadcastError.operation} </span>
                    )}
                    Error
                  </h4>
                  <p className={`text-sm text-${color}-600 mt-1`}>{getErrorMessage()}</p>
                </div>

                {/* Error Code and Timestamp */}
                <div className='flex flex-wrap items-center gap-2'>
                  {broadcastError.code && (
                    <Chip size='sm' variant='flat' color={color}>
                      {broadcastError.code}
                    </Chip>
                  )}

                  {broadcastError.timestamp && (
                    <span className={`text-xs text-${color}-500`}>
                      {broadcastError.timestamp.toLocaleTimeString()}
                    </span>
                  )}

                  <Chip size='sm' variant='flat' color={color}>
                    {severity.toUpperCase()}
                  </Chip>
                </div>

                {/* Quick Suggestions */}
                {severity !== 'low' && (
                  <div className='space-y-2'>
                    <h5 className={`text-sm font-medium text-${color}-700`}>Quick fixes:</h5>
                    <ul className={`text-xs text-${color}-600 space-y-1`}>
                      {getRetrySuggestions()
                        .slice(0, 2)
                        .map((suggestion, index) => (
                          <li key={index} className='flex items-center gap-2'>
                            <Icon icon='solar:check-circle-linear' className='h-3 w-3' />
                            {suggestion}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className='flex items-center gap-2 pt-2'>
                  {isRetryable() && onRetry && (
                    <Button
                      size='sm'
                      color={color}
                      variant='solid'
                      onPress={onRetry}
                      startContent={<Icon icon='solar:refresh-linear' className='h-3 w-3' />}
                    >
                      {tCommon('retry')}
                    </Button>
                  )}

                  {showDetails && (
                    <Button
                      size='sm'
                      color={color}
                      variant='bordered'
                      onPress={onOpen}
                      startContent={<Icon icon='solar:eye-linear' className='h-3 w-3' />}
                    >
                      Details
                    </Button>
                  )}

                  {onDismiss && (
                    <Button
                      size='sm'
                      color='default'
                      variant='light'
                      onPress={onDismiss}
                      startContent={<Icon icon='solar:close-linear' className='h-3 w-3' />}
                    >
                      Dismiss
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Error Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <Icon icon={icon} className={`h-5 w-5 text-${color}-500`} />
              Error Details
            </div>
          </ModalHeader>

          <ModalBody>
            <div className='space-y-4'>
              {/* Basic Information */}
              <div>
                <h4 className='mb-2 font-semibold'>Error Information</h4>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-foreground-500'>Message:</span>
                    <span>{getErrorMessage()}</span>
                  </div>

                  {broadcastError.code && (
                    <div className='flex justify-between'>
                      <span className='text-foreground-500'>Code:</span>
                      <span>{broadcastError.code}</span>
                    </div>
                  )}

                  {broadcastError.operation && (
                    <div className='flex justify-between'>
                      <span className='text-foreground-500'>Operation:</span>
                      <span className='capitalize'>{broadcastError.operation}</span>
                    </div>
                  )}

                  <div className='flex justify-between'>
                    <span className='text-foreground-500'>Severity:</span>
                    <Chip size='sm' color={color}>
                      {severity.toUpperCase()}
                    </Chip>
                  </div>

                  {broadcastError.timestamp && (
                    <div className='flex justify-between'>
                      <span className='text-foreground-500'>Time:</span>
                      <span>{broadcastError.timestamp.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Troubleshooting Steps */}
              <div>
                <h4 className='mb-2 font-semibold'>Troubleshooting Steps</h4>
                <ol className='space-y-2 text-sm'>
                  {getRetrySuggestions().map((suggestion, index) => (
                    <li key={index} className='flex items-start gap-2'>
                      <span className='text-foreground-500 mt-1'>{index + 1}.</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Technical Details */}
              {broadcastError.details && (
                <div>
                  <h4 className='mb-2 font-semibold'>Technical Details</h4>
                  <Card className='bg-default-100'>
                    <CardBody className='p-3'>
                      <pre className='overflow-auto text-xs'>
                        {JSON.stringify(broadcastError.details, null, 2)}
                      </pre>
                    </CardBody>
                  </Card>
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button color='default' variant='light' onPress={onClose}>
              Close
            </Button>

            {isRetryable() && onRetry && (
              <Button
                color={color}
                onPress={() => {
                  onRetry();
                  onClose();
                }}
                startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
              >
                {tCommon('retry')}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BroadcastErrorHandler;

// Utility function to create BroadcastError from various error sources
export const createBroadcastError = (
  error: any,
  operation?: BroadcastError['operation'],
  field?: string
): BroadcastError => {
  // Handle API response errors
  if (error?.response?.data) {
    return {
      code: error.response.data.code || 'SERVER_ERROR',
      message: error.response.data.message || error.response.statusText || 'Server error occurred',
      details: error.response.data,
      timestamp: new Date(),
      operation,
      field,
      retryable: error.response.status >= 500 || error.response.status === 429
    };
  }

  // Handle network errors
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed. Please check your internet connection.',
      timestamp: new Date(),
      operation,
      field,
      retryable: true
    };
  }

  // Handle timeout errors
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Request timed out. Please try again.',
      timestamp: new Date(),
      operation,
      field,
      retryable: true
    };
  }

  // Handle generic errors
  return {
    code: error?.code || 'UNKNOWN_ERROR',
    message: error?.message || 'An unexpected error occurred',
    timestamp: new Date(),
    operation,
    field,
    retryable: true
  };
};

// Hook for handling broadcast errors consistently
export const useBroadcastErrorHandler = () => {
  const handleError = (
    error: any,
    operation?: BroadcastError['operation'],
    field?: string
  ): BroadcastError => {
    const broadcastError = createBroadcastError(error, operation, field);

    // Error handling is processed by the UI components

    return broadcastError;
  };

  return { handleError };
};
