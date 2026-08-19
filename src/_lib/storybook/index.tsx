// The building blocks of a component page:
//
//   ComponentDocs         title, intro
//     Behavior            logic rules + edge cases
//     StorySection        a live example, with the code behind it
//
// The component's measurements and props are provided as `Default.spec` and
// render in the right-hand panel.

import { useState, type ReactNode } from 'react';
import { Card } from '@astryxdesign/core/Card';
import { VStack, HStack, Stack } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@astryxdesign/core/Table';
import { Badge, Icon, Tabs, type BadgeTone } from '@ds';
import { AccessibilityReport } from '../AccessibilityReport';
import { LiveAudit } from '../LiveAudit';
import type { AccessibilitySpec } from '../story-types';

const STATUS_TONE: Record<string, BadgeTone> = {
  wip: 'warning',
  exploration: 'brand',
  review: 'info',
  ready: 'success',
};

export interface ComponentDocsProps {
  title: string;
  status?: string;
  description?: ReactNode;
  /**
   * The component's accessibility record. Given one, the page splits into two
   * tabs — a component is not documented until a keyboard user is too, and a
   * tab keeps that a peer of the examples rather than an appendix below them.
   */
  accessibility?: AccessibilitySpec;
  /**
   * The component, rendered so its accessibility can be read rather than
   * described. Given one, the tab leads with measured facts — the tab order it
   * really produces and the names it really exposes — and the written record
   * below is left to say what those facts mean.
   */
  audit?: ReactNode;
  children: ReactNode;
}

export function ComponentDocs({
  title,
  status,
  description,
  accessibility,
  audit,
  children,
}: ComponentDocsProps) {
  const [tab, setTab] = useState('docs');

  return (
    <VStack gap={8}>
      <VStack gap={1}>
        <Text type="supporting" weight="semibold" color="secondary">
          COMPONENT
        </Text>
        <HStack gap={3} vAlign="center">
          <Heading level={1}>{title}</Heading>
          {status && <Badge tone={STATUS_TONE[status] ?? 'brand'}>{status}</Badge>}
        </HStack>
        {description && <Text color="secondary">{description}</Text>}
      </VStack>

      {accessibility ? (
        <VStack gap={8}>
          <Tabs
            ariaLabel="Component documentation"
            value={tab}
            onChange={setTab}
            items={[
              { value: 'docs', label: 'Documentation' },
              { value: 'a11y', label: 'Accessibility' },
            ]}
          />
          {tab === 'docs' ? (
            children
          ) : (
            <VStack gap={8}>
              {audit && (
                <StorySection
                  name="Read from the component"
                  description="Taken from the rendered markup each time this page loads, so it cannot fall behind the component."
                >
                  <LiveAudit previewWidth={340}>{audit}</LiveAudit>
                </StorySection>
              )}
              <AccessibilityReport spec={accessibility} />
            </VStack>
          )}
        </VStack>
      ) : (
        children
      )}
    </VStack>
  );
}

export interface EdgeCase {
  /** The unusual input, state or interaction. */
  case: string;
  /** What the component should do. */
  expected: string;
}

export interface BehaviorProps {
  /** How the component works. */
  logic?: string[];
  edgeCases?: EdgeCase[];
}

/** The half of a handoff that a static image cannot carry. */
export function Behavior({ logic, edgeCases }: BehaviorProps) {
  return (
    <VStack gap={5}>
      {logic && logic.length > 0 && (
        <VStack gap={2}>
          <Heading level={2}>Logic</Heading>
          <VStack gap={2}>
            {logic.map((rule, index) => (
              <Text key={index} color="secondary">
                • {rule}
              </Text>
            ))}
          </VStack>
        </VStack>
      )}

      {edgeCases && edgeCases.length > 0 && (
        <VStack gap={2}>
          <Heading level={2}>Edge cases</Heading>
          <Table density="compact">
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Case</TableHeaderCell>
                <TableHeaderCell>Expected</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {edgeCases.map((edge, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Text weight="semibold">{edge.case}</Text>
                  </TableCell>
                  <TableCell>
                    <Text color="secondary">{edge.expected}</Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </VStack>
      )}
    </VStack>
  );
}

export interface StorySectionProps {
  name: string;
  description?: ReactNode;
  /** Source snippet revealed by "Show code". */
  code?: string;
  /** The child brings its own frame, so this one adds no padding. */
  flush?: boolean;
  /** Controls for this example, right-aligned in its header. */
  actions?: ReactNode;
  children: ReactNode;
}

export function StorySection({
  name,
  description,
  code,
  flush,
  actions,
  children,
}: StorySectionProps) {
  const hasFooter = Boolean(description || code);

  return (
    // One card per example: the component sits on the plain card surface, and
    // everything *about* it drops into a muted strip underneath. Keeping the
    // canvas the same colour as the page is the point — a state rendered on a
    // grey box is not the state engineering will actually build.
    <Card padding={0}>
      <VStack gap={0}>
        {/* The label always sits inside the card's padding. `flush` is for a
            child that brings its own frame, and that should not corner the
            label along with it. */}
        <VStack
          style={{
            padding: 'var(--spacing-3) var(--spacing-6)',
            borderBottom: '1px solid var(--color-border)',
            // A flush child brings its own chrome, and its dividers should meet
            // this rule rather than start 24px below it.
            marginBottom: flush ? 0 : 'var(--spacing-6)',
          }}
        >
          <HStack gap={3} vAlign="center" justify="between">
            <Text type="supporting" weight="semibold" color="secondary">
              {name}
            </Text>
            {actions}
          </HStack>
        </VStack>

        <VStack
          style={{ padding: flush ? 0 : '0 var(--spacing-6) var(--spacing-6)' }}
        >
          {flush ? (
            // A flush child owns the full width of the card, so centring it
            // here would leave its own right-hand edge floating.
            children
          ) : (
            <Stack
              direction="horizontal"
              gap={4}
              wrap="wrap"
              vAlign="center"
              hAlign="center"
              minHeight={140}
            >
              {children}
            </Stack>
          )}
        </VStack>

        {hasFooter && (
          <VStack
            padding={4}
            gap={2}
            style={{
              background: 'var(--color-background-muted)',
              borderBottomLeftRadius: 'var(--radius-container)',
              borderBottomRightRadius: 'var(--radius-container)',
            }}
          >
            {description && <Text color="secondary">{description}</Text>}
            {code && (
              <Collapsible
                trigger={
                  <HStack gap={1} vAlign="center">
                    <Icon name="code" size={14} />
                    <Text type="supporting" weight="semibold">
                      Show code
                    </Text>
                  </HStack>
                }
              >
                {/* The block ships a 400px intrinsic width, so it has to be
                    told to use the room the footer gives it. */}
                <CodeBlock code={code} language="tsx" hasCopyButton style={{ width: '100%' }} />
              </Collapsible>
            )}
          </VStack>
        )}
      </VStack>
    </Card>
  );
}
