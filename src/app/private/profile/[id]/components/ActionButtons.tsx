'use client';

import React from 'react';
import { Button, ButtonGroup, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  editTooltip?: string;
  deleteTooltip?: string;
  addTooltip?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'flat' | 'ghost';
  showEdit?: boolean;
  showDelete?: boolean;
  showAdd?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  onAdd,
  editTooltip = 'Edit',
  deleteTooltip = 'Delete',
  addTooltip = 'Add',
  size = 'sm',
  variant = 'light',
  showEdit = false,
  showDelete = false,
  showAdd = false
}) => {
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
  const buttonSize = size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-8 w-8' : 'h-10 w-10';

  return (
    <div className='flex items-center gap-1'>
      {showEdit && onEdit && (
        <Tooltip content={editTooltip} size="sm" closeDelay={0}>
          <Button
            isIconOnly
            variant={variant}
            size={size}
            className={`text-foreground-400 hover:text-primary transition-colors ${buttonSize}`}
            onPress={onEdit}
          >
            <Icon icon='solar:pen-linear' className={iconSize} />
          </Button>
        </Tooltip>
      )}
      
      {showDelete && onDelete && (
        <Tooltip content={deleteTooltip} size="sm" closeDelay={0} color="danger">
          <Button
            isIconOnly
            variant={variant}
            size={size}
            className={`text-foreground-400 hover:text-danger transition-colors ${buttonSize}`}
            onPress={onDelete}
          >
            <Icon icon='solar:trash-bin-minimalistic-linear' className={iconSize} />
          </Button>
        </Tooltip>
      )}
      
      {showAdd && onAdd && (
        <Tooltip content={addTooltip} size="sm" closeDelay={0} color="success">
          <Button
            isIconOnly
            variant={variant}
            size={size}
            className={`text-foreground-400 hover:text-success transition-colors ${buttonSize}`}
            onPress={onAdd}
          >
            <Icon icon='solar:add-circle-linear' className={iconSize} />
          </Button>
        </Tooltip>
      )}
    </div>
  );
};
