import React from 'react';
import { createComponent } from '../create-component';
import type { UIButton as UIButtonElement } from '@cubit-ui/core';

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  children?: React.ReactNode;
}

export const Button = createComponent<ButtonProps, UIButtonElement>('ui-button');
