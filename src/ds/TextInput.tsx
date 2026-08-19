// TextInput / Textarea — the design system's text entry.
//
// The real TextInput already owns a label, a description, validation status
// and a loading state, so most of what this app used to hand-roll around an
// input is simply props here.

import type { ReactNode } from 'react';
import { TextInput as BaseTextInput } from '@astryxdesign/core/TextInput';
import { TextArea as BaseTextArea } from '@astryxdesign/core/TextArea';

export interface TextInputProps {
  value: string;
  onValueChange?: (value: string) => void;
  /** Accessible name. Hidden visually unless `showLabel` is set. */
  'aria-label'?: string;
  label?: string;
  showLabel?: boolean;
  /** Helper text under the control. */
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  valid?: boolean;
  loading?: boolean;
  /** Message shown under the control, coloured by the current status. */
  statusMessage?: string;
  startIcon?: ReactNode;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Number = px, string used as-is. */
  width?: number | string;
  className?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function TextInput({
  value,
  onValueChange,
  label,
  showLabel = false,
  description,
  placeholder,
  disabled,
  invalid,
  valid,
  loading,
  statusMessage,
  startIcon,
  autoFocus,
  size,
  width,
  className,
  onKeyDown,
  ...rest
}: TextInputProps) {
  const name = label ?? rest['aria-label'] ?? 'Text';
  // Status carries its own message; anything else is a plain description.
  const status = invalid
    ? ({ type: 'error', message: statusMessage } as const)
    : valid
      ? ({ type: 'success', message: statusMessage } as const)
      : undefined;

  return (
    <BaseTextInput
      label={name}
      isLabelHidden={!showLabel}
      value={value}
      onChange={(next) => onValueChange?.(next)}
      description={status ? description : (statusMessage ?? description)}
      status={status}
      isDisabled={disabled}
      isLoading={loading}
      placeholder={placeholder}
      startIcon={startIcon}
      size={size}
      width={width}
      hasAutoFocus={autoFocus}
      onKeyDown={onKeyDown}
      className={className}
    />
  );
}

export interface TextareaProps {
  value: string;
  onValueChange?: (value: string) => void;
  label?: string;
  showLabel?: boolean;
  'aria-label'?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function Textarea({
  value,
  onValueChange,
  label,
  showLabel = false,
  placeholder,
  className,
  ...rest
}: TextareaProps) {
  const name = label ?? rest['aria-label'] ?? 'Text';
  return (
    <BaseTextArea
      label={name}
      isLabelHidden={!showLabel}
      value={value}
      onChange={(next) => onValueChange?.(next)}
      placeholder={placeholder}
      className={className}
    />
  );
}
