// Shared discovery assembly — bundler-independent. An implementation gathers
// three raw path->module maps and hands them here to build the result.

import type {
  DiscoveredFeature,
  DiscoveredStory,
  DiscoveryResult,
  FeatureModule,
} from './types';
import type { StoryModule } from '@handoff/story-types';

// Injected by the bundler.
declare const __HANDOFF_FEATURE__: string;

function folderOf(filePath: string): string {
  const normalized = filePath.replace(/^\.?\//, '');
  const idx = normalized.lastIndexOf('/');
  return idx === -1 ? '' : normalized.slice(0, idx);
}

function folderName(folder: string): string {
  const parts = folder.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? folder;
}

/** Files under an underscore-prefixed folder are runtime-only and hidden. */
function isHidden(filePath: string): boolean {
  return filePath
    .replace(/^\.?\//, '')
    .split('/')
    .some((segment) => segment.startsWith('_'));
}

export interface RawMaps {
  stories: Record<string, StoryModule>;
  features: Record<string, { default: FeatureModule }>;
  specs: Record<string, string>;
}

export function assembleFeatures(raw: RawMaps): DiscoveryResult {
  const byFolder = new Map<string, DiscoveredFeature>();

  const ensure = (folder: string): DiscoveredFeature => {
    let feature = byFolder.get(folder);
    if (!feature) {
      feature = { path: folder, id: folderName(folder), stories: [] };
      byFolder.set(folder, feature);
    }
    return feature;
  };

  for (const [path, mod] of Object.entries(raw.features)) {
    if (isHidden(path)) continue;
    const feature = ensure(folderOf(path));
    const meta = mod.default;
    if (meta) {
      feature.meta = meta;
      feature.id = meta.id || feature.id;
    }
  }

  for (const [path, mod] of Object.entries(raw.stories)) {
    if (!mod?.default) continue;
    if (isHidden(path)) continue;
    const feature = ensure(folderOf(path));
    const story: DiscoveredStory = {
      path,
      title: mod.default.title ?? folderName(folderOf(path)),
      module: mod,
    };
    feature.stories.push(story);
  }

  for (const [path, content] of Object.entries(raw.specs)) {
    if (isHidden(path)) continue;
    ensure(folderOf(path)).spec = content;
  }

  // A feature counts once it has something to show, which a written context is
  // as much as a page is. Requiring a story meant a new feature stayed
  // invisible until it had one, so scaffolding had to invent a placeholder
  // page whose only job was to satisfy this line.
  let features = [...byFolder.values()].filter((f) => f.stories.length > 0 || f.spec);
  features.sort((a, b) => featureLabel(a).localeCompare(featureLabel(b)));

  const focus = safeFocus();
  if (focus) {
    features = features.filter(
      (f) => f.id === focus || featureLabel(f).toLowerCase() === focus.toLowerCase(),
    );
  }

  return { features };
}

export function featureLabel(feature: DiscoveredFeature): string {
  return feature.meta?.title ?? feature.id;
}

function safeFocus(): string {
  try {
    return typeof __HANDOFF_FEATURE__ === 'string' ? __HANDOFF_FEATURE__ : '';
  } catch {
    return '';
  }
}
