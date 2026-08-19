// VariantGrid — every state of a component side by side, each captioned with
// the props that produce it.

import type { ReactNode } from 'react';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { VStack, Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Code } from '@astryxdesign/core/Code';

export interface Variant {
  /** Short label under the cell, e.g. "Error". */
  label: string;
  /** Usually the props that produce this state, e.g. `state="error"`. */
  caption?: string;
  node: ReactNode;
}

export interface VariantGridProps {
  variants: Variant[];
  /** Minimum cell width in px. Default 220. */
  minCellWidth?: number;
}

export function VariantGrid({ variants, minCellWidth = 220 }: VariantGridProps) {
  return (
    <Grid columns={{ minWidth: minCellWidth }} gap={4}>
      {variants.map((variant, index) => (
        // Same shape as an example: plain canvas for the state itself, muted
        // strip for the label and the props that produce it.
        <Card key={`${variant.label}-${index}`} padding={0}>
          <VStack gap={0}>
            <Stack
              direction="horizontal"
              hAlign="center"
              vAlign="center"
              padding={5}
              minHeight={132}
            >
              {variant.node}
            </Stack>
            <VStack
              padding={3}
              gap={0}
              style={{
                background: 'var(--color-background-muted)',
                borderBottomLeftRadius: 'var(--radius-container)',
                borderBottomRightRadius: 'var(--radius-container)',
              }}
            >
              <Text weight="semibold">{variant.label}</Text>
              {variant.caption && <Code>{variant.caption}</Code>}
            </VStack>
          </VStack>
        </Card>
      ))}
    </Grid>
  );
}
