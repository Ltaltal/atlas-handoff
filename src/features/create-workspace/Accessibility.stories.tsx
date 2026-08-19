// Reviews / Accessibility — what a keyboard, a screen reader and a low-contrast
// display make of this flow.

import type { StoryMeta } from '@handoff/story-types';
import { Page } from '@handoff/Page';
import { Findings, type Finding } from '@handoff/Findings';
import { AccessibilityReport } from '@handoff/AccessibilityReport';
import { LiveAudit } from '@handoff/LiveAudit';
import { StorySection } from '@handoff/storybook';
import type { AccessibilitySpec } from '@handoff/story-types';
import { Related } from '@handoff/Related';
import { OptionCard } from './OptionCard';
import { DetailsScreen } from './screens';
import { NameField } from './NameField';

const meta: StoryMeta = { title: 'Accessibility', section: 'Reviews', order: 21 };
export default meta;

/** The flow as a whole, rather than any one component in it. */
const FLOW_A11Y: AccessibilitySpec = {
  summary:
    'One step at a time, so each of these is short by construction. The risk in a wizard is not the individual step but the seams — what carries across a step change, and what a screen reader is told when the content under it is replaced.',
  adaptation: [
    {
      condition: '400% zoom',
      behaviour:
        'The step overflows horizontally instead of reflowing. Measured at an effective 285px viewport: the choice row needs 412px because each card is pinned to 200px, and in the handoff site the screen frame is pinned to 600px in a stack item that will not shrink. WCAG 1.4.10 asks for no horizontal scroll at this zoom.',
      verdict: 'fail',
    },
    {
      condition: '320px viewport',
      behaviour:
        'The choice row wraps and the fields fill the width. This works because wrapping, not shrinking, is what the layout does.',
      verdict: 'pass',
    },
    {
      condition: 'Text spacing overrides',
      behaviour:
        'Line height and letter spacing come from the type scale rather than fixed heights, so increasing them grows the step instead of clipping it.',
      verdict: 'pass',
    },
    {
      condition: 'Reduced motion',
      behaviour: 'Step transitions are opacity-only and respect the system preference.',
      verdict: 'pass',
    },
  ],
};

