// useFlowPlayer — the flow engine, with no UI attached. Owns the current index,
// play/pause, the auto-advance timer and which beats are visible. Pair it with
// FlowPlayer or build a custom surface on top.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FlowBeat, FlowDefinition, FlowPlayerState } from './flowTypes';

export interface UseFlowPlayerOptions {
  /** Start playing immediately. Default true. */
  autoPlay?: boolean;
}

export interface FlowPlayerControls extends FlowPlayerState {
  play(): void;
  pause(): void;
  toggle(): void;
  next(): void;
  prev(): void;
  restart(): void;
  goTo(index: number): void;
}

function computeVisible(beats: FlowBeat[], index: number): FlowBeat[] {
  // Walk back to the last "replace" boundary.
  let start = 0;
  for (let i = index; i >= 0; i--) {
    if ((beats[i]?.mode ?? 'append') === 'replace') {
      start = i;
      break;
    }
  }
  return beats.slice(start, index + 1);
}

export function useFlowPlayer(
  flow: FlowDefinition,
  { autoPlay = true }: UseFlowPlayerOptions = {},
): FlowPlayerControls {
  const beats = flow.beats;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const atEnd = index >= beats.length - 1;

  const goTo = useCallback(
    (next: number) => setIndex(Math.max(0, Math.min(next, beats.length - 1))),
    [beats.length],
  );

  const next = useCallback(() => {
    setIndex((current) => {
      if (current >= beats.length - 1) return flow.loop ? 0 : current;
      return current + 1;
    });
  }, [beats.length, flow.loop]);

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => setPlaying((value) => !value), []);
  const restart = useCallback(() => {
    clear();
    setIndex(0);
    setPlaying(true);
  }, [clear]);

  useEffect(() => {
    clear();
    if (!playing) return;
    const hold = beats[index]?.hold ?? 0;
    if (hold <= 0) return;
    if (atEnd && !flow.loop) return;
    timer.current = setTimeout(next, hold);
    return clear;
  }, [playing, index, beats, atEnd, flow.loop, next, clear]);

  const visible = useMemo(() => computeVisible(beats, index), [beats, index]);

  return { index, playing, visible, atEnd, play, pause, toggle, next, prev, restart, goTo };
}
