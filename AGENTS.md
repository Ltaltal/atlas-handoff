# AGENTS

Project-specific guidance for AI coding agents.

## What this is

**Atlas** is a fictional workspace-management product, and this repo is a demo
of how a design handoff for it can be structured. The product, the feature, the
people, the copy, the measurements and the sample data are all invented.

Call the product and its design system **Atlas**. Never introduce a real
product, company, person, team, ticket or dataset; new examples stay fictional
and links point at `example.com`.

## The design system

Atlas ships no stylesheet of its own — no CSS modules, no raw hex or px, no
`:root` token overrides. `src/ds/` is a thin translation layer: call sites ask
for a tone or a pixel size, and that folder maps it onto the underlying
component library. Swapping libraries means editing that folder, not every page.

That library is Astryx (MIT). It is a dependency, not a brand for this project,
so it appears only where a package name or a command has to be exact — as
below.

<!-- ASTRYX:START -->
Underlying library: Astryx v0.3.0 · 155 components
CLI: run every command as `yarn astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in your app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — discover, don't guess. Before writing UI:
1. `astryx build "<idea>"` — START HERE: returns a kit (closest [page] + [block]s + [component]s). No args = full playbook.
2. `astryx template <name> [--skeleton]` — scaffold the [page]/[block]s it named, or study their layout. Templates are reference code.
3. `astryx component <Name>` — props + examples for every component you use.

RULES:
- No <div> — components do all layout/spacing. Full page → AppShell; sidebar nav → SideNav.
- Frame first: pick the shell (AppShell / Layout+LayoutPanel) and budget regions in px BEFORE writing content (`astryx docs layout`).
- Dense data = rows (Table, List/Item) edge-to-edge — never Card-wrapped list items. Card = dashboard widgets, galleries, settings groups only.
- Status → StatusDot/Token; Badge only for counts and enumerated states, never decoration.
- Custom styling: component props first; else style/className with tokens — var(--color-*|--spacing-*|--radius-*). No raw hex/px. (No StyleX/Tailwind compiler here — don't use xstyle/utility classes.)
- Tokens for every value (`astryx docs tokens`). Brand/accent via `astryx theme` — never override --color-* in :root.
- SELF-CHECK before you finish: re-read the file and replace any raw <div>/<span> layout, imported .css/@apply, or hardcoded value (#hex, 16px) with the component or a token (var(--color-*|--spacing-*|…)). If unsure a component/prop exists, run `astryx component <Name>` / `astryx search "<thing>"`; don't hand-roll CSS.

MORE CLI:
  search "<query>"   find any component / hook / doc / template / block
  component --list   155 components by category
  template --list    page + block recipes
  docs <topic>       color, elevation, icons, illustrations, internationalization, layout, migration, motion, principles, shape, spacing, styling, theme, tokens, typography
  swizzle <Name>     eject component source for deep customization
  upgrade --apply    run after any @astryxdesign/core bump
<!-- ASTRYX:END -->

## Starting a feature

`yarn handoff:new` asks about it and writes the folder. The questions live in
`handoff/interview.json`, and both the Getting started page and
`.github/prompts/new-feature.prompt.md` read the same file — the prompt is
generated from it, and `yarn handoff:validate` fails if it is out of date.

Change a question there, then regenerate:

```bash
yarn handoff:new --emit-prompt > .github/prompts/new-feature.prompt.md
```

A feature appears as soon as it has a `README.md`, so a new one starts with its
context and nothing else. Do not scaffold a placeholder page: the first page
should be one someone wanted to write.

## Feature content — notes and links

Notes and links are **read-only in the site** and authored in the repo, so
recording a decision is a commit rather than a change only the author can see.

They live in JSON, one pair per feature:

```
src/features/<feature>/notes.json     decisions, open questions, risks, notes
src/features/<feature>/links.json     spec, research, design file, ticket
```

To add one, edit the JSON. Each file references its schema, so an editor will
autocomplete the fields and flag a wrong value as you type:

```
schemas/notes.schema.json
schemas/links.schema.json
```

Rules the schema does not enforce, and the validator does:

- `id` must be unique within the file, prefixed `n-` for notes and `l-` for
  links, kebab-case.
- `affects` on a note must name a page this feature actually exports — the
  `title` of a `StoryMeta` in one of its `*.stories.tsx` files. This is the easy
  one to get wrong: an unknown label silently breaks the cross-linking the
  handoff is built on.
- `date` is `YYYY-MM-DD` and must be a real date.

Run `yarn handoff:validate` after editing. It prints the known page names when
an `affects` label does not resolve.

Write a decision so it says what was decided **and what it costs**; the existing
entries are the model.
