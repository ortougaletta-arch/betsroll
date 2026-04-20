import { Routes, Route, Navigate } from 'react-router-dom';
import FeedPage from './routes/FeedPage';
import MarketsPage from './routes/MarketsPage';
import MarketPage from './routes/MarketPage';
import TradePage from './routes/TradePage';
import ProfilePage from './routes/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FeedPage />} />
      <Route path="/markets" element={<MarketsPage />} />
      <Route path="/market/:id" element={<MarketPage />} />
      <Route path="/trade" element={<TradePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
