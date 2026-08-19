// Exploration — the part of the process that a handoff usually throws away.
//
// By the time something reaches a component page it has been decided. This is
// where the alternatives live: what was tried, what was picked and why, what
// was parked rather than rejected, and what changed recently. It reads like a
// design file rather than documentation, on purpose — the point is to show the
// thinking while it is still loose.

import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Divider } from '@astryxdesign/core/Divider';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Badge, Icon, type BadgeTone } from '@ds';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ board -- */

export type DirectionState = 'exploring' | 'chosen' | 'parked' | 'dropped';

const STATE: Record<DirectionState, { label: string; tone: BadgeTone }> = {
  exploring: { label: 'Exploring', tone: 'info' },
  chosen: { label: 'Chosen', tone: 'success' },
  parked: { label: 'Parked', tone: 'warning' },
  dropped: { label: 'Dropped', tone: 'neutral' },
};

export interface Direction {
  title: string;
  state: DirectionState;
  /** One line: what this direction is betting on. */
  premise: string;
  /** What it would cost, if anyone has worked that out yet. */
  cost?: string;
  preview?: ReactNode;
}

/**
 * A wall of directions. Deliberately not a decision log — several of these are
 * alive at once, and the parked ones are kept because a parked idea is the
 * cheapest thing to revive when a constraint changes.
 */
export function ExplorationBoard({ directions }: { directions: Direction[] }) {
  return (
    <Grid columns={{ minWidth: 260, repeat: 'fit' }} gap={3}>
      {directions.map((direction) => (
        <Card key={direction.title} padding={0}>
          <VStack gap={0} height="100%">
            <VStack
              gap={0}
              style={{
                padding: 'var(--spacing-3) var(--spacing-4)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <HStack gap={2} vAlign="center" justify="between">
                <Text weight="semibold">{direction.title}</Text>
                <Badge tone={STATE[direction.state].tone}>{STATE[direction.state].label}</Badge>
              </HStack>
            </VStack>

            {direction.preview && (
              <HStack
                hAlign="center"
                vAlign="center"
                style={{ padding: 'var(--spacing-5)', minHeight: 132 }}
              >
                {direction.preview}
              </HStack>
            )}

            <VStack gap={1} style={{ padding: 'var(--spacing-4)' }}>
              <Text type="supporting" color="secondary">
                {direction.premise}
              </Text>
              {direction.cost && (
                <Text type="supporting" color="secondary">
                  <Text as="span" weight="semibold">
                    Cost:{' '}
                  </Text>
                  {direction.cost}
                </Text>
              )}
            </VStack>
          </VStack>
        </Card>
      ))}
    </Grid>
  );
}

/* ------------------------------------------------------------- variations -- */

export interface Variation {
  label: string;
  note: string;
  picked?: boolean;
  preview: ReactNode;
}

/**
 * The same thing several ways, side by side, with the pick marked.
 *
 * Comparing is the whole job here, so they share a row and a baseline rather
 * than being stacked down the page where you have to remember the last one.
 */
export function VariationCheck({ variations }: { variations: Variation[] }) {
  return (
    <Grid columns={{ minWidth: 200, repeat: 'fit' }} gap={3}>
      {variations.map((variation) => (
        <VStack key={variation.label} gap={2} height="100%">
          <Card
            padding={5}
            variant={variation.picked ? 'default' : 'muted'}
            style={{
              flexGrow: 1,
              outline: variation.picked ? '2px solid var(--color-accent)' : undefined,
            }}
          >
            <HStack hAlign="center" vAlign="center" height="100%" style={{ minHeight: 120 }}>
              {variation.preview}
            </HStack>
          </Card>
          <VStack gap={0}>
            <HStack gap={2} vAlign="center">
              <Text weight="semibold">{variation.label}</Text>
              {variation.picked && (
                <HStack gap={1} vAlign="center">
                  <Icon name="checkCircle" size={13} />
                  <Text type="supporting" weight="semibold">
                    Picked
                  </Text>
                </HStack>
              )}
            </HStack>
            <Text type="supporting" color="secondary">
              {variation.note}
            </Text>
          </VStack>
        </VStack>
      ))}
    </Grid>
  );
}

/* ----------------------------------------------------------------- recent -- */

export interface RecentEntry {
  what: string;
  who: string;
  when: string;
  detail?: string;
}

/** What moved lately, so someone returning knows where to look. */
export function Recent({ entries }: { entries: RecentEntry[] }) {
  return (
    <VStack gap={0}>
      {entries.map((entry, index) => (
        <VStack key={index} gap={0}>
          {index > 0 && <Divider />}
          <HStack gap={3} vAlign="center" style={{ paddingBlock: 'var(--spacing-3)' }}>
            <Avatar name={entry.who} size="sm" />
            <VStack gap={0}>
              <Text>{entry.what}</Text>
              {entry.detail && (
                <Text type="supporting" color="secondary">
                  {entry.detail}
                </Text>
              )}
            </VStack>
            <HStack justify="end" style={{ marginInlineStart: 'auto' }}>
              <Text type="supporting" color="secondary">
                {entry.when}
              </Text>
            </HStack>
          </HStack>
        </VStack>
      ))}
    </VStack>
  );
}

/* ------------------------------------------------------------------ shell -- */

/** A titled band, so the three parts read as one workspace. */
export function ExplorationSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <VStack gap={3}>
      <VStack gap={0}>
        <Heading level={2}>{title}</Heading>
        <Text type="supporting" color="secondary">
          {hint}
        </Text>
      </VStack>
      {children}
    </VStack>
  );
}
