// Design status — what is designed, what is still moving, and what has not been
// started. The one page a lead can open in a standup.
//
// Every row that has somewhere to go is a link: components open their own page,
// surfaces that are part of a screen open that screen on the right step, and
// anything not started yet is plain text, because there is nothing to show.

import type { StoryMeta } from '@handoff/story-types';
import { Page } from '@handoff/Page';
import { StatusBoard, type StatusRow } from '@handoff/StatusBoard';
import { Related } from '@handoff/Related';
import { useHandoffNav } from '@handoff/navigation';
import { setActiveStep } from './journey';

const meta: StoryMeta = { title: 'Design status', order: 12 };
export default meta;

export const Default = () => {
  const navigate = useHandoffNav();

  /** Open the Screens page on a particular step of the flow. */
  const openScreen = (stepIndex: number) => () => {
    setActiveStep(stepIndex);
    navigate({ page: 'Screens' });
  };

  const rows: StatusRow[] = [
    {
      component: 'SetupStepper',
      step: 'All steps',
      priority: 'P0',
      status: 'designed',
      notes: 'Specs final',
      open: () => navigate({ page: 'SetupStepper' }),
    },
    {
      component: 'OptionCard',
      step: '1 · Workspace details',
      priority: 'P0',
      status: 'designed',
      notes: 'Reused at step 2',
      open: () => navigate({ page: 'OptionCard' }),
    },
    {
      component: 'NameField',
      step: '1 · Workspace details',
      priority: 'P0',
      status: 'in-design',
      notes: 'Awaiting the taken-name decision',
      open: () => navigate({ page: 'NameField' }),
    },
    {
      component: 'Review summary',
      step: '3 · Review',
      priority: 'P1',
      status: 'designed',
      notes: 'Read-only rows, no component of its own',
      open: openScreen(2),
    },
    {
      component: 'Complete panel',
      step: '4 · Complete',
      priority: 'P1',
      status: 'in-design',
      notes: 'Next action still open',
      open: openScreen(3),
    },
    {
      component: 'Invite people',
      step: '2 · Configure',
      priority: 'P2',
      status: 'missing',
      notes: 'Deferred to the next release',
    },
  ];

  return (
    <Page
      title="Design status"
      eyebrow="Progress"
      description="Where each part of the feature stands today. Open any row to see it."
    >
      <StatusBoard rows={rows} />

      <Related
        items={[
          {
            kind: 'question',
            label: 'Notes',
            hint: 'What is holding the rest up',
            target: { page: 'Notes' },
          },
          { kind: 'flow', label: 'User flow', hint: 'The steps these map to', target: { page: 'User flow' } },
        ]}
      />
    </Page>
  );
};
