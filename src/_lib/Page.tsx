// Page — a consistent header for every page, so a feature reads like one
// document rather than a pile of screens.

import type { ReactNode } from 'react';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Badge, type BadgeTone } from '@ds';

const STATUS_TONE: Record<string, BadgeTone> = {
  wip: 'warning',
  exploration: 'brand',
  review: 'info',
  ready: 'success',
  archived: 'neutral',
};

export interface PageProps {
  title: string;
  /** Small label above the title, e.g. "Flow". */
  eyebrow?: string;
  description?: ReactNode;
  status?: string;
  /** Page-level control, aligned with the title. */
  actions?: ReactNode;
  children: ReactNode;
}

export function Page({ title, eyebrow, description, status, actions, children }: PageProps) {
  return (
    <VStack gap={6}>
      <VStack gap={1}>
        {eyebrow && (
          <Text type="supporting" weight="semibold" color="secondary">
            {eyebrow.toUpperCase()}
          </Text>
        )}
        <HStack gap={3} vAlign="center" justify="between">
          <HStack gap={3} vAlign="center">
            <Heading level={1}>{title}</Heading>
            {status && <Badge tone={STATUS_TONE[status] ?? 'info'}>{status}</Badge>}
          </HStack>
          {actions}
        </HStack>
        {description && <Text color="secondary">{description}</Text>}
      </VStack>
      <VStack gap={6}>{children}</VStack>
    </VStack>
  );
}
