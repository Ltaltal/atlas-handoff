# Copilot instructions — Atlas design handoff

This repo is a **demo of a code-based design handoff**, built around a fictional
product. Atlas is a made-up workspace-management app; the feature, the people,
the copy, the measurements and the sample data are all invented. It exists to
show *how* a handoff can be structured.

Read [`AGENTS.md`](../AGENTS.md) first — it holds the design-system rules and is
authoritative. This file covers the handoff format on top of them.

## Golden rules

- **Everything is fictional.** Never introduce a real product, company, person,
  team, ticket, URL or dataset. New examples must stay invented, and links
  should point at `example.com`.
- **One design system.** The site and the product screens inside it are built
  from the same open-source system. Nothing ships its own stylesheet: no CSS
  modules, no raw hex or px, no `:root` token overrides. `src/ds/` is a thin
  translation layer over the system — new primitives belong there, not inline.
- **Bundler-agnostic core.** The only bundler-specific code lives in
  `src/discovery/`. Import it through the `@handoff/discovery` alias.
- **Specs are measured, not intended.** Numbers in a spec must come from
  measuring the rendered component. If you change a component, re-measure.
- **Features are folders.** A feature under `src/features/<id>/` holds a
  `*.feature.ts`, a `README.md` for context, one or more `*.stories.tsx`, and
  its components. Folders starting with `_` are hidden.

## Conventions

- Stories: the `default` export is `StoryMeta` (`{ title, section?, status?,
  order? }`); named exports are render functions. `section` groups pages inside
  a feature; `status` renders a badge.
- Pages are discovered at build time, so adding a page is adding a file.
- Cross-linking is the point: use `@handoff/Related` so every page can reach the
  flow step, screen, component and reasoning it belongs to.
- Notes and links are authored in `notes.json` / `links.json` and are read-only
  in the site. Each points at a JSON Schema in `schemas/`.
- Component pages use `@handoff/storybook`: `ComponentDocs` > `Behavior` >
  `StorySection`. The spec goes in `Default.spec` and renders in the spec pane.

## Starting a feature

`yarn handoff:new` interviews the person and writes the folder. The questions
are in `handoff/interview.json`; the Getting started page and
`.github/prompts/new-feature.prompt.md` read that same file, and the prompt is
generated from it. After changing a question, regenerate it —
`yarn handoff:validate` fails if you forget.

## Checks before finishing

```bash
yarn typecheck
yarn handoff:validate
yarn build
```

All three must pass. Keep changes small and consistent with existing patterns.
