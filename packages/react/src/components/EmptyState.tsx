import React from 'react';
import { createComponent } from '../create-component';
import type { UIEmptyState as UIEmptyStateElement } from '@cubit-ui/core';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen' | 'onInput'> {
  heading?: string;
  description?: string;
  size?: 'sm' | 'md';
  variant?: 'default' | 'error';
  children?: React.ReactNode;
}

/** Use slot="icon" on a child for the icon; other children are rendered as actions. */
export const EmptyState = createComponent<EmptyStateProps, UIEmptyStateElement>('ui-empty-state');
