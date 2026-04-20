import { useViewport } from '../hooks/useViewport';
import { MobileProfile } from '../components/mobile/MobileProfile';
import { BottomNav } from '../components/mobile/BottomNav';
import { DesktopSidebar } from '../components/desktop/DesktopSidebar';

export default function ProfilePage() {
  const isDesktop = useViewport();
  if (isDesktop) {
    return (
      <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)' }}>
        <DesktopSidebar />
        <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }} className="noscroll">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <MobileProfile />
          </div>
        </main>
      </div>
    );
  }
  return (
    <>
      <MobileProfile />
      <BottomNav active="profile" />
    </>
  );
}
