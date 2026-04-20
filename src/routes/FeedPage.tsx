import { useViewport } from '../hooks/useViewport';
import { MobileFeed } from '../components/mobile/MobileFeed';
import { BottomNav } from '../components/mobile/BottomNav';

export default function FeedPage() {
  const isDesktop = useViewport();
  if (isDesktop) return <div style={{ padding: 40 }}>Desktop Feed coming next task</div>;
  return (
    <>
      <MobileFeed />
      <BottomNav active="feed" />
    </>
  );
}
