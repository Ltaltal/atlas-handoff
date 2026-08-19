// FlowPlayer — the default surface for a flow: a stage showing the current
// beat, a scrubber of labelled steps, and transport controls.

import { Card } from '@astryxdesign/core/Card';
import { VStack, HStack, Stack } from '@astryxdesign/core/Stack';
import { Grid } from '@astryxdesign/core/Grid';
import { Text } from '@astryxdesign/core/Text';
import { Button, Icon } from '@ds';
import { useFlowPlayer, type UseFlowPlayerOptions } from './useFlowPlayer';
import type { FlowDefinition } from './flowTypes';

export interface FlowPlayerProps extends UseFlowPlayerOptions {
  flow: FlowDefinition;
}

export function FlowPlayer({ flow, ...options }: FlowPlayerProps) {
  const player = useFlowPlayer(flow, options);

  return (
    <VStack gap={3} maxWidth={620}>
      <Card padding={6} variant="muted">
        {/* The stage holds the height of the tallest beat, so the transport
            below it does not climb the page as a shorter step comes up. A
            min-height would be a number to re-measure by hand every time a
            beat changes, and it would be wrong quietly. */}
        <Grid columns={1}>
          {flow.beats.map((beat) => (
            <div
              key={`reserve-${beat.id}`}
              aria-hidden
              inert
              style={{ gridArea: '1 / 1', visibility: 'hidden' }}
            >
              {beat.content}
            </div>
          ))}
          <Stack
            direction="horizontal"
            hAlign="center"
            vAlign="center"
            style={{ gridArea: '1 / 1' }}
          >
            {player.visible.map((beat) => (
              <Stack key={beat.id} direction="vertical">
                {beat.content}
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Card>

      <HStack gap={1} width="100%">
        {flow.beats.map((beat, index) => (
          <Stack key={beat.id} direction="vertical" gap={1} width="100%">
            <button
              type="button"
              onClick={() => player.goTo(index)}
              aria-label={`Go to ${beat.label ?? `step ${index + 1}`}`}
              style={{
                height: 'var(--spacing-1)',
                width: '100%',
                padding: 0,
                border: 'none',
                cursor: 'pointer',
                borderRadius: 'var(--radius-full)',
                backgroundColor:
                  index === player.index
                    ? 'var(--color-accent)'
                    : index < player.index
                      ? 'var(--color-accent-muted)'
                      : 'var(--color-border)',
              }}
            />
            {beat.label && (
              <Text
                type="supporting"
                color={index === player.index ? 'primary' : 'secondary'}
                maxLines={1}
              >
                {beat.label}
              </Text>
            )}
          </Stack>
        ))}
      </HStack>

      <HStack gap={2} vAlign="center">
        <Button
          variant="primary"
          icon={<Icon name={player.playing ? 'pause' : 'play'} size={16} />}
          onClick={player.toggle}
          aria-label={player.playing ? 'Pause' : 'Play'}
        />
        <Button
          variant="subtle"
          icon={<Icon name="previous" size={16} />}
          onClick={player.prev}
          disabled={player.index === 0}
          aria-label="Previous step"
        />
        <Button
          variant="subtle"
          icon={<Icon name="next" size={16} />}
          onClick={player.next}
          disabled={player.atEnd && !flow.loop}
          aria-label="Next step"
        />
        <Button
          variant="subtle"
          icon={<Icon name="reset" size={16} />}
          onClick={player.restart}
          aria-label="Restart"
        />
        <Stack direction="horizontal" justify="end" width="100%">
          <Text type="supporting" color="secondary" hasTabularNumbers>
            {player.index + 1} / {flow.beats.length}
          </Text>
        </Stack>
      </HStack>
    </VStack>
  );
}
