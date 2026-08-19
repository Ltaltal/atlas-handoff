import type { FeatureModule } from '@handoff/discovery';

const feature: FeatureModule = {
  id: 'create-workspace',
  title: 'Create a workspace',
  designer: 'Rowan Ellis',
  description:
    'Turning one long form into four short steps, so a new workspace takes a minute instead of a meeting.',
  status: 'wip',
  order: 1,
  specLabel: 'Context',
  highlights: [
    {
      label: 'Context',
      hint: 'Why this exists and the problem it solves.',
      icon: 'context',
      context: true,
    },
    { label: 'IA', hint: 'What the feature is made of.', icon: 'ia', page: 'IA' },
    { label: 'Flow', hint: 'The end-to-end journey, step by step.', icon: 'flow', page: 'User flow' },
    { label: 'UI', hint: 'The screen behind every step.', icon: 'ui', page: 'Screens' },
    {
      label: 'Behavior',
      hint: 'Interactions, states and edge cases.',
      icon: 'behavior',
      page: 'NameField',
    },
    {
      label: 'Specs',
      hint: 'Sizes, spacing and tokens to build with.',
      icon: 'specs',
      page: 'OptionCard',
    },
    {
      label: 'Reviews',
      hint: 'Heuristics, accessibility, drift and content.',
      icon: 'review',
      page: 'Heuristics',
    },
    {
      label: 'Notes',
      hint: 'Decisions, open questions and risks.',
      icon: 'decision',
      page: 'Notes',
    },
    { label: 'Links', hint: 'The spec, the research, the design file.', icon: 'links', page: 'Links' },
  ],
};

export default feature;
