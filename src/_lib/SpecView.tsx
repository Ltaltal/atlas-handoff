// SpecView — the two ways of reading a component's measurements, behind one
// toggle in the section header.
//
//   Numbers — callouts on the component, explained in a panel beside it.
//   Measure — the box model of the component itself.
//
// They answer different questions. Numbers is for the values someone has
// decided are worth stating; Measure is for the one they are looking at right
// now and cannot find in the list. Neither measures the handoff's own layout,
// which is the only thing that is never the answer.

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Layout, LayoutPanel, LayoutContent } from '@astryxdesign/core/Layout';
import { VStack, HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Divider } from '@astryxdesign/core/Divider';
import { Tabs, Icon } from '@ds';

export type SpecViewMode = 'numbers' | 'measure';

export interface SpecNote {
  /** Horizontal position over the component, 0–100 (%). */
  x: number;
  /** Vertical position over the component, 0–100 (%). */
  y: number;
  /** The spec, e.g. "12px horizontal padding". */
  label: string;
}

/** The toggle, so a page can put it in the section header. */
export function useSpecView(initial: SpecViewMode = 'numbers') {
  const [view, setView] = useState<SpecViewMode>(initial);

  const toggle = (
    <Tabs
      variant="segmented"
      ariaLabel="Spec view"
      value={view}
      onChange={(value) => setView(value as SpecViewMode)}
      items={[
        { value: 'numbers', label: '', icon: <Icon name="numbers" size={14} label="Callouts" /> },
        { value: 'measure', label: '', icon: <Icon name="ruler" size={14} label="Measure" /> },
      ]}
    />
  );

  return { view, toggle };
}

/* --------------------------------------------------------------- callouts -- */

const marker = (active: boolean, dimmed: boolean): CSSProperties => ({
  position: 'absolute',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'var(--spacing-5)',
  height: 'var(--spacing-5)',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'var(--color-accent)',
  color: 'var(--color-on-accent)',
  fontSize: 'var(--font-size-2xs)',
  fontWeight: 'var(--font-weight-semibold)',
  transform: active ? 'translate(-50%, -50%) scale(1.25)' : 'translate(-50%, -50%)',
  opacity: dimmed ? 0.25 : 1,
  transition: 'transform 120ms ease, opacity 120ms ease',
  zIndex: active ? 2 : 1,
});

/* ---------------------------------------------------------------- measure -- */

interface Box {
  /** Offset from the component root, so a part can be drawn in place. */
  top: number;
  left: number;
  width: number;
  height: number;
  margin: [number, number, number, number];
  border: [number, number, number, number];
  padding: [number, number, number, number];
  content: { width: number; height: number };
}

const px = (value: string) => Math.round(parseFloat(value) || 0);

function readBox(el: HTMLElement, host: HTMLElement): Box {
  const r = el.getBoundingClientRect();
  const h = host.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const sides = (prefix: string, suffix = ''): [number, number, number, number] => [
    px(cs.getPropertyValue(`${prefix}-top${suffix}`)),
    px(cs.getPropertyValue(`${prefix}-right${suffix}`)),
    px(cs.getPropertyValue(`${prefix}-bottom${suffix}`)),
    px(cs.getPropertyValue(`${prefix}-left${suffix}`)),
  ];
  const border = sides('border', '-width');
  const padding = sides('padding');
  return {
    top: r.top - h.top,
    left: r.left - h.left,
    width: r.width,
    height: r.height,
    margin: sides('margin'),
    border,
    padding,
    content: {
      width: Math.round(r.width - border[1] - border[3] - padding[1] - padding[3]),
      height: Math.round(r.height - border[0] - border[2] - padding[0] - padding[2]),
    },
  };
}

const chip = (color: string): CSSProperties => ({
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  padding: '0 var(--spacing-1)',
  borderRadius: 'var(--radius-element)',
  backgroundColor: `var(--color-background-${color})`,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-code)',
  fontSize: 'var(--font-size-2xs)',
  lineHeight: 'var(--spacing-4)',
  whiteSpace: 'nowrap',
  zIndex: 3,
});

function Edge({ value, color, style }: { value: number; color: string; style: CSSProperties }) {
  if (value <= 0) return null;
  return <span style={{ ...chip(color), ...style }}>{value}</span>;
}

