type Props = { pct?: number };

export function ValidationBar({ pct = 0 }: Props) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${clamped}%`,
          background: 'linear-gradient(90deg, #7c5cff 0%, #4cc9ff 60%, #9ef01a 100%)',
          borderRadius: 3,
          boxShadow: '0 0 12px rgba(124,92,255,0.6)',
        }} />
      </div>
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-2)', fontWeight: 600 }}>
        {clamped}%
      </span>
    </div>
  );
}
