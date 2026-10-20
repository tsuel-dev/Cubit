import React from 'react';
import { createComponent } from '../create-component';
import type { UIAvatar as UIAvatarElement } from '@cubit-ui/core';

export interface AvatarProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar = createComponent<AvatarProps, UIAvatarElement>('ui-avatar');
