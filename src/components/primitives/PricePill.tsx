type Props = { side?: 'yes' | 'no'; price?: number; compact?: boolean };

export function PricePill({ side = 'yes', price = 0.5, compact = false }: Props) {
  const isYes = side === 'yes';
  const color = isYes ? 'var(--yes)' : 'var(--no)';
  const pct = Math.round(price * 100);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: compact ? '6px 10px' : '10px 14px',
      borderRadius: 10,
      background: isYes ? 'rgba(158,240,26,0.08)' : 'rgba(255,46,132,0.08)',
      border: `1px solid ${isYes ? 'rgba(158,240,26,0.25)' : 'rgba(255,46,132,0.25)'}`,
    }}>
      <span style={{
        fontFamily: 'var(--display)', fontWeight: 700,
        fontSize: compact ? 11 : 12, letterSpacing: 0.1, color,
      }}>{isYes ? 'YES' : 'NO'}</span>
      <span className="mono" style={{ color, fontWeight: 700, fontSize: compact ? 13 : 15 }}>
        {pct}¢
      </span>
    </div>
  );
}
