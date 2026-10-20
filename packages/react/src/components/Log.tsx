import React from 'react';
import { createComponent } from '../create-component';
import type { UILog as UILogElement } from '@cubit-ui/core';
import type { UILogItem as UILogItemElement } from '@cubit-ui/core';

export interface LogProps extends React.HTMLAttributes<HTMLElement> {
  label?: string;
  height?: string;
  wrap?: boolean;
  /** true → 활성(기본). 'false' 문자열을 넣으면 비활성 */
  'auto-scroll'?: boolean | 'false';
  max?: number;
  empty?: string;
  children?: React.ReactNode;
}

export interface LogItemProps extends React.HTMLAttributes<HTMLElement> {
  level?: 'info' | 'success' | 'warning' | 'error' | 'debug';
  time?: string;
  children?: React.ReactNode;
}

export const Log = createComponent<LogProps, UILogElement>('ui-log');
export const LogItem = createComponent<LogItemProps, UILogItemElement>('ui-log-item');
