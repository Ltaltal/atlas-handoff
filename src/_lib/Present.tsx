// Present — full-screen mode for a research session. Everything belonging to
// the handoff disappears, leaving only the screen under test, so a participant
// is never looking at our redlines and status badges.
//
// Arrow keys move between screens, Escape leaves.

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { VStack, HStack, Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { Button, Icon } from '@ds';

export interface Slide {
  id: string;
  label: string;
  content: ReactNode;
}

export interface PresentProps {
  slides: Slide[];
  startIndex?: number;
  onExit: () => void;
}

export function Present({ slides, startIndex = 0, onExit }: PresentProps) {
  const [index, setIndex] = useState(startIndex);

  const go = useCallback(
    (next: number) => setIndex(Math.max(0, Math.min(next, slides.length - 1))),
    [slides.length],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onExit();
      if (event.key === 'ArrowRight' || event.key === ' ') go(index + 1);
      if (event.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, onExit]);

  // Ask for real full screen where the browser allows it, and give it back on
  // the way out. Failing is fine — the overlay already fills the viewport.
  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => undefined);
    return () => {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => undefined);
    };
  }, []);

  const slide = slides[index];

  return createPortal(
    <Stack
      direction="vertical"
      role="dialog"
      aria-modal="true"
      aria-label="Presentation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'var(--color-background-body)',
      }}
    >
      <Stack direction="horizontal" justify="end" padding={4}>
        <Button
          variant="subtle"
          icon={<Icon name="close" size={18} />}
          onClick={onExit}
          aria-label="Exit full screen"
        />
      </Stack>

      <Stack direction="horizontal" hAlign="center" vAlign="center" height="100%" padding={6}>
        <VStack key={slide.id}>{slide.content}</VStack>
      </Stack>

      <HStack justify="center" vAlign="center" gap={4} padding={4}>
        <Button
          variant="subtle"
          icon={<Icon name="previous" size={16} />}
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous screen"
        />
        <Text type="supporting" color="secondary">
          {slide.label}
        </Text>
        <Button
          variant="subtle"
          icon={<Icon name="next" size={16} />}
          onClick={() => go(index + 1)}
          disabled={index === slides.length - 1}
          aria-label="Next screen"
        />
      </HStack>
    </Stack>,
    document.body,
  );
}

export interface PresentButtonProps {
  slides: Slide[];
  startIndex?: number;
  label?: string;
}

/** Button that opens present mode, plus the overlay it controls. */
export function PresentButton({ slides, startIndex = 0, label = 'Present' }: PresentButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon={<Icon name="window" size={15} />} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && <Present slides={slides} startIndex={startIndex} onExit={() => setOpen(false)} />}
    </>
  );
}
