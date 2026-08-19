// IAMap — the same structure as the tree, arranged as a grid so the feature
// has a shape rather than a length.
//
// Steps run across; what each one is made of runs down. Read a column and you
// have one step; read a row and you can see which steps carry a screen but no
// data, or reuse a component another step already introduced. A vertical tree
// can hold all of that, but you have to scan it to find out.

import { useMemo } from 'react';
import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Divider } from '@astryxdesign/core/Divider';
import { Badge, Icon } from '@ds';
import { useHandoffNav, type NavTarget } from './navigation';

export type NodeKind = 'entry' | 'step' | 'screen' | 'component' | 'data' | 'exit';

export interface IANode {
  label: string;
  kind: NodeKind;
  /** One line on what this is. */
  note?: string;
  /** Where it is documented. Nodes without one are structure only. */
  target?: NavTarget;
  children?: IANode[];
}

/** One cell's worth of parts, already resolved from the tree. */
interface StepParts {
  label: string;
  note?: string;
  screen?: IANode;
  components: IANode[];
  data: IANode[];
}

function collect(step: IANode): StepParts {
  const screen = step.children?.find((child) => child.kind === 'screen');
  return {
    label: step.label,
    note: step.note,
    screen,
    components: screen?.children?.filter((child) => child.kind === 'component') ?? [],
    data: step.children?.filter((child) => child.kind === 'data') ?? [],
  };
}

function BandLabel({ children }: { children: string }) {
  return (
    <Text type="supporting" weight="semibold" color="secondary">
      {children.toUpperCase()}
    </Text>
  );
}

/** A part, linked when it has somewhere to go. */
function Part({
  node,
  reused,
  onOpen,
}: {
  node: IANode;
  reused?: boolean;
  onOpen?: () => void;
}) {
  const interactive = Boolean(onOpen);
  return (
    <HStack
      gap={2}
      vAlign="center"
      as={interactive ? 'button' : 'div'}
      onClick={onOpen}
      style={{
        width: '100%',
        textAlign: 'start',
        padding: 'var(--spacing-1) var(--spacing-2)',
        borderRadius: 'var(--radius-element)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-background-card)',
        cursor: interactive ? 'pointer' : 'default',
        color: 'var(--color-text-primary)',
      }}
    >
      <Text type="supporting">{node.label}</Text>
      {reused && <Badge tone="info">reused</Badge>}
      {interactive && <Icon name="arrowRight" size={12} />}
    </HStack>
  );
}

function Empty() {
  return (
    <Text type="supporting" color="secondary">
      —
    </Text>
  );
}

/** Entry and exit, which bookend the steps rather than sitting among them. */
function Bookend({ node }: { node: IANode }) {
  return (
    <Card padding={3} variant="muted">
      <HStack gap={2} vAlign="center">
        <Icon name={node.kind === 'entry' ? 'arrowRight' : 'checkCircle'} size={14} />
        <VStack gap={0}>
          <HStack gap={2} vAlign="center">
            <Text weight="semibold">{node.label}</Text>
            <Text type="supporting" color="secondary">
              {node.kind.toUpperCase()}
            </Text>
          </HStack>
          {node.note && (
            <Text type="supporting" color="secondary">
              {node.note}
            </Text>
          )}
        </VStack>
      </HStack>
    </Card>
  );
}

export function IAMap({ nodes }: { nodes: IANode[] }) {
  const navigate = useHandoffNav();

  const entry = nodes.find((node) => node.kind === 'entry');
  const exit = nodes.find((node) => node.kind === 'exit');
  const steps = useMemo(
    () => nodes.filter((node) => node.kind === 'step').map(collect),
    [nodes],
  );

  /** A component named by more than one step is the most useful fact here. */
  const reused = useMemo(() => {
    const counts = new Map<string, number>();
    for (const step of steps) {
      for (const component of step.components) {
        counts.set(component.label, (counts.get(component.label) ?? 0) + 1);
      }
    }
    return new Set([...counts].filter(([, count]) => count > 1).map(([label]) => label));
  }, [steps]);

  const open = (node: IANode) => (node.target ? () => navigate(node.target as NavTarget) : undefined);

  return (
    <VStack gap={4}>
      {entry && <Bookend node={entry} />}

      <Grid columns={{ minWidth: 160, max: steps.length }} gap={3}>
        {steps.map((step, index) => (
          <Card key={step.label} padding={0}>
            <VStack gap={0}>
              <VStack
                gap={0}
                style={{
                  padding: 'var(--spacing-3)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <Text type="supporting" color="secondary">
                  {`STEP ${index + 1}`}
                </Text>
                <Text weight="semibold">{step.label}</Text>
              </VStack>

              <VStack gap={4} style={{ padding: 'var(--spacing-3)' }}>
                <VStack gap={1}>
                  <BandLabel>Screen</BandLabel>
                  {step.screen ? (
                    <Part node={step.screen} onOpen={open(step.screen)} />
                  ) : (
                    <Empty />
                  )}
                </VStack>

                <VStack gap={1}>
                  <BandLabel>Components</BandLabel>
                  {step.components.length > 0 ? (
                    step.components.map((component) => (
                      <Part
                        key={component.label}
                        node={component}
                        reused={reused.has(component.label)}
                        onOpen={open(component)}
                      />
                    ))
                  ) : (
                    <Empty />
                  )}
                </VStack>

                <VStack gap={1}>
                  <BandLabel>Data</BandLabel>
                  {step.data.length > 0 ? (
                    step.data.map((field) => (
                      <VStack key={field.label} gap={0}>
                        <Text
                          type="supporting"
                          style={{ fontFamily: 'var(--font-family-code)' }}
                        >
                          {field.label}
                        </Text>
                        {field.note && (
                          <Text type="supporting" color="secondary">
                            {field.note}
                          </Text>
                        )}
                      </VStack>
                    ))
                  ) : (
                    <Empty />
                  )}
                </VStack>
              </VStack>
            </VStack>
          </Card>
        ))}
      </Grid>

      {exit && (
        <>
          <Divider />
          <Bookend node={exit} />
        </>
      )}
    </VStack>
  );
}
