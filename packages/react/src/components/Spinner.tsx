import React from 'react';
import { createComponent } from '../create-component';
import type { UISpinner as UISpinnerElement } from '@cubit-ui/core';

export interface SpinnerProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
}

export const Spinner = createComponent<SpinnerProps, UISpinnerElement>('ui-spinner');
