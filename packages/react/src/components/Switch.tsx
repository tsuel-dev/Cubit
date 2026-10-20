import React from 'react';
import { createComponent } from '../create-component';
import type { UISwitch as UISwitchElement } from '@cubit-ui/core';

export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen'> {
  checked?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
  onChange?: (detail: { checked: boolean }) => void;
  children?: React.ReactNode;
}

export const Switch = createComponent<SwitchProps, UISwitchElement>('ui-switch', {
  onChange: 'change',
});
