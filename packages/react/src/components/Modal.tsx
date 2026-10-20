import React from 'react';
import { createComponent } from '../create-component';
import type { UIModal as UIModalElement } from '@cubit-ui/core';

export interface ModalProps extends React.HTMLAttributes<HTMLElement> {
  open?: boolean;
  title?: string;
  'aria-label'?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const Modal = createComponent<ModalProps, UIModalElement>('ui-modal', {
  onClose: 'close',
});
