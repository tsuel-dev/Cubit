/**
 * Cubit UI Core Type Definitions
 */

export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface BaseComponentProps {
  disabled?: boolean;
  className?: string;
  id?: string;
}
