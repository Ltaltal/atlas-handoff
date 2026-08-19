// Notes — one place for everything written down about this feature: what was
// decided, what is still open, what might bite, and what we learned. Add a new
// entry without leaving the page.

import type { StoryMeta } from '@handoff/story-types';
import { Page } from '@handoff/Page';
import { NotesBoard } from '@handoff/NotesBoard';
import { Related } from '@handoff/Related';
import { notes } from './data';

const meta: StoryMeta = { title: 'Notes', order: 10 };
export default meta;

export const Default = () => (
  <Page
    title="Notes"
    eyebrow="Thinking"
    description="Decisions, open questions, risks and observations — in one list, filtered by kind."
  >
    <NotesBoard notes={notes} />

    <Related
      items={[
        { kind: 'flow', label: 'User flow', hint: 'What the decisions shaped', target: { page: 'User flow' } },
        {
          kind: 'behavior',
          label: 'NameField',
          hint: 'Where inline validation lives',
          target: { page: 'NameField' },
        },
        { kind: 'ui', label: 'Links', hint: 'The spec and the research', target: { page: 'Links' } },
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
