import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { actions, useStore } from '../../../state/useStore';
import { Avatar } from '../../primitives/Avatar';
import { BRLogo } from '../../primitives/BRLogo';
import { Chip } from '../../primitives/Chip';
import { PricePill } from '../../primitives/PricePill';

const STEPS = [
  {
    title: 'Roll the future',
    sub: 'Predict, trade, and create markets on anything from BTC to ballot boxes.',
  },
  {
    title: 'Swipe to vote',
    sub: 'Swipe right to approve markets for launch. Left to skip. Approved markets go live.',
  },
  {
    title: 'Be a Betsroller',
    sub: 'Create your own markets. Earn a cut of every trade. Climb from Bronze to King.',
  },
] as const;

export function OnboardingTutorial() {
  const nav = useNavigate();
  const step = useStore((s) => Math.min(s.onboardStep, STEPS.length - 1));
  const cur = STEPS[step];

  const finish = () => {
    actions.completeOnboarding();
    nav('/');
  };

  const next = () => {
    if (step >= STEPS.length - 1) finish();
    else actions.setOnboardStep(step + 1);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', background: 'var(--bg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="onboard-bg" />
      <div style={{ position: 'relative', zIndex: 2, padding: '28px 24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={finish} style={{ padding: '8px 14px', borderRadius: 999, color: 'var(--ink-3)', fontSize: 12, fontWeight: 600 }}>Skip</button>
        </div>

        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {step === 0 && (
            <div className="pop" style={{ position: 'relative' }}>
              <BRLogo size={120} spin />
              <div style={{ position: 'absolute', inset: -40, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.12)' }} />
              <div style={{ position: 'absolute', inset: -80, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.06)' }} />
            </div>
          )}
          {step === 1 && <OnboardSwipeDemo />}
          {step === 2 && <OnboardRollerDemo />}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 className="page-enter" key={`t${step}`} style={{ fontSize: 34, fontWeight: 700, letterSpacing: 0, margin: 0, color: 'var(--ink)', lineHeight: 1.05 }}>{cur.title}</h1>
          <p className="page-enter" key={`s${step}`} style={{ fontSize: 14.5, color: 'var(--ink-2)', marginTop: 12, lineHeight: 1.5, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>{cur.sub}</p>
        </div>

        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ width: i === step ? 24 : 6, height: 6, borderRadius: 3, background: i === step ? 'var(--brand)' : 'rgba(255,255,255,0.15)', transition: 'width 0.3s' }} />
          ))}
        </div>

        <button onClick={next} className="btn-primary" style={{ width: '100%', marginBottom: 24 }}>
          {step === STEPS.length - 1 ? 'Get started' : 'Continue'} <span>→</span>
        </button>
      </div>
    </div>
  );
}

function OnboardSwipeDemo() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1800);
    return () => window.clearInterval(id);
  }, []);
  const phase = tick % 4;
  const tx = phase === 1 ? 80 : phase === 3 ? -80 : 0;
  const rot = phase === 1 ? 8 : phase === 3 ? -8 : 0;

  return (
    <div style={{ width: 260, height: 220, position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'var(--bg-1)', border: '1px dashed var(--line)', opacity: 0.5, transform: 'translateY(8px) scale(0.95)' }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'linear-gradient(135deg, var(--bg-1), var(--bg-2))', border: `1px solid ${phase === 1 ? 'rgba(158,240,26,0.5)' : phase === 3 ? 'rgba(255,46,132,0.5)' : 'var(--line)'}`, transform: `translateX(${tx}px) rotate(${rot}deg)`, transition: 'transform 0.6s cubic-bezier(.2,.9,.3,1.1), border-color 0.3s', padding: 20, display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name="MV" size={28} ring="var(--gold)" />
          <span style={{ fontSize: 12, fontWeight: 600 }}>@macro_vlad</span>
          <Chip label="Crypto" tone="brand" />
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>Will BTC close above $120k by end of April?</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <PricePill side="yes" price={0.67} compact />
          <PricePill side="no" price={0.33} compact />
        </div>
      </div>
      <Stamp label="APPROVE" side="right" show={phase === 1} />
      <Stamp label="SKIP" side="left" show={phase === 3} />
    </div>
  );
}

function Stamp({ label, side, show }: { label: string; side: 'left' | 'right'; show: boolean }) {
  const yes = side === 'right';
  return (
    <div style={{ position: 'absolute', top: 40, [side]: -10, padding: '6px 12px', borderRadius: 8, border: `2px solid ${yes ? 'var(--yes)' : 'var(--no)'}`, color: yes ? 'var(--yes)' : 'var(--no)', fontWeight: 700, fontSize: 14, transform: `rotate(${yes ? 12 : -12}deg)`, opacity: show ? 1 : 0, transition: 'opacity 0.25s' }}>{label}</div>
  );
}

function OnboardRollerDemo() {
  return (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
      <div className="pop" style={{ padding: '20px 24px', borderRadius: 20, background: 'linear-gradient(135deg, rgba(255,216,107,0.12), rgba(124,92,255,0.12))', border: '1px solid rgba(255,216,107,0.3)', display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
        <div style={{ fontSize: 44 }}>🎲</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700 }}>You created</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>"BTC $120k by April"</div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--yes)', marginTop: 2, fontWeight: 700 }}>+$156 fees earned</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Bronze', 'Silver', 'Gold', 'Platinum', 'King'].map((tier, i) => (
          <div key={tier} style={{ padding: '6px 10px', borderRadius: 999, background: i <= 2 ? 'rgba(255,216,107,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${i <= 2 ? 'rgba(255,216,107,0.35)' : 'var(--line)'}`, color: i <= 2 ? 'var(--gold)' : 'var(--ink-3)', fontSize: 10, fontWeight: 700, letterSpacing: 0.3 }}>{tier}</div>
        ))}
      </div>
    </div>
  );
}
