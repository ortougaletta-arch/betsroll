import { Routes, Route, Navigate } from 'react-router-dom';
import FeedPage from './routes/FeedPage';
import MarketPage from './routes/MarketPage';
import ProfilePage from './routes/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FeedPage />} />
      <Route path="/market/:id" element={<MarketPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
