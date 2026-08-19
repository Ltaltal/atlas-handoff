// ScreenFrame — a surround for a mocked product screen, so a screen in the
// handoff reads as a real surface rather than a loose cluster of components.

import type { ReactNode } from 'react';
import { Card } from '@astryxdesign/core/Card';
import { VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

export interface ScreenFrameProps {
  /** Frame width in px, capped to the available space. Default 520. */
  width?: number;
  /** Sits above the frame, the way a frame is named on a design canvas. */
  name?: ReactNode;
  caption?: ReactNode;
  /**
   * Fill the height available instead of hugging the content. A window keeps
   * its size while you move through it; a frame on a canvas should not.
   */
  fill?: boolean;
  children: ReactNode;
}

export function ScreenFrame({ width = 520, name, caption, fill, children }: ScreenFrameProps) {
  return (
    // A definite width so the frame keeps its size as a flex item, capped at
    // 100% so it can never overflow a narrower column and sit on its neighbour.
    <VStack gap={2} width={width} maxWidth="100%" height={fill ? '100%' : undefined}>
      {name && (
        <Text type="supporting" weight="semibold" color="secondary">
          {name}
        </Text>
      )}
      <Card padding={6} elevation="med" height={fill ? '100%' : undefined}>
        {children}
      </Card>
      {caption && (
        <Text type="supporting" color="secondary">
          {caption}
        </Text>
      )}
    </VStack>
  );
}
