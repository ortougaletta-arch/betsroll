type Props = { bull?: number };

export function SentimentBar({ bull = 50 }: Props) {
  const bear = 100 - bull;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--yes)', boxShadow: '0 0 8px var(--yes)', flexShrink: 0 }} />
          <span className="mono" style={{ fontSize: 11, color: 'var(--yes)', fontWeight: 700 }}>{bull}% BULL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--no)', fontWeight: 700 }}>{bear}% BEAR</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--no)', boxShadow: '0 0 8px var(--no)', flexShrink: 0 }} />
        </div>
      </div>
      <div style={{
        height: 8, borderRadius: 4, overflow: 'hidden',
        background: 'rgba(255,255,255,0.06)', display: 'flex',
      }}>
        <div style={{ width: `${bull}%`, background: 'linear-gradient(90deg, var(--yes), rgba(158,240,26,0.4))' }} />
        <div style={{ width: `${bear}%`, background: 'linear-gradient(90deg, rgba(255,46,132,0.4), var(--no))' }} />
      </div>
    </div>
  );
}