/** The box model, drawn over the component and nothing else. */
function BoxModel({ box }: { box: Box }) {
  const [mt, mr, mb, ml] = box.margin;
  const [bt, br, bb, bl] = box.border;
  const [pt, pr, pb, pl] = box.padding;

  const midX = ml + box.width / 2;
  const midY = mt + box.height / 2;

  const band = (color: string, opacity: number, s: CSSProperties): CSSProperties => ({
    position: 'absolute',
    backgroundColor: `var(--color-background-${color})`,
    opacity,
    ...s,
  });

  // A band with nothing to show is the same rectangle as the one under it, and
  // four of those stacked tint the whole component a muddy olive. Draw each one
  // only where it actually occupies space.
  const has = (sides: [number, number, number, number]) => sides.some((side) => side > 0);

  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        top: box.top - mt,
        left: box.left - ml,
        width: box.width + ml + mr,
        height: box.height + mt + mb,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {has(box.margin) && <span style={band('orange', 0.35, { inset: 0 })} />}
      {has(box.border) && (
        <span
          style={band('yellow', 0.4, {
            top: mt,
            left: ml,
            width: box.width,
            height: box.height,
          })}
        />
      )}
      {has(box.padding) && (
        <span
          style={band('green', 0.4, {
            top: mt + bt,
            left: ml + bl,
            width: box.width - bl - br,
            height: box.height - bt - bb,
          })}
        />
      )}
      {/* Outlined, not filled — painting over the component hides the thing
          being measured. */}
      <span
        style={{
          position: 'absolute',
          top: mt + bt + pt,
          left: ml + bl + pl,
          width: box.content.width,
          height: box.content.height,
          outline: '1px dashed var(--color-border-emphasized)',
        }}
      />

      {/* Above the box, not across it — the middle is where the content is. */}
      <span style={{ ...chip('blue'), top: mt - 10, left: midX }}>
        {`${box.content.width} × ${box.content.height}`}
      </span>

      <Edge value={pt} color="green" style={{ top: mt + bt + pt / 2, left: midX }} />
      <Edge value={pb} color="green" style={{ top: mt + box.height - bb - pb / 2, left: midX }} />
      <Edge value={pl} color="green" style={{ top: midY, left: ml + bl + pl / 2 }} />
      <Edge value={pr} color="green" style={{ top: midY, left: ml + box.width - br - pr / 2 }} />

      <Edge value={mt} color="orange" style={{ top: mt / 2, left: midX }} />
      <Edge value={mb} color="orange" style={{ top: mt + box.height + mb / 2, left: midX }} />
      <Edge value={ml} color="orange" style={{ top: midY, left: ml / 2 }} />
      <Edge value={mr} color="orange" style={{ top: midY, left: ml + box.width + mr / 2 }} />
    </span>
  );
}

const SWATCHES: [string, string][] = [
  ['blue', 'content'],
  ['green', 'padding'],
  ['yellow', 'border'],
  ['orange', 'margin'],
];

/* ------------------------------------------------------------------ view -- */

export interface SpecViewProps {
  view: SpecViewMode;
  /** Width measurement shown with the callouts, e.g. "200px". */
  width?: string;
  height?: string;
  notes?: SpecNote[];
  children: ReactNode;
}

