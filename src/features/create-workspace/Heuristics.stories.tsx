// Reviews / Heuristics — the feature measured against the ten usability
// heuristics. Public framework, applied to a fictional product.

import type { StoryMeta } from '@handoff/story-types';
import { Page } from '@handoff/Page';
import { Findings, type Finding } from '@handoff/Findings';
import { FlowAudit, labelOf, type FlowCheck } from '@handoff/FlowAudit';
import { StorySection } from '@handoff/storybook';
import { Related } from '@handoff/Related';
import { NameField } from './NameField';
import { SetupStepper } from './SetupStepper';
import { STEPS, STEP_TITLES } from './journey';
import { SCREENS } from './screens';

const meta: StoryMeta = { title: 'Heuristics', section: 'Reviews', order: 20 };
export default meta;

const FINDINGS: Finding[] = [
  {
    title: 'Visibility of system status',
    verdict: 'pass',
    observation:
      'The stepper is on every screen, and the name field reports availability while the person types rather than after they submit.',
    evidence: <SetupStepper steps={STEP_TITLES} current={1} />,
    affects: [{ label: 'SetupStepper', target: { page: 'SetupStepper' } }],
  },
  {
    title: 'Match between the system and the real world',
    verdict: 'pass',
    observation:
      'Personal and Team describe who the workspace is for, not how it is stored. No internal vocabulary reaches the screens.',
    affects: [{ label: 'OptionCard', target: { page: 'OptionCard' } }],
  },
  {
    title: 'User control and freedom',
    verdict: 'concern',
    observation:
      'Back works on every step and nothing is created before Review, but leaving mid-flow discards the draft with no warning.',
    recommendation:
      'Confirm before discarding once the name has been filled in, or keep the draft for the session.',
    affects: [{ label: 'User flow', target: { page: 'User flow' } }],
  },
  {
    title: 'Consistency and standards',
    verdict: 'concern',
    observation:
      'The primary action is bottom-right on every step, but its label changes between Continue, Create workspace and Open workspace.',
    recommendation:
      'That variation is deliberate at the commit point. Document it so it is not "fixed" later into a uniform Continue.',
    affects: [{ label: 'Content', target: { page: 'Content' } }],
  },
  {
    title: 'Error prevention',
    verdict: 'pass',
    observation:
      'The one input that can fail is checked before the person can move on, and Continue stays disabled while it is failing.',
    evidence: <NameField value="Field Research" state="error" errorMessage="A workspace with this name already exists." />,
    affects: [{ label: 'NameField', target: { page: 'NameField' } }],
  },
  {
    title: 'Recognition rather than recall',
    verdict: 'pass',
    observation:
      'Review restates every choice before the workspace is created, so nothing has to be remembered across the flow.',
    affects: [{ label: 'Screens', target: { page: 'Screens' } }],
  },
  {
    title: 'Flexibility and efficiency of use',
    verdict: 'concern',
    observation:
      'There is one path through the flow. A returning lead who creates workspaces often still answers every step.',
    recommendation:
      'Consider Enter-to-continue and remembering the last used type. Out of scope for this release — recorded as an open question.',
    affects: [{ label: 'Notes', target: { page: 'Notes' } }],
  },
  {
    title: 'Aesthetic and minimalist design',
    verdict: 'pass',
    observation:
      'One decision per step, and advanced configuration is deferred until the workspace exists.',
    affects: [{ label: 'Progressive configuration', target: { page: 'Notes' } }],
  },
  {
    title: 'Help users recognise, diagnose and recover from errors',
    verdict: 'pass',
    observation:
      'The error names the problem in plain language and appears next to the field, with the typed value kept.',
    affects: [{ label: 'NameField', target: { page: 'NameField' } }],
  },
  {
    title: 'Help and documentation',
    verdict: 'fail',
    observation:
      'There is no explanation of what Shared visibility actually exposes, and no way to reach help from inside the flow.',
    recommendation:
      'Add a short inline explanation under the visibility choice. A help link is not enough — the question is asked at the moment of choosing.',
    affects: [{ label: 'Step 2 · Configure', target: { page: 'Screens' } }],
  },
];

/**
 * The observable half of a heuristic verdict.
 *
 * Each of these is a sentence one of the findings below leans on, asked of the
 * real screens instead of taken on trust. The verdicts stay hand-written —
 * whether a word matches how people talk is not something markup can answer.
 */
const CONSISTENCY: FlowCheck[] = [
  {
    claim: 'The stepper is on every screen, so position in the flow is never in doubt.',
    test: (screen) => Boolean(screen.querySelector('[role="group"][aria-label^="Step"]')),
  },
  {
    claim: 'Every screen before the end offers a way back.',
    test: (screen) =>
      [...screen.querySelectorAll('button')].some((button) => /^(Back|Start another)$/.test(labelOf(button))),
  },
  {
    claim: 'The primary action is the last control on the screen.',
    test: (screen) => {
      const buttons = [...screen.querySelectorAll('button')].filter((b) => labelOf(b).length > 2);
      const last = buttons[buttons.length - 1];
      return Boolean(last && /Continue|Create|Open/.test(labelOf(last)));
    },
    detail: (screens) => {
      const labels = screens.map((screen) => {
        const buttons = [...screen.querySelectorAll('button')].filter((b) => labelOf(b).length > 2);
        return labelOf(buttons[buttons.length - 1] ?? screen);
      });
      return `Labels in order: ${labels.join(' · ')}`;
    },
  },
];

const SCREEN_LIST = STEPS.map((step) => {
  const Screen = SCREENS[step.id];
  return { id: step.id, label: step.title, render: <Screen /> };
});

export const Default = () => (
  <Page
    title="Heuristic review"
    eyebrow="Review"
    description="The ten usability heuristics, applied to this flow. Each one gets a verdict, what we found, and what to do about it."
  >
    {/* Generated by rendering all four screens and reading them, so a claim
        about "every screen" is answered by every screen. */}
    <StorySection
      name="Checked against every screen"
      description="The parts of these findings that are questions about the markup, asked of the running screens each time this page loads."
    >
      <FlowAudit screens={SCREEN_LIST} checks={CONSISTENCY} />
    </StorySection>

    <Findings items={FINDINGS} unit="heuristics" />

    <Related
      items={[
        { kind: 'flow', label: 'User flow', hint: 'What was reviewed', target: { page: 'User flow' } },
        { kind: 'question', label: 'Accessibility', hint: 'The other review', target: { page: 'Accessibility' } },
        { kind: 'decision', label: 'Notes', hint: 'What these findings became', target: { page: 'Notes' } },
      ]}
    />
  </Page>
);

Default.notes =
  '**Framework**\n\nThe ten usability heuristics for user interface design, as set out by Jakob Nielsen. A public, widely used framework — cited here, not affiliated.\n\n**Method**\n\nWalked the happy path plus the name-taken and skip-configure branches, scoring each heuristic against what is actually built in this handoff rather than against the design intent.\n\nA `concern` is something worth a conversation. A `fail` is something that should not ship as-is.';
