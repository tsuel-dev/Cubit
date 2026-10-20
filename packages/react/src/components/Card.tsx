import React from 'react';
import { createComponent } from '../create-component';
import type { UICard as UICardElement } from '@cubit-ui/core';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'elevated' | 'secondary' | 'bordered';
  bordered?: boolean;
  children?: React.ReactNode;
}

export const Card = createComponent<CardProps, UICardElement>('ui-card');
