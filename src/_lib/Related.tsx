// Related — the "connected to" rail. Every page carries one, so a reader can
// always see what a thing depends on and jump straight there.
//
// It is a line of links rather than a grid of cards. These are a footer to the
// page, not its content: as cards they took a screen's worth of room, competed
// with the thing being documented, and changed height as the list changed. On
// one line they stay out of the way and still say where each link goes.

import { Stack, VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Divider } from '@astryxdesign/core/Divider';
import { Icon, type IconName } from '@ds';
import { useHandoffNav, type NavTarget } from './navigation';

export type RelationKind =
  | 'context'
  | 'flow'
  | 'ui'
  | 'behavior'
  | 'specs'
  | 'decision'
  | 'question';

const KIND: Record<RelationKind, { label: string; icon: IconName }> = {
  context: { label: 'Context', icon: 'lightbulb' },
  flow: { label: 'Flow', icon: 'flow' },
  ui: { label: 'UI', icon: 'window' },
  behavior: { label: 'Behavior', icon: 'sparkle' },
  specs: { label: 'Specs', icon: 'ruler' },
  decision: { label: 'Decision', icon: 'scales' },
  question: { label: 'Open question', icon: 'question' },
};

export interface RelationItem {
  kind: RelationKind;
  /** The thing being pointed at, e.g. "Step 1 · Workspace details". */
  label: string;
  hint?: string;
  target: NavTarget;
}

export interface RelatedProps {
  items: RelationItem[];
  title?: string;
}

export function Related({ items, title = 'Connected to' }: RelatedProps) {
  const navigate = useHandoffNav();
  if (items.length === 0) return null;

  return (
    // A rule rather than a box. Once these became links they needed something
    // to separate them from the page above; a line does that without turning
    // them back into content.
    <VStack gap={4}>
      <Divider />
      <VStack gap={2}>
        <Text type="supporting" weight="semibold" color="secondary">
          {title.toUpperCase()}
        </Text>
        {/* Wraps rather than scrolls, so a long list costs a second line
            instead of hiding its tail. */}
        <Stack direction="horizontal" gap={5} wrap="wrap" vAlign="center">
          {items.map((item, index) => {
            const kind = KIND[item.kind];
            return (
              <HStack key={`${item.kind}-${item.label}-${index}`} gap={1.5} vAlign="center">
                {/* The icon is decoration for the word beside it; the kind is
                    written out so it does not depend on reading the glyph. */}
                <Icon name={kind.icon} size={13} />
                <Text type="supporting" color="secondary">
                  {kind.label}
                </Text>
                <Link onClick={() => navigate(item.target)}>{item.label}</Link>
              </HStack>
            );
          })}
        </Stack>
      </VStack>
    </VStack>
  );
}
