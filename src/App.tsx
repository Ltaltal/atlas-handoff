// App — the handoff shell, assembled from the design system's own frame.
//
//   AppShell   the page, with the navigation rail in its sideNav slot
//   SideNav    brand, the navigation tree, and the theme toggle
//   Layout     a header for the breadcrumb, the page in the middle, and the
//              spec panel in the end slot when the page has one to show
//
// The shell also owns cross-page navigation: pages address each other by label
// through `@handoff/navigation`, and targets are resolved here.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppShell } from '@astryxdesign/core/AppShell';
import { SideNav } from '@astryxdesign/core/SideNav';
import { TreeList } from '@astryxdesign/core/TreeList';
import { Layout, LayoutHeader, LayoutContent, LayoutPanel } from '@astryxdesign/core/Layout';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Breadcrumbs, BreadcrumbItem } from '@astryxdesign/core/Breadcrumbs';
import { Icon } from '@ds';
import { discover } from '@handoff/discovery';
import { buildNav, featurePages } from '@handoff/registry';
import { Markdown } from '@handoff/Markdown';
import { Page } from '@handoff/Page';
import { SpecPane } from '@handoff/SpecPane';
import { NavigationProvider, type NavTarget } from '@handoff/navigation';
import { applyTheme, loadThemeName, type ThemeName } from './theme';
import { WelcomeHub } from './Welcome';
import { BrandMark } from './BrandMark';
import { buildTree, selectionKey, type Selection } from './Sidebar';
import { GettingStarted } from './GettingStarted';

export function App() {
  const nav = useMemo(() => buildNav(discover()), []);
  const [theme, setTheme] = useState<ThemeName>(() => loadThemeName());
  const [selection, setSelection] = useState<Selection>({ kind: 'welcome' });
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme((previous) => {
      const next: ThemeName = previous === 'light' ? 'dark' : 'light';
      applyTheme(next);
      return next;
    });
  };

  const allFeatures = useMemo(() => [...nav.features, ...nav.archived], [nav]);
  const feature =
    selection.kind === 'welcome' || selection.kind === 'guide'
      ? undefined
      : allFeatures.find((node) => node.id === selection.featureId);
  const page =
    selection.kind === 'page' && feature
      ? featurePages(feature).find((leaf) => leaf.key === selection.key)
      : undefined;

  // Resolve a page-to-page target into a Selection. Targets address pages by
  // label, so a feature never has to know internal keys.
  const navigate = useCallback(
    (target: NavTarget) => {
      if (target.home) {
        setSelection({ kind: 'welcome' });
        return;
      }
      // A page that belongs to no feature — the hub, the guide — can still
      // link into one. Without this fallback those links silently do nothing.
      const featureId =
        target.feature ??
        (selection.kind === 'welcome' || selection.kind === 'guide'
          ? nav.features[0]?.id
          : selection.featureId);
      if (!featureId) return;
      const node = allFeatures.find((item) => item.id === featureId);
      if (!node) return;

      if (target.context || !target.page) {
        setSelection({ kind: 'spec', featureId });
        return;
      }
      const found = featurePages(node).find((leaf) => leaf.label === target.page);
      setSelection(
        found ? { kind: 'page', featureId, key: found.key } : { kind: 'spec', featureId },
      );
    },
    [allFeatures, nav.features, selection],
  );

  // Every navigation starts the reader at the top of the new page.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [selection]);

  const spec = page?.componentSpec ? (
    <SpecPane spec={page.componentSpec} />
  ) : page?.notes ? (
    <Markdown source={page.notes} />
  ) : null;

  const currentLabel =
    selection.kind === 'spec' ? (feature?.specLabel ?? 'Context') : (page?.label ?? '');
  const key = selectionKey(selection);

  const tree = buildTree({ nav, selection, onSelect: setSelection });

  return (
    <NavigationProvider navigate={navigate}>
      <AppShell
        contentPadding={0}
        sideNav={
          <SideNav
            resizable={{ defaultWidth: 288, minWidth: 220, maxWidth: 400 }}
            header={
              <HStack justify="between" vAlign="center" width="100%" padding={2}>
                <BrandMark subtitle />
                <IconButton
                  label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
                  tooltip={theme === 'light' ? 'Dark theme' : 'Light theme'}
                  variant="ghost"
                  size="sm"
                  icon={<Icon name={theme === 'light' ? 'moon' : 'sun'} size={16} />}
                  onClick={toggleTheme}
                />
              </HStack>
            }
          >
            <TreeList items={tree} density="compact" variant="noGuides" />
          </SideNav>
        }
      >
        <Layout
          height="fill"
          header={
            <LayoutHeader hasDivider padding={4}>
              <Breadcrumbs label="Page location">
                <BreadcrumbItem onClick={() => setSelection({ kind: 'welcome' })}>
                  Overview
                </BreadcrumbItem>
                {feature && (
                  <BreadcrumbItem
                    onClick={() => setSelection({ kind: 'spec', featureId: feature.id })}
                  >
                    {feature.title}
                  </BreadcrumbItem>
                )}
                {feature && currentLabel && (
                  <BreadcrumbItem isCurrent>{currentLabel}</BreadcrumbItem>
                )}
              </Breadcrumbs>
            </LayoutHeader>
          }
          end={
            spec ? (
              <LayoutPanel width={336} hasDivider isScrollable padding={4} label="Specs">
                <VStack gap={4} key={key}>
                  <Text type="supporting" color="secondary" weight="semibold">
                    SPECS
                  </Text>
                  {spec}
                </VStack>
              </LayoutPanel>
            ) : undefined
          }
        >
          <LayoutContent isScrollable padding={6} ref={scrollRef}>
            {/* A fixed measure, centred, so the reading column stays the same
                width no matter how wide the window gets. The bottom gutter is
                the content padding again: 24px alone leaves the last line of a
                long page sitting on the edge of the window. */}
            <VStack
              gap={5}
              key={key}
              width="100%"
              maxWidth={960}
              style={{ marginInline: 'auto', paddingBottom: 'var(--spacing-10)' }}
            >
              {selection.kind === 'guide' ? (
                <GettingStarted />
              ) : selection.kind === 'welcome' || !feature ? (
                <WelcomeHub nav={nav} onOpen={setSelection} />
              ) : selection.kind === 'spec' ? (
                <Page title={feature.title} eyebrow={feature.specLabel} status={feature.status}>
                  {feature.spec ? (
                    <Markdown source={feature.spec} />
                  ) : (
                    <Text color="secondary">This feature has no written context yet.</Text>
                  )}
                </Page>
              ) : page ? (
                <page.render />
              ) : (
                <WelcomeHub nav={nav} onOpen={setSelection} />
              )}
            </VStack>
          </LayoutContent>
        </Layout>
      </AppShell>
    </NavigationProvider>
  );
}
