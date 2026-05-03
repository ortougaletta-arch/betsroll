import { useNavigate, useParams } from 'react-router-dom';
import { useAllMarkets } from '../state/useStore';
import { useViewport } from '../hooks/useViewport';
import { MobileMarket } from '../components/mobile/MobileMarket';
import { MobileResolved } from '../components/mobile/MobileResolved';
import { BottomNav } from '../components/mobile/BottomNav';
import { GuestBanner } from '../components/mobile/GuestBanner';
import { DesktopMarket } from '../components/desktop/DesktopMarket';

export default function MarketPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const isDesktop = useViewport();
  const markets = useAllMarkets();
  const m = markets.find((x) => x.id === id);

  if (!m) {
    return (
      <div style={{ padding: 40, color: 'var(--ink)' }}>
        Market not found.
        <button onClick={() => nav('/')} style={{ marginLeft: 12, color: 'var(--brand)' }}>Back to Feed</button>
      </div>
    );
  }

  if (isDesktop) return <DesktopMarket m={m} />;
  return (
    <>
      <GuestBanner />
      {m.status === 'resolved' ? <MobileResolved m={m} /> : <MobileMarket m={m} />}
      <BottomNav active="markets" />
    </>
  );
}
