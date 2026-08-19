// The Create a workspace journey — the single source of truth for the step
// model. The flow map, the screens, the prototype and the status board all read
// from here, so a step can never drift between pages.

import { useSyncExternalStore } from 'react';

export interface JourneyStep {
  id: string;
  /** Step name as it appears everywhere in the handoff. */
  title: string;
  /** One line: what happens here. */
  summary: string;
  /** What the person is trying to achieve at this step. */
  goal: string;
  /**
   * The components the step's screen is assembled from. Named once here so the
   * IA map and the "Built from" rail cannot disagree about what a screen uses.
   */
  components: string[];
  /** What the step actually collects. A step that collects nothing is skippable. */
  collects?: { name: string; type: string }[];
  /** Why the step is the way it is, shown on the IA map. */
  note?: string;
}

export const STEPS: JourneyStep[] = [
  {
    id: 'details',
    title: 'Workspace details',
    summary: 'Name it and choose Personal or Team.',
    goal: 'Give the workspace an identity in as few decisions as possible.',
    note: 'The only step with a required input.',
    components: ['SetupStepper', 'NameField', 'OptionCard'],
    collects: [
      { name: 'name', type: 'string · required · unique per organization' },
      { name: 'type', type: "'personal' | 'team' · defaults to team" },
    ],
  },
  {
    id: 'configure',
    title: 'Configure',
    summary: 'Set visibility and invite people.',
    goal: 'Decide who can see and join, without blocking on it.',
    note: 'Skippable. A skipped workspace is Private with no invites.',
    components: ['SetupStepper', 'OptionCard'],
    collects: [
      { name: 'visibility', type: "'private' | 'shared' · defaults to private" },
      { name: 'members', type: 'string[] · may be empty' },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    summary: 'Confirm everything before it is created.',
    goal: 'Catch mistakes while they are still free to fix.',
    note: 'The commit point. Nothing exists before this.',
    components: ['SetupStepper'],
  },
  {
    id: 'complete',
    title: 'Complete',
    components: ['SetupStepper'],
    summary: 'Workspace is ready to open.',
    goal: 'Land somewhere useful instead of an empty screen.',
  },
];

export const STEP_TITLES = STEPS.map((step) => step.title);

/**
 * Which step the reader last selected. Shared between the journey map, the
 * screens page and the component pages, so choosing a step in one place lands
 * on the same step everywhere else.
 */
let activeStep = 0;
const listeners = new Set<() => void>();

export function setActiveStep(index: number): void {
  activeStep = Math.max(0, Math.min(index, STEPS.length - 1));
  listeners.forEach((listener) => listener());
}

/**
 * Select a step by id. Component pages use this to say which step they belong
 * to; an index would be a second place to update whenever the flow changes,
 * and a wrong one fails quietly by landing on the wrong screen.
 */
export function setActiveStepById(id: string): void {
  const index = STEPS.findIndex((step) => step.id === id);
  if (index >= 0) setActiveStep(index);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const snapshot = () => activeStep;

export function useActiveStep(): number {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/** Sample content used across the screens and the prototype. */
export const SAMPLE = {
  workspaceName: 'Harbor Launch',
  takenName: 'Field Research',
  owner: 'Maya Restrepo',
  members: ['Devon Park', 'Priya Nair', 'Sam Okoye'],
};
