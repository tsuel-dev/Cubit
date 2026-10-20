import React from 'react';
import { createComponent } from '../create-component';
import type { UITextarea as UITextareaElement } from '@cubit-ui/core';

export interface TextareaProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen' | 'onInput'> {
  value?: string;
  placeholder?: string;
  rows?: number;
  maxlength?: number;
  resize?: 'none' | 'vertical' | 'both';
  size?: 'sm' | 'md' | 'lg';
  name?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  'aria-label'?: string;
  onInput?: (detail: { value: string }) => void;
  onChange?: (detail: { value: string }) => void;
}

export const Textarea = createComponent<TextareaProps, UITextareaElement>('ui-textarea', {
  onInput: 'input',
  onChange: 'change',
});
