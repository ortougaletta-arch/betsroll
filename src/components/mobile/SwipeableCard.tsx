import { useRef, useState } from 'react';
import type { Market } from '../../data/markets';
import { MarketCardContent } from './MarketCardContent';

type Props = {
  m: Market;
  liveProgress: number;
  onOpen: () => void;
  onSwipe: (dir: 'yes' | 'no') => void;
  z: number;
  offset: number;
};

const DRAG_ACTIVATE = 5;   // px before we claim pointer and consider it a drag
const DRAG_COMMIT = 90;    // px threshold for vote commit

export function SwipeableCard({ m, liveProgress, onOpen, onSwipe, z, offset }: Props) {
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const activeRef = useRef(false); // true once we've crossed DRAG_ACTIVATE and captured pointer
  const startX = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

  const handleStart = (e: React.PointerEvent<HTMLDivElement>) => {
    // Don't capture yet — let clicks on inner buttons work first.
    setDragging(true);
    activeRef.current = false;
    pointerIdRef.current = e.pointerId;
    startX.current = e.clientX;
  };
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    if (!activeRef.current && Math.abs(dx) < DRAG_ACTIVATE) return;
    if (!activeRef.current) {
      activeRef.current = true;
      try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
    }
    setDrag(dx);
  };
  const handleEnd = () => {
    if (!dragging) return;
    setDragging(false);
    const wasActive = activeRef.current;
    activeRef.current = false;
    pointerIdRef.current = null;
    if (!wasActive) { setDrag(0); return; } // simple click, no drag happened
    if (drag > DRAG_COMMIT) {
      setDrag(500);
      setTimeout(() => onSwipe('yes'), 180);
    } else if (drag < -DRAG_COMMIT) {
      setDrag(-500);
      setTimeout(() => onSwipe('no'), 180);
    } else {
      setDrag(0);
    }
  };

  const rot = drag / 20;
  const showYes = drag > 40;
  const showNo = drag < -40;

  return (
    <div
      className="no-select"
      onPointerDown={handleStart}
      onPointerMove={handleMove}
      onPointerUp={handleEnd}
      onPointerCancel={handleEnd}
      style={{
        position: 'absolute', inset: 0,
        transform: `translate(${drag}px, ${offset}px) rotate(${rot}deg) scale(${1 - offset / 300})`,
        transition: dragging ? 'none' : 'transform 0.3s cubic-bezier(.2,.9,.3,1.2)',
        zIndex: z,
        borderRadius: 24,
        background: 'linear-gradient(180deg, var(--bg-1) 0%, var(--bg) 100%)',
        border: `1px solid ${showYes ? 'rgba(158,240,26,0.5)' : showNo ? 'rgba(255,46,132,0.5)' : 'var(--line)'}`,
        boxShadow: showYes
          ? '0 20px 60px rgba(158,240,26,0.2)'
          : showNo
            ? '0 20px 60px rgba(255,46,132,0.2)'
            : '0 20px 60px rgba(0,0,0,0.5)',
        cursor: dragging ? 'grabbing' : 'grab',
        overflow: 'hidden',
        touchAction: 'pan-y',
      }}
    >
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        borderRadius: '50%', border: '1px dashed rgba(124,92,255,0.15)',
        pointerEvents: 'none',
      }} />
      <MarketCardContent m={m} onOpen={onOpen} liveProgress={liveProgress} />
      <div className={`stamp stamp-yes ${showYes ? 'show' : ''}`}>APPROVE</div>
      <div className={`stamp stamp-no ${showNo ? 'show' : ''}`}>SKIP</div>
    </div>
  );
}
