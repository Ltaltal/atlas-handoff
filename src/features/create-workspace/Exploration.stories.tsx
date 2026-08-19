// Exploration — the optional workspace page. Everything on it is unfinished on
// purpose: directions still open, variants still being compared, and what moved
// this week. A feature can leave this page out entirely once it has settled.

import type { StoryMeta } from '@handoff/story-types';
import { VStack } from '@astryxdesign/core/Stack';
import { Page } from '@handoff/Page';
import { Related } from '@handoff/Related';
import {
  ExplorationBoard,
  ExplorationSection,
  VariationCheck,
  Recent,
  type Direction,
  type Variation,
  type RecentEntry,
} from '@handoff/Exploration';
import { OptionCard } from './OptionCard';
import { NameField } from './NameField';
import { SetupStepper } from './SetupStepper';
import { STEP_TITLES } from './journey';

const meta: StoryMeta = { title: 'Exploration', section: 'Flow', order: 3 };
export default meta;

const DIRECTIONS: Direction[] = [
  {
    title: 'Stepped, one decision each',
    state: 'chosen',
    premise: 'Split the form so no screen asks two unrelated questions.',
    cost: 'Four screens to maintain instead of one, and a step change to get right.',
    preview: <SetupStepper steps={STEP_TITLES} current={1} showLabels={false} />,
  },
  {
    title: 'One form, grouped',
    state: 'dropped',
    premise: 'Keep everything on a page and lean on headings to do the grouping.',
    cost: 'Tested worst on resuming after an interruption — people lost their place.',
    preview: <NameField value="Harbor Launch" state="success" />,
  },
  {
    title: 'Name first, settle the rest later',
    state: 'parked',
    premise: 'Create on the name alone and let the workspace configure itself over time.',
    cost: 'Needs an empty state we have not designed, and a way to nag. Worth revisiting.',
    preview: <NameField value="Harbor Launch" state="default" />,
  },
  {
    title: 'Templates instead of a blank start',
    state: 'exploring',
    premise: 'Offer a shaped workspace rather than an empty one, and skip the type question.',
    cost: 'Unknown — depends on whether the archived templates feature comes back.',
    preview: <OptionCard icon="folder" title="From a template" description="Start with a shape." />,
  },
];

const VARIATIONS: Variation[] = [
  {
    label: 'Card with a sentence',
    note: 'Each option explains its consequence. Wider, but nothing has to be guessed.',
    picked: true,
    preview: (
      <OptionCard icon="people" title="Team" description="Shared from the start." selected />
    ),
  },
  {
    label: 'Card, title only',
    note: 'Half the height. "Team" alone did not tell anyone what it changes.',
    preview: <OptionCard icon="people" title="Team" description="" selected />,
  },
  {
    label: 'Disabled state',
    note: 'What a single available option looks like. Shown rather than hidden.',
    preview: (
      <OptionCard icon="person" title="Personal" description="Only you." selected disabled />
    ),
  },
];

const RECENT: RecentEntry[] = [
  {
    what: 'Dropped the Start step',
    who: 'Rowan Ellis',
    when: '2 days ago',
    detail: 'It repeated the page it sat on. The flow opens on Workspace details now.',
  },
  {
    what: 'Measured the specs properly',
    who: 'Rowan Ellis',
    when: '2 days ago',
    detail: 'Nine of eighteen numbers were written from intent and wrong.',
  },
  {
    what: 'Raised the focus-management gap',
    who: 'Priya Nair',
    when: '4 days ago',
    detail: 'Nothing moves focus on a step change. Highest-value accessibility fix.',
  },
  {
    what: 'Parked "name first"',
    who: 'Devon Park',
    when: 'last week',
    detail: 'Blocked on an empty state, not on the idea.',
  },
];

export const Default = () => (
  <Page
    title="Exploration"
    eyebrow="Thinking"
    description="What is still open. Directions being weighed, variants being compared, and what moved recently — kept separate from the pages that document what was settled."
  >
    <VStack gap={8}>
      <ExplorationSection
        title="Directions"
        hint="Several are alive at once. Parked is not rejected — it is the cheapest thing to revive when a constraint changes."
      >
        <ExplorationBoard directions={DIRECTIONS} />
      </ExplorationSection>

      <ExplorationSection
        title="Variation check"
        hint="The same choice several ways, side by side, with the pick marked and the reason next to it."
      >
        <VariationCheck variations={VARIATIONS} />
      </ExplorationSection>

      <ExplorationSection
        title="Recent"
        hint="What moved lately, so someone coming back knows where to look."
      >
        <Recent entries={RECENT} />
      </ExplorationSection>
    </VStack>

    <Related
      items={[
        { kind: 'decision', label: 'Notes', hint: 'What was settled, and why', target: { page: 'Notes' } },
        { kind: 'ui', label: 'OptionCard', hint: 'Where the chosen variant lives', target: { page: 'OptionCard' } },
        { kind: 'flow', label: 'User flow', hint: 'The direction that won', target: { page: 'User flow' } },
      ]}
    />
  </Page>
);

Default.notes =
  '**Why this page is optional**\n\nMost of a handoff documents what was decided. This documents what has not been, which is only useful while it is true — a feature that has settled should delete the page rather than let it rot.\n\nThe parked column earns its keep: "name first" is blocked on an empty state, not on the idea, and that is worth knowing the next time someone proposes it.';
