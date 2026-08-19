// Components / OptionCard — one selectable choice. It appears twice in the flow,
// which is the whole reason it is a component and not two bespoke layouts.

import { useState } from 'react';
import type { StoryMeta } from '@handoff/story-types';
import { Stack } from '@astryxdesign/core/Stack';
import { ComponentDocs, Behavior, StorySection } from '@handoff/storybook';
import { VariantGrid } from '@handoff/VariantGrid';
import { Playground } from '@handoff/Playground';
import { SpecView, useSpecView } from '@handoff/SpecView';
import { Related } from '@handoff/Related';
import { OptionCard } from './OptionCard';
import type { IconName } from '@ds';

const meta: StoryMeta = { title: 'OptionCard', section: 'Components', order: 5 };
export default meta;

export const Default = () => {
  const spec = useSpecView();
  const [selected, setSelected] = useState('team');

  return (
    <ComponentDocs
      title="OptionCard"
      description="A single choice, shown as a card rather than a radio button. Used for workspace type at step 1 and for visibility at step 2 — the two places where the choice deserves a sentence of explanation."
      audit={
        <Stack direction="horizontal" gap={3} role="group" aria-label="Workspace type">
          <OptionCard icon="person" title="Personal" description="Only you." />
          <OptionCard icon="people" title="Team" description="Shared from the start." selected />
        </Stack>
      }
      accessibility={{
        summary:
          'The card is a checkbox that the group treats as a single choice. That is the design system\u2019s own pattern for selectable cards, and it has a consequence worth knowing: assistive technology hears four independent checkboxes, not "one of two".',
        headings: [
          {
            level: 0,
            text: 'None \u2014 the title is a control label, not a heading',
            note: 'The card title renders as text inside the control, so it never enters the page outline. The group above it carries the name instead.',
          },
        ],
        tabOrder: [
          {
            target: 'Each card, in source order',
            announced: '"Personal, checkbox, not checked" \u2014 then "Team, checkbox, checked"',
            note: 'Every card is its own tab stop. There is no arrow-key roving between them, because these are checkboxes rather than a radio group.',
          },
        ],
        names: [
          {
            element: 'The card',
            role: 'checkbox',
            name: 'The card title, e.g. "Team"',
            source: 'aria-label on the input the component renders',
          },
          {
            element: 'The description line',
            role: 'none',
            name: '\u2014',
            source: 'Not part of the accessible name. It is read as adjacent text, so the title has to stand alone.',
          },
          {
            element: 'The wrapping group',
            role: 'group',
            name: '"Workspace type" / "Visibility"',
            source: 'aria-label on the Stack that wraps the pair',
          },
        ],
        adaptation: [
          {
            condition: '400% zoom',
            behaviour:
              'The card holds a fixed 200px width, so a pair needs 412px and cannot reflow into the ~285px a 400% zoom leaves. The row overflows horizontally instead of stacking.',
            verdict: 'fail',
          },
          {
            condition: 'Narrow viewport, above the zoom threshold',
            behaviour:
              'The group wraps, so the second card moves under the first rather than shrinking. Both keep their width and their text stays at its intended measure.',
            verdict: 'pass',
          },
          {
            condition: 'Long description',
            behaviour: 'Cards in a row match the tallest, so the group stays a clean rectangle.',
            verdict: 'pass',
          },
        ],
      }}
    >
      <Behavior
        logic={[
          'Exactly one card in a group is selected — the group enforces that in state, not in markup.',
          'Selection is immediate and reversible — it never advances the step on its own.',
          'The whole card is the target, not just the title.',
          'A disabled card still reads its description, so the reason it exists is not hidden.',
        ]}
        edgeCases={[
          { case: 'No selection yet', expected: 'The step’s primary action stays disabled.' },
          { case: 'Description wraps to three lines', expected: 'Cards in a row match the tallest.' },
          {
            case: 'Only one option available',
            expected: 'Render it selected and disabled rather than hiding the choice.',
          },
        ]}
      />

      <StorySection
        name="Default"
        description="Workspace type, as it appears at step 1."
        code={
          '<OptionCard\n  icon="people"\n  title="Team"\n  description="Shared from the start."\n  selected={type === \'team\'}\n  onSelect={() => setType(\'team\')}\n/>'
        }
      >
        <OptionCard
          icon="person"
          title="Personal"
          description="Only you. Invite people later if you need to."
          selected={selected === 'personal'}
          onSelect={() => setSelected('personal')}
        />
        <OptionCard
          icon="people"
          title="Team"
          description="Shared from the start with the people you pick."
          selected={selected === 'team'}
          onSelect={() => setSelected('team')}
        />
      </StorySection>

      <StorySection name="States" description="Every state the card can be in.">
        <VariantGrid
          minCellWidth={240}
          variants={[
            {
              label: 'Default',
              caption: 'selected={false}',
              node: <OptionCard icon="lock" title="Private" description="Only invited people." />,
            },
            {
              label: 'Selected',
              caption: 'selected',
              node: (
                <OptionCard icon="lock" title="Private" description="Only invited people." selected />
              ),
            },
            {
              label: 'Disabled',
              caption: 'disabled',
              node: (
                <OptionCard
                  icon="globe"
                  title="Shared"
                  description="Turned off by your organization's policy."
                  disabled
                />
              ),
            },
          ]}
        />
      </StorySection>

      <StorySection
        name="Playground"
        flush
        description="Drive it from its props. The description is where this component breaks — try a long one."
      >
        <Playground
          controls={[
            { name: 'title', label: 'Title', kind: 'text', initial: 'Team' },
            {
              name: 'description',
              label: 'Description',
              kind: 'text',
              initial: 'Shared from the start with the people you pick.',
            },
            {
              name: 'icon',
              label: 'Icon',
              kind: 'select',
              options: ['person', 'people', 'lock', 'globe'],
              initial: 'people',
            },
            { name: 'selected', label: 'Selected', kind: 'boolean', initial: true },
            { name: 'disabled', label: 'Disabled', kind: 'boolean', initial: false },
          ]}
          render={(values) => (
            <OptionCard
              icon={values.icon as IconName}
              title={String(values.title)}
              description={String(values.description)}
              selected={Boolean(values.selected)}
              disabled={Boolean(values.disabled)}
            />
          )}
          code={(values) =>
            `<OptionCard\n  icon="${values.icon}"\n  title="${values.title}"\n  description="${values.description}"${
              values.selected ? '\n  selected' : ''
            }${values.disabled ? '\n  disabled' : ''}\n/>`
          }
        />
      </StorySection>

      <StorySection name="Specs" actions={spec.toggle} description="Measurements for the selected state.">
        <SpecView view={spec.view}
          width="200px"
          height="hug contents"
          notes={[
            { x: 16, y: 22, label: 'Icon 20px, 4px above the title' },
            { x: 50, y: 60, label: 'Padding 15px, plus the 1px border' },
            { x: 88, y: 14, label: 'Selected mark, 8px inset' },
          ]}
        >
          <OptionCard
            icon="people"
            title="Team"
            description="Shared from the start with the people you pick."
            selected
          />
        </SpecView>
      </StorySection>

      <Related
        items={[
          {
            kind: 'flow',
            label: 'Step 1 · Workspace details',
            hint: 'Personal or Team',
            target: { page: 'User flow' },
          },
          {
            kind: 'ui',
            label: 'Screens',
            hint: 'Also used at step 2 for visibility',
            target: { page: 'Screens' },
          },
          {
            kind: 'question',
            label: 'Can Personal become Team?',
            hint: 'Still undecided',
            target: { page: 'Notes' },
          },
          {
            kind: 'context',
            label: 'Reversible by default',
            hint: 'The principle behind it',
            target: { context: true },
          },
        ]}
      />
    </ComponentDocs>
  );
};

