// SpecPane — the right-hand column of a component page: the numbers, the
// parts, the props, the tokens and the caveats.

import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Divider } from '@astryxdesign/core/Divider';
import { Badge } from '@ds';
import type { ComponentSpec } from './story-types';

/**
 * A section heading with its rule underneath.
 *
 * The rule used to sit under every row, which turned a short list of facts
 * into a ledger and separated things that belong together. Under the heading
 * it does the one job spacing cannot: saying where a section starts.
 */
function SectionLabel({ children }: { children: string }) {
  return (
    <VStack gap={1}>
      <Text type="supporting" weight="semibold" color="secondary">
        {children.toUpperCase()}
      </Text>
      <Divider />
    </VStack>
  );
}

/**
 * An identifier, set in the code face.
 *
 * This pane is almost entirely identifiers — every measurement, part, prop,
 * type and token. Giving each one a filled chip turns the column into a stack
 * of grey boxes, so the monospace face carries the distinction on its own.
 */
function Mono({
  children,
  color = 'primary',
}: {
  children: string;
  color?: 'primary' | 'secondary';
}) {
  return (
    <Text
      type="supporting"
      color={color}
      weight="normal"
      style={{ fontFamily: 'var(--font-family-code)' }}
    >
      {children}
    </Text>
  );
}

export function SpecPane({ spec }: { spec: ComponentSpec }) {
  return (
    <VStack gap={5}>
      {spec.description && <Text color="secondary">{spec.description}</Text>}

      {spec.measurements && spec.measurements.length > 0 && (
        <VStack gap={2}>
          <SectionLabel>Measurements</SectionLabel>
          {spec.measurements.map((measure) => (
            <VStack key={measure.name} gap={0}>
              <HStack justify="between" gap={3} vAlign="center">
                <Text type="supporting">{measure.name}</Text>
                <Mono>{measure.value}</Mono>
              </HStack>
              {measure.description && (
                <Text type="supporting" color="secondary">
                  {measure.description}
                </Text>
              )}
            </VStack>
          ))}
        </VStack>
      )}

      {spec.anatomy && spec.anatomy.length > 0 && (
        <VStack gap={2}>
          <SectionLabel>Composed of</SectionLabel>
          {spec.anatomy.map((part) => (
            <VStack key={part.name} gap={0}>
              <Mono>{part.name}</Mono>
              <Text type="supporting" color="secondary">
                {part.description}
              </Text>
            </VStack>
          ))}
        </VStack>
      )}

      {spec.props && spec.props.length > 0 && (
        <VStack gap={2}>
          <SectionLabel>Props</SectionLabel>
          {spec.props.map((prop) => (
            <VStack key={prop.name} gap={0}>
              <HStack gap={2} vAlign="center">
                <Mono>{prop.name}</Mono>
                {prop.required && <Badge tone="danger">required</Badge>}
              </HStack>
              <HStack gap={3} vAlign="center">
                <Mono color="secondary">{prop.type}</Mono>
                <Text type="supporting" color="secondary">
                  default: {prop.default ?? '\u2014'}
                </Text>
              </HStack>
              {prop.description && (
                <Text type="supporting" color="secondary">
                  {prop.description}
                </Text>
              )}
            </VStack>
          ))}
        </VStack>
      )}

      {spec.tokens && spec.tokens.length > 0 && (
        <VStack gap={2}>
          <SectionLabel>Design tokens</SectionLabel>
          {spec.tokens.map((entry) => (
            <VStack key={entry.token} gap={0}>
              <Mono>{entry.token}</Mono>
              {entry.description && (
                <Text type="supporting" color="secondary">
                  {entry.description}
                </Text>
              )}
            </VStack>
          ))}
        </VStack>
      )}

      {spec.notes && spec.notes.length > 0 && (
        <VStack gap={2}>
          <SectionLabel>Notes</SectionLabel>
          {spec.notes.map((note, index) => (
            <Text key={index} type="supporting" color="secondary">
              {'\u2022'} {note}
            </Text>
          ))}
        </VStack>
      )}
    </VStack>
  );
}
