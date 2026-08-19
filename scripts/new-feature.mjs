// Starts a feature by asking about it.
//
// The questions live in handoff/interview.json, not here, because the Getting
// started page asks the same ones and the agent prompt is generated from them.
// A second copy of a question list is the copy that goes stale.
//
// Deliberately dependency-free, like the validator beside it.
//
//   yarn handoff:new                 ask, then write the folder
//   yarn handoff:new --emit-prompt   print the agent prompt built from the same file
//
// A note on what gets written: a feature is only listed once it exports a
// page, so this writes a starter story as well as the metadata and the
// context. Scaffolding a folder that does not appear would be a poor first
// five minutes.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { filesFor, promptMarkdown } from '../handoff/scaffold.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const interview = JSON.parse(
  readFileSync(join(root, 'handoff', 'interview.json'), 'utf8'),
);

/** The prompt for the questions as they stand. Re-exported for the validator. */
export const currentPrompt = () => promptMarkdown(interview);

const splitList = (value) =>
  value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

/* ----------------------------------------------------------------- run -- */

async function ask(rl, question) {
  const hint = question.options
    ? ` (${question.options.join(' / ')})`
    : question.placeholder
      ? ` e.g. ${question.placeholder}`
      : '';

  for (;;) {
    console.log(`\n${question.ask}${hint}`);
    console.log(`  ${question.why}`);
    const raw = await rl.question(question.initial ? `> [${question.initial}] ` : '> ');
    const value = (raw ?? '').trim() || question.initial || '';

    if (!value && question.required) {
      console.log('  Needed for the feature to make sense. Try again.');
      continue;
    }
    if (value && question.options && !question.options.includes(value)) {
      console.log(`  Has to be one of: ${question.options.join(', ')}`);
      continue;
    }
    return question.kind === 'list' ? splitList(value) : value;
  }
}

async function main() {
  if (process.argv.includes('--emit-prompt')) {
    stdout.write(currentPrompt());
    return;
  }

  console.log(`\n${interview.title}\n`);
  if (interview.summary) console.log(`${interview.summary}\n`);

  const rl = createInterface({ input: stdin, output: stdout });

  // Without this, closing the input mid-interview leaves the question promise
  // unsettled and the process exits with a warning and no explanation.
  let closed = false;
  rl.on('close', () => {
    closed = true;
  });

  const answers = {};
  try {
    for (const question of interview.questions) {
      answers[question.id] = await ask(rl, question);
      if (closed) {
        console.error('\nInput ended before the interview finished. Nothing written.');
        process.exit(1);
      }
    }
  } finally {
    rl.close();
  }

  const { id, files } = filesFor(answers);
  const dir = join(root, 'src', 'features', id);

  if (existsSync(dir)) {
    console.error(`\nsrc/features/${id} already exists. Nothing written.`);
    process.exit(1);
  }

  mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, name), content);
  }

  console.log(`\nWrote src/features/${id}/`);
  for (const name of Object.keys(files)) console.log(`  ${name}`);
  console.log('\nRun `yarn dev` and it will be in the navigation.\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
