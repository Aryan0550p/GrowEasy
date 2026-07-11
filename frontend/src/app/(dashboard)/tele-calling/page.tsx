'use client';

import { useState } from 'react';

export default function TeleCalling() {
  const [twilioStatus, setTwilioStatus] = useState('Disconnected');
  const [exotelStatus, setExotelStatus] = useState('Disconnected');
  const [toast, setToast] = useState('');

  const handleConnect = (provider: string, status: string, setStatusFn: (s: string) => void) => {
    if (status === 'Connected') {
      if (confirm(`Disconnect ${provider}?`)) {
        setStatusFn('Disconnected');
        setToast(`${provider} disconnected.`);
        setTimeout(() => setToast(''), 3000);
      }
    } else {
      setToast(`Connecting to ${provider}...`);
      setTimeout(() => {
        setStatusFn('Connected');
        setToast(`${provider} connected successfully!`);
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Tele Calling Integration</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Set up cloud telephony to make calls directly from the CRM.</p>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', maxWidth: '600px' }}>
        
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Available Integrations</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: twilioStatus === 'Connected' ? '#f0fdf4' : 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: '#F22F46', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>TW</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Twilio {twilioStatus === 'Connected' && <span style={{ color: '#047857', fontSize: '0.75rem', marginLeft: '8px' }}>(Connected)</span>}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Global voice API</div>
              </div>
            </div>
            <button 
              className={`btn ${twilioStatus === 'Connected' ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => handleConnect('Twilio', twilioStatus, setTwilioStatus)}
            >
              {twilioStatus === 'Connected' ? 'Manage' : 'Connect'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: exotelStatus === 'Connected' ? '#f0fdf4' : 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: '#00C4FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>EX</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Exotel {exotelStatus === 'Connected' && <span style={{ color: '#047857', fontSize: '0.75rem', marginLeft: '8px' }}>(Connected)</span>}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>India/APAC telephony</div>
              </div>
            </div>
            <button 
              className={`btn ${exotelStatus === 'Connected' ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => handleConnect('Exotel', exotelStatus, setExotelStatus)}
            >
              {exotelStatus === 'Connected' ? 'Manage' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
