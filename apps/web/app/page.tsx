import MathGraph from '../components/MathGraph';

export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#fff' }}>
        📈 MathGraph
      </h1>
      <MathGraph />
    </main>
  );
}