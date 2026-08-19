// DoDont — a pair of samples side by side. Content guidance is easier to
// follow from an example than from a rule, so the rule goes underneath.

import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Icon } from '@ds';

export interface DoDontProps {
  /** The wording to use. */
  good: string;
  /** The wording to avoid. */
  bad: string;
  /** Why, in one line. */
  why?: string;
}

export function DoDont({ good, bad, why }: DoDontProps) {
  return (
    <Grid columns={{ minWidth: 280, repeat: 'fit' }} gap={3}>
      <Card padding={4} variant="green">
        <VStack gap={2}>
          <HStack gap={1} vAlign="center">
            <Icon name="checkCircle" size={13} />
            <Text type="supporting" weight="semibold" color="primary">
              DO
            </Text>
          </HStack>
          <Text type="large">{good}</Text>
          {why && (
            <Text type="supporting" color="primary">
              {why}
            </Text>
          )}
        </VStack>
      </Card>

      <Card padding={4} variant="red">
        <VStack gap={2}>
          <HStack gap={1} vAlign="center">
            <Icon name="close" size={13} />
            <Text type="supporting" weight="semibold" color="primary">
              DON'T
            </Text>
          </HStack>
          <Text type="large" color="primary" hasStrikethrough>
            {bad}
          </Text>
        </VStack>
      </Card>
    </Grid>
  );
}
