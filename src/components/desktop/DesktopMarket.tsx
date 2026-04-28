import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMENTS, type Market } from '../../data/markets';
import { actions, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { Chip } from '../primitives/Chip';
import { MiniChart } from '../primitives/MiniChart';
import { SentimentBar } from '../primitives/SentimentBar';
import { TierBadge } from '../primitives/TierBadge';
import { DesktopSidebar } from './DesktopSidebar';

type Props = { m: Market };

export function DesktopMarket({ m }: Props) {
  const nav = useNavigate();
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState(50);
  const [toast, setToast] = useState<string | null>(null);
  const balance = useStore((s) => s.balance);
  const freebet = useStore((s) => s.freebet);
  const tier = useStore((s) => s.tier);
  const positions = useStore((s) => s.positions);
  const isGuest = useStore((s) => s.isGuest);

  const myPositions = positions.filter((p) => p.marketId === m.id);
  const hasYes = myPositions.find((p) => p.side === 'YES');
  const hasNo = myPositions.find((p) => p.side === 'NO');
  const hasAnyPosition = !!(hasYes || hasNo);
  const activePosition = mode === 'sell' ? (side === 'yes' ? hasYes : hasNo) : null;

  const enterSellMode = () => {
    setMode('sell');
    if (hasYes && !hasNo) setSide('yes');
    else if (hasNo && !hasYes) setSide('no');
  };

  const price = side === 'yes' ? m.yes : m.no;
  const total = balance + freebet;
  const payout = mode === 'buy'
    ? amount / price
    : activePosition ? (amount / activePosition.entry) * price : 0;
  const realizedPnl = mode === 'sell' && activePosition ? payout - amount : 0;
  const canBuy = mode === 'buy' && amount > 0 && (isGuest || amount <= total);
  const canSell = mode === 'sell' && !!activePosition && amount > 0 && amount <= activePosition.size + 0.001;
  const canSubmit = canBuy || canSell;
  const buyLabel = isGuest
    ? (amount > 0 ? `Save account to roll $${amount}` : 'Enter amount')
    : amount === 0 ? 'Enter amount'
      : (!canSubmit && amount > total ? 'Insufficient balance' : `🎲 Roll $${amount} on ${side.toUpperCase()}`);

  const submit = () => {
    if (mode === 'buy') {
      if (isGuest) {
        actions.triggerDeposit('trade');
        return;
      }
      const res = actions.rollBet({
        marketId: m.id, q: m.q,
        side: side === 'yes' ? 'YES' : 'NO',
        amount, price, eta: m.resolvesIn ?? 'TBD',
      });
      if (res.ok) {
        setToast(`🎲 Rolled $${amount} on ${side.toUpperCase()}`);
        setTimeout(() => setToast(null), 1800);
      }
    } else {
      const res = actions.sellPosition({
        marketId: m.id,
        side: side === 'yes' ? 'YES' : 'NO',
        amount, curPrice: price,
      });
      if (res.ok) {
        const sign = res.realizedPnl >= 0 ? '+' : '';
        setToast(`💰 Sold $${amount} · ${sign}$${res.realizedPnl.toFixed(2)} PnL`);
        setTimeout(() => setToast(null), 2200);
        const remaining = activePosition ? activePosition.size - amount : 0;
        if (remaining < 0.01) setMode('buy');
      }
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
          {m.status === 'resolved'
            ? <Chip label={`Resolved ${m.resolution}`} />
            : m.status === 'live'
              ? <Chip label={`LIVE · ${m.resolvesIn}`} tone="live" />
              : <Chip label={`Validating ${m.progress ?? 0}%`} />}
          <Chip label="Chainlink oracle" />
          <Chip label="Resolves Apr 30" />
        </div>
        <h1 style={{ margin: '0 0 14px', fontSize: 32, fontWeight: 600, lineHeight: 1.1, letterSpacing: -0.8, maxWidth: 780 }}>{m.q}</h1>
        {m.status === 'resolved' && <ResolvedResultBandDesktop m={m} />}

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
            {m.status === 'resolved' ? null : m.status !== 'live' ? <ValidatingTradeLockDesktop m={m} /> : (
            <div style={{ padding: 18, borderRadius: 18, background: 'linear-gradient(180deg, var(--bg-1), var(--bg))', border: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -50, right: -50, width: 140, height: 140, borderRadius: '50%', border: `1px dashed ${side === 'yes' ? 'rgba(158,240,26,0.15)' : 'rgba(255,46,132,0.15)'}` }} />

              <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-2)', borderRadius: 10, marginBottom: 12 }}>
                <button onClick={() => setMode('buy')} style={{
                  flex: 1, height: 30, borderRadius: 8,
                  background: mode === 'buy' ? 'var(--bg-3)' : 'transparent',
                  color: mode === 'buy' ? 'var(--ink)' : 'var(--ink-3)',
                  fontSize: 12, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
                }}>Buy</button>
                <button
                  onClick={enterSellMode}
                  disabled={!hasAnyPosition}
                  style={{
                    flex: 1, height: 30, borderRadius: 8,
                    background: mode === 'sell' ? 'var(--bg-3)' : 'transparent',
                    color: !hasAnyPosition ? 'var(--ink-3)' : mode === 'sell' ? 'var(--ink)' : 'var(--ink-2)',
                    fontSize: 12, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
                    opacity: hasAnyPosition ? 1 : 0.4, cursor: hasAnyPosition ? 'pointer' : 'not-allowed',
                  }}
                >Sell</button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>
                  {mode === 'buy' ? 'Place bet' : 'Close position'}
                </div>
                <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>
                  {mode === 'buy' ? `$${balance.toFixed(2)} USDC` : activePosition ? `$${activePosition.size.toFixed(2)} ${activePosition.side}` : '—'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <button
                  onClick={() => { setSide('yes'); if (mode === 'sell' && hasYes) setAmount(Math.min(amount, hasYes.size)); }}
                  disabled={mode === 'sell' && !hasYes}
                  style={{
                    flex: 1, height: 40, borderRadius: 10, background: side === 'yes' ? 'rgba(158,240,26,0.18)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${side === 'yes' ? 'rgba(158,240,26,0.5)' : 'var(--line)'}`,
                    color: side === 'yes' ? 'var(--yes)' : 'var(--ink-2)', fontWeight: 700, fontSize: 13,
                    opacity: mode === 'sell' && !hasYes ? 0.35 : 1,
                    cursor: mode === 'sell' && !hasYes ? 'not-allowed' : 'pointer',
                  }}
                >YES {Math.round(m.yes * 100)}¢</button>
                <button
                  onClick={() => { setSide('no'); if (mode === 'sell' && hasNo) setAmount(Math.min(amount, hasNo.size)); }}
                  disabled={mode === 'sell' && !hasNo}
                  style={{
                    flex: 1, height: 40, borderRadius: 10, background: side === 'no' ? 'rgba(255,46,132,0.18)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${side === 'no' ? 'rgba(255,46,132,0.5)' : 'var(--line)'}`,
                    color: side === 'no' ? 'var(--no)' : 'var(--ink-2)', fontWeight: 700, fontSize: 13,
                    opacity: mode === 'sell' && !hasNo ? 0.35 : 1,
                    cursor: mode === 'sell' && !hasNo ? 'not-allowed' : 'pointer',
                  }}
                >NO {Math.round(m.no * 100)}¢</button>
              </div>

              <div style={{ padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid var(--line)', marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 2 }}>
                  {mode === 'buy' ? 'Amount USDC' : `Amount to sell · max $${activePosition?.size.toFixed(2) ?? '0'}`}
                </div>
                <input
                  type="number" value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="mono"
                  style={{ background: 'transparent', border: 'none', color: 'var(--ink)', fontSize: 28, fontWeight: 700, width: '100%', outline: 'none', fontFamily: 'var(--mono)' }}
                />
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {mode === 'buy'
                    ? <>
                      {[10, 25, 50, 100].map((p) => (
                        <button key={p} onClick={() => setAmount(p)} style={{ flex: 1, height: 26, borderRadius: 7, background: amount === p ? 'var(--bg-3)' : 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--ink-2)', fontSize: 10.5, fontWeight: 600 }}>${p}</button>
                      ))}
                      <button onClick={() => setAmount(Math.floor(total))} style={{ flex: 1, height: 26, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--ink-2)', fontSize: 10.5, fontWeight: 600 }}>Max</button>
                    </>
                    : [0.25, 0.5, 0.75, 1].map((f) => (
                      <button
                        key={f}
                        onClick={() => activePosition && setAmount(Number((activePosition.size * f).toFixed(2)))}
                        disabled={!activePosition}
                        style={{ flex: 1, height: 26, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--ink-2)', fontSize: 10.5, fontWeight: 600 }}
                      >{f === 1 ? 'Max' : `${f * 100}%`}</button>
                    ))
                  }
                </div>
              </div>
              <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--line)', fontSize: 12, marginBottom: 12 }}>
                {mode === 'buy' ? (
                  <>
                    {[
                      ['You pay', `$${amount.toFixed(2)}`, 'var(--ink-2)'],
                      ['Potential payout', `$${payout.toFixed(2)}`, side === 'yes' ? 'var(--yes)' : 'var(--no)'],
                      ['Implied prob.', `${Math.round(price * 100)}%`, 'var(--ink-2)'],
                      [`Fee (${tier} tier)`, `${feeForTier.toFixed(2)}%`, 'var(--ink-2)'],
                    ].map(([k, v, c], i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                        <span style={{ color: 'var(--ink-3)' }}>{k}</span>
                        <span className="mono" style={{ color: c, fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      ['You sell', `$${amount.toFixed(2)} ${side.toUpperCase()}`, 'var(--ink-2)'],
                      ['You receive', `$${payout.toFixed(2)}`, side === 'yes' ? 'var(--yes)' : 'var(--no)'],
                      ['Realized PnL', `${realizedPnl >= 0 ? '+' : ''}$${realizedPnl.toFixed(2)}`, realizedPnl >= 0 ? 'var(--yes)' : 'var(--no)'],
                      ['Current price', `${Math.round(price * 100)}¢`, 'var(--ink-2)'],
                    ].map(([k, v, c], i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                        <span style={{ color: 'var(--ink-3)' }}>{k}</span>
                        <span className="mono" style={{ color: c, fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <button
                onClick={submit}
                disabled={!canSubmit}
                style={{
                  width: '100%', height: 48, borderRadius: 12,
                  background: !canSubmit ? 'rgba(255,255,255,0.05)' : isGuest && mode === 'buy'
                    ? 'linear-gradient(135deg, #7c5cff, #4cc9ff)'
                    : mode === 'buy'
                    ? (side === 'yes' ? 'linear-gradient(135deg,#9ef01a,#6dbf00)' : 'linear-gradient(135deg,#ff2e84,#c41c5f)')
                    : 'linear-gradient(135deg, #7c5cff, #4cc9ff)',
                  color: !canSubmit ? 'var(--ink-3)' : isGuest && mode === 'buy' ? '#fff' : mode === 'buy' && side === 'yes' ? '#0a0a15' : '#fff',
                  fontWeight: 700, fontSize: 14, letterSpacing: 0.3,
                  boxShadow: !canSubmit ? 'none' : isGuest && mode === 'buy'
                    ? '0 10px 30px rgba(124,92,255,0.35)'
                    : mode === 'buy'
                    ? (side === 'yes' ? '0 10px 30px rgba(158,240,26,0.3)' : '0 10px 30px rgba(255,46,132,0.25)')
                    : '0 10px 30px rgba(124,92,255,0.35)',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                }}
              >{mode === 'buy'
                ? buyLabel
                : (!activePosition ? 'No position to sell' : !canSubmit ? 'Invalid amount' : `💰 Sell $${amount} ${side.toUpperCase()}`)
              }</button>
              <div style={{ marginTop: 10, fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.4 }}>Crypto prediction markets involve risk. Only roll what you can afford to lose.</div>
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

function ResolvedResultBandDesktop({ m }: { m: Market }) {
  const resolvedYes = m.resolution === 'YES';
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      maxWidth: 780,
      marginBottom: 18,
      padding: '12px 14px',
      borderRadius: 14,
      background: resolvedYes ? 'rgba(158,240,26,0.10)' : 'rgba(255,46,132,0.10)',
      border: `1px solid ${resolvedYes ? 'rgba(158,240,26,0.35)' : 'rgba(255,46,132,0.35)'}`,
    }}>
      <span style={{
        padding: '6px 10px',
        borderRadius: 999,
        background: resolvedYes ? 'rgba(158,240,26,0.14)' : 'rgba(255,46,132,0.14)',
        color: resolvedYes ? 'var(--yes)' : 'var(--no)',
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
      }}>Resolved {m.resolution}</span>
      {m.resolvedAt && <span className="mono" style={{ color: 'var(--ink-2)', fontSize: 12 }}>{m.resolvedAt}</span>}
      <div style={{ flex: 1 }} />
      <span className="mono" style={{ color: 'var(--ink)', fontSize: 12, fontWeight: 700 }}>
        Final YES {Math.round((m.finalYes ?? m.yes) * 100)}¢
      </span>
    </div>
  );
}

function ValidatingTradeLockDesktop({ m }: { m: Market }) {
  const myVote = useStore((s) => s.votes[m.id]);
  const boost = useStore((s) => s.validationBoost[m.id] ?? 0);
  const progress = Math.min(100, (m.progress ?? 0) + boost);
  return (
    <div style={{
      padding: 20, borderRadius: 18,
      background: 'linear-gradient(180deg, rgba(124,92,255,0.08), rgba(76,201,255,0.04))',
      border: '1px solid rgba(124,92,255,0.25)',
      position: 'relative', overflow: 'hidden', textAlign: 'center',
    }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', border: '1px dashed rgba(124,92,255,0.2)' }} />
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>🔒 Trading locked</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: '10px 0 6px', lineHeight: 1.3 }}>
        Market in validation
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 14 }}>
        Buy / sell unlock when this market hits <b style={{ color: '#a794ff' }}>100%</b> community approval. Currently <span className="mono" style={{ color: 'var(--ink)', fontWeight: 700 }}>{progress}%</span>.
      </div>
      <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 14 }}>
        <div style={{
          width: `${progress}%`, height: '100%',
          background: 'linear-gradient(90deg, #7c5cff 0%, #4cc9ff 60%, #9ef01a 100%)',
          boxShadow: '0 0 12px rgba(124,92,255,0.6)',
        }} />
      </div>
      {myVote ? (
        <div style={{
          padding: '10px 14px', borderRadius: 10,
          background: myVote === 'yes' ? 'rgba(158,240,26,0.1)' : 'rgba(255,46,132,0.1)',
          border: `1px solid ${myVote === 'yes' ? 'rgba(158,240,26,0.3)' : 'rgba(255,46,132,0.3)'}`,
          color: myVote === 'yes' ? 'var(--yes)' : 'var(--no)',
          fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
        }}>
          {myVote === 'yes' ? '✓ You voted to approve' : '✕ You voted to skip'}
        </div>
      ) : (
        <button
          onClick={() => actions.voteMarket(m.id, 'yes')}
          style={{
            width: '100%', height: 46, borderRadius: 12,
            background: 'linear-gradient(135deg, #7c5cff, #4cc9ff)', color: '#fff',
            fontWeight: 700, fontSize: 14, letterSpacing: 0.3,
            boxShadow: '0 10px 30px rgba(124,92,255,0.35)',
          }}
        >✓ Approve to go live · +4 VIP pts</button>
      )}
    </div>
  );
}
