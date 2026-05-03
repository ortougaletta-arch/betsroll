import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Market } from '../../data/markets';
import { actions, useStore, type Position, type Side } from '../../state/useStore';
import { Icon } from '../primitives/icons';
import { Sparkline } from '../primitives/Sparkline';
import { TopBar } from '../primitives/system';

type Props = { m: Market };

export function calcResolvedPosition(position: Position, resolution: Side) {
  const won = position.side === resolution;
  const payout = won ? position.size * (1 / position.entry) : 0;
  return { won, payout, pnl: payout - position.size };
}

export function MobileResolved({ m }: Props) {
  const nav = useNavigate();
  const [claimed, setClaimed] = useState(false);
  const position = useStore((s) => s.positions.find((p) => p.marketId === m.id));

  const resolution = m.resolution ?? (((m.finalYes ?? m.yes) >= 0.5) ? 'YES' : 'NO');
  const finalYes = m.finalYes ?? m.yes;
  const resolvedAt = m.resolvedAt ?? 'Resolved';
  const resultColor = resolution === 'YES' ? 'var(--yes)' : 'var(--no)';
  const resultBg = resolution === 'YES' ? 'rgba(158,240,26,0.15)' : 'rgba(255,46,132,0.15)';
  const resultBorder = resolution === 'YES' ? 'var(--yes)' : 'var(--no)';
  const txHash = `0x${m.id.padEnd(8, '0').slice(0, 8)}`;
  const traders = m.comments * 5 + 200;
  const totalVolume = `$${(m.vol24 / 1000).toFixed(0)}k`;
  const resolvedPosition = position ? calcResolvedPosition(position, resolution) : null;
  const bannerWon = resolvedPosition?.won ?? true;
  const bannerAccent = bannerWon ? 'rgba(158,240,26,0.4)' : 'rgba(255,46,132,0.4)';
  const bannerOrbit = bannerWon ? 'rgba(158,240,26,0.3)' : 'rgba(255,46,132,0.3)';
  const bannerBg = bannerWon
    ? 'linear-gradient(135deg, rgba(158,240,26,0.18), rgba(76,201,255,0.10))'
    : 'linear-gradient(135deg, rgba(255,46,132,0.18), rgba(124,92,255,0.10))';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', paddingBottom: 120, position: 'relative' }} className="noscroll">
      <TopBar
        title="Market resolved"
        onBack={() => nav(-1)}
        right={
          <button style={{ width: 36, height: 36, borderRadius: 18, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Icon.share(18)}
          </button>
        }
      />

      <div style={{
        margin: 14,
        padding: 20,
        borderRadius: 18,
        background: bannerBg,
        border: `1px solid ${bannerAccent}`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="roll" style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: `1px dashed ${bannerOrbit}`,
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 999,
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 10,
            fontWeight: 800,
            color: 'var(--ink)',
            letterSpacing: 0.6,
          }}>
            ⚖ RESOLVED · {resolvedAt}
          </div>
          <div style={{
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--ink)',
            lineHeight: 1.25,
            marginTop: 12,
          }}>{m.q}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
            <div style={{
              padding: '14px 20px',
              borderRadius: 14,
              background: resultBg,
              border: `2px solid ${resultBorder}`,
            }}>
              <div style={{ fontSize: 9.5, color: resultColor, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>Outcome</div>
              <div style={{ fontWeight: 800, fontSize: 32, color: resultColor, letterSpacing: -1, lineHeight: 1 }}>{resolution}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600 }}>Final YES price</div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>{Math.round(finalYes * 100)}¢</div>
              <Sparkline data={m.spark} color="var(--yes)" width={120} height={28} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 14px' }}>
        {position && resolvedPosition && (
          <div style={{ padding: 16, borderRadius: 16, background: 'var(--bg-1)', border: '1px solid var(--line)', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>Your position</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: position.side === 'YES' ? 'rgba(158,240,26,0.10)' : 'rgba(255,46,132,0.10)',
                color: position.side === 'YES' ? 'var(--yes)' : 'var(--no)',
                fontWeight: 700,
                fontSize: 12,
                border: `1px solid ${position.side === 'YES' ? 'rgba(158,240,26,0.3)' : 'rgba(255,46,132,0.3)'}`,
              }}>{position.side}</div>
              <span className="mono" style={{ color: 'var(--ink)', fontSize: 13, fontWeight: 600 }}>${position.size.toFixed(2)} staked</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 12, color: resolvedPosition.won ? 'var(--yes)' : 'var(--no)', fontWeight: 700 }}>
                {resolvedPosition.won ? 'WON' : 'LOST'}
              </span>
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
              <Row k="Stake" v={`$${position.size.toFixed(2)}`} mono />
              <Row
                k="P/L"
                v={<span style={{ color: resolvedPosition.pnl >= 0 ? 'var(--yes)' : 'var(--no)' }}>{resolvedPosition.pnl >= 0 ? '+' : ''}${resolvedPosition.pnl.toFixed(2)}</span>}
                mono
              />
              <Row
                k="Payout"
                v={<span style={{ fontSize: 18, color: resolvedPosition.won ? 'var(--yes)' : 'var(--ink-2)', fontWeight: 800 }}>${resolvedPosition.payout.toFixed(2)}</span>}
                mono
              />
            </div>

            {resolvedPosition.won && !claimed && (
              <button
                onClick={() => {
                  setClaimed(true);
                  actions.simulateTx({
                    kind: 'reward',
                    amount: resolvedPosition.payout,
                    hash: `0x${Math.random().toString(16).slice(2, 10)}`,
                    label: 'Claim payout',
                  });
                }}
                className="btn-primary"
                style={{ width: '100%', marginTop: 14 }}
              >
                {Icon.spark(15, '#fff')} Claim ${resolvedPosition.payout.toFixed(2)}
              </button>
            )}
            {claimed && (
              <div style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 10,
                background: 'rgba(158,240,26,0.08)',
                border: '1px solid rgba(158,240,26,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--yes)',
                fontSize: 12,
                fontWeight: 700,
              }}>
                {Icon.check(14, 'var(--yes)')} Payout sent to your wallet
              </div>
            )}
          </div>
        )}

        <div style={{ padding: 14, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>Resolution proof</div>
          <Row k="Source" v={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--yes)', boxShadow: '0 0 6px var(--yes)' }} />Chainlink</span>} />
          <Row k="Tx hash" v={txHash} mono />
          <Row k="Resolved at" v={`${resolvedAt} · 14:32 UTC`} />
          <button style={{
            width: '100%',
            marginTop: 8,
            padding: 8,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--line)',
            fontSize: 11.5,
            color: 'var(--ink-2)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}>{Icon.share(12)} View on explorer</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginBottom: 16 }}>
          <StatTile label="Total volume" v={totalVolume} sub="lifetime" />
          <StatTile label="Traders" v={traders.toLocaleString()} sub="took a side" />
        </div>

        <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>Roll forward</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <CtaButton icon="🎲" title="Find a similar market" sub="Discover what's resolving next" onClick={() => nav('/markets')} />
          <CtaButton icon="📊" title="See your wallet" sub="Review balances and payouts" onClick={() => nav('/wallet')} />
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12, gap: 12 }}>
      <span style={{ color: 'var(--ink-3)' }}>{k}</span>
      <span className={mono ? 'mono' : ''} style={{ color: 'var(--ink-2)', fontWeight: 600, textAlign: 'right' }}>{v}</span>
    </div>
  );
}

function StatTile({ label, v, sub }: { label: string; v: string; sub: string }) {
  return (
    <div style={{ padding: 14, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
      <div className="mono" style={{ marginTop: 7, color: 'var(--ink)', fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{v}</div>
      <div style={{ marginTop: 4, color: 'var(--ink-3)', fontSize: 11 }}>{sub}</div>
    </div>
  );
}

function CtaButton({ icon, title, sub, onClick }: { icon: string; title: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: 14,
      background: 'var(--bg-1)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      color: 'var(--ink)',
      textAlign: 'left',
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>
      </div>
      <span style={{ color: 'var(--ink-3)', transform: 'rotate(180deg)', display: 'flex' }}>{Icon.back(14)}</span>
    </button>
  );
}
