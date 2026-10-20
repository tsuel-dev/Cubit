import React from 'react';
import { createComponent } from '../create-component';
import type { UIBadge as UIBadgeElement } from '@cubit-ui/core';

export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const Badge = createComponent<BadgeProps, UIBadgeElement>('ui-badge');
