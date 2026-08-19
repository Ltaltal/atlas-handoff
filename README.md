# Atlas — Design Handoff

A template for code-based design handoffs, with a **worked example** built in.

Atlas is an example workspace-management feature — the product, the copy, the
measurements and the sample data are illustrative, there to make the structure
concrete. You keep the template and replace the example with your own feature:
the pages, cross-links, specs and boards stay, and the content becomes yours.

```bash
yarn
yarn dev        # http://localhost:5180
```

## The idea

Vibe coding gets you a working feature in an afternoon. What it does not get
you is the thing a designer used to make **before** the code existed — the
flow, the states nobody remembers until support asks about them, the
measurements, and the reasoning.

In the old workflow that artefact came first and the code followed it. Now the
code comes first, and the artefact never gets made at all. The problem is not
that design thinking is scattered. It is that it is missing.

This is that artefact, produced **from** the code instead of beside it.

- **It cannot go stale.** Specs are measured from the running component, and
  the accessibility and heuristic reviews are read off the real screens every
  time the page loads. A design file drifts the moment someone edits the code;
  this is generated from it.
- **It is built from your components.** The prototype imports the product's
  real components through `src/ds/`, so a component moves between the prototype
  and the app rather than being redrawn on a canvas.
- **Exploration stays with the decision.** Directions are marked chosen,
  parked or dropped, so the alternative that lost is next to the thing that
  shipped.

What it holds, each part **linked to the others**:

| | |
| --- | --- |
| **Context** | Why the feature exists and the problem it solves |
| **Flow** | The end-to-end journey, and a prototype that plays it |
| **UI** | The screen behind every step, including error and loading states |
| **Behavior** | How each component actually works, and its edge cases |
| **Specs** | Sizes, spacing and tokens, next to the live component |
| **Notes** | Decisions, open questions and risks, filtered by kind |
| **Links** | The spec, the research, the design file, the ticket |

Every page carries a "Connected to" rail, so you can move from a flow step to
the screen that implements it, to the component it is built from, to that
component's specs, and back to the reasoning — without leaving the site.
Selecting a step in one place selects it everywhere, so the flow and the UI can
never disagree.

## Notes and links come from the repo

**Notes** (decisions, open questions, risks, observations) and **Links** (the
spec, the research, the design file, the ticket) are read-only in the site and
authored in `src/features/<feature>/notes.json` and `links.json`.

That is deliberate. A handoff is a document, and the repo is what everyone
shares: recording a decision is a commit, so it reaches the whole team, shows
up in review, and is still there in a deployment. An in-browser composer would
only ever have written to the browser it was typed in.

Adding one is a small, structured edit — the kind a coding agent can make
reliably, which is the intended workflow. Each file points at a JSON Schema, so
the editor autocompletes the fields and rejects a wrong `kind` before anything
runs, and `yarn handoff:validate` catches what a schema cannot express:

```bash
yarn handoff:validate
```

- ids are unique
- every `affects` label names a page the feature really exports
- dates and URLs parse

That `affects` check is the one that earns its keep: a note pointing at a page
that does not exist fails silently, and quietly breaks the cross-linking.

## Starting a feature

Three ways in, all asking the same questions from `handoff/interview.json`, so
they cannot ask different ones:

```bash
yarn handoff:new     # answer in the terminal, and it writes the folder
```

Or open **Getting started** in the site and answer there — it shows the files
rather than writing them, because the site is read-only on purpose. Or point a
coding agent at `.github/prompts/new-feature.prompt.md`, which is generated
from the same file and checked by `yarn handoff:validate`.

## How it is organised

```
src/
  ds/          the Atlas design system — tokens and primitives
  _lib/        the handoff kit — flow player, journey map, redlines,
               spec pane, notes and links boards, cross-page navigation
  discovery/   the only bundler-specific code
  features/    the example Atlas content
```

A feature is a folder under `src/features/<id>/`:

| File | Purpose |
| --- | --- |
| `*.feature.ts` | Feature metadata and the hub entry points |
| `README.md` | The written context, rendered as the Context page |
| `*.stories.tsx` | One page each — flow, screens, components, notes, links |
| `*.tsx` | The components themselves |

Pages are discovered at build time, so adding a page is adding a file.

## The Atlas design system

The site and the Atlas screens inside it are built from the same components, so
the handoff is made of the same parts as the thing it documents. Nothing here
ships its own stylesheet.

- **Tokens** — colour, type, space and radius come from the system. Light and
  dark are the same token names with different values, so switching themes is
  one attribute on `<html>`.
- **`src/ds/`** — a thin translation layer, not a component library. Call sites
  ask for a tone or a pixel size; the underlying library speaks in variants and
  named steps. That mapping lives in one folder.

Point `src/ds/` at your own components and the documented product becomes
yours: the screens, the states and the measured specs are all built from what
you export there. The site's own chrome — navigation, panels, tables — keeps
using the library directly, so adopting this means taking on that dependency
for the shell. Replacing it everywhere is a bigger job than editing one folder,
and it is worth being clear about that.

Atlas is built on [Astryx](https://github.com/facebook/astryx) (MIT).

## Stack

React + TypeScript, built with Vite.
