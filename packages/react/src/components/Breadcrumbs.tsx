import React from 'react';
import { createComponent } from '../create-component';
import type { UIBreadcrumbs as UIBreadcrumbsElement, UIBreadcrumbItem as UIBreadcrumbItemElement } from '@cubit-ui/core';

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  separator?: string;
  'aria-label'?: string;
  children?: React.ReactNode;
}

export const Breadcrumbs = createComponent<BreadcrumbsProps, UIBreadcrumbsElement>('ui-breadcrumbs');

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  separator?: string;
  current?: boolean;
  children?: React.ReactNode;
}

export const BreadcrumbItem = createComponent<BreadcrumbItemProps, UIBreadcrumbItemElement>('ui-breadcrumb-item');
