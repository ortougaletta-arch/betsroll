import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMENTS, type Market } from '../../data/markets';
import { actions, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { Chip } from '../primitives/Chip';
import { Icon } from '../primitives/icons';
import { MiniChart } from '../primitives/MiniChart';
import { SentimentBar } from '../primitives/SentimentBar';
import { TierBadge } from '../primitives/TierBadge';

type Props = { m: Market };

export function MobileMarket({ m }: Props) {
  const nav = useNavigate();
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState(25);
  const [view, setView] = useState<'chart' | 'depth' | 'trades'>('chart');
  const [csort, setCsort] = useState<'Top' | 'Latest'>('Top');
  const [toast, setToast] = useState<string | null>(null);
  const balance = useStore((s) => s.balance);
  const freebet = useStore((s) => s.freebet);

  const price = side === 'yes' ? m.yes : m.no;
  const color = side === 'yes' ? 'var(--yes)' : 'var(--no)';
  const payout = amount / price;
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

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', paddingBottom: 120 }} className="noscroll">
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(12,12,22,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--line)',
        padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={() => nav(-1)} style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg-2)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.back(18)}</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Market · {m.cat}</div>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.q}</div>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.share(16)}</button>
      </div>

      <div style={{ padding: '18px 18px 12px' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <Chip label={m.cat} tone="brand" />
          <Chip label={m.status === 'live' ? `LIVE · ${m.resolvesIn}` : `Validating ${m.progress ?? 0}%`} tone={m.status === 'live' ? 'live' : 'default'} />
          <Chip label="Chainlink oracle" />
        </div>
        <h1 style={{
          margin: 0, fontFamily: 'var(--display)', fontSize: 24, lineHeight: 1.1,
          fontWeight: 600, color: 'var(--ink)', letterSpacing: -0.6,
        }}>{m.q}</h1>
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-3)' }}>
          Resolves <span className="mono" style={{ color: 'var(--ink-2)' }}>Apr 30, 2026</span> · via Chainlink
        </div>
      </div>

      <div style={{ padding: '0 14px' }}>
        <div style={{
          padding: 14, borderRadius: 16,
          background: 'linear-gradient(135deg, var(--bg-1), var(--bg-2))',
          border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Avatar name={m.creator.av} size={44} ring="var(--gold)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{m.creator.handle}</span>
              <TierBadge tier={m.creator.tier} size="sm" />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: 11, color: 'var(--ink-3)' }}>
              <span><span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>{m.creator.markets}</span> markets</span>
              <span><span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>${m.creator.vol}</span> vol</span>
              <span><span className="mono" style={{ color: 'var(--yes)', fontWeight: 600 }}>{m.creator.rep}%</span> acc.</span>
            </div>
          </div>
          <button style={{
            padding: '8px 14px', borderRadius: 10,
            background: 'rgba(124,92,255,0.15)', border: '1px solid rgba(124,92,255,0.4)',
            color: '#a794ff', fontWeight: 600, fontSize: 12,
          }}>Follow</button>
        </div>
      </div>

      <div style={{ padding: '16px 14px 0' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, padding: 14, borderRadius: 14, background: 'rgba(158,240,26,0.05)', border: '1px solid rgba(158,240,26,0.25)' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>YES</div>
            <div className="mono" style={{ color: 'var(--yes)', fontSize: 26, fontWeight: 700, lineHeight: 1, margin: '6px 0 2px' }}>{Math.round(m.yes * 100)}¢</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--yes)', opacity: 0.7 }}>↑ 4.2% · 24h</div>
          </div>
          <div style={{ flex: 1, padding: 14, borderRadius: 14, background: 'rgba(255,46,132,0.05)', border: '1px solid rgba(255,46,132,0.2)' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>NO</div>
            <div className="mono" style={{ color: 'var(--no)', fontSize: 26, fontWeight: 700, lineHeight: 1, margin: '6px 0 2px' }}>{Math.round(m.no * 100)}¢</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--no)', opacity: 0.7 }}>↓ 4.2% · 24h</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-2)', borderRadius: 10, marginBottom: 10 }}>
          {(['chart', 'depth', 'trades'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              flex: 1, height: 28, borderRadius: 8,
              background: view === v ? 'var(--bg-3)' : 'transparent',
              color: view === v ? 'var(--ink)' : 'var(--ink-3)',
              fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
            }}>{v === 'trades' ? 'Recent' : v}</button>
          ))}
        </div>

        <div style={{ padding: 12, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
          {view === 'chart' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['1H', '1D', '1W', 'ALL'].map((r, i) => (
                    <button key={r} style={{
                      padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                      background: i === 1 ? 'var(--bg-3)' : 'transparent',
                      color: i === 1 ? 'var(--ink)' : 'var(--ink-3)',
                    }}>{r}</button>
                  ))}
                </div>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>vol ${(m.vol24 / 1000).toFixed(0)}k</span>
              </div>
              <MiniChart data={m.spark} color="var(--yes)" width={320} height={140} />
            </>
          )}
          {view === 'depth' && <div style={{ padding: 30, textAlign: 'center', color: 'var(--ink-3)', fontSize: 12 }}>Order book — $840k liquidity · 34 levels</div>}
          {view === 'trades' && (
            <div style={{ fontSize: 11, color: 'var(--ink-2)' }}>
              {[
                ['2m ago', 'BUY YES', '$420', '67¢'],
                ['4m ago', 'SELL NO', '$180', '33¢'],
                ['7m ago', 'BUY YES', '$1,240', '66¢'],
                ['11m ago', 'BUY NO', '$85', '34¢'],
              ].map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '6px 0', borderBottom: i < 3 ? '1px dashed var(--line)' : 'none' }}>
                  <span style={{ color: 'var(--ink-3)' }}>{r[0]}</span>
                  <span style={{ color: r[1].includes('YES') ? 'var(--yes)' : 'var(--no)', fontWeight: 600, fontSize: 10 }}>{r[1]}</span>
                  <span className="mono">{r[2]}</span>
                  <span className="mono" style={{ textAlign: 'right' }}>{r[3]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 14px 0' }}>
        <div style={{
          padding: 16, borderRadius: 18,
          background: 'linear-gradient(180deg, var(--bg-1), var(--bg))',
          border: '1px solid var(--line)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', border: `1px dashed ${side === 'yes' ? 'rgba(158,240,26,0.15)' : 'rgba(255,46,132,0.15)'}` }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Place bet</div>
            <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>
              Balance <span className="mono" style={{ color: 'var(--ink-2)' }}>${balance.toFixed(2)}</span>
              {freebet > 0 && <> · Freebet <span className="mono" style={{ color: 'var(--yes)' }}>${freebet.toFixed(2)}</span></>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            <button onClick={() => setSide('yes')} style={{
              flex: 1, height: 40, borderRadius: 10,
              background: side === 'yes' ? 'rgba(158,240,26,0.18)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${side === 'yes' ? 'rgba(158,240,26,0.5)' : 'var(--line)'}`,
              color: side === 'yes' ? 'var(--yes)' : 'var(--ink-2)',
              fontWeight: 700, fontSize: 13,
            }}>YES <span className="mono" style={{ opacity: 0.7, marginLeft: 4 }}>{Math.round(m.yes * 100)}¢</span></button>
            <button onClick={() => setSide('no')} style={{
              flex: 1, height: 40, borderRadius: 10,
              background: side === 'no' ? 'rgba(255,46,132,0.18)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${side === 'no' ? 'rgba(255,46,132,0.5)' : 'var(--line)'}`,
              color: side === 'no' ? 'var(--no)' : 'var(--ink-2)',
              fontWeight: 700, fontSize: 13,
            }}>NO <span className="mono" style={{ opacity: 0.7, marginLeft: 4 }}>{Math.round(m.no * 100)}¢</span></button>
          </div>

          <div style={{ padding: 14, background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid var(--line)', marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>Amount USDC</div>
            <input
              type="number" inputMode="decimal" value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="mono"
              style={{ background: 'transparent', border: 'none', color: 'var(--ink)', fontSize: 32, fontWeight: 700, width: '100%', outline: 'none', fontFamily: 'var(--mono)' }}
            />
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {[10, 25, 50, 100].map((p) => (
                <button key={p} onClick={() => setAmount(p)} style={{
                  flex: 1, height: 28, borderRadius: 8,
                  background: amount === p ? 'var(--bg-3)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--line)',
                  color: amount === p ? 'var(--ink)' : 'var(--ink-2)',
                  fontSize: 11, fontWeight: 600,
                }}>${p}</button>
              ))}
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--line)', fontSize: 12, marginBottom: 12 }}>
            {[
              ['You pay', `$${amount.toFixed(2)}`, 'var(--ink-2)' as string],
              ['Potential payout', `$${payout.toFixed(2)}`, color],
              ['Implied probability', `${Math.round(price * 100)}%`, 'var(--ink-2)'],
            ].map(([k, v, c], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ color: 'var(--ink-3)' }}>{k}</span>
                <span className="mono" style={{ color: c, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          <button
            onClick={roll}
            disabled={!canRoll}
            style={{
              width: '100%', height: 50, borderRadius: 14,
              background: !canRoll
                ? 'rgba(255,255,255,0.05)'
                : side === 'yes'
                  ? 'linear-gradient(135deg, #9ef01a, #6dbf00)'
                  : 'linear-gradient(135deg, #ff2e84, #c41c5f)',
              color: !canRoll ? 'var(--ink-3)' : side === 'yes' ? '#0a0a15' : '#fff',
              fontWeight: 700, fontSize: 15, letterSpacing: 0.3,
              boxShadow: !canRoll ? 'none' : side === 'yes' ? '0 10px 30px rgba(158,240,26,0.35)' : '0 10px 30px rgba(255,46,132,0.3)',
              cursor: canRoll ? 'pointer' : 'not-allowed',
            }}
          >
            {!canRoll && amount > total ? 'Insufficient balance' : `🎲 Roll $${amount} on ${side.toUpperCase()}`}
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <button style={{ fontSize: 11, color: 'var(--ink-3)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>Advanced options →</button>
            <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>fee 1.0%</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.4 }}>
            Crypto prediction markets involve risk. Only roll what you can afford to lose.
          </div>
        </div>
      </div>

      <div style={{ padding: '18px 14px 0' }}>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Swipe sentiment · 2,184 votes</div>
        <SentimentBar bull={m.bull} />
      </div>

      <div style={{ padding: '20px 14px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Comments · {m.comments}</div>
          <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-2)', borderRadius: 8 }}>
            {(['Top', 'Latest'] as const).map((s) => (
              <button key={s} onClick={() => setCsort(s)} style={{
                padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                background: csort === s ? 'var(--bg-3)' : 'transparent',
                color: csort === s ? 'var(--ink)' : 'var(--ink-3)',
              }}>{s}</button>
            ))}
          </div>
        </div>
        {COMMENTS.map((c) => (
          <div key={c.id} style={{ padding: '12px 0', borderBottom: '1px dashed var(--line)', display: 'flex', gap: 10 }}>
            <Avatar name={c.av} size={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</span>
                <TierBadge tier={c.tier} size="sm" />
                <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>· {c.time}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.4, color: 'var(--ink-2)' }}>{c.text}</div>
              <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 11, color: 'var(--ink-3)' }}>
                <button style={{ color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 3 }}>▲ <span className="mono">{c.up}</span></button>
                <button style={{ color: 'var(--ink-3)' }}>▼</button>
                <button style={{ color: 'var(--ink-3)' }}>Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 110, left: '50%', transform: 'translateX(-50%)',
          padding: '12px 20px', borderRadius: 12,
          background: 'rgba(158,240,26,0.15)', border: '1px solid rgba(158,240,26,0.4)',
          color: 'var(--yes)', fontWeight: 700, fontSize: 13,
          zIndex: 200,
        }}>{toast}</div>
      )}
    </div>
  );
}
