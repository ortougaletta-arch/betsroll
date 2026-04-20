import { useViewport } from '../hooks/useViewport';
import { MobileMarkets } from '../components/mobile/MobileMarkets';
import { BottomNav } from '../components/mobile/BottomNav';
import { DesktopFeed } from '../components/desktop/DesktopFeed';

export default function MarketsPage() {
  const isDesktop = useViewport();
  if (isDesktop) return <DesktopFeed />; // desktop shows same markets grid — single source of truth
  return (
    <>
      <MobileMarkets />
      <BottomNav active="markets" />
    </>
  );
}
