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
