// Swap — shows one of several things in a box that stays the height of the
// tallest, so what sits underneath never moves.
//
// The obvious fix is a min-height, but that is a number someone has to
// re-measure every time the content changes, and it will be wrong quietly.
// Stacking every option in one grid cell lets the browser do it: the cell is
// as tall as its tallest child whatever that turns out to be.
//
// Hidden options keep their space but leave the tab order and the accessibility
// tree, which `visibility: hidden` gives for free.

import { Grid } from '@astryxdesign/core/Grid';
import type { ReactNode } from 'react';

export interface SwapProps {
  /** Every option, in a stable order. */
  items: ReactNode[];
  /** Which one is showing. */
  activeIndex: number;
  /** Centres each option in the reserved space. */
  hAlign?: 'start' | 'center';
}

export function Swap({ items, activeIndex, hAlign = 'start' }: SwapProps) {
  return (
    <Grid columns={1}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={index}
            aria-hidden={!isActive}
            style={{
              gridArea: '1 / 1',
              visibility: isActive ? 'visible' : 'hidden',
              justifySelf: hAlign === 'center' ? 'center' : 'stretch',
              minWidth: 0,
            }}
          >
            {item}
          </div>
        );
      })}
    </Grid>
  );
}
