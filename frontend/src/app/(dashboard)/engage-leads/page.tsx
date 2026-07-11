'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';

interface Broadcast {
  name: string;
  type: string;
  sent: number | string;
  opened: string;
  clicked: string;
  status: string;
}

const initialBroadcasts: Broadcast[] = [
  { name: 'Welcome Sequence (Email 1)', type: 'Email', sent: 1250, opened: '48%', clicked: '12%', status: 'Active' },
  { name: 'July Promo Text', type: 'SMS', sent: 800, opened: '98%', clicked: '34%', status: 'Completed' },
  { name: 'Webinar Reminder', type: 'Email', sent: 450, opened: '52%', clicked: '8%', status: 'Completed' }
];

export default function EngageLeads() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(initialBroadcasts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBroadcast, setNewBroadcast] = useState({ name: '', type: 'Email' });

  const handleCreate = () => {
    if (!newBroadcast.name) return alert('Broadcast name is required');
    setBroadcasts([
      { name: newBroadcast.name, type: newBroadcast.type, sent: 'Scheduled', opened: '-', clicked: '-', status: 'Pending' },
      ...broadcasts
    ]);
    setIsModalOpen(false);
    setNewBroadcast({ name: '', type: 'Email' });
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Engage Leads</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Communicate with your leads via Email and SMS campaigns.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          New Broadcast
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-page)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Broadcasts</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Campaign Name</th>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Type</th>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Sent</th>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Opened</th>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Clicked</th>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {broadcasts.map((b, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px 24px', fontWeight: 500, fontSize: '0.875rem' }}>{b.name}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{b.type}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem' }}>{typeof b.sent === 'number' ? b.sent.toLocaleString() : b.sent}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: b.opened !== '-' ? 'var(--brand-success)' : 'inherit', fontWeight: 500 }}>{b.opened}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: b.clicked !== '-' ? 'var(--brand-primary)' : 'inherit', fontWeight: 500 }}>{b.clicked}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: b.status === 'Active' ? '#d1fae5' : b.status === 'Pending' ? '#fef3c7' : '#f3f4f6',
                    color: b.status === 'Active' ? '#047857' : b.status === 'Pending' ? '#b45309' : '#374151'
                  }}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Broadcast"
        maxWidth="400px"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Schedule</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Broadcast Name *</label>
            <input 
              type="text" 
              value={newBroadcast.name}
              onChange={e => setNewBroadcast({...newBroadcast, name: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Broadcast Type</label>
            <select
              value={newBroadcast.type}
              onChange={e => setNewBroadcast({...newBroadcast, type: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}
            >
              <option>Email</option>
              <option>SMS</option>
              <option>WhatsApp Message</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
