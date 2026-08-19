// The pure half of scaffolding a feature: what the files say, and the prompt
// built from the questions. No file system and no terminal, so the Getting
// started page can import it and show exactly what the command would write.
//
// Kept beside interview.json rather than in scripts/, because both of the
// things in here are functions of those questions.

/** kebab-case id from a title, e.g. "Invite teammates" -> "invite-teammates". */
export const toId = (title) =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** PascalCase, for a component or story name. */
const toPascal = (title) =>
  title
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join('');

/** Escape a value for a single-quoted TypeScript string. */
const quote = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/* --------------------------------------------------------------- files -- */

/**
 * The files a new feature needs, as content rather than as writes, so the
 * Getting started page can show exactly what the command would produce.
 */
export function filesFor(answers) {
  const id = toId(answers.title);
  const name = toPascal(answers.title);
  // Not asked. Anything being scaffolded is in progress, and the badge is one
  // word to change once it is not.
  const status = 'wip';

  const files = {};

  files[`${id}.feature.ts`] = `import type { FeatureModule } from '@handoff/discovery';

const feature: FeatureModule = {
  id: ${quote(id)},
  title: ${quote(answers.title)},${answers.designer ? `\n  designer: ${quote(answers.designer)},` : ''}
  description: ${quote(answers.description)},
  status: ${quote(status)},
  specLabel: 'Context',
};

export default feature;
`;

  // No placeholder page. The feature is listed on the strength of its context,
  // so the first page someone writes is one they wanted to write.
  files['README.md'] = `# ${answers.title}

> ${answers.description}

${answers.designer ? `**Designer** ${answers.designer}\n\n` : ''}## The problem

${answers.problem}

## What we are doing about it

_Replace this with the shape of the answer, not the answer itself. The screens
say what it looks like; this says why it looks like that._
`;

  return { id, name, files };
}

/* -------------------------------------------------------------- prompt -- */

/** The agent prompt, built from the same questions the other surfaces ask. */
export function promptMarkdown(interview) {
  const lines = [
    // Frontmatter has to be the first thing in the file, so the note about
    // where this came from goes underneath it.
    '---',
    'mode: agent',
    `description: ${interview.title} — interview the designer, then scaffold the folder.`,
    '---',
    '',
    '<!-- Generated from handoff/interview.json by scripts/new-feature.mjs.',
    '     Run `yarn handoff:new --emit-prompt > .github/prompts/new-feature.prompt.md`',
    '     after changing the questions. `yarn handoff:validate` checks this is current. -->',
    '',
    `# ${interview.title}`,
    '',
    interview.summary ?? '',
    '',
    'Read [`AGENTS.md`](../../AGENTS.md) first and follow it — it holds the rules for',
    'this repo, and restating them here would only give them somewhere to drift to.',
    '',
    '## Ask these, one at a time',
    '',
    'Wait for each answer before asking the next. Tell them what the answer becomes;',
    'a question someone understands the point of gets a better answer.',
    '',
  ];

  interview.questions.forEach((question, index) => {
    lines.push(`${index + 1}. **${question.ask}**${question.required ? '' : ' _(optional)_'}`);
    lines.push(`   - ${question.why}`);
    if (question.options) lines.push(`   - One of: ${question.options.join(', ')}`);
    if (question.initial) lines.push(`   - Default: ${question.initial}`);
    if (question.placeholder) lines.push(`   - For example: ${question.placeholder}`);
    lines.push('');
  });

  lines.push(
    '## Then write the folder',
    '',
    'Create `src/features/<id>/`, where `<id>` is the feature name in kebab-case:',
    '',
    '| File | Holds |',
    '| --- | --- |',
    '| `<id>.feature.ts` | The metadata, with `specLabel: \'Context\'` |',
    '| `README.md` | The problem, rendered as the Context page |',
    '',
    'That is enough to appear in the navigation. Do not add a placeholder page:',
    'the first page should be one they actually wanted, not scaffolding.',
    '',
    'A new feature is `status: \'wip\'`. If it turns out to be a stepped flow, add',
    '`journey.ts` later — the step model belongs there so the flow map, the screens',
    'and the prototype all read one source.',
    '',
    'Running `yarn handoff:new` does all of this by asking the same questions, so',
    'prefer it when the person is at a terminal.',
    '',
    '## Finish',
    '',
    '```bash',
    'yarn typecheck',
    'yarn handoff:validate',
    'yarn build',
    '```',
    '',
    'Then tell them what you made and what to do next: prototype the screens in real',
    'components, and record decisions in `notes.json`.',
    '',
  );

  return lines.join('\n');
}
