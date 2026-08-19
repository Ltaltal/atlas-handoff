// The four screens of workspace creation. Each is a real, interactive
// composition of the feature's components, so the handoff shows the actual
// surface rather than a picture of one.

import { useState, type ReactElement, type ReactNode } from 'react';
import { VStack, HStack, Stack, StackItem } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Divider } from '@astryxdesign/core/Divider';
import { Avatar } from '@astryxdesign/core/Avatar';
import { AvatarGroup } from '@astryxdesign/core/AvatarGroup';
import { Button, Icon, Spinner } from '@ds';
import { SetupStepper } from './SetupStepper';
import { OptionCard } from './OptionCard';
import { NameField } from './NameField';
import { STEP_TITLES, SAMPLE } from './journey';

export type ScreenVariant = 'default' | 'error' | 'loading';

export type WorkspaceType = 'personal' | 'team';
export type Visibility = 'private' | 'shared';

/**
 * What the person filling the form has chosen so far.
 *
 * The screens are steps of one task, so the answers have to outlive the screen
 * that asked for them — otherwise Review is a picture of a summary rather than
 * a summary. Left unset, each screen keeps its own state and reads as a still
 * life, which is what the Screens page wants.
 */
export interface WorkspaceDraft {
  type: WorkspaceType;
  visibility: Visibility;
}

export const DEFAULT_DRAFT: WorkspaceDraft = { type: 'team', visibility: 'private' };

export interface DraftProps {
  draft?: WorkspaceDraft;
  onDraftChange?: (draft: WorkspaceDraft) => void;
}

/** Set when the screen is a window being clicked through rather than a still. */
export interface FillProps {
  fill?: boolean;
}

/**
 * Wiring for the buttons. Left unset the screen is a still life, which is what
 * the Screens page wants; given these it becomes a flow you can click through.
 */
export interface ScreenNav {
  onBack?: () => void;
  onNext?: () => void;
  onRestart?: () => void;
}

function Screen({
  step,
  title,
  subtitle,
  children,
  actions,
  fill,
}: {
  step: number;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  actions?: ReactNode;
  /** Sink the actions to the bottom so they hold still between steps. */
  fill?: boolean;
}) {
  return (
    <VStack gap={5} height={fill ? '100%' : undefined}>
      <SetupStepper steps={STEP_TITLES} current={step} />
      <VStack gap={1}>
        {title && <Heading level={2}>{title}</Heading>}
        {subtitle && (
          <Text type="supporting" color="secondary">
            {subtitle}
          </Text>
        )}
      </VStack>
      {/* The content takes the slack, so a short step does not drag Back and
          Continue up the card and make them move under the pointer. */}
      {fill ? (
        <StackItem size="fill">{children && <VStack gap={4}>{children}</VStack>}</StackItem>
      ) : (
        children && <VStack gap={4}>{children}</VStack>
      )}
      {actions}
    </VStack>
  );
}

export function DetailsScreen({
  variant = 'default',
  draft,
  onDraftChange,
  fill,
  onBack,
  onNext,
}: { variant?: ScreenVariant } & DraftProps & FillProps & ScreenNav) {
  const [ownType, setOwnType] = useState<WorkspaceType>(DEFAULT_DRAFT.type);
  const type = draft?.type ?? ownType;
  const setType = (next: WorkspaceType) =>
    draft && onDraftChange ? onDraftChange({ ...draft, type: next }) : setOwnType(next);
  const isError = variant === 'error';

  return (
    <Screen
      step={0}
      fill={fill}
      title="Name your workspace"
      subtitle="You can rename it at any time."
      actions={
        <HStack justify="between" gap={2}>
          <Button variant="subtle" onClick={onBack}>
            Back
          </Button>
          <Button variant="primary" disabled={isError} onClick={onNext}>
            Continue
          </Button>
        </HStack>
      }
    >
      <NameField
        value={isError ? SAMPLE.takenName : SAMPLE.workspaceName}
        state={isError ? 'error' : 'success'}
        errorMessage="A workspace with this name already exists."
      />

      <VStack gap={2}>
        <Text type="supporting" weight="semibold">
          Workspace type
        </Text>
        <Stack direction="horizontal" gap={3} wrap="wrap" role="group" aria-label="Workspace type">
          <OptionCard
            icon="person"
            title="Personal"
            description="Only you. Invite people later if you need to."
            selected={type === 'personal'}
            onSelect={() => setType('personal')}
          />
          <OptionCard
            icon="people"
            title="Team"
            description="Shared from the start with the people you pick."
            selected={type === 'team'}
            onSelect={() => setType('team')}
          />
        </Stack>
      </VStack>
    </Screen>
  );
}

/** An sm avatar inside a group measures 28px including its ring, and the slot
 *  has to match it exactly or it sits low and undersized next to the group. */
const AVATAR_SM = '28px';

/** The next empty seat in an avatar group. */
function AddPeopleSlot() {
  return (
    <button
      type="button"
      aria-label="Add people"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: AVATAR_SM,
        height: AVATAR_SM,
        flexShrink: 0,
        padding: 0,
        boxSizing: 'border-box',
        borderRadius: 'var(--radius-full)',
        border: '1px dashed var(--color-border-emphasized)',
        backgroundColor: 'transparent',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
      }}
    >
      <Icon name="plus" size={13} />
    </button>
  );
}

