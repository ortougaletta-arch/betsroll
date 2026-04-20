type Props = { name?: string; size?: number; ring?: string | null };

const PALETTE: [string, string][] = [
  ['#7c5cff', '#4cc9ff'],
  ['#9ef01a', '#4cc9ff'],
  ['#ff2e84', '#ffc24c'],
  ['#4cc9ff', '#9ef01a'],
  ['#ffc24c', '#ff2e84'],
];

export function Avatar({ name = 'NB', size = 32, ring = null }: Props) {
  const seed = (name.charCodeAt(0) || 0) + (name.charCodeAt(1) || 0);
  const [a, b] = PALETTE[seed % PALETTE.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${a}, ${b})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#0a0a15', fontWeight: 700, fontSize: size * 0.38,
      fontFamily: 'var(--display)',
      boxShadow: ring ? `0 0 0 2px var(--bg), 0 0 0 4px ${ring}` : 'none',
      flexShrink: 0,
    }}>{name.slice(0, 2).toUpperCase()}</div>
  );
}
