// Markdown — the design system's renderer. The context page and every spec
// note are plain markdown, and the system already knows how to set it.

import { Markdown as BaseMarkdown } from '@astryxdesign/core/Markdown';

export function Markdown({ source }: { source: string }) {
  return <BaseMarkdown headingLevelStart={2}>{source}</BaseMarkdown>;
}
