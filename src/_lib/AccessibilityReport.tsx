// AccessibilityReport — the four things that get missed, laid out the same way
// for a single component and for the whole flow.
//
// Headings and tab order are sequences, so they render as ordered lists where a
// gap or a jump is visible at a glance. Names and adaptation are tables,
// because the useful question is "what, and from where".

import { useState, type CSSProperties } from 'react';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@astryxdesign/core/Table';
import { Badge, type BadgeTone } from '@ds';
import type { AccessibilitySpec } from './story-types';

const VERDICT_TONE: Record<string, BadgeTone> = {
  pass: 'success',
  concern: 'warning',
  fail: 'danger',
};

const VERDICT_LABEL: Record<string, string> = {
  pass: 'Pass',
  concern: 'Needs work',
  fail: 'Fails',
};


const RULE = '1px dashed var(--color-border-emphasized)';

/** A numbered focus marker, sized like the spec callouts it sits beside. */
function stopMarker(active: boolean): CSSProperties {
  return {
    position: 'absolute',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--spacing-5)',
    height: 'var(--spacing-5)',
    borderRadius: 'var(--radius-full)',
    backgroundColor: active ? 'var(--color-accent)' : 'var(--color-background-card)',
    color: active ? 'var(--color-on-accent)' : 'var(--color-text-primary)',
    border: `2px solid var(--color-accent)`,
    fontSize: 'var(--font-size-2xs)',
    fontWeight: 'var(--font-weight-semibold)',
    transform: 'translate(-50%, -50%)',
    transition: 'background-color var(--duration-fast, 120ms) ease',
    zIndex: 1,
  };
}

/** The number badge used in the list, so the two sides read as one thing. */
function listMarker(active: boolean): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--spacing-5)',
    height: 'var(--spacing-5)',
    flexShrink: 0,
    borderRadius: 'var(--radius-full)',
    backgroundColor: active ? 'var(--color-accent)' : 'var(--color-background-muted)',
    color: active ? 'var(--color-on-accent)' : 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-2xs)',
    fontWeight: 'var(--font-weight-semibold)',
    transition: 'background-color var(--duration-fast, 120ms) ease',
  };
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <VStack gap={2}>
      <VStack gap={0}>
        <Heading level={2}>{title}</Heading>
        <Text type="supporting" color="secondary">
          {hint}
        </Text>
      </VStack>
      {children}
    </VStack>
  );
}

/** Monospace without the filled chip — the face is enough on its own. */
function Mono({ children }: { children: string }) {
  return (
    <Text weight="normal" style={{ fontFamily: 'var(--font-family-code)' }}>
      {children}
    </Text>
  );
}

export function AccessibilityReport({ spec }: { spec: AccessibilitySpec }) {
  const { summary, headings, tabOrder, names, adaptation, preview } = spec;
  const [active, setActive] = useState<number | null>(null);

  return (
    <VStack gap={8}>
      {summary && <Text color="secondary">{summary}</Text>}

      {headings && headings.length > 0 && (
        <Section
          title="Heading outline"
          hint="The document structure a screen reader navigates by. Levels should descend one at a time."
        >
          <VStack gap={0}>
            {headings.map((heading, index) => (
              <VStack key={index} gap={0}>
                <HStack gap={3} vAlign="center">
                  <Mono>{heading.level > 0 ? `h${heading.level}` : '—'}</Mono>
                  <Text
                    color={heading.level > 0 ? 'primary' : 'secondary'}
                    weight={heading.level > 0 && heading.level <= 2 ? 'semibold' : 'normal'}
                    style={{
                      paddingInlineStart: `calc(var(--spacing-4) * ${Math.max(heading.level - 1, 0)})`,
                    }}
                  >
                    {heading.text}
                  </Text>
                </HStack>
                {heading.note && (
                  <Text type="supporting" color="secondary">
                    {heading.note}
                  </Text>
                )}
              </VStack>
            ))}
          </VStack>
        </Section>
      )}

      {tabOrder && tabOrder.length > 0 && (
        <Section
          title="Tab order"
          hint="Every stop between entering and leaving, in the order Tab reaches them. Hover a stop to find it on the component."
        >
          <VStack gap={5}>
            {preview && tabOrder.some((stop) => stop.x !== undefined) && (
              <HStack hAlign="center">
                <span
                  style={{
                    position: 'relative',
                    border: RULE,
                    borderRadius: 'var(--radius-element)',
                    padding: 'var(--spacing-4)',
                  }}
                >
                  {preview}
                  {tabOrder.map((stop, index) =>
                    stop.x === undefined || stop.y === undefined ? null : (
                      <span
                        key={index}
                        aria-hidden
                        style={{
                          ...stopMarker(active === index),
                          left: `${stop.x}%`,
                          top: `${stop.y}%`,
                        }}
                      >
                        {index + 1}
                      </span>
                    ),
                  )}
                </span>
              </HStack>
            )}

            <VStack gap={0}>
              {tabOrder.map((stop, index) => (
                <VStack
                  key={index}
                  gap={0}
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() => setActive(null)}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    borderRadius: 'var(--radius-element)',
                    backgroundColor:
                      active === index ? 'var(--color-background-muted)' : 'transparent',
                    transition: 'background-color var(--duration-fast, 120ms) ease',
                  }}
                >
                  <HStack gap={3} vAlign="center">
                    <span style={listMarker(active === index)}>{index + 1}</span>
                    <Text weight="semibold">{stop.target}</Text>
                    {stop.skipped && <Badge tone="neutral">not in the product</Badge>}
                  </HStack>
                  <VStack gap={0} style={{ paddingInlineStart: 'calc(var(--spacing-5) + var(--spacing-3))' }}>
                    <Text color="secondary">{stop.announced}</Text>
                    {stop.note && (
                      <Text type="supporting" color="secondary">
                        {stop.note}
                      </Text>
                    )}
                  </VStack>
                </VStack>
              ))}
            </VStack>
          </VStack>
        </Section>
      )}

      {names && names.length > 0 && (
        <Section
          title="Names and roles"
          hint="What assistive technology calls each part, and what supplies that name."
        >
          <Table density="compact">
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Element</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Accessible name</TableHeaderCell>
                <TableHeaderCell>From</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {names.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Text weight="semibold">{entry.element}</Text>
                  </TableCell>
                  <TableCell>
                    <Mono>{entry.role}</Mono>
                  </TableCell>
                  <TableCell>
                    <Text>{entry.name}</Text>
                  </TableCell>
                  <TableCell>
                    <Text color="secondary">{entry.source}</Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      )}

      {adaptation && adaptation.length > 0 && (
        <Section
          title="Reflow and zoom"
          hint="What happens when the viewport is not the one the design assumed. 400% zoom is the WCAG bar."
        >
          <Table density="compact">
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Condition</TableHeaderCell>
                <TableHeaderCell>Behaviour</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adaptation.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <HStack gap={2} vAlign="center">
                      <Text weight="semibold">{entry.condition}</Text>
                      {entry.verdict && (
                        <Badge tone={VERDICT_TONE[entry.verdict]}>
                          {VERDICT_LABEL[entry.verdict]}
                        </Badge>
                      )}
                    </HStack>
                  </TableCell>
                  <TableCell>
                    <Text color="secondary">{entry.behaviour}</Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      )}
    </VStack>
  );
}
