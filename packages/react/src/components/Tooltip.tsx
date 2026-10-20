import React from 'react';
import { createComponent } from '../create-component';
import type { UITooltip as UITooltipElement } from '@cubit-ui/core';

export interface TooltipProps extends React.HTMLAttributes<HTMLElement> {
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children?: React.ReactNode;
}

export const Tooltip = createComponent<TooltipProps, UITooltipElement>('ui-tooltip');