export function SpecView({ view, width, height, notes = [], children }: SpecViewProps) {
  const [active, setActive] = useState<number | null>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [rootBox, setRootBox] = useState<Box | null>(null);
  const target = useRef<HTMLSpanElement>(null);

  const root = () => target.current?.firstElementChild as HTMLElement | null;

  // The whole component, for the panel readout. Always this, never a part, so
  // the numbers on the right describe the thing the section is about.
  useLayoutEffect(() => {
    const el = root();
    const host = target.current;
    setRootBox(view === 'measure' && el && host ? readBox(el, host) : null);
  }, [view, children]);

  /**
   * Whatever is under the pointer, as long as it belongs to the component.
   *
   * A composite is mostly its parts — on a stepper the useful answer is that a
   * node is 20px, not that the row is 360. Anything outside the component is
   * ignored, so the wrapper and the page are never measurable.
   */
  const trackPart = (event: React.MouseEvent) => {
    if (view !== 'measure') return;
    const el = root();
    const host = target.current;
    if (!el || !host) return;
    const hit = event.target as HTMLElement;
    setBox(el === hit || el.contains(hit) ? readBox(hit, host) : null);
  };

  const canvas = (
    <HStack hAlign="center" vAlign="center" style={{ minHeight: 180 }}>
      {/* The overlay is a lens, not a state: leaving it on permanently means
          the component is always behind three coloured bands. It appears while
          the pointer is over the component and gets out of the way after. */}
      <span
        ref={target}
        onMouseMove={trackPart}
        onMouseLeave={() => setBox(null)}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        {children}
        {view === 'measure' && box && <BoxModel box={box} />}
        {view === 'numbers' &&
          notes.map((note, index) => (
            <span
              key={index}
              aria-hidden
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              style={{
                ...marker(active === index, active !== null && active !== index),
                left: `${note.x}%`,
                top: `${note.y}%`,
              }}
            >
              {index + 1}
            </span>
          ))}
      </span>
    </HStack>
  );

  const panel =
    view === 'numbers' ? (
      <VStack gap={3}>
        <Text type="supporting" weight="semibold" color="secondary">
          CALLOUTS
        </Text>
        {(width || height) && (
          <VStack gap={0}>
            {width && (
              <HStack gap={2} justify="between">
                <Text type="supporting" color="secondary">
                  Width
                </Text>
                <Text type="supporting" style={{ fontFamily: 'var(--font-family-code)' }}>
                  {width}
                </Text>
              </HStack>
            )}
            {height && (
              <HStack gap={2} justify="between">
                <Text type="supporting" color="secondary">
                  Height
                </Text>
                <Text type="supporting" style={{ fontFamily: 'var(--font-family-code)' }}>
                  {height}
                </Text>
              </HStack>
            )}
            <Divider />
          </VStack>
        )}
        <VStack gap={0}>
          {notes.map((note, index) => (
            <HStack
              key={index}
              gap={2}
              vAlign="center"
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              style={{
                padding: 'var(--spacing-1) var(--spacing-2)',
                borderRadius: 'var(--radius-element)',
                backgroundColor:
                  active === index ? 'var(--color-background-muted)' : 'transparent',
                transition: 'background-color 120ms ease',
              }}
            >
              <span
                style={{
                  ...marker(active === index, false),
                  position: 'static',
                  transform: 'none',
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </span>
              <Text type="supporting" color={active === index ? 'primary' : 'secondary'}>
                {note.label}
              </Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
    ) : (
      <VStack gap={3}>
        <Text type="supporting" weight="semibold" color="secondary">
          BOX MODEL
        </Text>
        <VStack gap={2}>
          {SWATCHES.map(([color, label]) => (
            <HStack key={label} gap={2} vAlign="center">
              <span
                style={{
                  width: 'var(--spacing-3)',
                  height: 'var(--spacing-3)',
                  flexShrink: 0,
                  borderRadius: 'var(--radius-element)',
                  backgroundColor: `var(--color-background-${color})`,
                }}
              />
              <Text type="supporting" color="secondary">
                {label}
              </Text>
              {rootBox && (
                <HStack justify="end" style={{ marginInlineStart: 'auto' }}>
                  <Text type="supporting" style={{ fontFamily: 'var(--font-family-code)' }}>
                    {label === 'content'
                      ? `${rootBox.content.width} × ${rootBox.content.height}`
                      : label === 'padding'
                        ? rootBox.padding.join(' ')
                        : label === 'border'
                          ? rootBox.border.join(' ')
                          : rootBox.margin.join(' ')}
                  </Text>
                </HStack>
              )}
            </HStack>
          ))}
        </VStack>
        <Text type="supporting" color="secondary">
          The component as a whole. Point at any part of it to measure that part instead.
        </Text>
      </VStack>
    );

  return (
    <Layout height="auto" style={{ width: '100%' }} end={<LayoutPanel width={260} hasDivider padding={4} label="Spec">{panel}</LayoutPanel>}>
      <LayoutContent padding={6}>{canvas}</LayoutContent>
    </Layout>
  );
}
