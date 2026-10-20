import React from 'react';
import { createComponent } from '../create-component';
import type { UIInput as UIInputElement } from '@cubit-ui/core';

export interface InputProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen' | 'onInput'> {
  value?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  'aria-label'?: string;
  onInput?: (detail: { value: string }) => void;
  onChange?: (detail: { value: string }) => void;
}

export const Input = createComponent<InputProps, UIInputElement>('ui-input', {
  onInput: 'input',
  onChange: 'change',
});
