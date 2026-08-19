// GettingStarted — the page a designer lands on after forking this, and the
// one that has to answer "so what do I actually do".
//
// The thing worth explaining is that there is no configuration step: pages are
// files, and the navigation is whatever is on disk. Everything else follows
// from that.

import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Divider } from '@astryxdesign/core/Divider';
import { Badge, Icon } from '@ds';
import { Page } from '@handoff/Page';
import { useHandoffNav } from '@handoff/navigation';

/** One numbered step in the walkthrough. */
function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <HStack gap={2} vAlign="start">
      {/* Just the number. It keeps its width so the titles line up, and sits
          on the heading's baseline rather than in a badge of its own. */}
      <span
        style={{
          display: 'inline-block',
          width: 'var(--spacing-3)',
          flexShrink: 0,
          color: 'var(--color-text-secondary)',
          lineHeight: 'var(--line-height-lg)',
        }}
      >
        {n}
      </span>
      <VStack gap={2}>
        {/* Still an h3, so the page keeps its outline — a step is a step. It
            just does not need bold to say so when the number already does. */}
        <Heading level={3} style={{ fontWeight: 'var(--font-weight-medium)' }}>
          {title}
        </Heading>
        {children}
      </VStack>
    </HStack>
  );
}

/** A file, and what appears in the site because of it. */
function Mapping({ file, becomes }: { file: string; becomes: string }) {
  return (
    <HStack gap={3} vAlign="center" wrap="wrap">
      <Text style={{ fontFamily: 'var(--font-family-code)' }}>{file}</Text>
      <Icon name="arrowRight" size={13} />
      <Text color="secondary">{becomes}</Text>
    </HStack>
  );
}

