'use client';

import { useState } from 'react';

export default function WhatsAppAccount() {
  const [status, setStatus] = useState('Disconnected');
  const [toast, setToast] = useState('');

  const handleConnect = () => {
    if (status === 'Connected') {
      if (confirm('Disconnect WhatsApp?')) {
        setStatus('Disconnected');
        setToast('WhatsApp disconnected.');
        setTimeout(() => setToast(''), 3000);
      }
    } else {
      setToast('Connecting to WhatsApp Business API...');
      setTimeout(() => {
        setStatus('Connected');
        setToast('WhatsApp connected successfully!');
        setTimeout(() => setToast(''), 3000);
      }, 1500);
    }
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>WhatsApp Business API</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Connect your WhatsApp number to automate messaging.</p>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', background: '#dcf8c6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#075e54"><path d="M12.031 0C5.385 0 0 5.388 0 12.043c0 2.128.555 4.195 1.611 6.012L.15 23.364l5.45-1.43c1.761 1.01 3.766 1.543 5.832 1.543 6.645 0 12.03-5.388 12.03-12.043C23.461 5.388 18.075 0 12.031 0zm-1.097 18.513c-1.63-.035-3.238-.475-4.664-1.277l-.334-.199-3.467.91.925-3.38-.218-.348c-.881-1.401-1.347-3.037-1.347-4.733 0-4.887 3.977-8.867 8.872-8.867 4.896 0 8.874 3.98 8.874 8.867 0 4.888-3.978 8.867-8.874 8.867l.233.16z"/></svg>
          </div>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>WhatsApp {status}</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {status === 'Connected' ? '+1 (555) 123-4567 connected.' : 'You need a verified Meta Business Account.'}
            </p>
          </div>
        </div>

        {status === 'Disconnected' && (
          <div style={{ padding: '16px', background: 'var(--bg-page)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            By connecting WhatsApp, you can automatically send welcome messages to new leads imported via CSV or generated through ads. 
            <br /><br />
            <strong>Requirements:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>A phone number not currently used on a standard WhatsApp app.</li>
              <li>A verified Meta Business Manager account.</li>
            </ul>
          </div>
        )}

        <button 
          className={`btn ${status === 'Connected' ? 'btn-secondary' : 'btn-primary'}`} 
          style={{ alignSelf: 'flex-start' }}
          onClick={handleConnect}
        >
          {status === 'Connected' ? 'Disconnect WhatsApp' : 'Connect WhatsApp'}
        </button>
      </div>
    </div>
  );
}
