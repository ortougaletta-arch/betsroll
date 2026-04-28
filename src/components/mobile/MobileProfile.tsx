import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CREATED, ME } from '../../data/user';
import { pointsToNextTier, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { Icon } from '../primitives/icons';
import { TierBadge } from '../primitives/TierBadge';
import { VIPRing } from '../primitives/VIPRing';

type Tab = 'Overview' | 'Positions' | 'Created' | 'History';

export function MobileProfile() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>('Overview');
  const store = useStore();
  const tierInfo = pointsToNextTier(store.vipPts);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', paddingBottom: 120 }} className="noscroll">
      <div style={{
        height: 140, position: 'relative', overflow: 'hidden',
        background:
          'radial-gradient(circle at 20% 20%, rgba(255,216,107,0.35) 0%, rgba(12,12,22,0) 60%), ' +
          'radial-gradient(circle at 80% 80%, rgba(124,92,255,0.4), rgba(12,12,22,0) 70%), var(--bg)',
      }}>
        <div style={{ position: 'absolute', top: 12, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
          <button onClick={() => nav(-1)} style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(12,12,22,0.6)', backdropFilter: 'blur(6px)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line)' }}>{Icon.back(18)}</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(12,12,22,0.6)', backdropFilter: 'blur(6px)', color: 'var(--ink-2)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.share(16)}</button>
            <button onClick={() => nav('/settings')} aria-label="Open settings" style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(12,12,22,0.6)', backdropFilter: 'blur(6px)', color: 'var(--ink-2)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.settings(16)}</button>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 30, right: -40, width: 180, height: 180, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.08)' }} />
      </div>

      <div style={{ padding: '0 16px', marginTop: -52, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          <div style={{ position: 'relative' }}>
            <VIPRing tier={store.tier} progress={tierInfo.progress} />
            <div style={{ position: 'absolute', inset: 12 }}>
              <Avatar name="MV" size={80} />
            </div>
            <div style={{
              position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
              padding: '3px 8px', borderRadius: 8,
              background: '#ffd86b', color: '#0a0a15', fontSize: 9, fontWeight: 700, letterSpacing: 0.4,
              boxShadow: '0 4px 10px rgba(255,216,107,0.4)',
              whiteSpace: 'nowrap',
            }}>{store.tier.toUpperCase()} · LVL 14</div>
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: -0.4 }}>{ME.handle}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{ME.bio}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 14px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <StatTile label="Balance USDC" value={`$${store.balance.toFixed(2)}`} sub={store.freebet > 0 ? `+$${store.freebet.toFixed(2)} freebet` : 'available to roll'} />
        <StatTile label="Lifetime PnL" value={`+$${ME.pnlLife.toFixed(0)}`} sub="all time" tone="yes" />
        <StatTile label="Win rate" value={`${Math.round(ME.winRate * 100)}%`} sub="last 90 days" />
        <StatTile label="Markets made" value={String(ME.marketsCreated)} sub={`${ME.resolved} resolved`} />
        <StatTile label="Creator fees" value={`$${ME.creatorEarnings.toFixed(0)}`} sub="as Betsroller" tone="yes" />
        <StatTile label="VIP pts" value={store.vipPts.toLocaleString()} sub={`${tierInfo.remaining.toLocaleString()} to ${tierInfo.next}`} />
      </div>

      <div style={{ padding: '16px 14px 0' }}>
        <div style={{
          padding: 16, borderRadius: 18,
          background: 'linear-gradient(135deg, rgba(255,216,107,0.08), rgba(124,92,255,0.08))',
          border: '1px solid rgba(255,216,107,0.25)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -30, width: 120, height: 120, borderRadius: '50%', border: '1px dashed rgba(255,216,107,0.2)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>VIP Program</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <TierBadge tier={store.tier} size="lg" />
                <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>→</span>
                <TierBadge tier={tierInfo.next} size="sm" />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--gold)' }}>{tierInfo.remaining.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>pts to {tierInfo.next}</div>
            </div>
          </div>
          <div style={{ marginTop: 14, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              width: `${tierInfo.progress * 100}%`, height: '100%',
              background: 'linear-gradient(90deg, #ffd86b, #b8e6ff)',
              boxShadow: '0 0 12px rgba(255,216,107,0.5)',
            }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 14px 0' }}>
        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-2)', borderRadius: 12 }}>
          {(['Overview', 'Positions', 'Created', 'History'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, height: 32, borderRadius: 8,
              background: tab === t ? 'var(--bg-3)' : 'transparent',
              color: tab === t ? 'var(--ink)' : 'var(--ink-3)',
              fontSize: 11.5, fontWeight: 600,
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 14px 0' }}>
        {tab === 'Overview' && <OverviewTab totalValue={store.positions.reduce((a, p) => a + p.size, 0)} unrealized={store.positions.reduce((a, p) => a + p.pnl, 0)} />}
        {tab === 'Positions' && <PositionsTab />}
        {tab === 'Created' && <CreatedTab />}
        {tab === 'History' && <HistoryTab />}
      </div>
    </div>
  );
}

function StatTile({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: 'yes' | 'no' }) {
  const color = tone === 'yes' ? 'var(--yes)' : tone === 'no' ? 'var(--no)' : 'var(--ink)';
  return (
    <div style={{
      padding: '10px 10px 12px', borderRadius: 12, background: 'var(--bg-1)', border: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      <div className="mono" style={{ fontSize: 15, fontWeight: 700, color, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
      {sub && <div style={{ fontSize: 9.5, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
    </div>
  );
}

function OverviewTab({ totalValue, unrealized }: { totalValue: number; unrealized: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Open positions</div>
        <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>Total size</div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 700 }}>${totalValue.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>Unrealized PnL</div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: unrealized >= 0 ? 'var(--yes)' : 'var(--no)' }}>
                {unrealized >= 0 ? '+' : ''}${unrealized.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Reputation badges</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            ['Crypto Oracle', '#9ef01a'],
            ['Macro Seer', '#7c5cff'],
            ['Early Roller', '#ffc24c'],
            ['Streak × 7', '#ff2e84'],
          ].map(([l, c]) => (
            <div key={l} style={{
              padding: '6px 10px', borderRadius: 10,
              background: `${c}1a`, border: `1px solid ${c}66`, color: c,
              fontSize: 11, fontWeight: 600,
            }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PositionsTab() {
  const positions = useStore((s) => s.positions);
  if (positions.length === 0) return <Empty label="No positions yet — roll something." />;
  return (
    <div>
      {positions.map((p, i) => {
        const profit = p.pnl >= 0;
        return (
          <div key={p.id} style={{ padding: '12px 0', borderBottom: i < positions.length - 1 ? '1px dashed var(--line)' : 'none' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{
                padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
                background: p.side === 'YES' ? 'rgba(158,240,26,0.15)' : 'rgba(255,46,132,0.15)',
                color: p.side === 'YES' ? 'var(--yes)' : 'var(--no)',
                marginTop: 2,
              }}>{p.side}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{p.q}</div>
                <div style={{ marginTop: 4, display: 'flex', gap: 10, fontSize: 10.5, color: 'var(--ink-3)', flexWrap: 'wrap' }}>
                  <span>size <span className="mono" style={{ color: 'var(--ink-2)' }}>${p.size}</span></span>
                  <span>entry <span className="mono" style={{ color: 'var(--ink-2)' }}>{Math.round(p.entry * 100)}¢</span></span>
                  <span>now <span className="mono" style={{ color: 'var(--ink-2)' }}>{Math.round(p.cur * 100)}¢</span></span>
                  <span>· {p.eta}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono" style={{ color: profit ? 'var(--yes)' : 'var(--no)', fontWeight: 700, fontSize: 14 }}>
                  {profit ? '+' : ''}${p.pnl.toFixed(2)}
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>
                  {profit ? '+' : ''}{p.size > 0 ? ((p.pnl / p.size) * 100).toFixed(1) : '0'}%
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CreatedTab() {
  const statusColor: Record<string, string> = { Live: 'var(--yes)', Validating: '#a794ff', Resolved: 'var(--ink-2)', Draft: 'var(--ink-3)' };
  const statusBorder: Record<string, string> = { Live: 'rgba(158,240,26,0.4)', Validating: 'rgba(124,92,255,0.4)', Resolved: 'var(--line)', Draft: 'var(--line)' };
  return (
    <div>
      {CREATED.map((c, i) => (
        <div key={i} style={{ padding: '12px 0', borderBottom: i < CREATED.length - 1 ? '1px dashed var(--line)' : 'none' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{c.q}</div>
            <span style={{
              padding: '2px 8px', borderRadius: 6, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.04)',
              color: statusColor[c.status],
              border: `1px solid ${statusBorder[c.status]}`,
            }}>{c.status}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--ink-3)' }}>
            <span>vol <span className="mono" style={{ color: 'var(--ink-2)' }}>${(c.vol / 1000).toFixed(0)}k</span></span>
            <span>fees earned <span className="mono" style={{ color: c.fees > 0 ? 'var(--yes)' : 'var(--ink-3)' }}>${c.fees.toFixed(2)}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryTab() {
  const history = useStore((s) => s.history);
  if (history.length === 0) return <Empty label="No activity yet." />;
  return (
    <div>
      {history.map((h, i) => (
        <div key={h.id} style={{ display: 'flex', gap: 10, padding: '12px 0', borderBottom: i < history.length - 1 ? '1px dashed var(--line)' : 'none', alignItems: 'center' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: h.kind === 'trade' ? 'rgba(124,92,255,0.12)' : h.kind === 'tier' ? 'rgba(255,216,107,0.12)' : 'rgba(76,201,255,0.12)',
            border: `1px solid ${h.kind === 'trade' ? 'rgba(124,92,255,0.3)' : h.kind === 'tier' ? 'rgba(255,216,107,0.3)' : 'rgba(76,201,255,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: h.kind === 'trade' ? '#a794ff' : h.kind === 'tier' ? 'var(--gold)' : '#8bd5ff',
            fontWeight: 700, fontSize: 14,
          }}>{h.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink)' }}>{h.txt}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{h.time}</div>
          </div>
          {h.v && <div className="mono" style={{ fontSize: 12, color: h.v.startsWith('+') ? 'var(--yes)' : h.v.startsWith('-') ? 'var(--no)' : 'var(--ink-2)', fontWeight: 600 }}>{h.v}</div>}
        </div>
      ))}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>{label}</div>;
}
