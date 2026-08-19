// notes — the shape of everything written down about a feature that isn't a
// screen or a component: what was decided, what is still open, what was
// observed, and what might bite.
//
// One list, four kinds. Keeping them together means a reader sees the state of
// the thinking in one place instead of three documents.

import type { IconName } from '@ds';

export type NoteKind = 'decision' | 'question' | 'risk' | 'note';

export interface NoteReference {
  label: string;
  url: string;
}

export interface Note {
  id: string;
  kind: NoteKind;
  title: string;
  body: string;
  author: string;
  /** ISO date. */
  date: string;
  /** Short state, e.g. "needs research". Most useful on questions and risks. */
  status?: string;
  /** Optional external reference. */
  reference?: NoteReference;
  /** Page labels this note governs, rendered as jump links. */
  affects?: string[];
}

export interface NoteKindMeta {
  label: string;
  /** Plural, for filter chips. */
  plural: string;
  icon: IconName;
  /** CSS custom property holding this kind's colour. */
  color: string;
  /** Placeholder shown in the composer for this kind. */
  prompt: string;
}

export const NOTE_KINDS: Record<NoteKind, NoteKindMeta> = {
  decision: {
    label: 'Decision',
    plural: 'Decisions',
    icon: 'scales',
    color: 'var(--kind-decision)',
    prompt: 'What was decided, and what does it cost?',
  },
  question: {
    label: 'Open question',
    plural: 'Open questions',
    icon: 'question',
    color: 'var(--kind-question)',
    prompt: 'What do we need to know, and who can answer it?',
  },
  risk: {
    label: 'Risk',
    plural: 'Risks',
    icon: 'alertCircle',
    color: 'var(--kind-specs)',
    prompt: 'What could go wrong, and how would we notice?',
  },
  note: {
    label: 'Note',
    plural: 'Notes',
    icon: 'lightbulb',
    color: 'var(--kind-context)',
    prompt: 'What did we learn?',
  },
};

export const NOTE_KIND_ORDER: NoteKind[] = ['decision', 'question', 'risk', 'note'];

/** "2026-03-12" -> "12 Mar". Falls back to the raw value if unparseable. */
export function formatNoteDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
