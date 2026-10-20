import React from 'react';
import { createComponent } from '../create-component';
import type { UITabs as UITabsElement } from '@cubit-ui/core';

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen'> {
  value?: string;
  onChange?: (detail: { value: string }) => void;
  children?: React.ReactNode;
}

export const Tabs = createComponent<TabsProps, UITabsElement>('ui-tabs', {
  onChange: 'change',
});

export interface TabProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen'> {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Tab = createComponent<TabProps, HTMLElement>('ui-tab');

export interface TabPanelProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen'> {
  value: string;
  children?: React.ReactNode;
}

export const TabPanel = createComponent<TabPanelProps, HTMLElement>('ui-tab-panel');
