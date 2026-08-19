// The typed boundary over this feature's content.
//
// The notes and links themselves live in `notes.json` and `links.json`, which
// is what makes them safe to edit: JSON is structured enough for an agent to
// append to without rewriting code, diffs stay readable, and the `$schema`
// reference in each file gives autocomplete and inline validation in the
// editor. `yarn handoff:validate` checks the rest.
//
// The interfaces stay the source of truth for shape; this file is where the
// two meet.

import type { Note } from '@handoff/notes';
import type { ResourceLink } from '@handoff/links';
import notesContent from './notes.json';
import linksContent from './links.json';

export const notes = notesContent.notes as Note[];
export const links = linksContent.links as ResourceLink[];
