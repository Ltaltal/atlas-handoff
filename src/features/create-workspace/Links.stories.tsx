// Links — everything that lives outside this site but is needed to understand
// it. One place, so nobody has to dig through chat history for the spec URL.

import type { StoryMeta } from '@handoff/story-types';
import { Page } from '@handoff/Page';
import { LinkBoard } from '@handoff/LinkBoard';
import { Related } from '@handoff/Related';
import { links } from './data';

const meta: StoryMeta = { title: 'Links', order: 11 };
export default meta;

export const Default = () => (
  <Page
    title="Links"
    eyebrow="References"
    description="The product spec, the research, the design file and the ticket."
  >
    <LinkBoard links={links} />

    <Related
      items={[
        { kind: 'decision', label: 'Notes', hint: 'Decisions and open questions', target: { page: 'Notes' } },
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
