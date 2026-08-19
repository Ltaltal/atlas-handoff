// StatusBoard — what is designed, what is moving and what has not started.
// Counts and the bar are derived from the rows, so the summary can never
// disagree with the table.

import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@astryxdesign/core/Table';
import { Badge, Button, Icon, type BadgeTone } from '@ds';

export type DesignState = 'designed' | 'in-design' | 'missing';

export interface StatusRow {
  component: string;
  /** Flow step or area, e.g. "2 · Workspace details". */
  step?: string;
  /** e.g. "P0". */
  priority?: string;
  status: DesignState;
  notes?: string;
  /**
   * Where to go to see this thing. Rows with a destination render as links;
   * rows without one render as plain text, so nothing looks clickable when
   * there is nothing to open yet.
   */
  open?: () => void;
}

const STATE: Record<DesignState, { label: string; tone: BadgeTone }> = {
  designed: { label: 'Designed', tone: 'success' },
  'in-design': { label: 'In design', tone: 'warning' },
  missing: { label: 'Not started', tone: 'danger' },
};

const ORDER: DesignState[] = ['designed', 'in-design', 'missing'];

export function StatusBoard({ rows }: { rows: StatusRow[] }) {
  const counts = ORDER.reduce(
    (acc, state) => ({ ...acc, [state]: rows.filter((row) => row.status === state).length }),
    {} as Record<DesignState, number>,
  );
  const percent = Math.round((counts.designed / (rows.length || 1)) * 100);

  return (
    <VStack gap={4}>
      <HStack justify="between" vAlign="center" gap={3}>
        <HStack gap={2} vAlign="center">
          {ORDER.map((state) => (
            <Badge key={state} tone={STATE[state].tone}>
              {`${counts[state]} ${STATE[state].label.toLowerCase()}`}
            </Badge>
          ))}
        </HStack>
        <Text type="supporting" color="secondary" hasTabularNumbers>
          {counts.designed}/{rows.length} designed ({percent}%)
        </Text>
      </HStack>

      <ProgressBar value={percent} max={100} label={`${percent}% designed`} isLabelHidden />

      <Table density="compact" hasHover>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Component</TableHeaderCell>
            <TableHeaderCell>Step</TableHeaderCell>
            <TableHeaderCell>Priority</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Notes</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.component}>
              <TableCell>
                {row.open ? (
                  <Button
                    variant="subtle"
                    size="sm"
                    icon={<Icon name="arrowRight" size={13} />}
                    iconAfter
                    onClick={row.open}
                  >
                    {row.component}
                  </Button>
                ) : (
                  <Text color="secondary" weight="semibold">
                    {row.component}
                  </Text>
                )}
              </TableCell>
              <TableCell>
                <Text type="supporting" color="secondary">
                  {row.step ?? '—'}
                </Text>
              </TableCell>
              <TableCell>{row.priority && <Badge tone="info">{row.priority}</Badge>}</TableCell>
              <TableCell>
                <Badge tone={STATE[row.status].tone}>{STATE[row.status].label}</Badge>
              </TableCell>
              <TableCell>
                <Text type="supporting" color="secondary">
                  {row.notes ?? ''}
                </Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </VStack>
  );
}
