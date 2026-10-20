import React from 'react';
import { createComponent } from '../create-component';
import type { UIChip as UIChipElement } from '@cubit-ui/core';

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen' | 'onInput'> {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  removable?: boolean;
  disabled?: boolean;
  'remove-label'?: string;
  /** Fired when the x button is clicked or Delete/Backspace is pressed. The chip is not removed automatically. */
  onRemove?: () => void;
  children?: React.ReactNode;
}

export const Chip = createComponent<ChipProps, UIChipElement>('ui-chip', {
  onRemove: 'remove',
});
