// Iterations — multiple versions of a component as tabs, so a page can carry
// the history of a decision and not only its outcome.

import { useState, type ReactNode } from 'react';
import { VStack, Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Tabs } from '@ds';

export interface Iteration {
  /** Tab label, e.g. "v1", "v2". */
  label: string;
  /** One line about this version. */
  description?: string;
  content: ReactNode;
}

export function Iterations({ items }: { items: Iteration[] }) {
  const [selected, setSelected] = useState(items[0]?.label ?? '');
  const active = items.find((item) => item.label === selected) ?? items[0];

  if (items.length === 0) return null;

  return (
    <VStack gap={3} width="100%">
      <Tabs
        variant="segmented"
        ariaLabel="Design iterations"
        value={active.label}
        onChange={setSelected}
        items={items.map((item) => ({ value: item.label, label: item.label }))}
      />
      {active.description && (
        <Text type="supporting" color="secondary">
          {active.description}
        </Text>
      )}
      <Stack direction="horizontal" gap={4} wrap="wrap">
        {active.content}
      </Stack>
    </VStack>
  );
}
