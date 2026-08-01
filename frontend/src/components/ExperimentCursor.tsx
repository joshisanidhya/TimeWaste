import React, { useEffect, useRef, useState } from 'react';

type CursorState = 'default' | 'run' | 'open' | 'soon' | 'hidden';

const CURSOR_LABELS: Record<CursorState, string> = {
  default: '',
  run: 'RUN',
  open: 'OPEN',
  soon: 'SOON',
  hidden: '',
};

export const ExperimentCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>('default');

  const rafId = useRef<number>(0);

  // Disable on touch or reduced motion
  const isTouch =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (isTouch || prefersReduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      // Dot follows instantly
      dot.style.left = `${targetX}px`;
      dot.style.top = `${targetY}px`;
      label.style.left = `${targetX}px`;
      label.style.top = `${targetY}px`;

      // Ring lags behind (lerp)
      ringX += (targetX - ringX) * 0.12;
      ringY += (targetY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    // Cursor state from data attributes
    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element)?.closest('[data-cursor]') as HTMLElement | null;
      if (el) {
        const state = el.getAttribute('data-cursor') as CursorState;
        setCursorState(state || 'default');
      }
    };
    const onOut = () => setCursorState('default');

    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(rafId.current);
    };
  }, [isTouch, prefersReduced]);

  if (isTouch || prefersReduced) return null;

  const label = CURSOR_LABELS[cursorState];
  const isExpanded = cursorState !== 'default';

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring${isExpanded ? ' expanded' : ''}`} />
      <div
        ref={labelRef}
        className={`cursor-label${label ? ' visible' : ''}`}
        style={{ marginLeft: 14, marginTop: 14 }}
      >
        {label}
      </div>
    </>
  );
};
