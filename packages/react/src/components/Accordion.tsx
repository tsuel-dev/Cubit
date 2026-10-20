import React from 'react';
import { createComponent } from '../create-component';
import type { UIAccordion as UIAccordionElement, UIAccordionItem as UIAccordionItemElement } from '@cubit-ui/core';

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen'> {
  multiple?: boolean;
  children?: React.ReactNode;
}

export const Accordion = createComponent<AccordionProps, UIAccordionElement>('ui-accordion');

export interface AccordionItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onClose' | 'onOpen'> {
  open?: boolean;
  title?: string;
  disabled?: boolean;
  onChange?: (detail: { open: boolean }) => void;
  children?: React.ReactNode;
}

export const AccordionItem = createComponent<AccordionItemProps, UIAccordionItemElement>('ui-accordion-item', {
  onChange: 'change',
});
