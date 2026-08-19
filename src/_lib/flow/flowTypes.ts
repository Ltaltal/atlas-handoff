// flowTypes — the data model for a flow: an ordered list of beats that reveal or
// replace UI over time, like frames in a prototype.

import type { ReactNode } from 'react';

export interface FlowBeat {
  id: string;
  content: ReactNode;
  /**
   * How the beat sits on the surface:
   *  - "append": add below previous beats
   *  - "replace": clear the surface and show only this beat
   */
  mode?: 'append' | 'replace';
  /** Auto-advance delay in ms. Omit for manual advance only. */
  hold?: number;
  /** Label shown on the scrubber. */
  label?: string;
}

export interface FlowDefinition {
  id: string;
  title?: string;
  beats: FlowBeat[];
  /** Loop back to the first beat after the last. */
  loop?: boolean;
}

export interface FlowPlayerState {
  index: number;
  playing: boolean;
  /** Beats currently on the surface, respecting append/replace. */
  visible: FlowBeat[];
  atEnd: boolean;
}
