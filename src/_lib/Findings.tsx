// Findings — one shape for every review in the handoff. A review is a list of
// criteria, and each criterion gets the same four things: a verdict, what was
// actually found, what to do about it, and where it applies.
//
// Heuristics, accessibility, design drift and content all use this, so a reader
// learns the format once.

import { useState, type ReactNode } from 'react';
import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { Badge, Button, Icon, type BadgeTone } from '@ds';
import { useHandoffNav, type NavTarget } from './navigation';

export type Verdict = 'pass' | 'concern' | 'fail' | 'na';

export interface FindingLink {
  label: string;
  target: NavTarget;
}

export interface Finding {
  /** Criterion being reviewed, e.g. "Visibility of system status". */
  title: string;
  verdict: Verdict;
  /** What was found in this feature. */
  observation: string;
  /** What to do about it. Omit when the verdict is a pass. */
  recommendation?: string;
  /** Live proof, rendered inside the finding. */
  evidence?: ReactNode;
  /** Where in the handoff this applies. */
  affects?: FindingLink[];
}

export interface FindingsProps {
  items: Finding[];
  /** Word for one item, used in the summary. Default "checks". */
  unit?: string;
}

const VERDICT: Record<Verdict, { label: string; short: string; tone: BadgeTone }> = {
  pass: { label: 'Passes', short: 'Pass', tone: 'success' },
  concern: { label: 'Needs work', short: 'Needs work', tone: 'warning' },
  fail: { label: 'Fails', short: 'Fail', tone: 'danger' },
  na: { label: 'Not applicable', short: 'N/A', tone: 'neutral' },
};

const ORDER: Verdict[] = ['pass', 'concern', 'fail', 'na'];

export function Findings({ items, unit = 'checks' }: FindingsProps) {
  const navigate = useHandoffNav();
  const [filter, setFilter] = useState<Verdict | 'all'>('all');

  const countOf = (verdict: Verdict) => items.filter((item) => item.verdict === verdict).length;
  const present = ORDER.filter((verdict) => countOf(verdict) > 0);
  const scored = items.filter((item) => item.verdict !== 'na').length || 1;
  const percent = Math.round((countOf('pass') / scored) * 100);

  const visible = filter === 'all' ? items : items.filter((item) => item.verdict === filter);

  return (
    <VStack gap={4}>
      <HStack justify="between" vAlign="center" gap={3}>
        <HStack gap={1} vAlign="center">
          <Button
            variant={filter === 'all' ? 'secondary' : 'subtle'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            {`All ${items.length}`}
          </Button>
          {present.map((verdict) => (
            <Button
              key={verdict}
              variant={filter === verdict ? 'secondary' : 'subtle'}
              size="sm"
              onClick={() => setFilter(verdict)}
            >
              {`${VERDICT[verdict].label} ${countOf(verdict)}`}
            </Button>
          ))}
        </HStack>
        <Text type="supporting" color="secondary">
          {countOf('pass')}/{scored} {unit} pass ({percent}%)
        </Text>
      </HStack>

      <ProgressBar value={percent} max={100} label={`${percent}% of ${unit} pass`} isLabelHidden />

      {visible.length === 0 ? (
        <Text color="secondary">Nothing in this category.</Text>
      ) : (
        <VStack gap={3}>
          {visible.map((item) => {
            const index = items.indexOf(item) + 1;
            const verdict = VERDICT[item.verdict];
            return (
              <Card key={item.title} padding={5}>
                <VStack gap={3}>
                  <HStack gap={3} vAlign="center" justify="between">
                    <HStack gap={3} vAlign="center">
                      <Text type="supporting" color="secondary" hasTabularNumbers>
                        {index}
                      </Text>
                      <Heading level={3} style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        {item.title}
                      </Heading>
                    </HStack>
                    <Badge tone={verdict.tone}>{verdict.short}</Badge>
                  </HStack>

                  {item.evidence && (
                    <Card padding={4} variant="muted">
                      {item.evidence}
                    </Card>
                  )}

                  <Grid columns={{ minWidth: 260, repeat: 'fit' }} gap={4}>
                    <VStack gap={0}>
                      <Text type="supporting" weight="semibold" color="secondary">
                        WHAT WE FOUND
                      </Text>
                      <Text color="secondary">{item.observation}</Text>
                    </VStack>
                    {item.recommendation && (
                      <VStack gap={0}>
                        <Text type="supporting" weight="semibold" color="secondary">
                          RECOMMENDATION
                        </Text>
                        <Text color="secondary">{item.recommendation}</Text>
                      </VStack>
                    )}
                  </Grid>

                  {item.affects && item.affects.length > 0 && (
                    <HStack gap={1} vAlign="center">
                      {item.affects.map((link) => (
                        <Button
                          key={link.label}
                          variant="subtle"
                          size="sm"
                          icon={<Icon name="arrowRight" size={13} />}
                          iconAfter
                          onClick={() => navigate(link.target)}
                        >
                          {link.label}
                        </Button>
                      ))}
                    </HStack>
                  )}
                </VStack>
              </Card>
            );
          })}
        </VStack>
      )}
    </VStack>
  );
}
