// NotesBoard — one place for everything written down about a feature, filtered
// by kind.
//
// Read-only by design. The notes come from the feature's data file, so adding
// or changing one is a commit, which is what makes it visible to everyone else
// and what lets a deployment be a build of the repo rather than of a browser.

import { useState } from 'react';
import { Card } from '@astryxdesign/core/Card';
import { VStack, HStack, Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Avatar } from '@astryxdesign/core/Avatar';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Link } from '@astryxdesign/core/Link';
import { Badge, Button, Icon, Tabs } from '@ds';
import {
  NOTE_KINDS,
  NOTE_KIND_ORDER,
  formatNoteDate,
  type Note,
  type NoteKind,
} from './notes';
import { useHandoffNav } from './navigation';

export interface NotesBoardProps {
  notes: Note[];
}

type Filter = NoteKind | 'all';

export function NotesBoard({ notes }: NotesBoardProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const visible = filter === 'all' ? notes : notes.filter((note) => note.kind === filter);
  const countOf = (kind: NoteKind) => notes.filter((note) => note.kind === kind).length;

  return (
    <VStack gap={4}>
      <HStack vAlign="center" gap={3}>
        <Tabs
          variant="segmented"
          ariaLabel="Filter notes by kind"
          value={filter}
          onChange={(value) => setFilter(value as Filter)}
          items={[
            { value: 'all', label: `All ${notes.length}` },
            ...NOTE_KIND_ORDER.map((kind) => ({
              value: kind,
              label: `${NOTE_KINDS[kind].plural} ${countOf(kind)}`,
            })),
          ]}
        />
      </HStack>

      {visible.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description={
            filter === 'all'
              ? 'No notes recorded for this feature yet.'
              : `No ${NOTE_KINDS[filter as NoteKind].plural.toLowerCase()} recorded.`
          }
        />
      ) : (
        <VStack gap={3}>
          {visible.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </VStack>
      )}
    </VStack>
  );
}

function NoteCard({ note }: { note: Note }) {
  const meta = NOTE_KINDS[note.kind];
  const navigate = useHandoffNav();

  return (
    <Card padding={5}>
      <VStack gap={3}>
        <HStack justify="between" vAlign="center" gap={2}>
          <HStack gap={2} vAlign="center">
            <Icon name={meta.icon} size={14} />
            <Text type="supporting" weight="semibold" color="secondary">
              {meta.label.toUpperCase()}
            </Text>
            {note.status && <Badge tone="warning">{note.status}</Badge>}
          </HStack>
          <Text type="supporting" color="secondary">
            {formatNoteDate(note.date)}
          </Text>
        </HStack>

        <Heading level={3} style={{ fontWeight: 'var(--font-weight-medium)' }}>
          {note.title}
        </Heading>
        {note.body && <Text color="secondary">{note.body}</Text>}

        <HStack justify="between" vAlign="center" gap={3}>
          <HStack gap={2} vAlign="center">
            <Avatar name={note.author} size="xsm" />
            <Text type="supporting" color="secondary">
              {note.author}
            </Text>
          </HStack>

          <Stack direction="horizontal" gap={1} vAlign="center" wrap="wrap">
            {note.affects?.map((label) => (
              <Button
                key={label}
                variant="subtle"
                size="sm"
                icon={<Icon name="arrowRight" size={13} />}
                iconAfter
                onClick={() => navigate({ page: label })}
              >
                {label}
              </Button>
            ))}
            {note.reference && (
              <Link href={note.reference.url} target="_blank">
                {note.reference.label}
              </Link>
            )}
          </Stack>
        </HStack>
      </VStack>
    </Card>
  );
}
