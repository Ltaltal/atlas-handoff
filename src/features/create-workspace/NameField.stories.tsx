// Components / NameField — the component that carries the feature's validation
// behaviour. Every state it can be in, what triggers each one, and the numbers
// to build it.

import { useEffect, useState } from 'react';
import type { StoryMeta } from '@handoff/story-types';
import { ComponentDocs, Behavior, StorySection } from '@handoff/storybook';
import { VariantGrid } from '@handoff/VariantGrid';
import { Playground } from '@handoff/Playground';
import { SpecView, useSpecView } from '@handoff/SpecView';
import { Iterations } from '@handoff/Iterations';
import { Related } from '@handoff/Related';
import { setActiveStepById } from './journey';
import { NameField, type NameFieldState } from './NameField';

const meta: StoryMeta = { title: 'NameField', section: 'Components', order: 6, status: 'wip' };
export default meta;

const STATES: { state: NameFieldState; label: string; value: string }[] = [
  { state: 'default', label: 'Default', value: '' },
  { state: 'success', label: 'Available', value: 'Harbor Launch' },
  { state: 'loading', label: 'Checking', value: 'Harbor Launch' },
  { state: 'error', label: 'Taken', value: 'Field Research' },
  { state: 'disabled', label: 'Disabled', value: 'Harbor Launch' },
];

export const Default = () => {
  const spec = useSpecView();
  const [value, setValue] = useState('Harbor Launch');
  const state: NameFieldState =
    value.trim() === ''
      ? 'default'
      : value.trim().toLowerCase() === 'field research'
        ? 'error'
        : 'success';

  // Reading this component leaves the journey on the step that uses it, so
  // jumping back to the flow lands in the right place.
  useEffect(() => setActiveStepById('details'), []);

  return (
    <ComponentDocs
      title="NameField"
      status="wip"
      audit={<NameField value="Harbor Launch" state="success" />}
      description="The workspace name input. Availability is checked while the person types, and anything wrong is reported directly under the field so they never lose what they typed."
    
      accessibility={{
        summary:
          'The field carries its own label, its own status and its own message, so nothing about its state has to be inferred from colour or position.',
        headings: [
          {
            level: 0,
            text: 'None — the field label is a label',
            note: 'It is associated with the input through `for`/`id`, so it is announced when focus lands rather than sitting in the outline.',
          },
        ],
        tabOrder: [
          {
            target: 'The input',
            announced:
              '"Workspace name, edit text" — then the message, because it is the input\u2019s description rather than a sibling',
            note: 'One stop. The status icon and the message are not focusable, so a keyboard user never has to tab past them to reach the next control.',
          },
        ],
        names: [
          {
            element: 'The input',
            role: 'textbox',
            name: '"Workspace name"',
            source: 'A visible <label> bound by for/id — not a placeholder, which disappears the moment typing starts',
          },
          {
            element: 'The message line',
            role: 'none',
            name: '—',
            source: 'aria-describedby on the input, so the reason is read with the field instead of being announced adrift',
          },
          {
            element: 'The checking state',
            role: 'status',
            name: '"Checking availability"',
            source: 'A polite live region, so the result arrives without stealing focus mid-typing',
          },
        ],
        adaptation: [
          {
            condition: '400% zoom',
            behaviour:
              'The field is fluid, so it reflows to the available width and the message wraps under it. This is the part of the step that survives zoom best.',
            verdict: 'pass',
          },
          {
            condition: 'Message present',
            behaviour:
              'The message line is always reserved, so validating never shifts what is below it — which matters most for someone zoomed in, who can see very little at once.',
            verdict: 'pass',
          },
        ],
      }}>
      <Behavior
        logic={[
          'Availability is checked after a short pause in typing, not on every keystroke.',
          'While a check is in flight the field shows a spinner and the step’s primary action is disabled.',
          'A taken name resolves to the error state; the typed value is kept so it can be edited, not retyped.',
          'This is the only required input in the whole flow.',
        ]}
        edgeCases={[
          {
            case: 'Name taken between Review and Create',
            expected: 'Return to step 1 with the error already shown.',
          },
          {
            case: 'Leading or trailing spaces',
            expected: 'Trimmed before the check; the person is not told off for it.',
          },
          {
            case: 'Check fails to respond',
            expected: 'Keep the last known state and allow Continue — the server revalidates.',
          },
          { case: 'Emoji or punctuation', expected: 'Allowed. Only length and uniqueness are enforced.' },
        ]}
      />

      <StorySection
        name="Default"
        description="Type to see it validate. “Field Research” is already taken."
        code={'<NameField\n  value={value}\n  state={state}\n  onChange={setValue}\n/>'}
      >
        <Iterations
          items={[
            {
              label: 'v2 · current',
              description: 'Message sits under the field, so the fix happens where the problem is.',
              content: <NameField value={value} state={state} onChange={setValue} />,
            },
            {
              label: 'v1',
              description: 'Rejected — errors were collected in a summary at the top of the step.',
              content: (
                <NameField value="Field Research" state="error" errorMessage="See the errors above." />
              ),
            },
          ]}
        />
      </StorySection>

      <StorySection name="States" description="Every state the field can be in.">
        <VariantGrid
          minCellWidth={320}
          variants={STATES.map((item) => ({
            label: item.label,
            caption: `state="${item.state}"`,
            node: <NameField value={item.value} state={item.state} />,
          }))}
        />
      </StorySection>

      <StorySection
        name="Playground"
        flush
        description="Drive it from its props. Useful for the questions the grid above cannot answer, like what a long label does to the layout."
      >
        <Playground
          controls={[
            {
              name: 'state',
              label: 'State',
              kind: 'select',
              options: ['default', 'success', 'loading', 'error', 'disabled'],
              initial: 'error',
            },
            { name: 'label', label: 'Label', kind: 'text', initial: 'Workspace name' },
            { name: 'value', label: 'Value', kind: 'text', initial: 'Field Research' },
            {
              name: 'errorMessage',
              label: 'Error message',
              kind: 'text',
              initial: 'A workspace with this name already exists.',
              hint: 'Only shown when the state is error.',
            },
          ]}
          render={(values) => (
            <NameField
              state={values.state as NameFieldState}
              label={String(values.label)}
              value={String(values.value)}
              errorMessage={String(values.errorMessage)}
            />
          )}
          code={(values) =>
            `<NameField\n  label="${values.label}"\n  value="${values.value}"\n  state="${values.state}"\n/>`
          }
        />
      </StorySection>

      <StorySection name="Specs" actions={spec.toggle} description="Measurements for the error state, the tightest of the six.">
        <SpecView view={spec.view}
          width="fills its column"
          height="32px control"
          notes={[
            { x: 22, y: 10, label: 'Label to control — 4px' },
            { x: 50, y: 46, label: 'Control 32px tall, 8px horizontal padding' },
            { x: 26, y: 88, label: 'Inline message — 16px icon, 4px gap' },
          ]}
        >
          <NameField value="Field Research" state="error" />
        </SpecView>
      </StorySection>

      <Related
        items={[
          {
            kind: 'flow',
            label: 'Step 1 · Workspace details',
            hint: 'Where this field is used',
            target: { page: 'User flow' },
          },
          { kind: 'ui', label: 'Screens', hint: 'See it in the surface', target: { page: 'Screens' } },
          {
            kind: 'decision',
            label: 'Inline validation',
            hint: 'Why the message sits here',
            target: { page: 'Notes' },
          },
          {
            kind: 'context',
            label: 'Never lose work',
            hint: 'The principle behind it',
            target: { context: true },
          },
        ]}
      />
    </ComponentDocs>
  );
};

