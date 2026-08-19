// Story types — a tiny story format. A `*.stories.tsx` file default-exports
// page metadata and named-exports the pages themselves.

import type { ReactElement, ReactNode } from 'react';

export interface StoryMeta {
  /** Page title, shown as the sidebar leaf. */
  title: string;
  /** Optional group inside the feature, e.g. "Flow", "UI", "Components". */
  section?: string;
  /** Optional status badge on the sidebar leaf. */
  status?: string;
  /** Ordering hint within a feature / section. */
  order?: number;
}

/** One part in a component's "Composed of" list. */
export interface AnatomyPart {
  name: string;
  description: string;
}

/** One row in the component's props table. */
export interface SpecProp {
  name: string;
  type: string;
  default?: string;
  description?: string;
  required?: boolean;
}

/** One measured value, e.g. "Control height — 32px". */
export interface SpecMeasure {
  name: string;
  value: string;
  description?: string;
}

/** One design token the component depends on. */
export interface SpecToken {
  token: string;
  description?: string;
}

/* -- Accessibility -------------------------------------------------------- */

/** One heading in the outline, so the document structure is reviewable. */
export interface A11yHeading {
  /**
   * 1–6. The point is the sequence, so gaps are visible.
   *
   * 0 means "this contributes no heading" — worth stating rather than leaving
   * the section empty, so a reader can tell it was considered.
   */
  level: number;
  text: string;
  note?: string;
}

/** One stop in the tab sequence. */
export interface A11yStop {
  /** What receives focus, in the reader's words. */
  target: string;
  /** What a screen reader says when it lands there. */
  announced: string;
  note?: string;
  /**
   * Where this stop sits on the preview, 0–100 (%). Given both, the stop gets
   * a numbered marker on the component itself — a tab sequence is a path
   * across a layout, and a table cannot show whether that path zig-zags.
   */
  x?: number;
  y?: number;
  /** A stop that exists in the handoff but not in the product, or vice versa. */
  skipped?: boolean;
}

/** An accessible name, and where it comes from. */
export interface A11yName {
  element: string;
  /** ARIA role, implicit or explicit. */
  role: string;
  /** The accessible name itself. */
  name: string;
  /** What supplies it — a visible label, aria-label, the content. */
  source: string;
}

/** How the thing behaves under a viewport or zoom condition. */
export interface A11yAdaptation {
  /** e.g. "400% zoom", "320px wide". */
  condition: string;
  behaviour: string;
  verdict?: 'pass' | 'concern' | 'fail';
}

/**
 * What a keyboard, a screen reader and a resized viewport make of something.
 *
 * Attached to a component or to the flow as a whole. Four dimensions, because
 * these are the ones that get missed: the heading outline, the tab sequence,
 * the accessible names, and what happens when the viewport is not what the
 * design assumed.
 */
export interface AccessibilitySpec {
  summary?: string;
  /**
   * The live thing the tab order is describing. Given one, the stops that
   * carry coordinates are drawn on it in order.
   */
  preview?: ReactNode;
  headings?: A11yHeading[];
  tabOrder?: A11yStop[];
  names?: A11yName[];
  adaptation?: A11yAdaptation[];
}

/** The component spec rendered in the right-hand pane. */
export interface ComponentSpec {
  description?: string;
  measurements?: SpecMeasure[];
  anatomy?: AnatomyPart[];
  props?: SpecProp[];
  tokens?: SpecToken[];
  notes?: string[];
}

/** A page is a render function returning a React element. */
export type Story = (() => ReactElement) & {
  storyName?: string;
  /** Markdown shown in the right-hand pane when there is no structured spec. */
  notes?: string;
  spec?: ComponentSpec;
};

export interface StoryModule {
  default: StoryMeta;
  [namedExport: string]: StoryMeta | Story;
}

/** Narrow a module export to a Story (a callable that isn't the meta object). */
export function isStory(value: unknown): value is Story {
  return typeof value === 'function';
}
