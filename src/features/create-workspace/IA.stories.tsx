// IA — the shape of the feature. What it is made of, how the parts nest, and
// where each one is documented. It answers "what exists" before the flow
// answers "in what order".

import type { StoryMeta } from '@handoff/story-types';
import { Page } from '@handoff/Page';
import { IAMap, type IANode } from '@handoff/IAMap';
import { Related } from '@handoff/Related';
import { STEPS } from './journey';

const meta: StoryMeta = { title: 'IA', section: 'Flow', order: 0 };
export default meta;

/**
 * Built from the journey rather than typed out beside it.
 *
 * The steps, the components each screen is assembled from and the data each
 * step collects all live in `journey.ts`. Listing them again here would be a
 * second copy to keep in step, and the copy is always the one that goes stale.
 */
const TREE: IANode[] = [
  {
    label: 'Workspace switcher',
    kind: 'entry',
    note: 'The only entry point. "New workspace" sits at the bottom of the list.',
  },
  ...STEPS.map<IANode>((step) => ({
    label: step.title,
    kind: 'step',
    note: step.note,
    children: [
      {
        label: `${step.title} screen`,
        kind: 'screen',
        target: { page: 'Screens' },
        // The stepper is on every screen, so listing it four times says
        // nothing. What distinguishes a screen is the rest.
        children: step.components
          .filter((name) => name !== 'SetupStepper')
          .map<IANode>((name) => ({ label: name, kind: 'component', target: { page: name } })),
      },
      ...(step.collects ?? []).map<IANode>((field) => ({
        label: field.name,
        kind: 'data',
        note: field.type,
      })),
    ],
  })),
  {
    label: 'The workspace',
    kind: 'exit',
    note: 'Where the flow hands off. Everything deferred is editable here.',
  },
];

export const Default = () => (
  <Page
    title="IA"
    eyebrow="Structure"
    description="What the feature is made of, step by step. Read a column for one step, or a row to see which steps carry a screen but collect nothing. Anything with a page is a link."
  >
    <IAMap nodes={TREE} />

    <Related
      items={[
        { kind: 'flow', label: 'User flow', hint: 'The same parts in order', target: { page: 'User flow' } },
        { kind: 'ui', label: 'Screens', hint: 'Each screen as a surface', target: { page: 'Screens' } },
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

Default.notes =
  '**Reading this**\n\nSteps are the order a person moves through. Screens are what they see. Components are what the screen is assembled from, and `data` is what the step actually collects.\n\nA step with no required data is a step that can be skipped — which is why **Configure** is optional and **Workspace details** is not.';
