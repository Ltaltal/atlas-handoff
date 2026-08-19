// LinkBoard — the feature's external references in one list.
//
// Read-only by design, like the notes board: the links come from the feature's
// data file, so adding one is a commit.

import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Avatar } from '@astryxdesign/core/Avatar';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { List, ListItem } from '@astryxdesign/core/List';
import { Icon } from '@ds';
import { LINK_KINDS, prettyUrl, type ResourceLink } from './links';

export interface LinkBoardProps {
  links: ResourceLink[];
}

export function LinkBoard({ links }: LinkBoardProps) {
  return (
    <VStack gap={4}>
      {links.length === 0 ? (
        <EmptyState
          title="No references yet"
          description="Add the spec, the research or the design file to the feature's data file."
        />
      ) : (
        <List>
          {links.map((link) => {
            const meta = LINK_KINDS[link.kind];
            return (
              <ListItem
                key={link.id}
                label={link.label}
                description={link.note}
                href={link.url}
                target="_blank"
                startContent={<Icon name={meta.icon} size={18} />}
                endContent={
                  <HStack gap={2} vAlign="center">
                    <Text type="supporting" color="secondary">
                      {prettyUrl(link.url)}
                    </Text>
                    {link.owner && <Avatar name={link.owner} size="xsm" />}
                  </HStack>
                }
              />
            );
          })}
        </List>
      )}
    </VStack>
  );
}
