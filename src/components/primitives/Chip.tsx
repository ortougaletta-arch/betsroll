import type { ReactNode } from 'react';

type Tone = 'default' | 'brand' | 'live' | 'gold';
type Props = { label: string; icon?: ReactNode; tone?: Tone };

const TONES: Record<Tone, { bg: string; fg: string; bd: string }> = {
  default: { bg: 'rgba(255,255,255,0.05)', fg: '#b5b7d4', bd: 'rgba(255,255,255,0.08)' },
  brand:   { bg: 'rgba(124,92,255,0.12)', fg: '#a794ff', bd: 'rgba(124,92,255,0.3)' },
  live:    { bg: 'rgba(158,240,26,0.12)', fg: 'var(--yes)', bd: 'rgba(158,240,26,0.3)' },
  gold:    { bg: 'rgba(255,194,76,0.12)', fg: 'var(--gold)', bd: 'rgba(255,194,76,0.3)' },
};

export function Chip({ label, icon, tone = 'default' }: Props) {
  const t = TONES[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 999,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      fontSize: 10.5, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
      fontFamily: 'var(--display)',
    }}>{icon}{label}</span>
  );
}
