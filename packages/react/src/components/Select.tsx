import React from 'react';
import { createComponent } from '../create-component';
import type { UISelect as UISelectElement } from '@cubit-ui/core';

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen'> {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  open?: boolean;
  'aria-label'?: string;
  onChange?: (detail: { value: string }) => void;
  onOpen?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const Select = createComponent<SelectProps, UISelectElement>('ui-select', {
  onChange: 'change',
  onOpen: 'open',
  onClose: 'close',
});

export interface OptionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen'> {
  value: string;
  children?: React.ReactNode;
}

export const Option = createComponent<OptionProps, HTMLElement>('ui-option');
