// Tabs — two real components behind one call site. "line" is a TabList for
// switching the content of a panel; "segmented" is a SegmentedControl for
// choosing between a few compact options.

import type { ReactNode } from 'react';
import { TabList, Tab } from '@astryxdesign/core/TabList';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';

export interface TabItem {
  value: string;
  label: ReactNode;
  /** Optional leading glyph. */
  icon?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'line' | 'segmented';
  ariaLabel?: string;
  className?: string;
}

/** Both components take a plain string label. */
const asText = (label: ReactNode): string =>
  typeof label === 'string' ? label : String(label ?? '');

export function Tabs({
  items,
  value,
  onChange,
  variant = 'line',
  ariaLabel = 'Options',
  className,
}: TabsProps) {
  if (variant === 'segmented') {
    return (
      <SegmentedControl
        value={value}
        onChange={onChange}
        label={ariaLabel}
        size="sm"
        className={className}
      >
        {items.map((item) => (
          <SegmentedControlItem
            key={item.value}
            value={item.value}
            label={asText(item.label)}
            icon={item.icon}
          />
        ))}
      </SegmentedControl>
    );
  }

  return (
    <TabList value={value} onChange={onChange} size="sm" className={className}>
      {items.map((item) => (
        <Tab key={item.value} value={item.value} label={asText(item.label)} icon={item.icon} />
      ))}
    </TabList>
  );
}
