import { useId } from 'react';

type Props = { data: number[]; color?: string; width?: number; height?: number };

export function MiniChart({ data, color = 'var(--yes)', width = 340, height = 140 }: Props) {
  const gid = useId();
  const pad = 10;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (width - pad * 2),
    pad + (1 - (v - min) / range) * (height - pad * 2),
  ]);
  const d = 'M ' + pts.map((p) => p.join(',')).join(' L ');
  const area = d + ` L ${width - pad},${height - pad} L ${pad},${height - pad} Z`;
  const last = pts[pts.length - 1];
  const marker = pts[6] ?? pts[0];
  return (
    <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((p) => (
        <line key={p} x1={pad} x2={width - pad} y1={pad + p * (height - pad * 2)} y2={pad + p * (height - pad * 2)} stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
      ))}
      <path d={area} fill={`url(#${gid})`} />
      <path d={d} stroke={color} strokeWidth="2" fill="none" />
      <circle cx={last[0]} cy={last[1]} r="4" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="8" fill={color} opacity="0.2" />
      <g transform={`translate(${marker[0]},${marker[1]})`}>
        <circle r="3" fill="#7c5cff" />
        <line x1="0" y1="0" x2="0" y2="-22" stroke="rgba(124,92,255,0.5)" strokeDasharray="2 3" />
        <rect x="-42" y="-38" width="84" height="16" rx="4" fill="rgba(124,92,255,0.15)" stroke="rgba(124,92,255,0.4)" />
        <text x="0" y="-26" fill="#a794ff" textAnchor="middle" fontSize="9" fontFamily="var(--mono)" fontWeight="700">CPI print +4.2%</text>
      </g>
    </svg>
  );
}
