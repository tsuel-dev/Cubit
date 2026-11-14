import React from 'react';
import { createComponent } from '../create-component';
import type { UILink as UILinkElement } from '@cubit-ui/core';

export interface LinkProps extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  target?: string;
  rel?: string;
  variant?: 'primary' | 'muted' | 'inherit';
  underline?: 'hover' | 'always' | 'none';
  external?: boolean;
  disabled?: boolean;
  download?: string | boolean;
  children?: React.ReactNode;
}

export const Link = createComponent<LinkProps, UILinkElement>('ui-link');
