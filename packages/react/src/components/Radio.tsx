import React from 'react';
import { createComponent } from '../create-component';
import type { UIRadio as UIRadioElement } from '@cubit-ui/core';

export interface RadioProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen'> {
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  onChange?: (detail: { value: string; checked: boolean }) => void;
  children?: React.ReactNode;
}

export const Radio = createComponent<RadioProps, UIRadioElement>('ui-radio', {
  onChange: 'change',
});
