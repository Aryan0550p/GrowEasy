'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';

interface Campaign {
  name: string;
  type: string;
  status: string;
  spend: string;
  leads: number;
  cpl: string;
}

const initialCampaigns: Campaign[] = [
  { name: 'Q3 E-book Download', type: 'Facebook Ads', status: 'Active', spend: '$1,240', leads: 342, cpl: '$3.62' },
  { name: 'Summer Webinar Signups', type: 'Google Ads', status: 'Active', spend: '$850', leads: 128, cpl: '$6.64' },
  { name: 'Website Contact Form', type: 'Organic', status: 'Active', spend: '$0', leads: 45, cpl: '$0.00' },
  { name: 'Retargeting Sequence', type: 'Facebook Ads', status: 'Paused', spend: '$420', leads: 82, cpl: '$5.12' }
];

export default function GenerateLeads() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', type: 'Facebook Ads' });
  const [toast, setToast] = useState('');

  const handleCreate = () => {
    if (!newCampaign.name) return alert('Campaign name is required');
    setCampaigns([
      { name: newCampaign.name, type: newCampaign.type, status: 'Active', spend: '$0', leads: 0, cpl: '$0.00' },
      ...campaigns
    ]);
    setIsModalOpen(false);
    setNewCampaign({ name: '', type: 'Facebook Ads' });
  };

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleViewAnalytics = (camp: Campaign) => {
    setSelectedCampaign(camp);
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Generate Leads</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create and monitor your lead generation campaigns.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Campaign
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {campaigns.map((camp, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>{camp.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'inline-block', padding: '2px 8px', background: 'var(--bg-page)', borderRadius: '4px' }}>{camp.type}</span>
              </div>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                padding: '4px 8px', 
                borderRadius: '12px',
                background: camp.status === 'Active' ? '#d1fae5' : '#f3f4f6',
                color: camp.status === 'Active' ? '#047857' : '#374151'
              }}>{camp.status}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Spend</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{camp.spend}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Leads</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--brand-success)' }}>{camp.leads}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>CPL</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{camp.cpl}</div>
              </div>
            </div>

            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => handleViewAnalytics(camp)}>View Analytics</button>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Campaign"
        maxWidth="400px"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Create Campaign</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Campaign Name *</label>
            <input 
              type="text" 
              value={newCampaign.name}
              onChange={e => setNewCampaign({...newCampaign, name: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Source Type</label>
            <select
              value={newCampaign.type}
              onChange={e => setNewCampaign({...newCampaign, type: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}
            >
              <option>Facebook Ads</option>
              <option>Google Ads</option>
              <option>LinkedIn Ads</option>
              <option>Custom Landing Page</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Analytics Modal */}
      <Modal 
        isOpen={selectedCampaign !== null} 
        onClose={() => setSelectedCampaign(null)}
        title={selectedCampaign ? `${selectedCampaign.name} Analytics` : 'Analytics'}
        maxWidth="600px"
        footer={
          <button className="btn btn-primary" onClick={() => setSelectedCampaign(null)}>Close</button>
        }
      >
        {selectedCampaign && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px', padding: '16px', background: 'var(--bg-page)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Total Spend</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedCampaign.spend}</div>
              </div>
              <div style={{ flex: 1, minWidth: '150px', padding: '16px', background: 'var(--bg-page)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Leads Generated</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-success)' }}>{selectedCampaign.leads}</div>
              </div>
              <div style={{ flex: 1, minWidth: '150px', padding: '16px', background: 'var(--bg-page)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Cost Per Lead</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedCampaign.cpl}</div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Performance Overview (Mock Data)</h4>
              <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '24px 0', borderBottom: '1px solid var(--border-color)' }}>
                {[...Array(7)].map((_, i) => {
                  const height = Math.max(20, Math.random() * 100);
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '100%', height: `${height}%`, background: 'var(--brand-primary)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Day {i+1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Source: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedCampaign.type}</span> • Status: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedCampaign.status}</span>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
