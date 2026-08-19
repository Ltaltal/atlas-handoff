// links — the external references a handoff points at. Everything that lives
// outside this site but is needed to understand it: the product spec, research,
// the design file, the tracking ticket.
//
// Kept in one place so nobody has to go looking through chat history for the
// spec URL.

import type { IconName } from '@ds';

export type LinkKind = 'spec' | 'research' | 'design' | 'ticket' | 'doc';

export interface ResourceLink {
  id: string;
  kind: LinkKind;
  label: string;
  url: string;
  /** One line on why this is worth opening. */
  note?: string;
  owner?: string;
}

export interface LinkKindMeta {
  label: string;
  icon: IconName;
  color: string;
}

export const LINK_KINDS: Record<LinkKind, LinkKindMeta> = {
  spec: { label: 'Product spec', icon: 'board', color: 'var(--kind-ui)' },
  research: { label: 'Research', icon: 'lightbulb', color: 'var(--kind-context)' },
  design: { label: 'Design file', icon: 'window', color: 'var(--kind-flow)' },
  ticket: { label: 'Ticket', icon: 'flow', color: 'var(--kind-behavior)' },
  doc: { label: 'Doc', icon: 'folder', color: 'var(--kind-decision)' },
};

export const LINK_KIND_ORDER: LinkKind[] = ['spec', 'research', 'design', 'ticket', 'doc'];

/** "https://example.com/specs/x?y=1" -> "example.com/specs/x" */
export function prettyUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.host}${parsed.pathname}`.replace(/\/$/, '');
  } catch {
    return url;
  }
}
