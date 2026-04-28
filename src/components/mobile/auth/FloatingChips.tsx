const ITEMS = [
  { side: 'yes', q: 'BTC > $120k', price: 67 },
  { side: 'no', q: 'ECB cut 50bps', price: 76 },
  { side: 'yes', q: 'PEPE new ATH', price: 58 },
  { side: 'no', q: 'Lakers title', price: 88 },
  { side: 'yes', q: 'Apple foldable', price: 41 },
];

export function FloatingChips() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '34%', zIndex: 1, opacity: 0.55, pointerEvents: 'none', overflow: 'hidden' }}>
      {ITEMS.map((item, index) => {
        const isYes = item.side === 'yes';
        return (
          <div key={item.q} style={{ position: 'absolute', top: `${8 + index * 16 + (index % 2 ? 4 : 0)}%`, left: `${6 + ((index * 47) % 65)}%`, animation: `float-up ${14 + (index % 3) * 4}s ease-in-out infinite`, animationDelay: `${index * 1.4}s` }}>
            <div style={{ padding: '6px 10px', borderRadius: 10, background: 'rgba(20,20,32,0.7)', border: `1px solid ${isYes ? 'rgba(158,240,26,0.3)' : 'rgba(255,46,132,0.3)'}`, backdropFilter: 'blur(8px)', fontSize: 10.5, color: 'var(--ink-2)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: isYes ? 'var(--yes)' : 'var(--no)', boxShadow: `0 0 6px ${isYes ? 'var(--yes)' : 'var(--no)'}` }} />
              {item.q}
              <span className="mono" style={{ color: isYes ? 'var(--yes)' : 'var(--no)', fontWeight: 700 }}>{item.price}c</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
