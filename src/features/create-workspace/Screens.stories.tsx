// UI / Screens — the surface behind each step. Selecting a step swaps the
// screens; the rail underneath links to the components they are built from, so
// the path from a screen to a component's spec is one click.

import type { StoryMeta } from '@handoff/story-types';
import { Card } from '@astryxdesign/core/Card';
import { VStack } from '@astryxdesign/core/Stack';
import { Grid } from '@astryxdesign/core/Grid';
import { Text } from '@astryxdesign/core/Text';
import { Page } from '@handoff/Page';
import { ScreenFrame } from '@handoff/ScreenFrame';
import { Swap } from '@handoff/Swap';
import { PresentButton } from '@handoff/Present';
import { Related } from '@handoff/Related';
import { STEPS, STEP_TITLES, useActiveStep, setActiveStep } from './journey';
import { SetupStepper } from './SetupStepper';
import { SCREENS, SCREEN_VARIANTS, type ScreenVariant } from './screens';

const meta: StoryMeta = { title: 'Screens', section: 'UI', order: 3 };
export default meta;

/** Every state a step has, so nothing has to be toggled into view. */
const statesOf = (id: string) =>
  SCREEN_VARIANTS[id] ?? [{ id: 'default' as ScreenVariant, label: 'Default', note: '' }];

export const Default = () => {
  const active = useActiveStep();
  const step = STEPS[active];

  return (
    <Page
      title="Screens"
      eyebrow="UI"
      description="Every state of a step laid out side by side, the way frames sit on a design canvas."
      actions={
        <PresentButton
          startIndex={active}
          label="Present"
          slides={STEPS.map((item, index) => {
            const Slide = SCREENS[item.id];
            return {
              id: item.id,
              label: `${index + 1} · ${item.title}`,
              content: (
                <ScreenFrame width={560}>
                  <Slide />
                </ScreenFrame>
              ),
            };
          })}
        />
      }
    >
      <Card padding={4} variant="muted">
        <SetupStepper steps={STEP_TITLES} current={active} onStepClick={setActiveStep} />
      </Card>

      {/* No state picker: a step's states are all on the canvas at once, so
          the error and the loading case are as visible as the happy path.
          The reservation keeps the page still while steps swap. */}
      <Swap
        activeIndex={active}
        items={STEPS.map((item) => {
          const Slide = SCREENS[item.id];
          return (
            <VStack key={item.id} gap={6}>
              <VStack gap={1}>
                <Text type="supporting" weight="semibold" color="secondary">
                  GOAL
                </Text>
                <Text color="secondary">{item.goal}</Text>
              </VStack>

              {/* The states share the row rather than each claiming a fixed
                  width, so they stay side by side instead of wrapping the
                  moment the window is a little narrow. */}
              <Grid columns={{ minWidth: 340, repeat: 'fit' }} gap={6} align="start">
                {statesOf(item.id).map((state) => (
                  <ScreenFrame key={state.id} width={460} name={state.label} caption={state.note}>
                    <Slide variant={state.id} />
                  </ScreenFrame>
                ))}
              </Grid>
            </VStack>
          );
        })}
      />

      <Related
        title="Built from"
        items={step.components.map((component) => ({
          kind: 'behavior' as const,
          label: component,
          hint: 'Behavior, states and specs',
          target: { page: component },
        }))}
      />

      <Related
        title="Back to"
        items={[
          {
            kind: 'flow',
            label: `Step ${active + 1} · ${step.title}`,
            hint: 'The journey map',
            target: { page: 'User flow' },
          },
          {
            kind: 'context',
            label: 'Why this exists',
            hint: 'The problem and principles',
            target: { context: true },
          },
        ]}
      />
    </Page>
  );
};