export function GettingStarted() {
  const navigate = useHandoffNav();

  return (
    <Page
      title="Getting started"
      eyebrow="Start here"
      description="Vibe coding leaves a gap where the design thinking used to be. This closes it: prototype the feature in code, and the site around it — navigation, specs, reviews — assembles itself from the files you write."
    >
      <VStack gap={5}>
        <Heading level={2}>Run it</Heading>
        <CodeBlock
          code={'yarn install\nyarn dev'}
          language="bash"
          style={{ width: '100%' }}
        />
        <Text color="secondary">
          That is the whole setup. There is no configuration file to fill in and nothing to
          register.
        </Text>
      </VStack>

      <Divider />

      <VStack gap={5}>
        <VStack gap={1}>
          <Heading level={2}>Nothing here is wired up by hand</Heading>
          <Text color="secondary">
            The navigation, the section grouping, the status badges and the spec pane are all
            read from the files at build time. Adding a page means adding a file; there is no
            second place to update, and nothing to forget.
          </Text>
        </VStack>

        <Card padding={5} variant="muted">
          <VStack gap={3}>
            <Text type="supporting" weight="semibold" color="secondary">
              WHAT EACH FILE BECOMES
            </Text>
            <Mapping file="my-feature.feature.ts" becomes="The feature itself, and its tile on the Overview" />
            <Mapping file="README.md" becomes="The Context page — why the feature exists" />
            <Mapping file="Flow.stories.tsx" becomes="A page, grouped by its `section`" />
            <Mapping file="Default.spec" becomes="The measurements and props in the right-hand pane" />
            <Mapping file="notes.json" becomes="The Notes board" />
            <Mapping file="links.json" becomes="The Links board" />
          </VStack>
        </Card>

        <Text color="secondary">
          A story file default-exports its metadata and named-exports the pages. The{' '}
          <Text as="span" style={{ fontFamily: 'var(--font-family-code)' }}>
            section
          </Text>{' '}
          decides which group it lands in, the{' '}
          <Text as="span" style={{ fontFamily: 'var(--font-family-code)' }}>
            status
          </Text>{' '}
          becomes a badge, and the order is a hint rather than a list you maintain elsewhere.
        </Text>

        <CodeBlock
          language="tsx"
          style={{ width: '100%' }}
          code={`const meta: StoryMeta = {
  title: 'Screens',
  section: 'UI',     // the group it appears under
  status: 'wip',     // renders as a badge
  order: 3,
};
export default meta;

export const Default = () => <ComponentDocs …/>;

// Picked up automatically and shown beside the component
Default.spec = { measurements: [...], props: [...] };`}
        />
      </VStack>

      <Divider />

      <VStack gap={6}>
        <Heading level={2}>Add your own</Heading>

        <Step n={1} title="Start a feature">
          <Text color="secondary">
            One folder per feature. It needs four things — a name, a line about what it is,
            who is designing it, and the problem it solves. Write them yourself, or describe
            the feature to a coding agent and let it write them: the questions are in{' '}
            <Text as="span" style={{ fontFamily: 'var(--font-family-code)' }}>
              .github/prompts
            </Text>
            , so it asks for what is missing rather than inventing it.
          </Text>
          <CodeBlock
            language="bash"
            style={{ width: '100%' }}
            code={'src/features/my-feature/\n  my-feature.feature.ts\n  README.md\n\n# or answer the same four questions in a terminal\nyarn handoff:new'}
          />
        </Step>

        <Step n={2} title="Prototype the screens">
          <Text color="secondary">
            Build the real thing in real components. The prototype is the deliverable, so the
            screens on the UI pages are the same code engineering will read — not an image of
            it.
          </Text>
        </Step>

        <Step n={3} title="Document as you go">
          <Text color="secondary">
            A component page carries its own behaviour, states, specs and accessibility.
            Measurements are worth taking from the running component rather than intent —
            the Measure toggle on any example will tell you.
          </Text>
          <HStack gap={2} wrap="wrap">
            <Badge tone="neutral">Behavior</Badge>
            <Badge tone="neutral">States</Badge>
            <Badge tone="neutral">Specs</Badge>
            <Badge tone="neutral">Accessibility</Badge>
          </HStack>
        </Step>

        <Step n={4} title="Record the thinking">
          <Text color="secondary">
            Decisions, open questions and risks go in the feature&rsquo;s{' '}
            <Text as="span" style={{ fontFamily: 'var(--font-family-code)' }}>
              notes.json
            </Text>
            . They are read-only in the site on purpose: writing one is a commit, so the
            whole team gets it rather than the browser it was typed into.
          </Text>
        </Step>

        <Step n={5} title="Check it">
          <Text color="secondary">
            Three commands. The last one catches a note pointing at a page that does not
            exist, which is the failure that otherwise goes unnoticed.
          </Text>
          <CodeBlock
            language="bash"
            style={{ width: '100%' }}
            code={'yarn typecheck\nyarn handoff:validate\nyarn build'}
          />
        </Step>
      </VStack>

      <Divider />

      <VStack gap={5}>
        <VStack gap={1}>
          <Heading level={2}>Put it in a repo you already have</Heading>
          <Text color="secondary">
            The whole thing is one folder with its own dependencies and its own scripts. It
            does not import from the app around it, and the app does not import from it, so
            it can sit next to your product code without either one knowing.
          </Text>
        </VStack>

        <CodeBlock
          language="bash"
          style={{ width: '100%' }}
          code={`# copy the folder into your repo
cp -R atlas-demo your-repo/design-handoff

cd your-repo/design-handoff
yarn install
yarn dev`}
        />

        <Text color="secondary">
          Being in the product repo is the point. The prototype can import your real
          components, so what a reviewer reads is the thing that ships rather than a copy of
          it that drifts. Nothing here is coupled to a particular bundler either — the only
          bundler-specific file is the discovery layer, which is aliased.
        </Text>
      </VStack>

      <Divider />

      <VStack gap={5}>
        <VStack gap={1}>
          <Heading level={2}>Publish it and send the link</Heading>
          <Text color="secondary">
            Building it makes a folder of ordinary files. Nothing runs behind it — no
            server, no database — so anywhere that can put a web page online will host it.
          </Text>
        </VStack>

        <CodeBlock
          language="bash"
          style={{ width: '100%' }}
          code={'yarn build     # -> dist/\nyarn preview   # check it before you share'}
        />

        <VStack gap={1}>
          <Text weight="semibold">One link, always current</Text>
          <Text color="secondary">
            This is the part worth having. Whoever you send it to opens a link and sees the
            work as it is now — not as it was the day someone exported a file. They install
            nothing and run nothing, and they get the real thing: the prototype they can
            click, the decisions, and what is finished. When the work moves on, so does the
            link.
          </Text>
        </VStack>

        <VStack gap={1}>
          <Text weight="semibold">Decide who can read it</Text>
          <Text color="secondary">
            A handoff usually describes work that has not shipped yet. Where you put it
            decides who can see it, so it is worth choosing on purpose — somewhere public
            means anyone with the link, which is sometimes right and sometimes not.
          </Text>
        </VStack>

        <Card padding={4} variant="muted">
          <VStack gap={2}>
            <Text type="supporting" weight="semibold" color="secondary">
              IF THE ADDRESS HAS ANYTHING AFTER THE SLASH
            </Text>
            <Text type="supporting" color="secondary">
              The site expects to live at the top of a web address —{' '}
              <Text as="span" style={{ fontFamily: 'var(--font-family-code)' }}>
                you.example.com
              </Text>
              . Put it somewhere deeper, like{' '}
              <Text as="span" style={{ fontFamily: 'var(--font-family-code)' }}>
                you.example.com/handoff/
              </Text>
              , and it looks for its own files in the wrong place: you get a blank page,
              with nothing on screen to say why. Worth knowing before you spend an
              afternoon on it. One line says where it lives, and everything else follows.
            </Text>
            <CodeBlock
              language="ts"
              style={{ width: '100%' }}
              code={"// vite.config.ts\nexport default defineConfig({\n  base: '/handoff/',\n});"}
            />
          </VStack>
        </Card>

        <Card padding={4} variant="muted">
          <VStack gap={2}>
            <Text type="supporting" weight="semibold" color="secondary">
              WORTH KNOWING
            </Text>
            <Text type="supporting" color="secondary">
              If you are screen-recording, record the published site rather than the one
              running on your machine. The local one quietly carries the file paths from
              your own computer, and they are visible to anyone who looks.
            </Text>
          </VStack>
        </Card>
      </VStack>

      <Divider />

      <VStack gap={5}>
        <VStack gap={1}>
          <Heading level={2}>Then make it yours</Heading>
          <Text color="secondary">
            None of the structure here is load-bearing. It is one opinion about what a
            handoff should contain, and yours will differ — teams that review together need
            different pages from teams that hand over asynchronously.
          </Text>
        </VStack>

        <Grid columns={{ minWidth: 240, repeat: 'fit' }} gap={3}>
          {[
            {
              title: 'Delete what you do not need',
              body: 'Heuristics, content guidelines, exploration — remove the file and the page goes with it. Nothing else refers to it.',
            },
            {
              title: 'Rename the sections',
              body: '"Flow", "UI", "Components" and "Reviews" are strings in your story files. Call them whatever your team already calls them.',
            },
            {
              title: 'Use your own components',
              body: 'The documented product is built from src/ds. Point it at your components and the screens, states and specs become yours. The site chrome keeps its own.',
            },
            {
              title: 'Add your own pages',
              body: 'Anything you can render is a page. Performance budgets, localisation notes, a migration plan — the format does not care.',
            },
          ].map((item) => (
            <Card key={item.title} padding={4}>
              <VStack gap={1}>
                <Text weight="semibold">{item.title}</Text>
                <Text type="supporting" color="secondary">
                  {item.body}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>

        <Text color="secondary">
          The one thing worth keeping is the shape of the argument: what the feature is for,
          how it behaves, what it is built from, and what was decided along the way. How you
          arrange that is yours.
        </Text>
      </VStack>

      <Divider />

      <VStack gap={4}>
        <Heading level={2}>Have a look around</Heading>
        <Grid columns={{ minWidth: 220, repeat: 'fit' }} gap={3}>
          {[
            { label: 'Context', hint: 'Why the example feature exists', target: { context: true } },
            { label: 'User flow', hint: 'The journey, step by step', target: { page: 'User flow' } },
            { label: 'OptionCard', hint: 'A component documented end to end', target: { page: 'OptionCard' } },
            { label: 'Accessibility', hint: 'What a keyboard makes of it', target: { page: 'Accessibility' } },
          ].map((item) => (
            <Card key={item.label} padding={0}>
              <VStack
                gap={0}
                as="button"
                onClick={() => navigate(item.target)}
                style={{
                  width: '100%',
                  textAlign: 'start',
                  padding: 'var(--spacing-4)',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--color-text-primary)',
                }}
              >
                <HStack gap={2} vAlign="center" justify="between">
                  <Text weight="semibold">{item.label}</Text>
                  <Icon name="arrowRight" size={14} />
                </HStack>
                <Text type="supporting" color="secondary">
                  {item.hint}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </VStack>
    </Page>
  );
}