const FINDINGS: Finding[] = [
  {
    title: 'Text contrast',
    verdict: 'pass',
    observation:
      'Body text is 15.2:1 on card surfaces and secondary text is 6.1:1. Both clear AA at their sizes, and body clears AAA.',
  },
  {
    title: 'Non-text contrast',
    verdict: 'pass',
    observation:
      'Control boundaries come from the design system rather than from us. The resting border on inputs and selectable cards clears 3:1 without anything here tuning it.',
    evidence: <OptionCard icon="lock" title="Private" description="Only invited people." />,
    affects: [{ label: 'Design drift', target: { page: 'Design drift' } }],
  },
  {
    title: 'Focus visibility',
    verdict: 'pass',
    observation:
      'Focus styling comes from the design system, so every control shares one ring and nothing here can accidentally suppress it.',
    evidence: <OptionCard icon="people" title="Team" description="Shared from the start." />,
  },
  {
    title: 'Focus order',
    verdict: 'pass',
    observation:
      'Tab order follows reading order on every step: stepper is skipped, then the field, the choices, then Back and the primary action.',
  },
  {
    title: 'Focus is not managed across steps',
    verdict: 'fail',
    observation:
      'Continue replaces the step content but leaves focus where the button was. A sighted user sees a new step; a screen reader user is told nothing, and Tab resumes from a control that no longer exists. There is no focus() call anywhere in the flow.',
    recommendation:
      'On step change, move focus to the step heading and give it tabindex="-1" so it can receive focus without joining the tab order. That announces the new step and puts Tab back at the top of it. This is the highest-value fix on the page.',
    affects: [{ label: 'Screens', target: { page: 'Screens' } }],
  },
  {
    title: 'The choice group is not a radio group',
    verdict: 'concern',
    observation:
      'SelectableCard renders a native checkbox. We had wrapped each pair in role="radiogroup", which promised semantics the markup never had — a screen reader announced a radio group and then found checkboxes in it.',
    recommendation:
      'The wrapper is now role="group", which is what it is. The remaining cost is real and deliberate: two tab stops instead of one, and no "one of two" announcement. RadioList would give both, at the price of the description line each option needs.',
    evidence: <OptionCard icon="person" title="Personal" description="Only you." />,
    affects: [{ label: 'OptionCard', target: { page: 'OptionCard' } }],
  },
  {
    title: 'Labels and instructions',
    verdict: 'pass',
    observation:
      'The name field has a visible persistent label rather than a placeholder, and each choice group carries a name of its own.',
    evidence: <NameField value="Harbor Launch" state="success" />,
    affects: [{ label: 'NameField', target: { page: 'NameField' } }],
  },
  {
    title: 'Error identification',
    verdict: 'pass',
    observation:
      'The message is part of the input\u2019s status rather than a sibling element, so the control is described by it and the reason is read when focus lands on the field.',
    affects: [{ label: 'NameField', target: { page: 'NameField' } }],
  },
  {
    title: 'Status messages',
    verdict: 'pass',
    observation:
      'Checking, available and taken are all states of the input rather than decoration around it, and the system announces the change politely instead of leaving a screen reader in silence.',
    affects: [{ label: 'NameField', target: { page: 'NameField' } }],
  },
  {
    title: 'Target size',
    verdict: 'pass',
    observation:
      'Controls are 32px tall and option cards are far larger. The smallest target is the stepper node, which is not interactive in the product.',
  },
  {
    title: 'Progress semantics',
    verdict: 'concern',
    observation:
      'The stepper is announced as a group labelled "Step 2 of 4", but the individual nodes carry no state, so the completed ones read the same as the untouched ones.',
    recommendation:
      'Mark completed nodes with aria-current and a visually hidden "completed", or hide the nodes entirely and rely on the group label.',
    affects: [{ label: 'SetupStepper', target: { page: 'SetupStepper' } }],
  },
  {
    title: 'A global reset can silently break the system',
    verdict: 'pass',
    observation:
      'Our own `button { color: inherit }` overrode the system\u2019s on-accent colour, because the system styles itself inside a cascade layer and unlayered rules beat layered ones. The primary button was near-black on blue at 3.4:1.',
    recommendation:
      'Resolved, and worth generalising: after adopting a design system, a reset is not neutral. It now sets geometry only, and contrast is back to 5.39:1.',
    affects: [{ label: 'Design drift', target: { page: 'Design drift' } }],
  },
  {
    title: 'Reduced motion',
    verdict: 'pass',
    observation:
      'Motion is the system\u2019s, so honouring prefers-reduced-motion is not something this feature has to remember to do.',
  },
  {
    title: 'Colour independence',
    verdict: 'pass',
    observation:
      'Selection is carried by a check mark as well as fill, and the error state by an icon and text as well as red.',
  },
];

export const Default = () => (
  <Page
    title="Accessibility review"
    eyebrow="Review"
    description="Contrast, focus, labelling, status and motion — checked against what is built here, not against intent."
  >
    {/* Measured, not written down. The screen below is mounted for real and
        the tables under it are a reading of the DOM it produced, so they
        cannot drift from the component the way a typed-up outline does. */}
    <StorySection
      name="Read from the running screen"
      description="The heading outline, the tab order and every accessible name, taken from the rendered markup each time this page loads."
    >
      <LiveAudit>
        <DetailsScreen />
      </LiveAudit>
    </StorySection>

    <AccessibilityReport spec={FLOW_A11Y} />

    <Findings items={FINDINGS} unit="checks" />

    <Related
      items={[
        { kind: 'behavior', label: 'NameField', hint: 'Where most fixes land', target: { page: 'NameField' } },
        { kind: 'specs', label: 'Design drift', hint: 'The contrast fix', target: { page: 'Design drift' } },
        { kind: 'question', label: 'Heuristics', hint: 'The other review', target: { page: 'Heuristics' } },
      ]}
    />
  </Page>
);

Default.notes =
  '**Method**\n\nKeyboard-only pass, then a screen-reader pass over each step, then contrast sampled from the running theme rather than from the spec.\n\nMost of what was failing here was failing because we had built the controls ourselves. Adopting the system\u2019s own resolved it, and introduced exactly one new bug \u2014 our reset fighting its cascade layer \u2014 which is now the most useful finding on the page.';
