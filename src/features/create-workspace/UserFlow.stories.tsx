// Flow / User flow — the hero page of the feature. The four steps as a
// connected map: selecting a step previews the screen that implements it, and
// opening it jumps to the UI page on that same step.

import type { StoryMeta } from '@handoff/story-types';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Divider } from '@astryxdesign/core/Divider';
import { Button, Icon } from '@ds';
import { Page } from '@handoff/Page';
import { FlowMap } from '@handoff/FlowMap';
import { ScreenFrame } from '@handoff/ScreenFrame';
import { Swap } from '@handoff/Swap';
import { Related } from '@handoff/Related';
import { useHandoffNav } from '@handoff/navigation';
import { STEPS, useActiveStep, setActiveStep } from './journey';
import { SCREENS, SCREEN_VARIANTS } from './screens';

const meta: StoryMeta = { title: 'User flow', section: 'Flow', order: 1 };
export default meta;

const BRANCHES = [
  {
    label: 'Name already taken',
    detail: 'Stay on step 1, report it under the field, keep everything else typed.',
  },
  {
    label: 'Skip configure',
    detail: 'Step 2 is optional — a skipped workspace is Private with no invites.',
  },
  {
    label: 'Leave mid-flow',
    detail: 'Nothing is created before Review, so there is nothing to clean up.',
  },
];

export const Default = () => {
  const navigate = useHandoffNav();
  const active = useActiveStep();
  const step = STEPS[active];
  const states = SCREEN_VARIANTS[step.id]?.length ?? 1;

  return (
    <Page
      title="User flow"
      eyebrow="Flow"
      description="Four steps, one decision each. Select a step to preview the screen behind it."
    >
      <FlowMap
        steps={STEPS.map((item) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
        }))}
        activeId={step.id}
        onSelect={(_, index) => setActiveStep(index)}
      />

      {/* The step reads top to bottom: what it is for, then the screen that
          does it. Side by side left a short paragraph holding a column half
          the page wide, with the rest of it empty. */}
      <VStack gap={5}>
        <VStack gap={3}>
          <Text type="supporting" weight="semibold" color="accent">
            {`STEP ${active + 1} OF ${STEPS.length}`}
          </Text>
          <Heading level={2}>{step.title}</Heading>
          <Text color="secondary">{step.goal}</Text>
          <HStack gap={2}>
            {/* The screen is already below, so "open" would point at what you
                are looking at. What Screens adds is the states this preview
                does not show, and the components it is built from. */}
            <Button
              variant="primary"
              icon={<Icon name="arrowRight" size={15} />}
              iconAfter
              onClick={() => navigate({ page: 'Screens' })}
            >
              {states > 1 ? `See all ${states} states` : 'See what it is built from'}
            </Button>
          </HStack>
        </VStack>

        <Swap
          activeIndex={active}
          items={STEPS.map((item) => {
            const Slide = SCREENS[item.id];
            return (
              <ScreenFrame
                key={item.id}
                width={560}
                caption="Live preview — the same components engineering will use."
              >
                <Slide />
              </ScreenFrame>
            );
          })}
        />
      </VStack>

      <VStack gap={2}>
        <Heading level={2}>Branches</Heading>
        {/* A rule between rows, not after the last one — the rail below brings
            its own, and two lines with nothing between them reads as a mistake. */}
        {BRANCHES.map((branch, index) => (
          <VStack key={branch.label} gap={1}>
            <HStack gap={4} vAlign="start">
              <Text weight="semibold">{branch.label}</Text>
              <Text type="supporting" color="secondary">
                {branch.detail}
              </Text>
            </HStack>
            {index < BRANCHES.length - 1 && <Divider />}
          </VStack>
        ))}
      </VStack>

      <Related
        items={[
          {
            kind: 'context',
            label: 'Why this flow exists',
            hint: 'The problem and principles',
            target: { context: true },
          },
          { kind: 'ui', label: 'Screens', hint: 'Every step as a real surface', target: { page: 'Screens' } },
          { kind: 'flow', label: 'Prototype', hint: 'Watch it run end to end', target: { page: 'Prototype' } },
          { kind: 'decision', label: 'Notes', hint: 'Why the flow is stepped', target: { page: 'Notes' } },
        ]}
      />
    </Page>
  );
};
