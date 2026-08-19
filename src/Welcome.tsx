// Welcome — the hub. Opens with what this handoff answers, as entry points
// rather than a table of contents, then the features themselves.

import { Card } from '@astryxdesign/core/Card';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Grid } from '@astryxdesign/core/Grid';
import { Stack, VStack, HStack } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Divider } from '@astryxdesign/core/Divider';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Badge, Icon } from '@ds';
import type { NavModel, FeatureNode } from '@handoff/registry';
import { useHandoffNav } from '@handoff/navigation';
import { BrandMark } from './BrandMark';
import { firstSelection, type Selection } from './Sidebar';

export interface WelcomeHubProps {
  nav: NavModel;
  onOpen: (selection: Selection) => void;
}

export function WelcomeHub({ nav, onOpen }: WelcomeHubProps) {
  const navigate = useHandoffNav();
  const primary = nav.features[0];
  const highlights = primary?.highlights ?? [];

  return (
    <VStack gap={8}>
      <VStack gap={3}>
        <BrandMark size="lg" />
        <Heading level={1} type="display-3">
          Design handoff
        </Heading>
        <Text color="secondary">
          Vibe coding gets you a working feature in an afternoon. What it does not get
          you is the thing a designer used to make before the code existed — the flow,
          the states nobody remembers until support asks, the measurements, and the
          reasoning. This is that, produced from the code instead of beside it.
        </Text>
      </VStack>

      {/* Three sentences rather than a manifesto: the argument has to survive
          being read in the four seconds someone gives a landing page. */}
      <Grid columns={{ minWidth: 240, repeat: 'fit' }} gap={3}>
        {[
          {
            title: 'It cannot go stale',
            body: 'Specs are measured from the running component and the reviews are read off the real screens. A design file drifts the moment someone edits the code.',
          },
          {
            title: 'Built from your components',
            body: 'The prototype uses the product\u2019s real components, so one moves between here and the app instead of being redrawn.',
          },
          {
            title: 'Exploration stays with it',
            body: 'The directions taken, parked and dropped sit next to the thing that shipped, rather than in someone\u2019s personal file.',
          },
        ].map((item) => (
          <Card key={item.title} padding={4} variant="muted">
            <VStack gap={1}>
              <Text weight="semibold">{item.title}</Text>
              <Text type="supporting" color="secondary">
                {item.body}
              </Text>
            </VStack>
          </Card>
        ))}
      </Grid>

      {highlights.length > 0 && (
        <VStack gap={3}>
          <Text type="supporting" weight="semibold" color="secondary">
            WHAT THIS HANDOFF ANSWERS
          </Text>
          <Grid columns={{ minWidth: 212 }} gap={3}>
            {highlights.map((item) => (
              <ClickableCard
                key={item.label}
                label={item.label}
                padding={4}
                onClick={() =>
                  navigate(
                    item.context
                      ? { feature: primary.id, context: true }
                      : { feature: primary.id, page: item.page },
                  )
                }
              >
                <VStack gap={1}>
                  <Text type="large" weight="semibold">
                    {item.label}
                  </Text>
                  <Text type="supporting" color="secondary">
                    {item.hint}
                  </Text>
                </VStack>
              </ClickableCard>
            ))}
          </Grid>
        </VStack>
      )}

      <Divider />

      <VStack gap={3}>
        <Text type="supporting" weight="semibold" color="secondary">
          FEATURES
        </Text>
        {nav.features.length > 0 ? (
          <Grid columns={{ minWidth: 300 }} gap={3}>
            {nav.features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} onOpen={onOpen} />
            ))}
          </Grid>
        ) : (
          <EmptyState
            title="Nothing here yet"
            description="Features appear here as soon as they are added."
          />
        )}
      </VStack>
    </VStack>
  );
}

function FeatureCard({
  feature,
  onOpen,
}: {
  feature: FeatureNode;
  onOpen: (selection: Selection) => void;
}) {
  const pageCount =
    feature.sections.reduce((total, section) => total + section.pages.length, 0) +
    feature.pages.length;

  return (
    <ClickableCard
      label={feature.title}
      padding={5}
      onClick={() => onOpen(firstSelection(feature))}
    >
      <VStack gap={3}>
        <HStack justify="between" vAlign="center" gap={2}>
          <Heading level={3} style={{ fontWeight: 'var(--font-weight-medium)' }}>
            {feature.title}
          </Heading>
          {feature.status && <Badge tone="warning">{feature.status}</Badge>}
        </HStack>

        {feature.description && <Text color="secondary">{feature.description}</Text>}

        <HStack justify="between" vAlign="center" gap={2}>
          <HStack gap={2} vAlign="center">
            {feature.designer && <Avatar name={feature.designer} size="xsm" />}
            <Text type="supporting" color="secondary">
              {feature.designer ?? 'Unassigned'} · {pageCount} pages
            </Text>
          </HStack>
          <Stack direction="horizontal" gap={1} vAlign="center">
            <Text type="supporting" weight="semibold" color="accent">
              Open
            </Text>
            <Icon name="arrowRight" size={14} />
          </Stack>
        </HStack>
      </VStack>
    </ClickableCard>
  );
}
