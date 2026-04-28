import { useViewport } from '../hooks/useViewport';
import { MobileFeed } from '../components/mobile/MobileFeed';
import { BottomNav } from '../components/mobile/BottomNav';
import { GuestBanner } from '../components/mobile/GuestBanner';
import { DesktopFeed } from '../components/desktop/DesktopFeed';

export default function FeedPage() {
  const isDesktop = useViewport();
  if (isDesktop) return <DesktopFeed />;
  return (
    <>
      <GuestBanner />
      <MobileFeed />
      <BottomNav active="feed" />
    </>
  );
}
