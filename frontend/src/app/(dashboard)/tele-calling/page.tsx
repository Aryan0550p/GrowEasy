'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';

export default function TeleCalling() {
  const [twilioStatus, setTwilioStatus] = useState('Disconnected');
  const [exotelStatus, setExotelStatus] = useState('Disconnected');
  const [toast, setToast] = useState('');
  
  const [isTwilioModalOpen, setIsTwilioModalOpen] = useState(false);
  const [twilioCreds, setTwilioCreds] = useState({ sid: '', token: '', phone: '' });

  const handleConnectTwilio = () => {
    if (twilioStatus === 'Connected') {
      if (confirm('Disconnect Twilio?')) {
        setTwilioStatus('Disconnected');
        setTwilioCreds({ sid: '', token: '', phone: '' });
        setToast('Twilio disconnected.');
        setTimeout(() => setToast(''), 3000);
      }
    } else {
      setIsTwilioModalOpen(true);
    }
  };

  const handleSaveTwilio = () => {
    if (!twilioCreds.sid || !twilioCreds.token) return alert('Account SID and Auth Token are required.');
    setIsTwilioModalOpen(false);
    setToast('Verifying Twilio credentials...');
    setTimeout(() => {
      setTwilioStatus('Connected');
      setToast('Twilio connected successfully!');
      setTimeout(() => setToast(''), 3000);
    }, 1500);
  };

  const [isExotelModalOpen, setIsExotelModalOpen] = useState(false);
  const [exotelCreds, setExotelCreds] = useState({ accountSid: '', apiKey: '', apiToken: '' });

  const handleConnectExotel = () => {
    if (exotelStatus === 'Connected') {
      if (confirm('Disconnect Exotel?')) {
        setExotelStatus('Disconnected');
        setExotelCreds({ accountSid: '', apiKey: '', apiToken: '' });
        setToast('Exotel disconnected.');
        setTimeout(() => setToast(''), 3000);
      }
    } else {
      setIsExotelModalOpen(true);
    }
  };

  const handleSaveExotel = () => {
    if (!exotelCreds.accountSid || !exotelCreds.apiKey || !exotelCreds.apiToken) return alert('All API credentials are required.');
    setIsExotelModalOpen(false);
    setToast('Verifying Exotel credentials...');
    setTimeout(() => {
      setExotelStatus('Connected');
      setToast('Exotel connected successfully!');
      setTimeout(() => setToast(''), 3000);
    }, 1500);
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
              onClick={handleConnectTwilio}
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
              onClick={handleConnectExotel}
            >
              {exotelStatus === 'Connected' ? 'Manage' : 'Connect'}
            </button>
          </div>
        </div>
      </div>

      {/* Twilio Configuration Modal */}
      <Modal 
        isOpen={isTwilioModalOpen} 
        onClose={() => setIsTwilioModalOpen(false)}
        title="Connect Twilio Account"
        maxWidth="450px"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsTwilioModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveTwilio}>Verify & Connect</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Enter your Twilio API credentials to enable direct calling from the CRM.</p>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Account SID *</label>
            <input 
              type="text" 
              value={twilioCreds.sid}
              onChange={e => setTwilioCreds({...twilioCreds, sid: e.target.value})}
              placeholder="AC..."
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Auth Token *</label>
            <input 
              type="password" 
              value={twilioCreds.token}
              onChange={e => setTwilioCreds({...twilioCreds, token: e.target.value})}
              placeholder="••••••••••••••••"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Twilio Phone Number (Optional)</label>
            <input 
              type="text" 
              value={twilioCreds.phone}
              onChange={e => setTwilioCreds({...twilioCreds, phone: e.target.value})}
              placeholder="+1234567890"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} 
            />
          </div>
        </div>
      </Modal>

      {/* Exotel Configuration Modal */}
      <Modal 
        isOpen={isExotelModalOpen} 
        onClose={() => setIsExotelModalOpen(false)}
        title="Connect Exotel Account"
        maxWidth="450px"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsExotelModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveExotel}>Verify & Connect</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Enter your Exotel API credentials to enable India/APAC calling.</p>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Account SID *</label>
            <input 
              type="text" 
              value={exotelCreds.accountSid}
              onChange={e => setExotelCreds({...exotelCreds, accountSid: e.target.value})}
              placeholder="Your Exotel Account SID"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>API Key *</label>
            <input 
              type="text" 
              value={exotelCreds.apiKey}
              onChange={e => setExotelCreds({...exotelCreds, apiKey: e.target.value})}
              placeholder="Your API Key"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>API Token *</label>
            <input 
              type="password" 
              value={exotelCreds.apiToken}
              onChange={e => setExotelCreds({...exotelCreds, apiToken: e.target.value})}
              placeholder="••••••••••••••••"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} 
            />
          </div>
        </div>
      </Modal>

    </div>
  );
}
