import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Market } from '../../data/markets';
import { COMMENTS } from '../../data/markets';
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
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState(25);
  const [view, setView] = useState<'chart' | 'depth' | 'trades'>('chart');
  const [csort, setCsort] = useState<'Top' | 'Latest'>('Top');
  const [toast, setToast] = useState<string | null>(null);
  const balance = useStore((s) => s.balance);
  const freebet = useStore((s) => s.freebet);
  const positions = useStore((s) => s.positions);
  const isGuest = useStore((s) => s.isGuest);

  const myPositions = positions.filter((p) => p.marketId === m.id);
  const hasYes = myPositions.find((p) => p.side === 'YES');
  const hasNo = myPositions.find((p) => p.side === 'NO');
  const hasAnyPosition = !!(hasYes || hasNo);
  const activePosition = mode === 'sell' ? (side === 'yes' ? hasYes : hasNo) : null;

  // If entering sell mode, auto-pick a side the user actually holds
  const enterSellMode = () => {
    setMode('sell');
    if (hasYes && !hasNo) setSide('yes');
    else if (hasNo && !hasYes) setSide('no');
    if (activePosition) setAmount(Math.min(amount, activePosition.size));
  };

  const price = side === 'yes' ? m.yes : m.no;
  const color = side === 'yes' ? 'var(--yes)' : 'var(--no)';
  const total = balance + freebet;

  // Buy: payout = amount / price (shares). Sell: payout = cash back = (amount / entry) * cur
  const payout = mode === 'buy'
    ? amount / price
    : activePosition ? (amount / activePosition.entry) * price : 0;
  const realizedPnl = mode === 'sell' && activePosition
    ? payout - amount
    : 0;
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
        // If fully closed, leave sell mode
        const remaining = activePosition ? activePosition.size - amount : 0;
        if (remaining < 0.01) setMode('buy');
      }
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
          <Chip
            label={m.status === 'resolved' ? `Resolved ${m.resolution}` : m.status === 'live' ? `LIVE · ${m.resolvesIn}` : `Validating ${m.progress ?? 0}%`}
            tone={m.status === 'live' ? 'live' : 'default'}
          />
          <Chip label="Chainlink oracle" />
        </div>
        <h1 style={{
          margin: 0, fontFamily: 'var(--display)', fontSize: 24, lineHeight: 1.1,
          fontWeight: 600, color: 'var(--ink)', letterSpacing: -0.6,
        }}>{m.q}</h1>
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-3)' }}>
          Resolves <span className="mono" style={{ color: 'var(--ink-2)' }}>Apr 30, 2026</span> · via Chainlink
        </div>
        {m.status === 'resolved' && <ResolvedResultBand m={m} />}
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
        {m.status === 'resolved' ? null : m.status === 'validating' ? <ValidatingTradeLock m={m} onVote={() => actions.voteMarket(m.id, 'yes')} /> : (
        <div style={{
          padding: 16, borderRadius: 18,
          background: 'linear-gradient(180deg, var(--bg-1), var(--bg))',
          border: '1px solid var(--line)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', border: `1px dashed ${side === 'yes' ? 'rgba(158,240,26,0.15)' : 'rgba(255,46,132,0.15)'}` }} />

          {/* Buy / Sell mode toggle */}
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>
              {mode === 'buy' ? 'Place bet' : 'Close position'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>
              {mode === 'buy' ? (
                <>Balance <span className="mono" style={{ color: 'var(--ink-2)' }}>${balance.toFixed(2)}</span>
                  {freebet > 0 && <> · Freebet <span className="mono" style={{ color: 'var(--yes)' }}>${freebet.toFixed(2)}</span></>}</>
              ) : (
                activePosition ? <>Holding <span className="mono" style={{ color: 'var(--ink-2)' }}>${activePosition.size.toFixed(2)} {activePosition.side}</span> · entry <span className="mono" style={{ color: 'var(--ink-2)' }}>{Math.round(activePosition.entry * 100)}¢</span></> : 'No position on this side'
              )}
            </div>
          </div>

          {/* Side toggle: in sell mode, disable sides the user doesn't hold */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            <button
              onClick={() => { setSide('yes'); if (mode === 'sell' && hasYes) setAmount(Math.min(amount, hasYes.size)); }}
              disabled={mode === 'sell' && !hasYes}
              style={{
                flex: 1, height: 40, borderRadius: 10,
                background: side === 'yes' ? 'rgba(158,240,26,0.18)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${side === 'yes' ? 'rgba(158,240,26,0.5)' : 'var(--line)'}`,
                color: side === 'yes' ? 'var(--yes)' : 'var(--ink-2)',
                fontWeight: 700, fontSize: 13,
                opacity: mode === 'sell' && !hasYes ? 0.35 : 1,
                cursor: mode === 'sell' && !hasYes ? 'not-allowed' : 'pointer',
              }}
            >YES <span className="mono" style={{ opacity: 0.7, marginLeft: 4 }}>{Math.round(m.yes * 100)}¢</span></button>
            <button
              onClick={() => { setSide('no'); if (mode === 'sell' && hasNo) setAmount(Math.min(amount, hasNo.size)); }}
              disabled={mode === 'sell' && !hasNo}
              style={{
                flex: 1, height: 40, borderRadius: 10,
                background: side === 'no' ? 'rgba(255,46,132,0.18)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${side === 'no' ? 'rgba(255,46,132,0.5)' : 'var(--line)'}`,
                color: side === 'no' ? 'var(--no)' : 'var(--ink-2)',
                fontWeight: 700, fontSize: 13,
                opacity: mode === 'sell' && !hasNo ? 0.35 : 1,
                cursor: mode === 'sell' && !hasNo ? 'not-allowed' : 'pointer',
              }}
            >NO <span className="mono" style={{ opacity: 0.7, marginLeft: 4 }}>{Math.round(m.no * 100)}¢</span></button>
          </div>

          <div style={{ padding: 14, background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid var(--line)', marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>
              {mode === 'buy' ? 'Amount USDC' : `Amount to sell · max $${activePosition?.size.toFixed(2) ?? '0'}`}
            </div>
            <input
              type="number" inputMode="decimal" value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="mono"
              style={{ background: 'transparent', border: 'none', color: 'var(--ink)', fontSize: 32, fontWeight: 700, width: '100%', outline: 'none', fontFamily: 'var(--mono)' }}
            />
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {mode === 'buy'
                ? [10, 25, 50, 100].map((p) => (
                  <button key={p} onClick={() => setAmount(p)} style={{
                    flex: 1, height: 28, borderRadius: 8,
                    background: amount === p ? 'var(--bg-3)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--line)',
                    color: amount === p ? 'var(--ink)' : 'var(--ink-2)',
                    fontSize: 11, fontWeight: 600,
                  }}>${p}</button>
                ))
                : [0.25, 0.5, 0.75, 1].map((f) => (
                  <button
                    key={f}
                    onClick={() => activePosition && setAmount(Number((activePosition.size * f).toFixed(2)))}
                    disabled={!activePosition}
                    style={{
                      flex: 1, height: 28, borderRadius: 8,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--line)',
                      color: 'var(--ink-2)', fontSize: 11, fontWeight: 600,
                    }}
                  >{f === 1 ? 'Max' : `${f * 100}%`}</button>
                ))
              }
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--line)', fontSize: 12, marginBottom: 12 }}>
            {mode === 'buy' ? (
              <>
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
              </>
            ) : (
              <>
                {[
                  ['You sell', `$${amount.toFixed(2)} ${side.toUpperCase()}`, 'var(--ink-2)' as string],
                  ['You receive', `$${payout.toFixed(2)}`, color],
                  ['Realized PnL', `${realizedPnl >= 0 ? '+' : ''}$${realizedPnl.toFixed(2)}`, realizedPnl >= 0 ? 'var(--yes)' : 'var(--no)'],
                  ['Current price', `${Math.round(price * 100)}¢`, 'var(--ink-2)'],
                ].map(([k, v, c], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
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
              width: '100%', height: 50, borderRadius: 14,
              background: !canSubmit
                ? 'rgba(255,255,255,0.05)'
                : isGuest && mode === 'buy'
                  ? 'linear-gradient(135deg, #7c5cff, #4cc9ff)'
                : mode === 'buy'
                  ? (side === 'yes' ? 'linear-gradient(135deg, #9ef01a, #6dbf00)' : 'linear-gradient(135deg, #ff2e84, #c41c5f)')
                  : 'linear-gradient(135deg, #7c5cff, #4cc9ff)',
              color: !canSubmit ? 'var(--ink-3)' : isGuest && mode === 'buy' ? '#fff' : mode === 'buy' && side === 'yes' ? '#0a0a15' : '#fff',
              fontWeight: 700, fontSize: 15, letterSpacing: 0.3,
              boxShadow: !canSubmit ? 'none' : isGuest && mode === 'buy'
                ? '0 10px 30px rgba(124,92,255,0.35)'
                : mode === 'buy'
                ? (side === 'yes' ? '0 10px 30px rgba(158,240,26,0.35)' : '0 10px 30px rgba(255,46,132,0.3)')
                : '0 10px 30px rgba(124,92,255,0.35)',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            {mode === 'buy'
              ? buyLabel
              : (!activePosition ? 'No position to sell' : !canSubmit ? 'Invalid amount' : `💰 Sell $${amount} ${side.toUpperCase()}`)
            }
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <button style={{ fontSize: 11, color: 'var(--ink-3)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>Advanced options →</button>
            <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>fee 1.0%</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.4 }}>
            Crypto prediction markets involve risk. Only roll what you can afford to lose.
          </div>
        </div>
        )}
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

function ResolvedResultBand({ m }: { m: Market }) {
  const resolvedYes = m.resolution === 'YES';
  return (
    <div style={{
      marginTop: 12,
      padding: 12,
      borderRadius: 14,
      background: resolvedYes ? 'rgba(158,240,26,0.10)' : 'rgba(255,46,132,0.10)',
      border: `1px solid ${resolvedYes ? 'rgba(158,240,26,0.35)' : 'rgba(255,46,132,0.35)'}`,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
    }}>
      <div style={{
        padding: '6px 10px',
        borderRadius: 999,
        background: resolvedYes ? 'rgba(158,240,26,0.14)' : 'rgba(255,46,132,0.14)',
        color: resolvedYes ? 'var(--yes)' : 'var(--no)',
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
      }}>Resolved {m.resolution}</div>
      {m.resolvedAt && <span className="mono" style={{ color: 'var(--ink-2)', fontSize: 11 }}>{m.resolvedAt}</span>}
      <div style={{ flex: 1 }} />
      <span className="mono" style={{ color: 'var(--ink)', fontSize: 12, fontWeight: 700 }}>
        Final YES {Math.round((m.finalYes ?? m.yes) * 100)}¢
      </span>
    </div>
  );
}

function ValidatingTradeLock({ m, onVote }: { m: Market; onVote: () => void }) {
  const myVote = useStore((s) => s.votes[m.id]);
  const boost = useStore((s) => s.validationBoost[m.id] ?? 0);
  const progress = Math.min(100, (m.progress ?? 0) + boost);
  return (
    <div style={{
      padding: 18, borderRadius: 18,
      background: 'linear-gradient(180deg, rgba(124,92,255,0.08), rgba(76,201,255,0.04))',
      border: '1px solid rgba(124,92,255,0.25)',
      position: 'relative', overflow: 'hidden', textAlign: 'center',
    }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', border: '1px dashed rgba(124,92,255,0.2)' }} />
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>🔒 Trading locked</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: '10px 0 4px', lineHeight: 1.3 }}>
        Market in validation
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 14 }}>
        Buying and selling open when this market reaches <b style={{ color: '#a794ff' }}>100%</b> approval by the community. Currently <span className="mono" style={{ color: 'var(--ink)', fontWeight: 700 }}>{progress}%</span>.
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
          onClick={onVote}
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
