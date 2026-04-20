import { useViewport } from '../hooks/useViewport';
import { MobileFeed } from '../components/mobile/MobileFeed';
import { BottomNav } from '../components/mobile/BottomNav';
import { DesktopFeed } from '../components/desktop/DesktopFeed';

export default function FeedPage() {
  const isDesktop = useViewport();
  if (isDesktop) return <DesktopFeed />;
  return (
    <>
      <MobileFeed />
      <BottomNav active="feed" />
    </>
  );
}
