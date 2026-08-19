// Playground — drive a component from its props and watch it change, with the
// code kept in sync underneath. The states grid on a component page shows what
// exists; this is for the questions a grid cannot answer, like what a long
// label does to the layout.

import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Layout, LayoutPanel, LayoutContent } from '@astryxdesign/core/Layout';
import { VStack, HStack, Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Switch } from '@astryxdesign/core/Switch';
import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Selector } from '@astryxdesign/core/Selector';
import { Divider } from '@astryxdesign/core/Divider';
import { Button, Icon, Tabs, TextInput } from '@ds';

export type ControlValue = string | boolean;

export type Control =
  | { name: string; label: string; kind: 'select'; options: string[]; initial: string; hint?: string }
  | { name: string; label: string; kind: 'boolean'; initial: boolean; hint?: string }
  | { name: string; label: string; kind: 'text'; initial: string; hint?: string };

export interface PlaygroundProps {
  controls: Control[];
  /** Render the component from the current control values. */
  render: (values: Record<string, ControlValue>) => ReactNode;
  /** Build the snippet that produces what is on the stage. */
  code?: (values: Record<string, ControlValue>) => string;
}

function initialValues(controls: Control[]): Record<string, ControlValue> {
  return Object.fromEntries(controls.map((control) => [control.name, control.initial]));
}

/**
 * A segmented control that becomes a dropdown when the options stop fitting.
 *
 * The switch is measured rather than guessed at a breakpoint, because it
 * depends on how long the option names are, not on how wide the window is. A
 * hidden copy at its natural width stays mounted so the comparison still works
 * after the swap — otherwise it could collapse to a dropdown and never come
 * back.
 */
function OptionControl({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const natural = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(true);

  useLayoutEffect(() => {
    const el = box.current;
    const copy = natural.current;
    if (!el || !copy) return;

    const check = () => setFits(copy.scrollWidth <= el.clientWidth);
    check();

    // Both sides can change: the box when the panel resizes, and the copy when
    // the web font finishes loading and every label gets wider. Watching only
    // the box measures the fallback font once and never looks again.
    const observer = new ResizeObserver(check);
    observer.observe(el);
    observer.observe(copy);
    return () => observer.disconnect();
  }, [options]);

  const items = options.map((option) => ({ value: option, label: option }));

  return (
    <div ref={box} style={{ position: 'relative', width: '100%' }}>
      {/* Measured, never seen. */}
      <div
        ref={natural}
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 'max-content',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <Tabs variant="segmented" ariaLabel={label} value={value} onChange={() => {}} items={items} />
      </div>

      {fits ? (
        <Tabs
          variant="segmented"
          ariaLabel={label}
          value={value}
          onChange={onChange}
          items={items}
        />
      ) : (
        <Selector
          label={label}
          isLabelHidden
          size="sm"
          value={value}
          onChange={onChange}
          options={items}
        />
      )}
    </div>
  );
}

export function Playground({ controls, render, code }: PlaygroundProps) {
  const initial = useMemo(() => initialValues(controls), [controls]);
  const [values, setValues] = useState<Record<string, ControlValue>>(initial);

  const set = (name: string, value: ControlValue) =>
    setValues((current) => ({ ...current, [name]: value }));

  const dirty = controls.some((control) => values[control.name] !== control.initial);

  return (
    <Layout
      height="auto"
      style={{ width: '100%' }}
      end={
        <LayoutPanel width={280} hasDivider padding={4} label="Props">
          <VStack gap={4}>
            <HStack justify="between" vAlign="center">
              <Text type="supporting" weight="semibold" color="secondary">
                PROPS
              </Text>
              {dirty && (
                <Button
                  variant="subtle"
                  size="sm"
                  icon={<Icon name="reset" size={13} />}
                  onClick={() => setValues(initial)}
                >
                  Reset
                </Button>
              )}
            </HStack>

            {controls.map((control) => (
              <VStack key={control.name} gap={1}>
                {control.kind === 'boolean' ? (
                  <Switch
                    label={control.label}
                    value={Boolean(values[control.name])}
                    onChange={(checked) => set(control.name, checked)}
                    description={control.hint}
                  />
                ) : control.kind === 'select' ? (
                  <VStack gap={1}>
                    <Text type="supporting" weight="semibold">
                      {control.label}
                    </Text>
                    <OptionControl
                      label={control.label}
                      options={control.options}
                      value={String(values[control.name])}
                      onChange={(value) => set(control.name, value)}
                    />
                    {control.hint && (
                      <Text type="supporting" color="secondary">
                        {control.hint}
                      </Text>
                    )}
                  </VStack>
                ) : (
                  <TextInput
                    label={control.label}
                    showLabel
                    value={String(values[control.name] ?? '')}
                    onValueChange={(value) => set(control.name, value)}
                    description={control.hint}
                  />
                )}
              </VStack>
            ))}

            {code && (
              <VStack gap={2}>
                <Divider />
                <CodeBlock code={code(values)} language="tsx" />
              </VStack>
            )}
          </VStack>
        </LayoutPanel>
      }
    >
      <LayoutContent padding={6}>
        {/* Fills the height the props panel sets, so the component sits in the
            middle of the stage rather than at the top of a tall empty box. */}
        <Stack
          direction="horizontal"
          hAlign="center"
          vAlign="center"
          minHeight={240}
          height="100%"
        >
          {render(values)}
        </Stack>
      </LayoutContent>
    </Layout>
  );
}