Default.spec = {
  description: 'A selectable card used inside a named group, for choices that need a short explanation.',
  // Measured with the box-model overlay on the example above, not written from
  // intent. Four of these were wrong before it existed.
  measurements: [
    { name: 'Card width', value: '200px' },
    {
      name: 'Padding',
      value: '15px',
      description: 'Plus the 1px border, so the box is a round 16px and selecting never shifts the content.',
    },
    { name: 'Corner radius', value: '12px', description: 'var(--radius-container)' },
    { name: 'Icon size', value: '20px' },
    { name: 'Icon to title', value: '4px' },
    { name: 'Gap between cards', value: '16px' },
  ],
  anatomy: [
    { name: 'Icon', description: 'Brand coloured when enabled, muted when not' },
    { name: 'Title', description: 'The choice itself' },
    { name: 'Description', description: 'The consequence of choosing it' },
    { name: 'Selected mark', description: 'Appears top right on selection' },
  ],
  props: [
    { name: 'title', type: 'string', required: true, description: 'The choice.' },
    { name: 'description', type: 'string', required: true, description: 'What choosing it means.' },
    { name: 'icon', type: 'IconName', required: true },
    { name: 'selected', type: 'boolean', default: 'false' },
    { name: 'disabled', type: 'boolean', default: 'false' },
    { name: 'onSelect', type: '() => void', description: 'Fires on click and on Space/Enter.' },
  ],
  tokens: [
    { token: '--color-accent', description: 'Selected border and check' },
    { token: '--color-accent-muted', description: 'Selected surface' },
    { token: '--color-border-emphasized', description: 'Resting border' },
    { token: '--color-background-muted', description: 'Disabled surface' },
    { token: '--radius-container', description: 'Card corner radius' },
  ],
  notes: [
    'Cards, not radios, because each option needs a sentence to be understood.',
    'Selection never navigates — the person still has to press Continue.',
    'Disabled options stay visible so the absence of a choice is explained.',
  ],
};
