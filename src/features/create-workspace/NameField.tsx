// NameField — the workspace name input.
//
// This used to be a hand-built label + control + spinner + message stack. The
// design system's TextInput already owns all of that, so what is left here is
// only the part that belongs to this feature: mapping an availability check
// onto the control's status.

import { TextInput } from '@ds';

export type NameFieldState = 'default' | 'disabled' | 'loading' | 'error' | 'success';

export interface NameFieldProps {
  label?: string;
  value?: string;
  placeholder?: string;
  /** Shown under the field when there is nothing to report. */
  hint?: string;
  state?: NameFieldState;
  errorMessage?: string;
  successMessage?: string;
  onChange?: (value: string) => void;
}

export function NameField({
  label = 'Workspace name',
  value = '',
  placeholder = 'e.g. Harbor Launch',
  hint = 'Visible to everyone you invite.',
  state = 'default',
  errorMessage = 'That name is already taken.',
  successMessage = 'Name is available.',
  onChange,
}: NameFieldProps) {
  const message =
    state === 'error'
      ? errorMessage
      : state === 'success'
        ? successMessage
        : state === 'loading'
          ? 'Checking availability…'
          : hint;

  return (
    <TextInput
      label={label}
      showLabel
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      statusMessage={message}
      invalid={state === 'error'}
      valid={state === 'success'}
      loading={state === 'loading'}
      disabled={state === 'disabled'}
    />
  );
}
