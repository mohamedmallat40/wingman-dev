// Example usage of PageHeader with advanced action features

import React from 'react';

import PageHeader from './page-header';

export default function ExampleUsage() {
  const handleCreateProject = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Project created!');
  };

  const handleDeleteProject = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Project deleted!');
  };

  const actionItems = [
    {
      key: 'create',
      label: 'Create Project',
      icon: 'solar:add-circle-linear',
      color: 'primary' as const,
      variant: 'solid' as const,
      priority: 'primary' as const,
      tooltip: 'Create a new project',
      onClick: handleCreateProject
    },
    {
      key: 'export',
      label: 'Export',
      icon: 'solar:export-linear',
      color: 'default' as const,
      variant: 'flat' as const,
      priority: 'secondary' as const,
      tooltip: 'Export project data',
      onClick: () => console.log('Exporting...')
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: 'solar:settings-linear',
      color: 'default' as const,
      variant: 'light' as const,
      priority: 'tertiary' as const,
      tooltip: 'Project settings',
      onClick: () => console.log('Opening settings...')
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'solar:trash-bin-minimalistic-linear',
      color: 'danger' as const,
      variant: 'light' as const,
      priority: 'tertiary' as const,
      tooltip: 'Delete this project',
      confirmMessage: 'Are you sure you want to delete this project?',
      onClick: handleDeleteProject
    },
    {
      key: 'share',
      label: 'Share',
      icon: 'solar:share-linear',
      color: 'default' as const,
      variant: 'flat' as const,
      priority: 'secondary' as const,
      tooltip: 'Share project',
      onClick: () => console.log('Sharing...')
    }
  ];

  return (
    <PageHeader
      title='Advanced Page Header'
      description='Demonstrating advanced UX features for buttons and actions'
      icon='solar:widget-linear'
      badge={{
        text: 'Advanced',
        color: 'success',
        variant: 'flat'
      }}
      breadcrumbs={[
        { label: 'Home', href: '/', icon: 'solar:home-linear' },
        { label: 'Components', href: '/components', icon: 'solar:widget-linear' },
        { label: 'Page Header' }
      ]}
      actionItems={actionItems}
      maxVisibleActions={3}
    />
  );
}
