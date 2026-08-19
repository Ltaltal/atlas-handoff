// BrandMark — the Atlas product mark. Atlas is a fictional workspace product
// used to demonstrate this handoff format.

import { Avatar } from '@astryxdesign/core/Avatar';
import { Text } from '@astryxdesign/core/Text';
import { VStack, HStack } from '@astryxdesign/core/Stack';

export interface BrandMarkProps {
  /** Show the "Design handoff" second line. */
  subtitle?: boolean;
  size?: 'xsm' | 'sm' | 'md' | 'lg';
}

export function BrandMark({ subtitle = false, size = 'sm' }: BrandMarkProps) {
  return (
    <HStack gap={2} vAlign="center">
      <Avatar name="Atlas" size={size} />
      <VStack gap={0}>
        <Text type="label" weight="semibold">
          Atlas
        </Text>
        {subtitle && (
          <Text type="supporting" color="secondary">
            Design handoff
          </Text>
        )}
      </VStack>
    </HStack>
  );
}
