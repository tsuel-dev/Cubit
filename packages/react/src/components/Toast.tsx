import React from 'react';
import { createComponent } from '../create-component';
import type { UIToast as UIToastElement } from '@cubit-ui/core';

export interface ToastProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const Toast = createComponent<ToastProps, UIToastElement>('ui-toast', {
  onClose: 'close',
});
