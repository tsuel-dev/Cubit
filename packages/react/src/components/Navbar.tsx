import React from 'react';
import { createComponent } from '../create-component';
import type { UINavbar as UINavbarElement } from '@cubit-ui/core';

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  brand?: string;
  sticky?: boolean;
  children?: React.ReactNode;
}

export const Navbar = createComponent<NavbarProps, UINavbarElement>('ui-navbar');
