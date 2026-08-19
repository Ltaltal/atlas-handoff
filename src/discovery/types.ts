// Discovery types — the contract every discovery implementation shares. The
// rest of the app imports only from `@handoff/discovery`, which the bundler
// config aliases. This is the only bundler-specific surface.

import type { StoryModule } from '@handoff/story-types';

/**
 * A headline entry on the hub: one of the things this feature's handoff
 * answers, and where to go to read it.
 */
export interface FeatureHighlight {
  label: string;
  hint: string;
  /** Icon name understood by the hub. */
  icon?: string;
  /** Page label to open. */
  page?: string;
  /** Open the feature's markdown context page instead of a page. */
  context?: boolean;
}

/** A registered `*.feature.ts` metadata module. */
export interface FeatureModule {
  /** Machine id, unique. Used by the __HANDOFF_FEATURE__ focus filter. */
  id: string;
  title: string;
  designer?: string;
  description?: string;
  /** e.g. "wip" | "review" | "ready". */
  status?: string;
  /** When true, the feature is listed under ARCHIVED. */
  archived?: boolean;
  order?: number;
  /** Label for the markdown spec page. Defaults to "UXD". */
  specLabel?: string;
  highlights?: FeatureHighlight[];
}

export interface DiscoveredStory {
  path: string;
  /** Story-set title (from the default export). */
  title: string;
  module: StoryModule;
}

export interface DiscoveredFeature {
  /** Folder path relative to the discovery root. */
  path: string;
  id: string;
  meta?: FeatureModule;
  stories: DiscoveredStory[];
  /** Raw markdown spec (README.md / UXD.md) if present. */
  spec?: string;
}

export interface DiscoveryResult {
  features: DiscoveredFeature[];
}
