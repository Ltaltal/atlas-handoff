// LiveAudit — renders something, reads it, and shows what it found.
//
// The point is that nobody types these answers in. The component under review
// is mounted for real, the DOM it produces is inspected, and the tables below
// are that inspection. Change the component and this page changes; there is no
// second copy of the truth to forget to update.

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@astryxdesign/core/Table';
import { Badge } from '@ds';
import { audit, type AuditResult } from './audit';

export interface LiveAuditProps {
  /** Rendered for real, then read. */
  children: ReactNode;
  /** Show the thing being measured, rather than only its findings. */
  showPreview?: boolean;
  previewWidth?: number;
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <VStack gap={2}>
      <VStack gap={0.5}>
        <Text type="supporting" weight="semibold" color="secondary">
          {title}
        </Text>
        {hint && (
          <Text type="supporting" color="secondary">
            {hint}
          </Text>
        )}
      </VStack>
      {children}
    </VStack>
  );
}

export function LiveAudit({ children, showPreview = true, previewWidth = 380 }: LiveAuditProps) {
  const host = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  // After paint, so the measurement sees what the browser actually built —
  // including anything a component only renders once it has laid itself out.
  useLayoutEffect(() => {
    if (host.current) setResult(audit(host.current));
  }, [children]);

  return (
    <VStack gap={5}>
      <div
        ref={host}
        aria-hidden={showPreview ? undefined : true}
        inert={showPreview ? undefined : true}
        style={{
          width: previewWidth,
          maxWidth: '100%',
          // Kept in the layout either way: measuring something that was never
          // rendered would report a different component than the one shipped.
          position: showPreview ? 'static' : 'absolute',
          left: showPreview ? undefined : '-10000px',
        }}
      >
        {children}
      </div>

      {result && (
        <VStack gap={5}>
          <Section
            title="HEADING OUTLINE"
            hint="Read from the rendered markup. A gap between levels is called out."
          >
            <VStack gap={1}>
              {result.headings.length === 0 ? (
                <Text color="secondary">No headings.</Text>
              ) : (
                result.headings.map((heading, index) => (
                  <HStack key={index} gap={3} vAlign="center">
                    <Text
                      type="supporting"
                      weight="normal"
                      color="secondary"
                      style={{
                        fontFamily: 'var(--font-family-code)',
                        paddingInlineStart: `calc(var(--spacing-4) * ${heading.level - 1})`,
                      }}
                    >
                      h{heading.level}
                    </Text>
                    <Text>{heading.text}</Text>
                    {heading.skippedFrom && (
                      <Badge tone="warning">skips h{heading.skippedFrom + 1}</Badge>
                    )}
                  </HStack>
                ))
              )}
            </VStack>
          </Section>

          <Section
            title="TAB ORDER"
            hint={`${result.stops.length} ${result.stops.length === 1 ? 'stop' : 'stops'}, in the order the browser reports them. The name is what a screen reader would announce, and where it came from.`}
          >
            {result.stops.length === 0 ? (
              <Text color="secondary">
                Nothing here is focusable, so the component adds no stops to the page.
              </Text>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>#</TableHeaderCell>
                  <TableHeaderCell>Element</TableHeaderCell>
                  <TableHeaderCell>Role</TableHeaderCell>
                  <TableHeaderCell>Announced as</TableHeaderCell>
                  <TableHeaderCell>From</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.stops.map((stop, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Text
                        type="supporting"
                        weight="normal"
                        style={{ fontFamily: 'var(--font-family-code)' }}
                      >
                        {stop.target}
                      </Text>
                    </TableCell>
                    <TableCell>{stop.role}</TableCell>
                    <TableCell>
                      {stop.name || <Text color="secondary">— nothing —</Text>}
                    </TableCell>
                    <TableCell>
                      <Badge tone={stop.nameSource === 'none' ? 'danger' : 'neutral'}>
                        {stop.nameSource}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </Section>

          <Section title="WHAT THE CHECK FOUND">
            <VStack gap={1}>
              <HStack gap={2} vAlign="center">
                <Badge tone={result.unnamed.length ? 'danger' : 'success'}>
                  {result.unnamed.length ? `${result.unnamed.length} unnamed` : 'All named'}
                </Badge>
                <Text color="secondary">Every enabled stop has an accessible name.</Text>
              </HStack>
              <HStack gap={2} vAlign="center">
                <Badge tone={result.hiddenButFocusable.length ? 'danger' : 'success'}>
                  {result.hiddenButFocusable.length
                    ? `${result.hiddenButFocusable.length} hidden`
                    : 'None hidden'}
                </Badge>
                <Text color="secondary">
                  Nothing focusable sits inside an <code>aria-hidden</code> subtree.
                </Text>
              </HStack>
              <HStack gap={2} vAlign="center">
                <Badge
                  tone={result.headings.some((h) => h.skippedFrom) ? 'warning' : 'success'}
                >
                  {result.headings.some((h) => h.skippedFrom) ? 'Level skipped' : 'Outline intact'}
                </Badge>
                <Text color="secondary">Heading levels descend one at a time.</Text>
              </HStack>
            </VStack>
          </Section>
        </VStack>
      )}
    </VStack>
  );
}
