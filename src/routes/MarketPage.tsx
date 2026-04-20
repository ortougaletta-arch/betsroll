import { useNavigate, useParams } from 'react-router-dom';
import { MARKETS } from '../data/markets';
import { useViewport } from '../hooks/useViewport';
import { MobileMarket } from '../components/mobile/MobileMarket';
import { BottomNav } from '../components/mobile/BottomNav';

export default function MarketPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const isDesktop = useViewport();
  const m = MARKETS.find((x) => x.id === id);

  if (!m) {
    return (
      <div style={{ padding: 40, color: 'var(--ink)' }}>
        Market not found.
        <button onClick={() => nav('/')} style={{ marginLeft: 12, color: 'var(--brand)' }}>Back to Feed</button>
      </div>
    );
  }

  if (isDesktop) return <div style={{ padding: 40 }}>Desktop Market coming next task (id={m.id})</div>;
  return (
    <>
      <MobileMarket m={m} />
      <BottomNav active="markets" />
    </>
  );
}
