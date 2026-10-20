import React from 'react';
import { createComponent } from '../create-component';
import type { UISegmented as UISegmentedElement } from '@cubit-ui/core';

export interface SegmentedProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen' | 'onInput'> {
  value?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  'aria-label'?: string;
  onChange?: (detail: { value: string }) => void;
  children?: React.ReactNode;
}

export const Segmented = createComponent<SegmentedProps, UISegmentedElement>('ui-segmented', {
  onChange: 'change',
});

export interface SegmentProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen' | 'onInput'> {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Segment = createComponent<SegmentProps, HTMLElement>('ui-segment');
