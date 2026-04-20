import { useParams } from 'react-router-dom';

export default function MarketPage() {
  const { id } = useParams();
  return <div style={{ padding: 40 }}>Market (stub) — id: {id}</div>;
}
