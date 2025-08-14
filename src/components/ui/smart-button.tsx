'use client';

import React from 'react';

import { Button, ButtonProps } from '@heroui/button';

import { useSmartNavigation } from '@/hooks/use-smart-navigation';

interface SmartButtonProps extends Omit<ButtonProps, 'onPress'> {
  href?: string;
  requiresAuth?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

export function SmartButton({
  href,
  requiresAuth = false,
  onPress,
  children,
  isDisabled,
  ...props
}: SmartButtonProps) {
  const { navigateToPrivate, navigateToPublic, isLoading } = useSmartNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (!href) return;

    if (requiresAuth) {
      navigateToPrivate(href);
    } else {
      navigateToPublic(href);
    }
  };

  return (
    <Button
      {...props}
      onPress={handlePress}
      isDisabled={isDisabled || (requiresAuth && isLoading)}
      isLoading={requiresAuth && isLoading}
    >
      {children}
    </Button>
  );
}
