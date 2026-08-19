// Reviews / Design drift — where this feature stops using the design system
// and does its own thing.
//
// This page used to list five divergences. Most of them are gone, not because
// they were fixed one by one, but because the components that carried them
// were replaced with the system's own. What is left is the honest remainder.

import type { StoryMeta } from '@handoff/story-types';
import { Page } from '@handoff/Page';
import { Findings, type Finding } from '@handoff/Findings';
import { Related } from '@handoff/Related';
import { SetupStepper } from './SetupStepper';
import { OptionCard } from './OptionCard';
import { STEP_TITLES } from './journey';

const meta: StoryMeta = { title: 'Design drift', section: 'Reviews', order: 22 };
export default meta;

const FINDINGS: Finding[] = [
  {
    title: 'NameField rebuilt a control the system already had',
    verdict: 'pass',
    observation:
      'It was a hand-built stack of label, input, spinner and message with its own stylesheet. TextInput already owns all four, including the status object that carries the message.',
    recommendation:
      'Resolved. The component is now only the part that belongs to this feature: mapping an availability check onto the control\u2019s status.',
    affects: [{ label: 'NameField', target: { page: 'NameField' } }],
  },
  {
    title: 'OptionCard rebuilt SelectableCard',
    verdict: 'pass',
    observation:
      'Selected, hover, focus and disabled were all styled by hand, and the keyboard model was ours to get wrong.',
    recommendation: 'Resolved. It is SelectableCard with our content inside it.',
    evidence: (
      <OptionCard
        icon="people"
        title="Team"
        description="Shared from the start with the people you pick."
        selected
      />
    ),
    affects: [{ label: 'OptionCard', target: { page: 'OptionCard' } }],
  },
  {
    title: 'Avatar assigned people status colours',
    verdict: 'pass',
    observation:
      'The old avatar hashed a name into one of six tints, and those tints were borrowed from the status palette — so someone could be rendered in danger red for no reason.',
    recommendation: 'Resolved. The system\u2019s Avatar derives its own tint from the name.',
  },
  {
    title: 'SetupStepper is drawn by hand',
    verdict: 'concern',
    observation:
      'The system has no stepper, so this one is ours: two connectors and a numbered node per step. Every value it uses is a token, but the shape is not a component anyone else can reuse.',
    recommendation:
      'Fine for now, and worth proposing upstream. A short linear flow is not an unusual thing to need.',
    evidence: <SetupStepper steps={STEP_TITLES} current={1} />,
    affects: [{ label: 'SetupStepper', target: { page: 'SetupStepper' } }],
  },
  {
    title: 'OptionCard pins its width to 200',
    verdict: 'concern',
    observation:
      'The card passes width={200}. It is a prop on the system component rather than a stylesheet override, but it is still a number we chose rather than a size the layout gave us.',
    recommendation:
      'Let the grid own the track width and drop the prop. The two-up layout at step 1 already comes from the parent.',
    affects: [{ label: 'Screens', target: { page: 'Screens' } }],
  },
  {
    title: 'SpecView positions callouts absolutely',
    verdict: 'concern',
    observation:
      'A measurement callout has to sit at a coordinate over the thing it describes, and no component does that. It is the one surface in the kit still doing its own layout.',
    recommendation:
      'Acceptable. It is a documentation tool, not product UI, and every colour and size in it is a token.',
  },
  {
    title: 'Our reset was overriding the system',
    verdict: 'pass',
    observation:
      'A bare `button { color: inherit }` in our own reset beat the system\u2019s own styling, because the system styles itself inside a cascade layer and unlayered rules win. The primary button rendered near-black on blue at 3.4:1.',
    recommendation:
      'Resolved. The reset no longer touches colour or type, and the contrast is back to 5.39:1. Worth knowing generally: a global reset is not neutral once a design system is in play.',
    affects: [{ label: 'Accessibility', target: { page: 'Accessibility' } }],
  },
  {
    title: 'The selected row in the navigation was invisible',
    verdict: 'concern',
    observation:
      'The tree marks the current page by painting the muted background, and the side panel it sits in is that same muted background. Measured at a contrast of 1.00 — the highlight was drawn exactly on top of its own colour, so the navigation had no visible current page at all.',
    recommendation:
      'The row now carries weight and a dot from the item data rather than a stylesheet. Worth knowing generally: a component\u2019s selected state assumes a surface, and putting it on a different one can cancel it silently.',
    affects: [{ label: 'Accessibility', target: { page: 'Accessibility' } }],
  },
  {
    title: 'Nothing in the feature styles itself any more',
    verdict: 'pass',
    observation:
      'There are no stylesheets left in this project and no token overrides. Colour, type, spacing, radius and motion all come from the system, which is why the dark theme works without anyone maintaining a second set of values.',
  },
];

export const Default = () => (
  <Page
    title="Design drift"
    eyebrow="Review"
    description="Where this feature diverges from the design system, and what to align it to."
  >
    <Findings items={FINDINGS} unit="rules" />

    <Related
      items={[
        { kind: 'behavior', label: 'SetupStepper', hint: 'The remaining hand-drawn one', target: { page: 'SetupStepper' } },
        { kind: 'specs', label: 'OptionCard', hint: 'The pinned width', target: { page: 'OptionCard' } },
        { kind: 'question', label: 'Accessibility', hint: 'Where the reset bug showed up', target: { page: 'Accessibility' } },
      ]}
    />
  </Page>
);

Default.notes =
  '**Method**\n\nRead every rule in the feature against the system, and flagged any value the system already has a name for.\n\nMost of this page now reads as resolved. That is what happened: the divergences were not corrected individually, they disappeared when the hand-built components were replaced by the real ones.\n\nDrift is not automatically a bug. A deliberate exception is fine — it just has to be written down, which is what the three remaining concerns are.';
