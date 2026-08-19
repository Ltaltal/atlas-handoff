// FlowMap — the end-to-end journey as a rail of steps. Selecting one is how a
// reader moves from "the journey" to "the screen that implements this step".

import { Grid } from '@astryxdesign/core/Grid';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Badge, Icon } from '@ds';

export interface FlowMapStep {
  id: string;
  title: string;
  /** One line on what happens here. */
  summary?: string;
  /** Optional tag, e.g. "Skippable". */
  badge?: string;
}

export interface FlowMapProps {
  steps: FlowMapStep[];
  /** Id of the highlighted step. */
  activeId?: string;
  /** Steps before the active one render as complete. Default true. */
  showProgress?: boolean;
  onSelect?: (step: FlowMapStep, index: number) => void;
}

/** The numbered node. A circle is not a component, so it is a styled span. */
function StepNode({ index, state }: { index: number; state: 'done' | 'active' | 'todo' }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'var(--size-element-sm)',
        height: 'var(--size-element-sm)',
        borderRadius: 'var(--radius-full)',
        border: '2px solid',
        borderColor: state === 'todo' ? 'var(--color-border)' : 'var(--color-accent)',
        backgroundColor: state === 'active' ? 'var(--color-accent)' : 'transparent',
        color:
          state === 'active'
            ? 'var(--color-on-accent)'
            : state === 'done'
              ? 'var(--color-accent)'
              : 'var(--color-text-secondary)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-semibold)',
      }}
      aria-hidden
    >
      {state === 'done' ? <Icon name="check" size={14} /> : index + 1}
    </span>
  );
}

export function FlowMap({ steps, activeId, showProgress = true, onSelect }: FlowMapProps) {
  const activeIndex = steps.findIndex((step) => step.id === activeId);

  return (
    <Grid columns={steps.length} gap={2}>
      {steps.map((step, index) => {
        const isActive = step.id === activeId;
        const isDone = showProgress && activeIndex > -1 && index < activeIndex;

        return (
          // The grid stretches each column; the card has to take the height
          // it is given, or a step whose summary wraps makes its neighbours
          // look unfinished.
          <VStack key={step.id} gap={2} height="100%">
            <HStack gap={2} vAlign="center">
              <StepNode index={index} state={isActive ? 'active' : isDone ? 'done' : 'todo'} />
            </HStack>
            <ClickableCard
              label={step.title}
              padding={3}
              variant={isActive ? 'muted' : 'default'}
              onClick={() => onSelect?.(step, index)}
              style={{ flexGrow: 1 }}
            >
              <VStack gap={1}>
                <Text weight="semibold">{step.title}</Text>
                {step.summary && (
                  <Text type="supporting" color="secondary">
                    {step.summary}
                  </Text>
                )}
                {step.badge && <Badge tone="info">{step.badge}</Badge>}
              </VStack>
            </ClickableCard>
          </VStack>
        );
      })}
    </Grid>
  );
}
