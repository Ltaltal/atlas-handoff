// Vite discovery — finds every feature file under src/ with `import.meta.glob`.
// This module is the target of the `@handoff/discovery` alias.

import { assembleFeatures, type RawMaps } from './shared';
import type { DiscoveryResult, FeatureModule } from './types';
import type { StoryModule } from '@handoff/story-types';

// Re-export the contract so features can import types from `@handoff/discovery`.
export type * from './types';

export function discover(): DiscoveryResult {
  const stories = import.meta.glob('/src/**/*.stories.tsx', {
    eager: true,
  }) as Record<string, StoryModule>;

  const features = import.meta.glob('/src/**/*.feature.ts', {
    eager: true,
  }) as Record<string, { default: FeatureModule }>;

  const specs = import.meta.glob('/src/**/{README,UXD}.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  }) as Record<string, string>;

  const raw: RawMaps = { stories, features, specs };
  return assembleFeatures(raw);
}