Default.spec = {
  description:
    'Single-line text input with asynchronous availability checking and an inline message slot. Built on the design system TextInput.',
  measurements: [
    { name: 'Control height', value: '32px' },
    { name: 'Control width', value: 'fills its column', description: 'The field is fluid; nothing pins it.' },
    { name: 'Corner radius', value: '10px', description: 'var(--radius-element)' },
    { name: 'Horizontal padding', value: '8px' },
    { name: 'Label to control', value: '4px' },
    { name: 'Message icon', value: '16px' },
  ],
  anatomy: [
    { name: 'Label', description: 'Always visible, never a placeholder' },
    { name: 'Control', description: 'TextInput, 1px border, accent underline on focus' },
    { name: 'Adornment', description: 'Spinner while checking, check mark when available' },
    { name: 'Message', description: 'Hint, error or confirmation — reserves its line so nothing jumps' },
  ],
  props: [
    { name: 'value', type: 'string', default: "''", description: 'Current text.' },
    {
      name: 'state',
      type: "'default' | 'disabled' | 'loading' | 'error' | 'success'",
      default: "'default'",
      description: 'Visual and assistive state.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Fires on every keystroke.',
    },
    { name: 'errorMessage', type: 'string', description: 'Shown when state is "error".' },
    { name: 'successMessage', type: 'string', description: 'Shown when state is "success".' },
    { name: 'hint', type: 'string', description: 'Shown when there is nothing to report.' },
  ],
  tokens: [
    { token: '--color-border-emphasized', description: 'Resting border' },
    { token: '--color-accent', description: 'Focus accent' },
    { token: '--color-error', description: 'Error text, icon and border' },
    { token: '--color-success', description: 'Available confirmation' },
    { token: '--color-background-muted', description: 'Disabled surface' },
  ],
  notes: [
    'The message line is always reserved, so validating never shifts the layout.',
    'Error text names the problem, not the rule — "already taken", not "must be unique".',
    'The spinner sits inside the control, so the value stays readable while checking.',
  ],
};
