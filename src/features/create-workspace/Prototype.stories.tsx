// Flow / Prototype — the journey twice over: playing on its own so the pacing
// is something you can watch, and clickable so it is something you can try.
//
// The clickable one is the same screens with their buttons wired to the step
// model, which is what makes it worth putting on a projector: a participant
// drives it, and nothing on screen belongs to the handoff.

import { useState } from 'react';
import type { StoryMeta } from '@handoff/story-types';
import { VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Page } from '@handoff/Page';
import { FlowPlayer, type FlowDefinition } from '@handoff/flow';
import { ScreenFrame } from '@handoff/ScreenFrame';
import { Swap } from '@handoff/Swap';
import { PresentButton } from '@handoff/Present';
import { Related } from '@handoff/Related';
import { Tabs } from '@ds';
import { STEPS } from './journey';
import { SCREENS, DEFAULT_DRAFT, type WorkspaceDraft } from './screens';

const meta: StoryMeta = { title: 'Prototype', section: 'Flow', order: 2 };
export default meta;

const flow: FlowDefinition = {
  id: 'create-workspace',
  title: 'Create a workspace',
  loop: true,
  beats: STEPS.map((step) => {
    const Screen = SCREENS[step.id];
    return {
      id: step.id,
      label: step.title,
      mode: 'replace' as const,
      hold: 2000,
      content: (
        <ScreenFrame width={460}>
          <Screen />
        </ScreenFrame>
      ),
    };
  }),
};

/** The flow with its buttons connected, so it can be clicked through. */
function Clickable({ width = 460 }: { width?: number }) {
  const [index, setIndex] = useState(0);
  // The answers belong to the task, not to the screen that asked for them, so
  // they live here and Review reads them back.
  const [draft, setDraft] = useState<WorkspaceDraft>(DEFAULT_DRAFT);

  const restart = () => {
    setIndex(0);
    setDraft(DEFAULT_DRAFT);
  };

  const nav = {
    draft,
    onDraftChange: setDraft,
    onBack: () => setIndex((current) => Math.max(current - 1, 0)),
    onNext: () => setIndex((current) => Math.min(current + 1, STEPS.length - 1)),
    onRestart: restart,
  };

  return (
    // A window, not a set of frames: every step is the height of the tallest
    // and the actions sit on the bottom edge, so Back and Continue stay under
    // the pointer instead of climbing the card as the content gets shorter.
    <Swap
      activeIndex={index}
      items={STEPS.map((step) => {
        const Screen = SCREENS[step.id];
        return (
          <ScreenFrame key={step.id} width={width} fill>
            <Screen fill {...nav} />
          </ScreenFrame>
        );
      })}
    />
  );
}

export const Default = () => {
  const [mode, setMode] = useState('play');

  return (
    <Page
      title="Prototype"
      eyebrow="Flow"
      description="The whole journey — playing on a loop, or clickable so you can drive it yourself."
      actions={
        <PresentButton
          label="Present"
          slides={[{ id: 'prototype', label: 'Create a workspace', content: <Clickable width={520} /> }]}
        />
      }
    >
      <VStack gap={4}>
        <Tabs
          ariaLabel="Prototype mode"
          value={mode}
          onChange={setMode}
          items={[
            { value: 'play', label: 'Play' },
            { value: 'click', label: 'Click through' },
          ]}
        />

        {mode === 'play' ? (
          <FlowPlayer flow={flow} />
        ) : (
          <VStack gap={2} hAlign="center">
            <Clickable />
            <Text type="supporting" color="secondary">
              Back and Continue move between steps. Present opens the same thing full screen.
            </Text>
          </VStack>
        )}
      </VStack>

      <Related
        items={[
          { kind: 'flow', label: 'User flow', hint: 'The same steps as a map', target: { page: 'User flow' } },
          {
            kind: 'ui',
            label: 'Screens',
            hint: 'Including the error and loading states',
            target: { page: 'Screens' },
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

Default.notes =
  '**Two modes**\n\n*Play* runs the happy path on a loop, two seconds a beat — long enough to read the step title, short enough that the whole flow fits in one pass.\n\n*Click through* wires Back and Continue to the step model, so it behaves like the product. This is the one to put on a projector: **Present** opens it full screen with nothing from the handoff visible.\n\nNeither mode covers the error and loading states. Those live on the **Screens** page, where they can be inspected without waiting for a loop.';
