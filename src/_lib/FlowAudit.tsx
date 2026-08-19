// FlowAudit — checks a claim about every screen by looking at every screen.
//
// A heuristic verdict is a judgement and stays a person's to make. What it
// rests on usually is not: "the stepper is on every screen", "Back works
// everywhere", "the primary action sits bottom-right" are all statements about
// the markup, and the markup can answer them.
//
// So the judgement stays written down, and the sentence underneath it is
// generated. If someone drops the stepper from a screen, the review says so
// without anyone remembering to re-read it.

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@ds';

export interface FlowCheck {
  /** What is being claimed about every screen. */
  claim: string;
  /** Answer it for one screen. */
  test: (screen: HTMLElement) => boolean;
  /** Optional detail, e.g. the differing labels it found. */
  detail?: (screens: HTMLElement[]) => string | undefined;
}

export interface FlowAuditProps {
  /** One entry per screen, in flow order. */
  screens: { id: string; label: string; render: ReactNode }[];
  checks: FlowCheck[];
}

interface CheckResult {
  claim: string;
  passed: string[];
  failed: string[];
  detail?: string;
}

/** The visible text of a control, with the duplicate sizing copy collapsed. */
export function labelOf(el: Element): string {
  const text = el.textContent?.trim().replace(/\s+/g, ' ') ?? '';
  const half = text.slice(0, text.length / 2);
  return half && text === half + half ? half : text;
}

export function FlowAudit({ screens, checks }: FlowAuditProps) {
  const host = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<CheckResult[] | null>(null);

  useLayoutEffect(() => {
    if (!host.current) return;
    const nodes = [...host.current.children] as HTMLElement[];
    setResults(
      checks.map((check) => {
        const passed: string[] = [];
        const failed: string[] = [];
        nodes.forEach((node, index) => {
          const label = screens[index]?.label ?? String(index);
          (check.test(node) ? passed : failed).push(label);
        });
        return { claim: check.claim, passed, failed, detail: check.detail?.(nodes) };
      }),
    );
  }, [screens, checks]);

  return (
    <VStack gap={3}>
      {/* Rendered off to the side rather than not at all: a screen that was
          never laid out would answer differently from the one that ships.
          `inert` keeps its controls out of the tab order — otherwise this would
          add fifteen invisible stops, which is the very thing it checks for. */}
      <div
        ref={host}
        aria-hidden
        inert
        style={{ position: 'absolute', left: '-10000px', width: 460 }}
      >
        {screens.map((screen) => (
          <div key={screen.id}>{screen.render}</div>
        ))}
      </div>

      {results?.map((result) => (
        <HStack key={result.claim} gap={3} vAlign="start">
          <Badge tone={result.failed.length ? 'warning' : 'success'}>
            {result.failed.length ? `${result.passed.length}/${screens.length}` : 'All'}
          </Badge>
          <VStack gap={0.5}>
            <Text>{result.claim}</Text>
            {result.failed.length > 0 && (
              <Text type="supporting" color="secondary">
                Not on: {result.failed.join(', ')}
              </Text>
            )}
            {result.detail && (
              <Text type="supporting" color="secondary">
                {result.detail}
              </Text>
            )}
          </VStack>
        </HStack>
      ))}
    </VStack>
  );
}
