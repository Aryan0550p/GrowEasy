'use client';

import { useState } from 'react';

interface Account {
  name: string;
  status: string;
  icon: string;
  id: string;
  spend: string;
  leads: number | string;
}

const initialAccounts: Account[] = [
  { name: 'Google Ads', status: 'Connected', icon: '#4285F4', id: '143-982-1049', spend: '$4,250', leads: 432 },
  { name: 'Facebook Ads', status: 'Disconnected', icon: '#1877F2', id: '-', spend: '-', leads: '-' },
  { name: 'LinkedIn Ads', status: 'Disconnected', icon: '#0A66C2', id: '-', spend: '-', leads: '-' },
  { name: 'TikTok Ads', status: 'Disconnected', icon: '#000000', id: '-', spend: '-', leads: '-' }
];

export default function AdAccounts() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [toast, setToast] = useState('');

  const toggleConnection = (index: number) => {
    const newAccounts = [...accounts];
    const acc = newAccounts[index];
    
    if (acc.status === 'Connected') {
      if (confirm(`Are you sure you want to disconnect ${acc.name}?`)) {
        acc.status = 'Disconnected';
        acc.id = '-';
        acc.spend = '-';
        acc.leads = '-';
        setToast(`${acc.name} disconnected successfully.`);
      }
    } else {
      setToast(`Connecting to ${acc.name}...`);
      // Simulate API call
      setTimeout(() => {
        acc.status = 'Connected';
        acc.id = `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
        acc.spend = '$0';
        acc.leads = 0;
        setAccounts([...newAccounts]);
        setToast(`${acc.name} connected successfully!`);
        setTimeout(() => setToast(''), 3000);
      }, 1500);
      return; // Return early because we're updating in the timeout
    }
    
    setAccounts(newAccounts);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div style={{ padding: '40px', position: 'relative' }}>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 100 }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Ad Accounts</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Connect and manage your advertising integrations.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {accounts.map((acc, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--bg-page)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                {acc.name === 'Google Ads' && <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
                {acc.name === 'Facebook Ads' && <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                {acc.name === 'LinkedIn Ads' && <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                {acc.name === 'TikTok Ads' && <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.15 4.38-2.9 5.76-1.81 1.44-4.28 2.07-6.52 1.66-2.19-.4-4.14-1.66-5.37-3.46-1.22-1.78-1.57-4.13-1.02-6.22.56-2.13 2.08-3.9 4.02-4.91 1.95-1 4.27-1.16 6.36-.51v4.11c-.9-.37-1.92-.47-2.87-.27-.93.18-1.79.76-2.31 1.55-.54.8-.68 1.84-.36 2.75.33.95 1.15 1.72 2.1 2.06.94.34 2.01.27 2.9-.21.84-.44 1.48-1.19 1.77-2.11.23-.74.22-1.55.22-2.33.01-4.95-.01-9.91.02-14.86z"/></svg>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '2px' }}>{acc.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Account ID: {acc.id}</div>
              </div>
              <span style={{ 
                padding: '4px 8px', 
                borderRadius: '12px', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                background: acc.status === 'Connected' ? '#d1fae5' : '#f3f4f6',
                color: acc.status === 'Connected' ? '#047857' : '#6b7280'
              }}>
                {acc.status}
              </span>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-page)', borderRadius: '8px', display: 'flex', gap: '24px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>30d Spend</div>
                <div style={{ fontWeight: 600 }}>{acc.spend}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Leads Generated</div>
                <div style={{ fontWeight: 600, color: acc.status === 'Connected' ? 'var(--brand-success)' : 'inherit' }}>{acc.leads}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
              <button 
                className={`btn ${acc.status === 'Connected' ? 'btn-secondary' : 'btn-outline'}`} 
                style={{ width: '100%' }}
                onClick={() => toggleConnection(i)}
              >
                {acc.status === 'Connected' ? 'Disconnect Account' : 'Connect Account'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
