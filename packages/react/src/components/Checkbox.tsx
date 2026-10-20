import React from 'react';
import { createComponent } from '../create-component';
import type { UICheckbox as UICheckboxElement } from '@cubit-ui/core';

export interface CheckboxProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen'> {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  name?: string;
  value?: string;
  'aria-label'?: string;
  onChange?: (detail: { checked: boolean }) => void;
  children?: React.ReactNode;
}

export const Checkbox = createComponent<CheckboxProps, UICheckboxElement>('ui-checkbox', {
  onChange: 'change',
});
