// registry — flattens what discovery found into the navigation model the
// sidebar and hub render. Pure data, no React.
//
//   FEATURES
//     <feature>
//       Context            (the markdown spec, if present)
//       <section>          (pages grouped by meta.section)
//         <page> [status]
//       <ungrouped page>
//   ARCHIVED
//     <feature>

import { isStory, type ComponentSpec, type Story } from './story-types';
import type {
  DiscoveredFeature,
  DiscoveryResult,
  FeatureHighlight,
} from '../discovery/types';

export type { FeatureHighlight };

export interface PageLeaf {
  key: string;
  label: string;
  status?: string;
  render: Story;
  notes?: string;
  componentSpec?: ComponentSpec;
  order: number;
  section?: string;
}

export interface PageSection {
  label: string;
  pages: PageLeaf[];
  order: number;
}

export interface FeatureNode {
  id: string;
  title: string;
  description?: string;
  status?: string;
  designer?: string;
  archived: boolean;
  order: number;
  /** Raw markdown spec, if present. */
  spec?: string;
  /** Label for the spec page leaf. */
  specLabel: string;
  highlights: FeatureHighlight[];
  sections: PageSection[];
  /** Pages with no section, shown directly under the feature. */
  pages: PageLeaf[];
}

export interface NavModel {
  features: FeatureNode[];
  archived: FeatureNode[];
}

function leavesFrom(featureId: string, set: DiscoveredFeature['stories'][number]): PageLeaf[] {
  const meta = set.module.default;
  const setTitle = meta?.title ?? set.title;
  const order = meta?.order ?? 999;
  const named = Object.entries(set.module).filter(
    ([exportName, value]) => exportName !== 'default' && isStory(value),
  );
  const single = named.length === 1;

  return named.map(([exportName, value]) => {
    const story = value as Story;
    const name = story.storyName ?? humanize(exportName);
    const label = single || exportName === 'Default' ? setTitle : `${setTitle} · ${name}`;
    return {
      key: `${featureId}/${set.title}/${exportName}`,
      label,
      status: meta?.status,
      render: story,
      notes: story.notes,
      componentSpec: story.spec,
      order,
      section: meta?.section,
    };
  });
}

const byOrder = (a: { order: number; label: string }, b: { order: number; label: string }) =>
  a.order - b.order || a.label.localeCompare(b.label);

function toFeatureNode(feature: DiscoveredFeature): FeatureNode {
  const sectionMap = new Map<string, PageLeaf[]>();
  const ungrouped: PageLeaf[] = [];

  for (const set of feature.stories) {
    const section = set.module.default?.section;
    const leaves = leavesFrom(feature.id, set);
    if (section) {
      sectionMap.set(section, [...(sectionMap.get(section) ?? []), ...leaves]);
    } else {
      ungrouped.push(...leaves);
    }
  }

  const sections: PageSection[] = [...sectionMap.entries()]
    .map(([label, pages]) => {
      pages.sort(byOrder);
      return { label, pages, order: Math.min(...pages.map((page) => page.order)) };
    })
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));

  ungrouped.sort(byOrder);

  const meta = feature.meta;
  const archived = meta?.archived === true || meta?.status === 'archived';

  return {
    id: feature.id,
    title: meta?.title ?? feature.id,
    description: meta?.description,
    status: archived ? undefined : meta?.status,
    designer: meta?.designer,
    archived,
    order: meta?.order ?? 999,
    spec: feature.spec,
    specLabel: meta?.specLabel ?? 'UXD',
    highlights: meta?.highlights ?? [],
    sections,
    pages: ungrouped,
  };
}

export function buildNav(result: DiscoveryResult): NavModel {
  const nodes = result.features.map(toFeatureNode);
  const sort = (a: FeatureNode, b: FeatureNode) =>
    a.order - b.order || a.title.localeCompare(b.title);
  return {
    features: nodes.filter((node) => !node.archived).sort(sort),
    archived: nodes.filter((node) => node.archived).sort(sort),
  };
}

/** All pages of a feature in display order: sections first, then loose pages. */
export function featurePages(feature: FeatureNode): PageLeaf[] {
  return [...feature.sections.flatMap((section) => section.pages), ...feature.pages];
}

function humanize(exportName: string): string {
  return exportName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}
