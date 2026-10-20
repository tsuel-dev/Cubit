import React from 'react';
import { createComponent } from '../create-component';
import type { UIProgress as UIProgressElement } from '@cubit-ui/core';

export interface ProgressProps extends React.HTMLAttributes<HTMLElement> {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  'aria-label'?: string;
}

export const Progress = createComponent<ProgressProps, UIProgressElement>('ui-progress');
