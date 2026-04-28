import type { CSSProperties } from 'react';

type Props = { size?: number; spin?: boolean };

export function BRLogo({ size = 32, spin = false }: Props) {
  const face = size * 0.5;
  const glyphSize = Math.max(8, size * 0.2);
  const showGlyphs = size >= 30;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        perspective: size * 4,
        transformStyle: 'preserve-3d',
        filter: 'drop-shadow(0 0 14px rgba(124,92,255,0.45))',
      }}
      aria-label="Betsroll"
    >
      <div
        className={spin ? 'br-cube-spin' : undefined}
        style={{
          position: 'relative',
          width: face,
          height: face,
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-30deg) rotateZ(45deg)',
        }}
      >
        <Face
          color="#7c5cff"
          glyph="₿"
          showGlyph={showGlyphs}
          glyphSize={glyphSize}
          style={{
            transform: `translateZ(${face / 2}px)`,
          }}
        />
        <Face
          color="#7c5cff"
          glyph="₿"
          showGlyph={showGlyphs}
          glyphSize={glyphSize}
          style={{
            transform: `rotateY(180deg) translateZ(${face / 2}px)`,
          }}
        />
        <Face
          color="#4cc9ff"
          glyph="Ξ"
          showGlyph={showGlyphs}
          glyphSize={glyphSize}
          style={{
            transform: `rotateY(-90deg) translateZ(${face / 2}px)`,
            filter: 'brightness(0.9)',
          }}
        />
        <Face
          color="#4cc9ff"
          glyph="Ξ"
          showGlyph={showGlyphs}
          glyphSize={glyphSize}
          style={{
            transform: `rotateY(90deg) translateZ(${face / 2}px)`,
            filter: 'brightness(0.9)',
          }}
        />
        <Face
          color="#9ef01a"
          glyph="$"
          showGlyph={showGlyphs}
          glyphSize={glyphSize}
          style={{
            transform: `rotateX(90deg) translateZ(${face / 2}px)`,
            filter: 'brightness(0.86)',
          }}
        />
        <Face
          color="#9ef01a"
          glyph="$"
          showGlyph={showGlyphs}
          glyphSize={glyphSize}
          style={{
            transform: `rotateX(-90deg) translateZ(${face / 2}px)`,
            filter: 'brightness(0.86)',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          width: size * 0.58,
          height: size * 0.18,
          left: '50%',
          bottom: size * 0.13,
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(124,92,255,0.5), rgba(124,92,255,0))',
          filter: 'blur(3px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function Face({
  color,
  glyph,
  glyphSize,
  showGlyph,
  style,
}: {
  color: string;
  glyph: string;
  glyphSize: number;
  showGlyph: boolean;
  style: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 3,
        backfaceVisibility: 'hidden',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.24)',
        color: '#09101a',
        fontFamily: 'var(--display)',
        fontWeight: 900,
        fontSize: glyphSize,
        lineHeight: 1,
        textShadow: '0 1px 0 rgba(255,255,255,0.25)',
        ...style,
      }}
    >
      {showGlyph && glyph}
    </div>
  );
}
