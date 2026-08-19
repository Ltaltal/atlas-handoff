// Button — the design system's button.
//
// This app's call sites pass children and a `variant` of primary | secondary |
// subtle, so this adapts that shape onto the real component's API: a required
// string `label`, and `ghost` where we said `subtle`.

import type { ReactElement, ReactNode } from 'react';
import { Button as BaseButton } from '@astryxdesign/core/Button';
import type { IconProps } from '@astryxdesign/core/Icon';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'subtle';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  iconAfter?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  'aria-label'?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconAfter,
  children,
  disabled,
  onClick,
  type = 'button',
  ...rest
}: ButtonProps) {
  // `label` is the accessible name. Icon-only buttons pass it via aria-label.
  const label = typeof children === 'string' ? children : (rest['aria-label'] ?? '');
  const iconOnly = Boolean(icon) && !children;
  // The system takes a leading icon and trailing content as separate props, so
  // "after" is a different slot rather than a flag on the same one.
  const trailing = iconAfter && !iconOnly;

  return (
    <BaseButton
      label={label}
      variant={variant === 'subtle' ? 'ghost' : variant}
      size={size}
      icon={trailing ? undefined : icon}
      endContent={trailing ? (icon as ReactElement<IconProps>) : undefined}
      isIconOnly={iconOnly}
      isDisabled={disabled}
      onClick={onClick}
      type={type}
    >
      {typeof children === 'string' ? undefined : children}
    </BaseButton>
  );
}
