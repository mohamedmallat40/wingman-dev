'use client';

import React, { useState } from 'react';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Tab,
  Tabs
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useDocuments } from '@root/modules/documents/hooks/use-documents';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import DocumentCard, { DocumentCardSkeleton } from './components/document-card';

export default function DocumentsPage() {
  const { data: result, isLoading, error, isError } = useDocuments();
  const [selectedTab, setSelectedTab] = useState('all-documents');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments =
    result?.data.filter(
      (doc) =>
        doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.type.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const documentList = () => {
    if (isLoading) {
      return (
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <DocumentCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (filteredDocuments.length === 0) {
      return (
        <div className='mt-10 flex flex-col items-center text-center'>
          <Icon
            icon='solar:document-text-linear'
            className='text-primary mx-auto mb-4 block h-24 w-24'
          />
          <h2 className='mb-2 text-2xl font-bold'>Document Management</h2>
          <p className='text-default-600 mb-4'>Store and manage your important documents</p>
          <Button color='primary' startContent={<Icon icon='solar:document-add-linear' />}>
            Upload Document
          </Button>
        </div>
      );
    }

    return (
      <div className='space-y-2'>
        {filteredDocuments.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout
      pageTitle='Documents'
      pageDescription='Manage your documents and files'
      pageIcon='solar:document-text-linear'
      breadcrumbs={[
        { label: 'Home', href: '/private/dashboard', icon: 'solar:home-linear' },
        { label: 'Documents' }
      ]}
      headerActions={
        <div className='flex items-center gap-2'>
          <div className='flex-1'>
            <Input
              placeholder='Search documents...'
              startContent={
                <Icon icon='heroicons:magnifying-glass' className='h-5 w-5 text-gray-400' />
              }
              classNames={{
                input: 'text-sm',
                inputWrapper: 'h-12'
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex gap-3'>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant='bordered'
                  endContent={<Icon icon='heroicons:chevron-down' className='h-4 w-4' />}
                  className='min-w-[140px]'
                >
                  Filter by tags
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Filter by tags'
                closeOnSelect={false}
                selectionMode='multiple'
              >
                <DropdownItem key='api-integration'>API Integration</DropdownItem>
                <DropdownItem key='marketing'>Marketing</DropdownItem>
                <DropdownItem key='hr'>HR Documents</DropdownItem>
                <DropdownItem key='finance'>Finance</DropdownItem>
                <DropdownItem key='security'>Security</DropdownItem>
                <DropdownItem key='development'>Development</DropdownItem>
                <DropdownItem key='sales'>Sales</DropdownItem>
                <DropdownItem key='research'>Research</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              color='primary'
              startContent={<Icon icon='heroicons:arrow-up-tray' className='h-4 w-4' />}
              className='font-medium'
            >
              Upload
            </Button>
          </div>
        </div>
      }
    >
      <div className='mx-auto w-[70%] space-y-8 py-6'>
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          variant='underlined'
          classNames={{
            tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
            cursor: 'w-full bg-primary',
            tab: 'max-w-fit px-0 h-12',
            tabContent: 'group-data-[selected=true]:text-primary'
          }}
        >
          <Tab key='all-documents' title='All Documents' />
          <Tab key='shared-with-me' title='Shared with Me' />
        </Tabs>

        <div className='space-y-4'>{documentList()}</div>
      </div>
    </DashboardLayout>
  );
}
