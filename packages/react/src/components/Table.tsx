import React from 'react';
import { createComponent } from '../create-component';
import type { UITable as UITableElement } from '@cubit-ui/core';

export interface TableProps extends React.HTMLAttributes<HTMLElement> {
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  children?: React.ReactNode;
}

export const Table = createComponent<TableProps, UITableElement>('ui-table');
