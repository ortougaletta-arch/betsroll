import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMENTS, type Market } from '../../data/markets';
import { actions, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { Chip } from '../primitives/Chip';
import { MiniChart } from '../primitives/MiniChart';
import { SentimentBar } from '../primitives/SentimentBar';
import { TierBadge } from '../primitives/TierBadge';
import { ValidationBar } from '../primitives/ValidationBar';
import { DesktopSidebar } from './DesktopSidebar';

type Props = { m: Market };

export function DesktopMarket({ m }: Props) {
  const nav = useNavigate();
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState(50);
  const [toast, setToast] = useState<string | null>(null);
  const balance = useStore((s) => s.balance);
  const freebet = useStore((s) => s.freebet);
  const tier = useStore((s) => s.tier);

  const price = side === 'yes' ? m.yes : m.no;
  const total = balance + freebet;
  const canRoll = amount > 0 && amount <= total;

  const roll = () => {
    const res = actions.rollBet({
      marketId: m.id,
      q: m.q,
      side: side === 'yes' ? 'YES' : 'NO',
      amount,
      price,
      eta: m.resolvesIn ?? 'TBD',
    });
    if (res.ok) {
      setToast(`🎲 Rolled $${amount} on ${side.toUpperCase()}`);
      setTimeout(() => setToast(null), 1800);
    }
  };

  const feeForTier = tier === 'Gold' ? 0.30 : tier === 'Platinum' ? 0.20 : tier === 'King' ? 0.10 : 0.60;

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <DesktopSidebar />
      <main style={{ flex: 1, overflow: 'auto', padding: '24px 32px', minWidth: 0 }} className="noscroll">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 12, color: 'var(--ink-3)' }}>
          <button onClick={() => nav('/')} style={{ color: 'var(--ink-3)' }}>Feed</button>
          <span>/</span><span>{m.cat}</span><span>/</span>
          <span style={{ color: 'var(--ink-2)' }}>{m.q.slice(0, 50)}…</span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <Chip label={m.cat} tone="brand" />
          {m.status === 'live' && <Chip label={`LIVE · ${m.resolvesIn}`} tone="live" />}
          <Chip label="Chainlink oracle" />
          <Chip label="Resolves Apr 30" />
        </div>
        <h1 style={{ margin: '0 0 14px', fontSize: 32, fontWeight: 600, lineHeight: 1.1, letterSpacing: -0.8, maxWidth: 780 }}>{m.q}</h1>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 14, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)', marginBottom: 24, maxWidth: 780 }}>
          <Avatar name={m.creator.av} size={44} ring="var(--gold)" />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 700 }}>{m.creator.handle}</span>
              <TierBadge tier={m.creator.tier} size="sm" />
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
              <span className="mono" style={{ color: 'var(--ink-2)' }}>{m.creator.markets}</span> markets ·
              <span className="mono" style={{ color: 'var(--ink-2)' }}> ${m.creator.vol}</span> vol ·
              <span className="mono" style={{ color: 'var(--yes)' }}> {m.creator.rep}%</span> accuracy
            </div>
          </div>
          <button style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(124,92,255,0.15)', border: '1px solid rgba(124,92,255,0.4)', color: '#a794ff', fontWeight: 600, fontSize: 12 }}>+ Follow</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 20 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, padding: 16, borderRadius: 14, background: 'rgba(158,240,26,0.05)', border: '1px solid rgba(158,240,26,0.25)' }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>YES</div>
                <div className="mono" style={{ color: 'var(--yes)', fontSize: 32, fontWeight: 700, lineHeight: 1, margin: '4px 0' }}>{Math.round(m.yes * 100)}¢</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--yes)', opacity: 0.7 }}>↑ 4.2% · 24h</div>
              </div>
              <div style={{ flex: 1, padding: 16, borderRadius: 14, background: 'rgba(255,46,132,0.05)', border: '1px solid rgba(255,46,132,0.2)' }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>NO</div>
                <div className="mono" style={{ color: 'var(--no)', fontSize: 32, fontWeight: 700, lineHeight: 1, margin: '4px 0' }}>{Math.round(m.no * 100)}¢</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--no)', opacity: 0.7 }}>↓ 4.2% · 24h</div>
              </div>
            </div>

            <div style={{ padding: 16, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Chart', 'Depth', 'Trades'].map((r, i) => (
                    <button key={r} style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: i === 0 ? 'var(--bg-3)' : 'transparent', color: i === 0 ? 'var(--ink)' : 'var(--ink-3)' }}>{r}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['1H', '1D', '1W', 'ALL'].map((r, i) => (
                    <button key={r} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: i === 1 ? 'var(--bg-3)' : 'transparent', color: i === 1 ? 'var(--ink)' : 'var(--ink-3)' }}>{r}</button>
                  ))}
                </div>
              </div>
              <MiniChart data={m.spark} color="var(--yes)" width={600} height={220} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Swipe sentiment · 2,184 votes</div>
              <SentimentBar bull={m.bull} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Comments · {m.comments}</div>
              </div>
              {COMMENTS.map((c) => (
                <div key={c.id} style={{ padding: '12px 0', borderBottom: '1px dashed var(--line)', display: 'flex', gap: 12 }}>
                  <Avatar name={c.av} size={34} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</span>
                      <TierBadge tier={c.tier} size="sm" />
                      <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>· {c.time}</span>
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--ink-2)' }}>{c.text}</div>
                    <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 11, color: 'var(--ink-3)' }}>
                      <button style={{ color: 'var(--ink-3)' }}>▲ <span className="mono">{c.up}</span></button>
                      <button style={{ color: 'var(--ink-3)' }}>▼</button>
                      <button style={{ color: 'var(--ink-3)' }}>Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
            <div style={{ padding: 18, borderRadius: 18, background: 'linear-gradient(180deg, var(--bg-1), var(--bg))', border: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -50, right: -50, width: 140, height: 140, borderRadius: '50%', border: `1px dashed ${side === 'yes' ? 'rgba(158,240,26,0.15)' : 'rgba(255,46,132,0.15)'}` }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Place bet</div>
                <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>${balance.toFixed(2)} USDC</div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <button onClick={() => setSide('yes')} style={{ flex: 1, height: 40, borderRadius: 10, background: side === 'yes' ? 'rgba(158,240,26,0.18)' : 'rgba(255,255,255,0.03)', border: `1px solid ${side === 'yes' ? 'rgba(158,240,26,0.5)' : 'var(--line)'}`, color: side === 'yes' ? 'var(--yes)' : 'var(--ink-2)', fontWeight: 700, fontSize: 13 }}>YES {Math.round(m.yes * 100)}¢</button>
                <button onClick={() => setSide('no')} style={{ flex: 1, height: 40, borderRadius: 10, background: side === 'no' ? 'rgba(255,46,132,0.18)' : 'rgba(255,255,255,0.03)', border: `1px solid ${side === 'no' ? 'rgba(255,46,132,0.5)' : 'var(--line)'}`, color: side === 'no' ? 'var(--no)' : 'var(--ink-2)', fontWeight: 700, fontSize: 13 }}>NO {Math.round(m.no * 100)}¢</button>
              </div>
              <div style={{ padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid var(--line)', marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 2 }}>Amount USDC</div>
                <input
                  type="number" value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="mono"
                  style={{ background: 'transparent', border: 'none', color: 'var(--ink)', fontSize: 28, fontWeight: 700, width: '100%', outline: 'none', fontFamily: 'var(--mono)' }}
                />
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {[10, 25, 50, 100].map((p) => (
                    <button key={p} onClick={() => setAmount(p)} style={{ flex: 1, height: 26, borderRadius: 7, background: amount === p ? 'var(--bg-3)' : 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--ink-2)', fontSize: 10.5, fontWeight: 600 }}>${p}</button>
                  ))}
                  <button onClick={() => setAmount(Math.floor(total))} style={{ flex: 1, height: 26, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--ink-2)', fontSize: 10.5, fontWeight: 600 }}>Max</button>
                </div>
              </div>
              <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--line)', fontSize: 12, marginBottom: 12 }}>
                {[
                  ['You pay', `$${amount.toFixed(2)}`, 'var(--ink-2)'],
                  ['Potential payout', `$${(amount / price).toFixed(2)}`, side === 'yes' ? 'var(--yes)' : 'var(--no)'],
                  ['Implied prob.', `${Math.round(price * 100)}%`, 'var(--ink-2)'],
                  [`Fee (${tier} tier)`, `${feeForTier.toFixed(2)}%`, 'var(--ink-2)'],
                ].map(([k, v, c], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span style={{ color: 'var(--ink-3)' }}>{k}</span>
                    <span className="mono" style={{ color: c, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={roll}
                disabled={!canRoll}
                style={{
                  width: '100%', height: 48, borderRadius: 12,
                  background: !canRoll ? 'rgba(255,255,255,0.05)' : side === 'yes' ? 'linear-gradient(135deg,#9ef01a,#6dbf00)' : 'linear-gradient(135deg,#ff2e84,#c41c5f)',
                  color: !canRoll ? 'var(--ink-3)' : side === 'yes' ? '#0a0a15' : '#fff',
                  fontWeight: 700, fontSize: 14, letterSpacing: 0.3,
                  boxShadow: !canRoll ? 'none' : side === 'yes' ? '0 10px 30px rgba(158,240,26,0.3)' : '0 10px 30px rgba(255,46,132,0.25)',
                  cursor: canRoll ? 'pointer' : 'not-allowed',
                }}
              >{!canRoll && amount > total ? 'Insufficient balance' : `🎲 Roll $${amount} on ${side.toUpperCase()}`}</button>
              <div style={{ marginTop: 10, fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.4 }}>Crypto prediction markets involve risk. Only roll what you can afford to lose.</div>
            </div>

            {m.status !== 'live' && (
              <div style={{ marginTop: 14, padding: 14, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Validation · {m.progress ?? 0}%</div>
                <ValidationBar pct={m.progress ?? 0} />
              </div>
            )}
          </aside>
        </div>
      </main>

      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, padding: '12px 20px', borderRadius: 12, background: 'rgba(158,240,26,0.15)', border: '1px solid rgba(158,240,26,0.4)', color: 'var(--yes)', fontWeight: 700, fontSize: 13, zIndex: 200 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
