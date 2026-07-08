export default function Dashboard() {
  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Overview of your CRM performance.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ padding: '24px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Leads</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>12,450</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--brand-success)', marginTop: '8px' }}>+14% this month</div>
        </div>
        <div style={{ padding: '24px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Active Campaigns</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>8</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '8px' }}>Across 3 platforms</div>
        </div>
        <div style={{ padding: '24px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Conversion Rate</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>4.2%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--brand-success)', marginTop: '8px' }}>+1.1% this month</div>
        </div>
      </div>

      <div style={{ padding: '24px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', minHeight: '300px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Recent Activity</h2>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>New batch of 45 leads imported via CSV by VK Test.</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>Google Ads campaign "Summer Sale" generated 12 leads.</div>
          <div style={{ padding: '12px 0' }}>Facebook Lead form "Demo Request" generated 3 leads.</div>
        </div>
      </div>
    </div>
  );
}
