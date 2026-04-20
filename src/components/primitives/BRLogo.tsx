type Props = { size?: number; spin?: boolean };

export function BRLogo({ size = 32, spin = false }: Props) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #9d7dff 0%, #4a2ed1 60%, #1a0f5e 100%)',
      position: 'relative',
      boxShadow: '0 0 20px rgba(124,92,255,0.5), inset 0 0 0 1.5px rgba(255,255,255,0.3)',
      flexShrink: 0,
    }}>
      <div className={spin ? 'roll' : ''} style={{
        position: 'absolute', inset: 3, borderRadius: '50%',
        border: '1.5px dashed rgba(255,255,255,0.4)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontFamily: 'var(--display)', fontWeight: 700,
        fontSize: size * 0.42, letterSpacing: -0.5,
      }}>B</div>
    </div>
  );
}
