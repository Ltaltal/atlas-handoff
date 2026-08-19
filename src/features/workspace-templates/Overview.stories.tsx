// An archived direction. Kept so the reasoning survives, not because anyone is
// meant to build it.

import type { StoryMeta } from '@handoff/story-types';
import { VStack } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Page } from '@handoff/Page';

const meta: StoryMeta = { title: 'Overview' };
export default meta;

export const Default = () => (
  <Page
    title="Workspace templates"
    eyebrow="Archived"
    status="archived"
    description="Every new workspace started by picking a template — Project, Research, or Blank."
  >
    <VStack gap={3}>
      <Heading level={2}>Why it was archived</Heading>
      <Text color="secondary">
        Templates asked people to categorise work they had not started yet. In testing,
        nearly everyone picked Blank and then wondered what they had missed. The idea may
        come back as something offered inside an existing workspace, where there is enough
        context to make it useful.
      </Text>
      <Heading level={2}>What replaced it</Heading>
      <Text color="secondary">
        The stepped flow in Create a workspace, which asks for a name and a type instead
        of a category.
      </Text>
    </VStack>
  </Page>
);
