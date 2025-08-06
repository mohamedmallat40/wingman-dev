import React from 'react';

import {
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { formatDate } from '@/lib/utils/utilities';

import { IDocument } from '../types';

interface DocumentCardProperties {
  document: IDocument;
}

const getDocumentIcon = (typeName: string) => {
  const iconMap: Record<string, { icon: string; color: string; bgColor: string }> = {
    Proposal: { icon: 'solar:document-bold', color: 'text-blue-500', bgColor: 'bg-blue-100' },
    Contract: { icon: 'mdi:contract-outline', color: 'text-purple-500', bgColor: 'bg-purple-100' },
    Invoice: { icon: 'solar:bill-list-bold', color: 'text-green-500', bgColor: 'bg-green-100' },
    Spreadsheet: {
      icon: 'solar:chart-square-bold',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    Template: { icon: 'solar:file-text-bold', color: 'text-gray-500', bgColor: 'bg-gray-100' }
  };

  const config = iconMap[typeName] || iconMap['Template'];

  return (
    <div className={`rounded-lg p-2 ${config!.bgColor} ${config!.color}`}>
      <Icon icon={config!.icon} className='h-6 w-6' />
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Awaiting Signature':
      return 'warning';
    case 'Under Review':
      return 'secondary';
    case 'Sent to Client':
      return 'primary';
    case 'In Progress':
      return 'success';
    default:
      return 'default';
  }
};

export default function DocumentCard({ document }: Readonly<DocumentCardProperties>) {
  return (
    <Card className='transition-shadow hover:shadow-md'>
      <CardBody className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-1 items-center gap-4'>
            {getDocumentIcon(document.type.name)}

            <div className='min-w-0 flex-1'>
              <h3 className='text-foreground truncate font-medium'>{document.documentName}</h3>
              <div className='mt-1 flex flex-wrap items-center gap-4'>
                <span className='text-sm text-gray-500'>
                  Modified {formatDate(document.createdAt)}
                </span>
                <span className='text-sm text-gray-500'>{document.type.name}</span>

                {/* Tags */}
                {document.tags.length > 0 && (
                  <div className='flex gap-1'>
                    {document.tags.slice(0, 2).map((tag) => (
                      <Chip key={tag.id} size='sm' variant='flat' className='text-xs'>
                        {tag.name}
                      </Chip>
                    ))}
                    {document.tags.length > 2 && (
                      <Chip size='sm' variant='flat' className='text-xs'>
                        +{document.tags.length - 2}
                      </Chip>
                    )}
                  </div>
                )}

                {/* Status */}
                <Chip
                  size='sm'
                  color={getStatusColor(document.status.name)}
                  variant='flat'
                  className='text-xs'
                >
                  {document.status.name}
                </Chip>

                {/* Shared with indicator */}
                {document.sharedWith.length > 0 && (
                  <div className='flex items-center gap-1'>
                    <Icon icon='solar:users-group-rounded-bold' className='h-3 w-3 text-gray-400' />
                    <span className='text-xs text-gray-500'>
                      Shared with {document.sharedWith.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button size='sm' variant='flat'>
              Share
            </Button>

            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size='sm' variant='light'>
                  <Icon icon='solar:menu-dots-bold' className='text-default-400 h-4 w-4' />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key='edit'>
                  <div className='flex items-center gap-2'>
                    <Icon icon='solar:pen-bold' className='h-4 w-4' />
                    Edit
                  </div>
                </DropdownItem>

                <DropdownItem key='delete' className='text-danger'>
                  <div className='flex items-center gap-2'>
                    <Icon icon='ic:outline-delete' className='h-4 w-4' />
                    Delete
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function DocumentCardSkeleton() {
  return (
    <Card className='transition-shadow hover:shadow-md'>
      <CardBody className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-1 items-center gap-4'>
            {/* Document Icon Skeleton */}
            <Skeleton className='rounded-lg'>
              <div className='h-10 w-10 bg-gray-200'></div>
            </Skeleton>

            <div className='min-w-0 flex-1 space-y-2'>
              {/* Document Title Skeleton */}
              <Skeleton className='rounded-lg'>
                <div className='h-5 w-3/4 rounded-lg bg-gray-200'></div>
              </Skeleton>

              {/* Metadata Row Skeleton */}
              <div className='flex flex-wrap items-center gap-4'>
                {/* Modified Date */}
                <Skeleton className='rounded-lg'>
                  <div className='h-3 w-20 rounded-lg bg-gray-200'></div>
                </Skeleton>

                {/* Document Type */}
                <Skeleton className='rounded-lg'>
                  <div className='h-3 w-16 rounded-lg bg-gray-200'></div>
                </Skeleton>

                {/* Tags Skeleton */}
                <div className='flex gap-1'>
                  <Skeleton className='rounded-full'>
                    <div className='h-5 w-12 rounded-full bg-gray-200'></div>
                  </Skeleton>
                  <Skeleton className='rounded-full'>
                    <div className='h-5 w-10 rounded-full bg-gray-200'></div>
                  </Skeleton>
                </div>

                {/* Status Skeleton */}
                <Skeleton className='rounded-full'>
                  <div className='h-5 w-20 rounded-full bg-gray-200'></div>
                </Skeleton>

                {/* Shared With Skeleton */}
                <Skeleton className='rounded-lg'>
                  <div className='h-3 w-16 rounded-lg bg-gray-200'></div>
                </Skeleton>
              </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className='flex items-center gap-2'>
            <Skeleton className='rounded-lg'>
              <div className='h-8 w-16 rounded-lg bg-gray-200'></div>
            </Skeleton>
            <Skeleton className='rounded-lg'>
              <div className='h-8 w-8 rounded-lg bg-gray-200'></div>
            </Skeleton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
