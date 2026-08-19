// Sidebar — builds the navigation as TreeList data. The tree itself is the
// design system's; this only decides what goes in it:
//
//   Overview
//   Getting started
//   FEATURES
//     <feature>
//       Context
//       <group>            e.g. "Flow", "UI", "Components", "Reviews"
//         <page>
//       <ungrouped page>   e.g. "Notes", "Links"
//   ARCHIVED

import { Badge } from '@ds';
import { Text } from '@astryxdesign/core/Text';
import type { ReactNode } from 'react';
import type { TreeListItemData } from '@astryxdesign/core/TreeList';
import type { NavModel, FeatureNode, PageLeaf } from '@handoff/registry';

export type Selection =
  | { kind: 'welcome' }
  | { kind: 'guide' }
  | { kind: 'spec'; featureId: string }
  | { kind: 'page'; featureId: string; key: string };

/** Which feature a selection belongs to, if any. */
function selectionFeatureId(selection: Selection): string | undefined {
  return selection.kind === 'welcome' || selection.kind === 'guide'
    ? undefined
    : selection.featureId;
}

export function selectionKey(selection: Selection): string {
  if (selection.kind === 'welcome') return 'welcome';
  if (selection.kind === 'guide') return 'guide';
  if (selection.kind === 'spec') return `spec:${selection.featureId}`;
  return selection.key;
}

/** First openable target for a feature: its spec page, else its first page. */
export function firstSelection(feature: FeatureNode): Selection {
  if (feature.spec) return { kind: 'spec', featureId: feature.id };
  const first = [...feature.sections.flatMap((s) => s.pages), ...feature.pages][0];
  return first ? { kind: 'page', featureId: feature.id, key: first.key } : { kind: 'welcome' };
}

const STATUS_TONE = {
  wip: 'warning',
  exploration: 'brand',
  review: 'info',
  ready: 'success',
  archived: 'neutral',
} as const;

function statusBadge(status?: string) {
  if (!status) return undefined;
  const tone = STATUS_TONE[status as keyof typeof STATUS_TONE] ?? 'neutral';
  return <Badge tone={tone}>{status}</Badge>;
}

export interface BuildTreeArgs {
  nav: NavModel;
  selection: Selection;
  onSelect: (selection: Selection) => void;
}

/**
 * Marks the current page in the tree.
 *
 * The tree's own selected state paints the muted background, which is the
 * exact colour of the panel it sits in here — a contrast of 1.00, so the
 * highlight cannot be seen. The theme is monochrome, so colour cannot carry it
 * either. Weight and a marker do, both from the item data rather than a
 * stylesheet.
 */
function navLabel(label: ReactNode, isSelected: boolean): ReactNode {
  if (!isSelected) return label;
  return <Text weight="semibold">{label}</Text>;
}

/** The whole navigation as tree data. */
export function buildTree({ nav, selection, onSelect }: BuildTreeArgs): TreeListItemData[] {
  const activeKey = selectionKey(selection);

  const pageItem = (feature: FeatureNode, page: PageLeaf): TreeListItemData => {
    const isSelected = activeKey === page.key;
    return {
      id: page.key,
      label: navLabel(page.label, isSelected),
      endContent: statusBadge(page.status),
      isSelected,
      onClick: () => onSelect({ kind: 'page', featureId: feature.id, key: page.key }),
    };
  };

  const featureItem = (feature: FeatureNode): TreeListItemData => {
    const children: TreeListItemData[] = [];

    if (feature.spec) {
      const specSelected = activeKey === `spec:${feature.id}`;
      children.push({
        id: `spec:${feature.id}`,
        label: navLabel(feature.specLabel, specSelected),
        isSelected: specSelected,
        onClick: () => onSelect({ kind: 'spec', featureId: feature.id }),
      });
    }
    for (const section of feature.sections) {
      children.push({
        id: `${feature.id}:${section.label}`,
        label: section.label,
        isExpanded: true,
        children: section.pages.map((page) => pageItem(feature, page)),
      });
    }
    for (const page of feature.pages) children.push(pageItem(feature, page));

    return {
      id: `feature:${feature.id}`,
      label: feature.title,
      endContent: statusBadge(feature.status),
      isExpanded: true,
      children,
    };
  };

  const items: TreeListItemData[] = [
    {
      id: 'welcome',
      label: navLabel('Overview', activeKey === 'welcome'),
      isSelected: activeKey === 'welcome',
      onClick: () => onSelect({ kind: 'welcome' }),
    },
    {
      id: 'guide',
      label: navLabel('Getting started', activeKey === 'guide'),
      isSelected: activeKey === 'guide',
      onClick: () => onSelect({ kind: 'guide' }),
    },
    {
      id: 'section:features',
      label: 'Features',
      isExpanded: true,
      children: nav.features.map(featureItem),
    },
  ];

  if (nav.archived.length > 0) {
    items.push({
      id: 'section:archived',
      label: 'Archived',
      isExpanded: true,
      // Archived features collapse to one row, so that row is what gets
      // marked when any page inside them is open.
      children: nav.archived.map((feature) => {
        const isSelected = selectionFeatureId(selection) === feature.id;
        return {
          id: `archived:${feature.id}`,
          label: navLabel(feature.title, isSelected),
          endContent: statusBadge('archived'),
          isSelected,
          onClick: () => onSelect(firstSelection(feature)),
        };
      }),
    });
  }

  return items;
}
