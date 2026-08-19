// Components / SetupStepper — progress across the flow. Small component, but it
// is the only thing on screen that answers "how much longer is this?".

import type { StoryMeta } from '@handoff/story-types';
import { ComponentDocs, Behavior, StorySection } from '@handoff/storybook';
import { VariantGrid } from '@handoff/VariantGrid';
import { SpecView, useSpecView } from '@handoff/SpecView';
import { Related } from '@handoff/Related';
import { SetupStepper } from './SetupStepper';
import { STEP_TITLES } from './journey';

const meta: StoryMeta = { title: 'SetupStepper', section: 'Components', status: 'ready', order: 4 };
export default meta;

const box = (width: number, current: number, showLabels = true) => (
  <div style={{ width }}>
    <SetupStepper steps={STEP_TITLES} current={current} showLabels={showLabels} />
  </div>
);

export const Default = () => {
  const spec = useSpecView();

  return (
  <ComponentDocs
    title="SetupStepper"
    status="ready"
    audit={<SetupStepper steps={STEP_TITLES} current={1} />}
    description="Shows where the person is in the four-step flow. It is deliberately not a navigation control — going back is done with the Back button, so there is only one way to move."
    accessibility={{
      summary:
        'Progress, not navigation. Because it is read-only in the product, the right outcome is that it says where you are once and then stays out of the way \u2014 out of the tab sequence and out of the heading outline.',
      headings: [
        {
          level: 0,
          text: 'None \u2014 step titles are labels, not headings',
          note: 'Promoting them would put four headings above the one that names the step, and a screen reader outline would read as five peers.',
        },
      ],
      tabOrder: [
        {
          target: 'Not a tab stop in the product',
          announced: 'Skipped entirely',
          note: 'The nodes render as disabled buttons, so Tab goes straight from the step heading to the first field. In the handoff site they are enabled, which is a deliberate difference \u2014 a reader needs to jump between steps.',
        },
      ],
      names: [
        {
          element: 'The stepper',
          role: 'group',
          name: '"Step 2 of 4"',
          source: 'aria-label on the wrapper, so position is announced once rather than inferred from four separate nodes',
        },
        {
          element: 'Each node',
          role: 'none',
          name: '\u2014',
          source: 'aria-hidden. The number and the tick are decoration once the group has said the position.',
        },
      ],
      adaptation: [
        {
          condition: '400% zoom',
          behaviour:
            'Nodes and connectors keep their size and the labels wrap to two lines. Nothing is clipped, but five columns in a narrow viewport leaves the labels very tight.',
          verdict: 'concern',
        },
        {
          condition: 'Narrow container',
          behaviour: 'Labels wrap and centre under their node; the connector line absorbs the remaining width.',
          verdict: 'pass',
        },
      ],
    }}
  >
    <Behavior
      logic={[
        'Steps before the current one render as complete; steps after it render as untouched.',
        'The current step is emphasised by scale and weight, not by colour alone.',
        'It is read-only in the product. Completed steps are not shortcuts.',
        'Labels wrap rather than truncate: a step name is worth more than a fixed height.',
      ]}
      edgeCases={[
        { case: 'Step is skipped', expected: 'Still marked complete — the person did make a choice.' },
        {
          case: 'Narrow container',
          expected: 'Labels wrap onto a second line; nodes and connectors keep their size.',
        },
        {
          case: 'Screen reader',
          expected: 'Announced as "Step 2 of 4" rather than four separate items.',
        },
      ]}
    />

    <StorySection
      name="Default"
      description="At step 2 of 4."
      code={'<SetupStepper steps={STEP_TITLES} current={1} />'}
    >
      {box(440, 1)}
    </StorySection>

    <StorySection name="States" description="Every position in the flow.">
      <VariantGrid
        minCellWidth={300}
        variants={[
          { label: 'First step', caption: 'current={0}', node: box(280, 0) },
          { label: 'Mid flow', caption: 'current={2}', node: box(280, 2) },
          { label: 'Complete', caption: 'current={4}', node: box(280, 4) },
          { label: 'Without labels', caption: 'showLabels={false}', node: box(280, 2, false) },
        ]}
      />
    </StorySection>

    <StorySection name="Specs" actions={spec.toggle} description="Node and connector measurements.">
      <SpecView view={spec.view}
        width="fills its container"
        height="32px"
        notes={[
          { x: 10, y: 26, label: 'Node 20px · 2px border' },
          { x: 50, y: 26, label: 'Connector 2px, fills the remaining space' },
          { x: 50, y: 78, label: 'Node to label — 4px' },
        ]}
      >
        {box(360, 1)}
      </SpecView>
    </StorySection>

    <Related
      items={[
        { kind: 'flow', label: 'User flow', hint: 'The four steps it tracks', target: { page: 'User flow' } },
        { kind: 'ui', label: 'Screens', hint: 'Appears on every step', target: { page: 'Screens' } },
        {
          kind: 'decision',
          label: 'Four steps, one decision each',
          hint: 'Why the flow is stepped',
          target: { page: 'Notes' },
        },
      ]}
    />
  </ComponentDocs>
  );
};

Default.spec = {
  description: 'Read-only progress indicator for a linear, fixed-length flow.',
  measurements: [
    { name: 'Node size', value: '20px' },
    { name: 'Node border', value: '2px' },
    { name: 'Connector thickness', value: '2px' },
    { name: 'Node to label', value: '4px' },
    { name: 'Label size', value: '12px', description: 'The supporting text step.' },
    {
      name: 'Total height',
      value: '44px',
      description: 'With labels shown, and taller when one wraps to two lines.',
    },
  ],
  anatomy: [
    { name: 'Node', description: 'Number, or a check once the step is complete' },
    { name: 'Connector', description: 'Fills the space between nodes; brand-filled when passed' },
    { name: 'Label', description: 'Step name, wrapping to a second line when narrow' },
  ],
  props: [
    { name: 'steps', type: 'string[]', required: true, description: 'Step labels in order.' },
    { name: 'current', type: 'number', required: true, description: 'Zero-based index of the current step.' },
    { name: 'showLabels', type: 'boolean', default: 'true' },
    {
      name: 'onStepClick',
      type: '(index: number) => void',
      description: 'Documentation only — unset in the product.',
    },
  ],
  tokens: [
    { token: '--color-accent', description: 'Completed node and connector' },
    { token: '--color-border', description: 'Untouched node and connector' },
    { token: '--color-on-accent', description: 'Check mark' },
  ],
  notes: [
    'Read-only by design — completed steps are not shortcuts.',
    'Position is conveyed by weight and scale as well as colour.',
  ],
};
