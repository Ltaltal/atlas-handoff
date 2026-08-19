// Badge — the design system's Badge. Call sites here describe a tone; the
// component describes a variant, and the two do not use the same words.

import type { ReactNode } from 'react';
import { Badge as BaseBadge } from '@astryxdesign/core/Badge';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

// The system offers solid semantic variants and a softer colour family. The
// colour family is used here: it reads as status without shouting, and every
// pair clears AA at 12px, which `error` (4.14:1) and `info` (4.57:1) do not.
const VARIANT = {
  neutral: 'neutral',
  brand: 'purple',
  success: 'green',
  warning: 'yellow',
  danger: 'red',
  info: 'blue',
} as const;

export interface BadgeProps {
  tone?: BadgeTone;
  /** Accepted for call-site compatibility; the component owns its casing. */
  uppercase?: boolean;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  return <BaseBadge variant={VARIANT[tone]} label={children} className={className} />;
}
