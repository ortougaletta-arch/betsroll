type Props = { data: number[]; color?: string; width?: number; height?: number };

export function Sparkline({ data, color = 'var(--yes)', width = 100, height = 32 }: Props) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - ((v - min) / range) * height,
  ]);
  const d = 'M ' + pts.map((p) => p.join(',')).join(' L ');
  const area = d + ` L ${width},${height} L 0,${height} Z`;
  const gid = `spark-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}
