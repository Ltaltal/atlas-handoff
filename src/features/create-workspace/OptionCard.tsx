// OptionCard — a single selectable choice. Used twice in the flow: workspace
// type at step 1, and visibility at step 2.
//
// This used to be a hand-built button with its own selected, hover, focus and
// disabled styling. The design system has SelectableCard, which is the same
// component with a keyboard model we did not write, so what is left here is
// just the content that goes inside it.

import { SelectableCard } from '@astryxdesign/core/SelectableCard';
import { VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Icon, type IconName } from '@ds';

export interface OptionCardProps {
  icon: IconName;
  title: string;
  description: string;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export function OptionCard({
  icon,
  title,
  description,
  selected = false,
  disabled = false,
  onSelect,
}: OptionCardProps) {
  return (
    <SelectableCard
      label={title}
      isSelected={selected}
      isDisabled={disabled}
      onChange={() => onSelect?.()}
      padding={4}
      width={200}
    >
      <VStack gap={1}>
        <Icon name={icon} size={22} />
        <Text weight="semibold">{title}</Text>
        <Text type="supporting" color="secondary">
          {description}
        </Text>
      </VStack>
    </SelectableCard>
  );
}
