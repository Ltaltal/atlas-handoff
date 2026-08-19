// Spinner — the design system's Spinner.

import { Spinner as BaseSpinner } from '@astryxdesign/core/Spinner';

export interface SpinnerProps {
  /** Requested diameter in px, mapped to the nearest step. Default 16. */
  size?: number;
  className?: string;
  label?: string;
}

function toStep(size: number): 'sm' | 'md' | 'lg' | 'xl' {
  if (size <= 16) return 'sm';
  if (size <= 24) return 'md';
  if (size <= 32) return 'lg';
  return 'xl';
}

export function Spinner({ size = 16, className, label = 'Loading' }: SpinnerProps) {
  return <BaseSpinner size={toStep(size)} label={label} className={className} />;
}
