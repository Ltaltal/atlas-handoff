// A thin translation layer over the design system.
//
// Call sites here describe intent — a tone, a pixel size, children — while the
// system describes variants, named steps and `label` props. These wrappers do
// that mapping in one place so the vocabulary stays consistent, and so swapping
// the underlying system means editing this folder rather than every page.

export { Icon, type IconName, type IconProps } from './Icon';
export { Button, type ButtonProps } from './Button';
export { Badge, type BadgeProps, type BadgeTone } from './Badge';
export { Tabs, type TabsProps, type TabItem } from './Tabs';
export { Spinner, type SpinnerProps } from './Spinner';
export {
  TextInput,
  Textarea,
  type TextInputProps,
  type TextareaProps,
} from './TextInput';
