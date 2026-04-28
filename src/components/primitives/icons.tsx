import type { JSX } from 'react';

type IconFn = (s?: number, c?: string) => JSX.Element;

export const Icon: Record<string, IconFn> = {
  search: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={c} strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  bell: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 8a6 6 0 1112 0v5l2 3H4l2-3V8z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 19a2 2 0 004 0" stroke={c} strokeWidth="2" />
    </svg>
  ),
  chat: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16v11H9l-5 4V5z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  share: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3v13M12 3l-4 4M12 3l4 4M4 14v5h16v-5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bookmark: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 3h12v18l-6-4-6 4V3z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  back: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M15 5l-7 7 7 7" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  close: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6l-12 12" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  check: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M5 12l5 5 9-11" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  plus: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
  crown: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <path d="M3 8l4 3 5-6 5 6 4-3-2 11H5L3 8z" />
    </svg>
  ),
  spark: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" fill={c} />
    </svg>
  ),
  trend: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M3 17l6-6 4 4 7-8" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7h4v4" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  wallet: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="13" rx="2.5" stroke={c} strokeWidth="2" />
      <path d="M3 10h18M16 14h2" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  settings: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={c} strokeWidth="2" />
      <path d="M19.4 15a1.7 1.7 0 00.4 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.4 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.4l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.4-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.4-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.4H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.4l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.4 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  flame: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <path d="M13.4 2.6c.6 3.2-.3 5.1-1.8 6.9-.8-1.2-1-2.4-.6-4.1C7.7 7.7 5 11 5 15a7 7 0 0014 0c0-4.6-3.4-7.4-5.6-12.4z" />
    </svg>
  ),
  die: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" stroke={c} strokeWidth="2" />
      <circle cx="8" cy="8" r="1.5" fill={c} />
      <circle cx="16" cy="16" r="1.5" fill={c} />
      <circle cx="16" cy="8" r="1.5" fill={c} />
      <circle cx="8" cy="16" r="1.5" fill={c} />
    </svg>
  ),
};
