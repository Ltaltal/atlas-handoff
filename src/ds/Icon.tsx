// Icon — the design system's Icon, drawn from the same icon set the system
// itself uses. This app refers to icons by intent ("flow", "specs") rather
// than by glyph, so the mapping lives here and call sites stay readable.

import type { ComponentType, SVGProps } from 'react';
import {
  AlertCircle,
  AppWindow,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Folder,
  Globe,
  HelpCircle,
  LayoutDashboard,
  Lightbulb,
  ListOrdered,
  Lock,
  Moon,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Ruler,
  Scale,
  SkipBack,
  SkipForward,
  Sparkles,
  Sun,
  User,
  UserPlus,
  Users,
  Workflow,
  X,
} from 'lucide-react';
import { Icon as BaseIcon } from '@astryxdesign/core/Icon';

export type IconName =
  | 'check'
  | 'checkCircle'
  | 'alertCircle'
  | 'chevronRight'
  | 'chevronDown'
  | 'arrowRight'
  | 'sun'
  | 'moon'
  | 'lightbulb'
  | 'flow'
  | 'window'
  | 'ruler'
  | 'numbers'
  | 'scales'
  | 'question'
  | 'sparkle'
  | 'board'
  | 'play'
  | 'pause'
  | 'previous'
  | 'next'
  | 'reset'
  | 'code'
  | 'person'
  | 'people'
  | 'lock'
  | 'globe'
  | 'folder'
  | 'personAdd'
  | 'close'
  | 'plus';

const GLYPH: Record<IconName, ComponentType<SVGProps<SVGSVGElement>>> = {
  check: Check,
  checkCircle: CheckCircle2,
  alertCircle: AlertCircle,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  arrowRight: ArrowRight,
  sun: Sun,
  moon: Moon,
  lightbulb: Lightbulb,
  flow: Workflow,
  window: AppWindow,
  ruler: Ruler,
  numbers: ListOrdered,
  scales: Scale,
  question: HelpCircle,
  sparkle: Sparkles,
  board: LayoutDashboard,
  play: Play,
  pause: Pause,
  previous: SkipBack,
  next: SkipForward,
  reset: RotateCcw,
  code: Code2,
  person: User,
  people: Users,
  lock: Lock,
  globe: Globe,
  folder: Folder,
  personAdd: UserPlus,
  close: X,
  plus: Plus,
};

/** Call sites ask for a pixel size; the system works in named steps. */
function toStep(size: number): 'xsm' | 'sm' | 'md' | 'lg' {
  if (size <= 14) return 'xsm';
  if (size <= 18) return 'sm';
  if (size <= 24) return 'md';
  return 'lg';
}

export interface IconProps {
  name: IconName;
  /** Requested size in px, mapped to the nearest step. Default 20. */
  size?: number;
  className?: string;
  /** Accessible name. Omit for decorative icons. */
  label?: string;
}

export function Icon({ name, size = 20, className, label }: IconProps) {
  return (
    <BaseIcon
      icon={GLYPH[name]}
      size={toStep(size)}
      color="inherit"
      label={label}
      className={className}
    />
  );
}
