---
mode: agent
description: Start a feature — interview the designer, then scaffold the folder.
---

<!-- Generated from handoff/interview.json by scripts/new-feature.mjs.
     Run `yarn handoff:new --emit-prompt > .github/prompts/new-feature.prompt.md`
     after changing the questions. `yarn handoff:validate` checks this is current. -->

# Start a feature

Four answers is enough to make a feature that renders. Status, the steps of a flow, components and notes are all things you add once you know them.

Read [`AGENTS.md`](../../AGENTS.md) first and follow it — it holds the rules for
this repo, and restating them here would only give them somewhere to drift to.

## Ask these, one at a time

Wait for each answer before asking the next. Tell them what the answer becomes;
a question someone understands the point of gets a better answer.

1. **What is the feature called?**
   - Becomes the folder id and the name everywhere in the handoff.
   - For example: Invite teammates

2. **One line: what is it?**
   - Shown on the overview tile, so it has to make sense on its own.
   - For example: Add people to a workspace and choose what they can do.

3. **Who is designing it?** _(optional)_
   - Named on the feature so a reader knows who to ask.
   - For example: Rowan Ellis

4. **What problem does it solve?**
   - Becomes the Context page — the one thing a handoff is most often missing.
   - For example: Sharing a workspace means sending a link and hoping. There is no way to see who has access.

## Then write the folder

Create `src/features/<id>/`, where `<id>` is the feature name in kebab-case:

| File | Holds |
| --- | --- |
| `<id>.feature.ts` | The metadata, with `specLabel: 'Context'` |
| `README.md` | The problem, rendered as the Context page |

That is enough to appear in the navigation. Do not add a placeholder page:
the first page should be one they actually wanted, not scaffolding.

A new feature is `status: 'wip'`. If it turns out to be a stepped flow, add
`journey.ts` later — the step model belongs there so the flow map, the screens
and the prototype all read one source.

Running `yarn handoff:new` does all of this by asking the same questions, so
prefer it when the person is at a terminal.

## Finish

```bash
yarn typecheck
yarn handoff:validate
yarn build
```

Then tell them what you made and what to do next: prototype the screens in real
components, and record decisions in `notes.json`.
