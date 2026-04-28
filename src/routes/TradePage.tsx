import { useViewport } from '../hooks/useViewport';
import { MobileTrade } from '../components/mobile/MobileTrade';
import { BottomNav } from '../components/mobile/BottomNav';
import { GuestBanner } from '../components/mobile/GuestBanner';
import { DesktopSidebar } from '../components/desktop/DesktopSidebar';

export default function TradePage() {
  const isDesktop = useViewport();
  if (isDesktop) {
    return (
      <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)' }}>
        <DesktopSidebar />
        <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }} className="noscroll">
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <MobileTrade />
          </div>
        </main>
      </div>
    );
  }
  return (
    <>
      <GuestBanner />
      <MobileTrade />
      <BottomNav active="trade" />
    </>
  );
}
