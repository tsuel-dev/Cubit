import React from 'react';
import { createComponent } from '../create-component';
import type { UISkeleton as UISkeletonElement } from '@cubit-ui/core';

export interface SkeletonProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'text' | 'circle' | 'rect';
  width?: string;
  height?: string;
  lines?: number;
  children?: React.ReactNode;
}

export const Skeleton = createComponent<SkeletonProps, UISkeletonElement>('ui-skeleton');
