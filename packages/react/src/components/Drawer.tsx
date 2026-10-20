import React from 'react';
import { createComponent } from '../create-component';
import type { UIDrawer as UIDrawerElement } from '@cubit-ui/core';

export interface DrawerProps extends React.HTMLAttributes<HTMLElement> {
  open?: boolean;
  side?: 'left' | 'right';
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const Drawer = createComponent<DrawerProps, UIDrawerElement>('ui-drawer', {
  onClose: 'close',
});