export function ConfigureScreen({
  draft,
  onDraftChange,
  fill,
  onBack,
  onNext,
}: DraftProps & FillProps & ScreenNav = {}) {
  const [ownVisibility, setOwnVisibility] = useState<Visibility>(DEFAULT_DRAFT.visibility);
  const visibility = draft?.visibility ?? ownVisibility;
  const setVisibility = (next: Visibility) =>
    draft && onDraftChange
      ? onDraftChange({ ...draft, visibility: next })
      : setOwnVisibility(next);

  return (
    <Screen
      step={1}
      fill={fill}
      title="Who can see it?"
      subtitle="Advanced settings stay out of the way until the workspace exists."
      actions={
        <HStack justify="between" gap={2}>
          <Button variant="subtle" onClick={onBack}>
            Back
          </Button>
          <HStack gap={2}>
            <Button onClick={onNext}>Skip for now</Button>
            <Button variant="primary" onClick={onNext}>
              Continue
            </Button>
          </HStack>
        </HStack>
      }
    >
      <Stack direction="horizontal" gap={3} wrap="wrap" role="group" aria-label="Visibility">
        <OptionCard
          icon="lock"
          title="Private"
          description="Only invited people can open this workspace."
          selected={visibility === 'private'}
          onSelect={() => setVisibility('private')}
        />
        <OptionCard
          icon="globe"
          title="Shared"
          description="Anyone in your organization can find and join."
          selected={visibility === 'shared'}
          onSelect={() => setVisibility('shared')}
        />
      </Stack>

      <Divider />

      <HStack gap={2} vAlign="center">
        <AvatarGroup size="sm">
          {SAMPLE.members.map((name) => (
            <Avatar key={name} name={name} />
          ))}
        </AvatarGroup>
        <AddPeopleSlot />
        <Text type="supporting" color="secondary">
          {SAMPLE.members.length} people will be invited
        </Text>
      </HStack>
    </Screen>
  );
}

export function ReviewScreen({
  variant = 'default',
  draft = DEFAULT_DRAFT,
  fill,
  onBack,
  onNext,
}: { variant?: ScreenVariant } & DraftProps & FillProps & ScreenNav) {
  const loading = variant === 'loading';
  // Read back from the draft: a summary that ignores the answers is not a
  // summary, and it is the one screen where that is obvious.
  const rows = [
    { label: 'Name', value: SAMPLE.workspaceName },
    { label: 'Type', value: draft.type === 'team' ? 'Team' : 'Personal' },
    { label: 'Visibility', value: draft.visibility === 'private' ? 'Private' : 'Shared' },
    { label: 'Owner', value: SAMPLE.owner },
    { label: 'Members', value: `${SAMPLE.members.length} invited` },
  ];

  return (
    <Screen
      step={2}
      fill={fill}
      title="Review and create"
      subtitle="Nothing is created until you confirm."
      actions={
        <HStack justify="between" gap={2}>
          <Button variant="subtle" disabled={loading} onClick={onBack}>
            Back
          </Button>
          <Button
            variant="primary"
            disabled={loading}
            icon={loading ? <Spinner size={14} /> : undefined}
            onClick={onNext}
          >
            {loading ? 'Creating…' : 'Create workspace'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={2}>
        {rows.map((row) => (
          <HStack key={row.label} justify="between" vAlign="center" gap={3}>
            <Text type="supporting" color="secondary">
              {row.label}
            </Text>
            <Text weight="semibold">{row.value}</Text>
          </HStack>
        ))}
      </VStack>
    </Screen>
  );
}

export function CompleteScreen({ fill, onRestart }: FillProps & ScreenNav = {}) {
  return (
    <Screen
      step={3}
      fill={fill}
      actions={
        <HStack justify="end" gap={2}>
          <Button onClick={onRestart}>Start another</Button>
          <Button variant="primary" onClick={onRestart}>
            Open workspace
          </Button>
        </HStack>
      }
    >
      <VStack gap={3} hAlign="center" paddingBlock={5}>
        <Icon name="checkCircle" size={44} />
        <Heading level={2}>{SAMPLE.workspaceName} is ready</Heading>
        <Text color="secondary">
          {SAMPLE.members.length} people have been invited. You can start adding files
          right away.
        </Text>
        <AvatarGroup size="sm">
          <Avatar name={SAMPLE.owner} />
          {SAMPLE.members.map((name) => (
            <Avatar key={name} name={name} />
          ))}
        </AvatarGroup>
      </VStack>
    </Screen>
  );
}

/** Screen renderer for each journey step id. */
export const SCREENS: Record<
  string,
  (props: { variant?: ScreenVariant } & DraftProps & FillProps & ScreenNav) => ReactElement
> = {
  details: ({ variant, ...rest }) => <DetailsScreen variant={variant} {...rest} />,
  configure: ({ variant: _variant, ...rest }) => <ConfigureScreen {...rest} />,
  review: ({ variant, ...rest }) => <ReviewScreen variant={variant} {...rest} />,
  complete: ({ variant: _variant, draft: _draft, onDraftChange: _onDraftChange, ...nav }) => (
    <CompleteScreen {...nav} />
  ),
};

/** The states each step's screen has beyond the happy path. */
export const SCREEN_VARIANTS: Record<
  string,
  { id: ScreenVariant; label: string; note: string }[]
> = {
  details: [
    { id: 'default', label: 'Valid', note: 'Name is available, Continue is enabled.' },
    { id: 'error', label: 'Name taken', note: 'Inline error; Continue stays disabled.' },
  ],
  configure: [{ id: 'default', label: 'Default', note: 'Private is preselected.' }],
  review: [
    { id: 'default', label: 'Ready', note: 'Everything confirmed, nothing created yet.' },
    { id: 'loading', label: 'Creating', note: 'Actions lock while the workspace is created.' },
  ],
  complete: [{ id: 'default', label: 'Default', note: 'Success, with a clear next action.' }],
};
