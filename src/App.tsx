import { Routes, Route, Navigate } from 'react-router-dom';
import type { TierName } from './data/markets';
import FeedPage from './routes/FeedPage';
import MarketsPage from './routes/MarketsPage';
import MarketPage from './routes/MarketPage';
import TradePage from './routes/TradePage';
import ProfilePage from './routes/ProfilePage';
import { MobileNotifications } from './components/mobile/MobileNotifications';
import { MobileSettings } from './components/mobile/MobileSettings';
import { MobileWallet } from './components/mobile/MobileWallet';
import { MobileDeposit } from './components/mobile/MobileDeposit';
import { MobileWithdraw } from './components/mobile/MobileWithdraw';
import { MobileOtherProfile } from './components/mobile/MobileOtherProfile';
import { WelcomeScreen } from './components/mobile/auth/WelcomeScreen';
import { SignInScreen } from './components/mobile/auth/SignInScreen';
import { WalletReadyScreen } from './components/mobile/auth/WalletReadyScreen';
import { GeoBlockScreen } from './components/mobile/auth/GeoBlockScreen';
import { NotFoundScreen } from './components/mobile/NotFoundScreen';
import { NetworkErrorScreen } from './components/mobile/NetworkErrorScreen';
import { TierUpModal } from './components/mobile/TierUpModal';
import { EmailCaptureSheet } from './components/mobile/EmailCaptureSheet';
import { actions, useStore } from './state/useStore';

export default function App() {
  const isOffline = useStore((s) => s.isOffline);
  const tierUp = useStore((s) => s.overlay === 'tierUp' ? s.overlayCtx as { tier?: TierName } | null : null);

  return (
    <>
      <EmailCaptureSheet />
      <Routes>
        <Route path="/" element={<FeedGate />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/welcome/signin" element={<SignInScreen />} />
        <Route path="/welcome/ready" element={<WalletReadyScreen />} />
        <Route path="/blocked" element={<GeoBlockScreen />} />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/market/:id" element={<MarketPage />} />
        <Route path="/trade" element={<TradePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<MobileNotifications />} />
        <Route path="/settings" element={<MobileSettings />} />
        <Route path="/wallet" element={<MobileWallet />} />
        <Route path="/wallet/deposit" element={<MobileDeposit />} />
        <Route path="/wallet/withdraw" element={<MobileWithdraw />} />
        <Route path="/u/:handle" element={<MobileOtherProfile />} />
        <Route path="/404" element={<NotFoundScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {tierUp?.tier && <TierUpModal tier={tierUp.tier} onClose={() => actions.closeOverlay()} />}
      {isOffline && <NetworkErrorScreen />}
    </>
  );
}

function FeedGate() {
  const onboarded = useStore((s) => s.onboarded);
  return onboarded ? <FeedPage /> : <Navigate to="/welcome" replace />;
}
