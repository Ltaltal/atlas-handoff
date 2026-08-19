// Reviews / Content — how this feature is allowed to talk. Atlas has no
// organisation-wide content guidelines yet, so these are written here and the
// gap is stated rather than hidden.

import type { StoryMeta } from '@handoff/story-types';
import { VStack } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Page } from '@handoff/Page';
import { DoDont } from '@handoff/DoDont';
import { Related } from '@handoff/Related';
import { Findings, type Finding } from '@handoff/Findings';

const meta: StoryMeta = { title: 'Content', section: 'Reviews', order: 23 };
export default meta;

const RULES: { heading: string; rule: string; good: string; bad: string; why: string }[] = [
  {
    heading: 'Buttons say what happens',
    rule: 'A button is labelled with the outcome, not with the direction of travel.',
    good: 'Create workspace',
    bad: 'Submit',
    why: 'At the commit point the label is the last thing read before something irreversible happens. It should name the thing that is about to exist.',
  },
  {
    heading: 'Errors name the problem',
    rule: 'Say what is wrong in the person\u2019s terms. Never restate the validation rule.',
    good: 'A workspace with this name already exists.',
    bad: 'Name must be unique.',
    why: '"Must be unique" describes our constraint. "Already exists" describes their situation, and implies the fix.',
  },
  {
    heading: 'Sentence case everywhere',
    rule: 'Headings, labels and buttons are sentence case. Only proper nouns are capitalised.',
    good: 'Name your workspace',
    bad: 'Name Your Workspace',
    why: 'Title case reads as a heading in a document. This is an instruction.',
  },
  {
    heading: 'Second person, active voice',
    rule: 'Address the person directly. Avoid the passive and avoid "we".',
    good: 'You can rename it at any time.',
    bad: 'The workspace may be renamed later.',
    why: 'The passive hides who can do the renaming, which is the only thing the sentence is for.',
  },
  {
    heading: 'Describe the consequence, not the setting',
    rule: 'An option explains what it means for the person, not what it toggles.',
    good: 'Only invited people can open this workspace.',
    bad: 'Visibility: private',
    why: 'Restating the label teaches nothing. The description exists to answer "and what does that mean for me".',
  },
  {
    heading: 'No dead ends',
    rule: 'Every message that reports a problem implies the next move.',
    good: 'Checking availability\u2026',
    bad: 'Validating\u2026',
    why: 'Say what is being checked so the wait is legible. "Validating" is our word for our process.',
  },
];

const AUDIT: Finding[] = [
  {
    title: 'Organisation-wide content guidelines',
    verdict: 'fail',
    observation:
      'Atlas has no shared content guidelines. Every feature invents its own voice, which is why the same action is called Submit in billing and Create workspace here.',
    recommendation:
      'The rules on this page were written for this feature and are a reasonable starting point for a shared set. Someone needs to own them.',
    affects: [{ label: 'Notes', target: { page: 'Notes' } }],
  },
  {
    title: 'Consistency of the primary action label',
    verdict: 'concern',
    observation:
      'The primary action is Continue on steps 1 and 2, Create workspace on step 3, and Open workspace on step 4.',
    recommendation:
      'Keep it. The change of label is what marks the commit point. Documented here so it survives a later consistency pass.',
    affects: [{ label: 'Heuristics', target: { page: 'Heuristics' } }],
  },
  {
    title: 'Reading level',
    verdict: 'pass',
    observation:
      'No sentence on any screen runs past 14 words, and there is no product jargon in the flow at all.',
  },
];

export const Default = () => (
  <Page
    title="Content"
    eyebrow="Review"
    description="How this feature talks, written down — because there is no organisation-wide guide to point at yet."
  >
    <Text type="supporting" weight="semibold" color="secondary">
      THE STATE OF THE GUIDELINES
    </Text>
    <Findings items={AUDIT} unit="checks" />

    {RULES.map((rule) => (
      <VStack key={rule.heading} gap={2}>
        <Heading level={2}>{rule.heading}</Heading>
        <Text color="secondary">{rule.rule}</Text>
        <DoDont good={rule.good} bad={rule.bad} why={rule.why} />
      </VStack>
    ))}

    <Related
      items={[
        { kind: 'ui', label: 'Screens', hint: 'Where this copy lives', target: { page: 'Screens' } },
        { kind: 'behavior', label: 'NameField', hint: 'The error wording', target: { page: 'NameField' } },
        { kind: 'question', label: 'Heuristics', hint: 'The label consistency finding', target: { page: 'Heuristics' } },
      ]}
    />
  </Page>
);

Default.notes =
  '**Why this page exists**\n\nContent is the part of a handoff that most often arrives as a screenshot and leaves as a guess.\n\nWriting the rules next to the screens they govern means a developer changing a label can see what the label was for.';
