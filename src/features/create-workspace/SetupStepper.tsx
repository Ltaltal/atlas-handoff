// SetupStepper — progress across the four steps of workspace creation.
// Present on every step screen so a person always knows how much is left.
//
// The design system has no stepper, so this is one of the few places the
// feature draws something itself. Every value is still a token.

import type { CSSProperties } from 'react';
import { HStack, VStack, Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Icon } from '@ds';

export interface SetupStepperProps {
  /** Step labels in order. */
  steps: string[];
  /** Zero-based index of the current step. */
  current: number;
  /** Show a label under each node. Default true. */
  showLabels?: boolean;
  /**
   * Makes the nodes clickable. Used by the handoff site to let a reader jump
   * between screens; unset in the product, where the stepper is read-only.
   */
  onStepClick?: (index: number) => void;
}

const NODE = 'var(--spacing-5)';

function nodeStyle(state: 'done' | 'current' | 'todo', interactive: boolean): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: NODE,
    height: NODE,
    flexShrink: 0,
    padding: 0,
    boxSizing: 'border-box',
    borderRadius: 'var(--radius-full)',
    border: '2px solid',
    borderColor: state === 'todo' ? 'var(--color-border)' : 'var(--color-accent)',
    backgroundColor: state === 'done' ? 'var(--color-accent)' : 'transparent',
    color:
      state === 'done'
        ? 'var(--color-on-accent)'
        : state === 'current'
          ? 'var(--color-text-accent)'
          : 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-2xs)',
    fontWeight: 'var(--font-weight-semibold)',
    cursor: interactive ? 'pointer' : 'default',
  };
}

const connector = (filled: boolean, hidden: boolean): CSSProperties => ({
  flexGrow: 1,
  height: '2px',
  backgroundColor: hidden
    ? 'transparent'
    : filled
      ? 'var(--color-accent)'
      : 'var(--color-border)',
});

export function SetupStepper({
  steps,
  current,
  showLabels = true,
  onStepClick,
}: SetupStepperProps) {
  const interactive = Boolean(onStepClick);

  return (
    <HStack
      width="100%"
      vAlign="start"
      role="group"
      aria-label={`Step ${current + 1} of ${steps.length}`}
    >
      {steps.map((step, index) => {
        const done = index < current;
        const isCurrent = index === current;

        return (
          <VStack key={step} gap={1} hAlign="center" width="100%" paddingInline={0.5}>
            {/* When the nodes are buttons they are real controls, so only the
                decoration is hidden. Hiding the row wholesale would bury
                focusable elements in an aria-hidden subtree. */}
            <Stack
              direction="horizontal"
              vAlign="center"
              width="100%"
              aria-hidden={interactive ? undefined : true}
            >
              <span aria-hidden style={connector(done || isCurrent, index === 0)} />
              <button
                type="button"
                disabled={!interactive}
                onClick={() => onStepClick?.(index)}
                aria-label={step}
                aria-current={isCurrent ? 'step' : undefined}
                style={nodeStyle(done ? 'done' : isCurrent ? 'current' : 'todo', interactive)}
              >
                {done ? <Icon name="check" size={12} /> : index + 1}
              </button>
              <span aria-hidden style={connector(done, index === steps.length - 1)} />
            </Stack>
            {showLabels && (
              <Text
                type="supporting"
                color={isCurrent ? 'primary' : 'secondary'}
                weight={isCurrent ? 'semibold' : 'normal'}
                style={{ textAlign: 'center' }}
              >
                {step}
              </Text>
            )}
          </VStack>
        );
      })}
    </HStack>
  );
}
