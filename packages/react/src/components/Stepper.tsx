import React from 'react';
import { createComponent } from '../create-component';
import type { UIStepper as UIStepperElement } from '@cubit-ui/core';

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen' | 'onInput'> {
  /** Zero-based index of the active step. */
  current?: number;
  orientation?: 'horizontal' | 'vertical';
  'aria-label'?: string;
  children?: React.ReactNode;
}

export const Stepper = createComponent<StepperProps, UIStepperElement>('ui-stepper');

export interface StepProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen' | 'onInput'> {
  label?: string;
  description?: string;
  /** Set to "error" to mark a failed step. */
  status?: 'error';
  children?: React.ReactNode;
}

export const Step = createComponent<StepProps, HTMLElement>('ui-step');
