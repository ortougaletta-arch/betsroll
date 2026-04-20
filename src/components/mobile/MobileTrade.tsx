import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MARKETS } from '../../data/markets';
import { actions, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';

export function MobileTrade() {
  const nav = useNavigate();
  const positions = useStore((s) => s.positions);
  const balance = useStore((s) => s.balance);
  const freebet = useStore((s) => s.freebet);
  const [toast, setToast] = useState<string | null>(null);

  const totalSize = positions.reduce((a, p) => a + p.size, 0);
  const totalPnl = positions.reduce((a, p) => a + p.pnl, 0);
  const profitable = positions.filter((p) => p.pnl >= 0).length;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', paddingBottom: 100 }}>
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid var(--line)',
        background: 'rgba(12,12,22,0.92)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 5,
      }}>
        <div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Portfolio</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: -0.4 }}>Trade</div>
      </div>

      <div style={{ padding: '14px 14px 0' }}>
        <div style={{
          padding: 16, borderRadius: 18,
          background: 'linear-gradient(135deg, var(--bg-1), var(--bg-2))',
          border: '1px solid var(--line)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -30, width: 140, height: 140, borderRadius: '50%', border: '1px dashed rgba(124,92,255,0.15)' }} />
          <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Total position value</div>
          <div className="mono" style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, marginTop: 6 }}>${totalSize.toFixed(2)}</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 11, color: 'var(--ink-3)' }}>
            <div>
              Unrealized PnL{' '}
              <span className="mono" style={{ color: totalPnl >= 0 ? 'var(--yes)' : 'var(--no)', fontWeight: 700 }}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </span>
            </div>
            <div>
              Cash{' '}
              <span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>${balance.toFixed(2)}</span>
              {freebet > 0 && <> · <span className="mono" style={{ color: 'var(--yes)' }}>+${freebet.toFixed(2)} freebet</span></>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 14px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <Stat label="Open" value={String(positions.length)} />
        <Stat label="Winning" value={String(profitable)} tone="yes" />
        <Stat label="Losing" value={String(positions.length - profitable)} tone={positions.length - profitable > 0 ? 'no' : 'default'} />
      </div>

      <div style={{ padding: '18px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Open positions</div>
          <button onClick={() => nav('/')} style={{ fontSize: 11, color: 'var(--brand-2)', fontWeight: 600 }}>Find markets →</button>
        </div>
        {positions.length === 0 ? (
          <div style={{
            padding: 40, borderRadius: 16, border: '1px dashed var(--line)', background: 'var(--bg-1)',
            textAlign: 'center', color: 'var(--ink-3)', fontSize: 13, lineHeight: 1.5,
          }}>
            No open positions yet.
            <br />
            <button onClick={() => nav('/')} style={{ marginTop: 12, padding: '8px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #7c5cff, #4cc9ff)', color: '#fff', fontWeight: 600, fontSize: 12 }}>
              Open Feed
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {positions.map((p, i) => {
              const profit = p.pnl >= 0;
              const m = MARKETS.find((x) => x.id === p.marketId);
              const curPrice = m ? (p.side === 'YES' ? m.yes : m.no) : p.cur;
              const closeAll = (e: React.MouseEvent) => {
                e.stopPropagation();
                const res = actions.sellPosition({ marketId: p.marketId, side: p.side, amount: p.size, curPrice });
                if (res.ok) {
                  const sign = res.realizedPnl >= 0 ? '+' : '';
                  setToast(`💰 Closed $${p.size.toFixed(0)} ${p.side} · ${sign}$${res.realizedPnl.toFixed(2)}`);
                  setTimeout(() => setToast(null), 2000);
                }
              };
              return (
                <div
                  key={p.id}
                  style={{
                    padding: '14px 0',
                    borderBottom: i < positions.length - 1 ? '1px dashed var(--line)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    {m ? (
                      <Avatar name={m.creator.av} size={28} />
                    ) : (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-2)', flexShrink: 0 }} />
                    )}
                    <span style={{
                      padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
                      background: p.side === 'YES' ? 'rgba(158,240,26,0.15)' : 'rgba(255,46,132,0.15)',
                      color: p.side === 'YES' ? 'var(--yes)' : 'var(--no)',
                      flexShrink: 0, marginTop: 4,
                    }}>{p.side}</span>
                    <button
                      onClick={() => m && nav(`/market/${m.id}`)}
                      disabled={!m}
                      style={{
                        textAlign: 'left', flex: 1, minWidth: 0, background: 'transparent',
                        cursor: m ? 'pointer' : 'default', padding: 0,
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{p.q}</div>
                      <div style={{ marginTop: 4, display: 'flex', gap: 10, fontSize: 10.5, color: 'var(--ink-3)', flexWrap: 'wrap' }}>
                        <span>size <span className="mono" style={{ color: 'var(--ink-2)' }}>${p.size.toFixed(0)}</span></span>
                        <span>entry <span className="mono" style={{ color: 'var(--ink-2)' }}>{Math.round(p.entry * 100)}¢</span></span>
                        <span>now <span className="mono" style={{ color: 'var(--ink-2)' }}>{Math.round(curPrice * 100)}¢</span></span>
                        <span>· {p.eta}</span>
                      </div>
                    </button>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div className="mono" style={{ color: profit ? 'var(--yes)' : 'var(--no)', fontWeight: 700, fontSize: 14 }}>
                        {profit ? '+' : ''}${p.pnl.toFixed(2)}
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>
                        {profit ? '+' : ''}{p.size > 0 ? ((p.pnl / p.size) * 100).toFixed(1) : '0'}%
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, marginLeft: 38 }}>
                    <button
                      onClick={() => m && nav(`/market/${m.id}`)}
                      disabled={!m}
                      style={{
                        flex: 1, height: 30, borderRadius: 8,
                        background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)',
                        color: 'var(--ink-2)', fontSize: 11, fontWeight: 600,
                      }}
                    >Adjust</button>
                    <button
                      onClick={closeAll}
                      style={{
                        flex: 1, height: 30, borderRadius: 8,
                        background: 'linear-gradient(135deg, #7c5cff, #4cc9ff)', color: '#fff',
                        fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                      }}
                    >💰 Close · {profit ? '+' : ''}${p.pnl.toFixed(0)}</button>
                  </div>
                </div>
              );
            })}
            {toast && (
              <div style={{
                position: 'fixed', bottom: 110, left: '50%', transform: 'translateX(-50%)',
                padding: '12px 20px', borderRadius: 12,
                background: 'rgba(158,240,26,0.15)', border: '1px solid rgba(158,240,26,0.4)',
                color: 'var(--yes)', fontWeight: 700, fontSize: 13, zIndex: 200,
              }}>{toast}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'yes' | 'no' | 'default' }) {
  const color = tone === 'yes' ? 'var(--yes)' : tone === 'no' ? 'var(--no)' : 'var(--ink)';
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 12,
      background: 'var(--bg-1)', border: '1px solid var(--line)',
    }}>
      <div style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
      <div className="mono" style={{ fontSize: 18, fontWeight: 700, color, lineHeight: 1.1, marginTop: 4 }}>{value}</div>
    </div>
  );
}
