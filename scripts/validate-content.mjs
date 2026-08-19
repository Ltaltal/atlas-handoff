// Checks the feature content files that the site renders but does not police.
//
// Two jobs. First, structure: does each entry match its schema. Second, and
// more usefully, the things a schema cannot express — that ids are unique, and
// that every `affects` label points at a page this feature actually exports.
// That last one is the whole reason this script exists: a note pointing at a
// page that does not exist fails silently, and quietly breaks the cross-linking
// the handoff is built on.
//
// Deliberately dependency-free. The schema subset below is only what these
// schemas use; if they grow past it, that is the moment to reach for `ajv`.
//
//   yarn handoff:validate

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const featuresDir = join(root, 'src', 'features');

const problems = [];
const report = (file, path, message) => problems.push({ file, path, message });

/* ---------------------------------------------------------------- schema -- */

const typeOf = (value) =>
  Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;

/** A deliberately small JSON Schema subset: enough for these two schemas. */
function checkSchema(value, schema, file, path, rootSchema) {
  if (schema.$ref) {
    const target = schema.$ref
      .replace(/^#\//, '')
      .split('/')
      .reduce((node, key) => node?.[key], rootSchema);
    if (!target) return report(file, path, `schema $ref not found: ${schema.$ref}`);
    return checkSchema(value, target, file, path, rootSchema);
  }

  if (schema.enum && !schema.enum.includes(value)) {
    return report(
      file,
      path,
      `${JSON.stringify(value)} is not one of: ${schema.enum.join(', ')}`,
    );
  }

  if (schema.type && typeOf(value) !== schema.type) {
    return report(file, path, `expected ${schema.type}, found ${typeOf(value)}`);
  }

  if (schema.type === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      report(file, path, 'must not be empty');
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      report(file, path, `${JSON.stringify(value)} does not match ${schema.pattern}`);
    }
    if (schema.format === 'uri') {
      try {
        new URL(value);
      } catch {
        report(file, path, `${JSON.stringify(value)} is not a valid URL`);
      }
    }
    return;
  }

  if (schema.type === 'array') {
    value.forEach((item, index) =>
      checkSchema(item, schema.items, file, `${path}[${index}]`, rootSchema),
    );
    return;
  }

  if (schema.type === 'object') {
    for (const key of schema.required ?? []) {
      if (value[key] === undefined) report(file, path, `missing required field: ${key}`);
    }
    for (const [key, child] of Object.entries(value)) {
      const childSchema = schema.properties?.[key];
      if (!childSchema) {
        if (schema.additionalProperties === false) {
          report(file, path, `unknown field: ${key}`);
        }
        continue;
      }
      checkSchema(child, childSchema, file, path === '' ? key : `${path}.${key}`, rootSchema);
    }
  }
}

/* -------------------------------------------------------------- semantics -- */

/** Every page title a feature exports, read from its `StoryMeta` declarations. */
function pageTitles(featureDir) {
  const titles = new Set();
  for (const entry of readdirSync(featureDir)) {
    if (!entry.endsWith('.stories.tsx')) continue;
    const source = readFileSync(join(featureDir, entry), 'utf8');
    const meta = source.match(/const meta:\s*StoryMeta\s*=\s*\{[\s\S]*?\}/);
    const title = meta?.[0].match(/title:\s*'([^']+)'/);
    if (title) titles.add(title[1]);
  }
  return titles;
}

function checkIds(entries, file) {
  const seen = new Map();
  entries.forEach((entry, index) => {
    if (typeof entry?.id !== 'string') return;
    if (seen.has(entry.id)) {
      report(
        file,
        `[${index}]`,
        `duplicate id "${entry.id}", already used at [${seen.get(entry.id)}]`,
      );
    }
    seen.set(entry.id, index);
  });
}

function checkAffects(notes, titles, file) {
  notes.forEach((note, index) => {
    for (const label of note?.affects ?? []) {
      if (!titles.has(label)) {
        const known = [...titles].sort().join(', ');
        report(
          file,
          `[${index}].affects`,
          `"${label}" is not a page in this feature. Known pages: ${known}`,
        );
      }
    }
  });
}

function checkDates(notes, file) {
  notes.forEach((note, index) => {
    if (typeof note?.date !== 'string') return;
    // Date() silently rolls impossible days over — 2026-02-30 becomes March 2 —
    // so the only reliable check is that the date it parsed is the one written.
    const parsed = new Date(`${note.date}T00:00:00Z`);
    const roundTrips =
      !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === note.date;
    if (!roundTrips) {
      report(file, `[${index}].date`, `"${note.date}" is not a real date`);
    }
  });
}

/* ------------------------------------------------------------------- run -- */

const schemas = {
  notes: JSON.parse(readFileSync(join(root, 'schemas', 'notes.schema.json'), 'utf8')),
  links: JSON.parse(readFileSync(join(root, 'schemas', 'links.schema.json'), 'utf8')),
};

let filesChecked = 0;
let entriesChecked = 0;

for (const feature of readdirSync(featuresDir)) {
  const featureDir = join(featuresDir, feature);
  if (!statSync(featureDir).isDirectory()) continue;
  const titles = pageTitles(featureDir);

  for (const kind of ['notes', 'links']) {
    const file = join(featureDir, `${kind}.json`);
    if (!existsSync(file)) continue;
    const label = `src/features/${feature}/${kind}.json`;
    filesChecked += 1;

    let content;
    try {
      content = JSON.parse(readFileSync(file, 'utf8'));
    } catch (error) {
      report(label, '', `not valid JSON: ${error.message}`);
      continue;
    }

    checkSchema(content, schemas[kind], label, '', schemas[kind]);

    const entries = content[kind];
    if (!Array.isArray(entries)) continue;
    entriesChecked += entries.length;

    checkIds(entries, label);
    if (kind === 'notes') {
      checkAffects(entries, titles, label);
      checkDates(entries, label);
    }
  }
}

/* ------------------------------------------------- generated prompt -- */

/**
 * The agent prompt is built from handoff/interview.json, so it is a second
 * copy of those questions — the kind that goes stale quietly. Rebuild it here
 * and compare, so a change to the questions cannot be half-applied.
 */
const promptPath = join(root, '.github', 'prompts', 'new-feature.prompt.md');
const promptLabel = '.github/prompts/new-feature.prompt.md';

if (existsSync(promptPath)) {
  const { currentPrompt } = await import('./new-feature.mjs');
  if (readFileSync(promptPath, 'utf8') !== currentPrompt()) {
    report(
      promptLabel,
      '',
      'Out of date with handoff/interview.json. Regenerate it:\n      yarn handoff:new --emit-prompt > ' +
        promptLabel,
    );
  }
} else {
  report(promptLabel, '', 'Missing. Generate it with `yarn handoff:new --emit-prompt`.');
}

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s) in feature content:\n`);
  for (const { file, path, message } of problems) {
    console.error(`  ${file}${path ? ` ${path}` : ''}\n    ${message}`);
  }
  console.error('');
  process.exit(1);
}

console.log(
  `Content OK — ${entriesChecked} entries across ${filesChecked} file(s), and the generated prompt is current.`,
);
