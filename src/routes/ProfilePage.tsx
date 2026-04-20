import { useViewport } from '../hooks/useViewport';
import { MobileProfile } from '../components/mobile/MobileProfile';
import { BottomNav } from '../components/mobile/BottomNav';

export default function ProfilePage() {
  const isDesktop = useViewport();
  if (isDesktop) return <div style={{ padding: 40 }}>Desktop Profile (uses desktop shell) — coming next tasks</div>;
  return (
    <>
      <MobileProfile />
      <BottomNav active="profile" />
    </>
  );
}
