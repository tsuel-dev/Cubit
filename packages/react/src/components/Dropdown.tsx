import React from 'react';
import { createComponent } from '../create-component';
import type { UIDropdown as UIDropdownElement } from '@cubit-ui/core';

export interface DropdownProps extends React.HTMLAttributes<HTMLElement> {
  open?: boolean;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  disabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const Dropdown = createComponent<DropdownProps, UIDropdownElement>('ui-dropdown', {
  onOpen: 'open',
  onClose: 'close',
});

export interface DropdownItemProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const DropdownItem = createComponent<DropdownItemProps, HTMLElement>('ui-dropdown-item');
