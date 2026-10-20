import React from 'react';
import { createComponent } from '../create-component';
import type { UIPagination as UIPaginationElement } from '@cubit-ui/core';

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen'> {
  current?: number;
  total?: number;
  'page-size'?: number;
  onChange?: (detail: { page: number }) => void;
}

export const Pagination = createComponent<PaginationProps, UIPaginationElement>('ui-pagination', {
  onChange: 'change',
});
