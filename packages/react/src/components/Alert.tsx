import React from 'react';
import { createComponent } from '../create-component';
import type { UIAlert as UIAlertElement } from '@cubit-ui/core';

export interface AlertProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  closable?: boolean;
  'aria-label'?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const Alert = createComponent<AlertProps, UIAlertElement>('ui-alert', {
  onClose: 'close',
});
