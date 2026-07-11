'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';

interface Member {
  name: string;
  role: string;
  email: string;
  status: string;
  lastActive: string;
}

const initialMembers: Member[] = [
  { name: 'VK Test', role: 'Owner', email: 'vk@groweasy.com', status: 'Active', lastActive: 'Just now' },
  { name: 'Sarah Jenkins', role: 'Admin', email: 'sarah.j@groweasy.com', status: 'Active', lastActive: '2 hrs ago' },
  { name: 'Marcus Rodriguez', role: 'Agent', email: 'marcus@groweasy.com', status: 'Active', lastActive: '5 hrs ago' },
  { name: 'Emily Chen', role: 'Agent', email: 'echen@groweasy.com', status: 'Offline', lastActive: '2 days ago' },
];

export default function TeamMembers() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Agent' });

  const handleInvite = () => {
    if (!newMember.name || !newMember.email) return alert('Name and email are required');
    setMembers([
      { name: newMember.name, email: newMember.email, role: newMember.role, status: 'Pending', lastActive: 'Invited just now' },
      ...members
    ]);
    setIsModalOpen(false);
    setNewMember({ name: '', email: '', role: 'Agent' });
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Team Members</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your team's access and roles.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          Invite Member
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-page)' }}>
            <tr>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>User</th>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Last Active</th>
              <th style={{ padding: '12px 24px', width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: '#3b82f6', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {m.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{m.role}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.875rem',
                    color: m.status === 'Active' ? 'var(--brand-success)' : m.status === 'Pending' ? '#b45309' : 'var(--text-tertiary)'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: m.status === 'Active' ? 'var(--brand-success)' : m.status === 'Pending' ? '#b45309' : 'var(--text-tertiary)' }}></span>
                    {m.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{m.lastActive}</td>
                <td style={{ padding: '16px 24px', color: 'var(--text-tertiary)' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Invite Team Member"
        maxWidth="400px"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleInvite}>Send Invite</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Full Name *</label>
            <input 
              type="text" 
              value={newMember.name}
              onChange={e => setNewMember({...newMember, name: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Email Address *</label>
            <input 
              type="email" 
              value={newMember.email}
              onChange={e => setNewMember({...newMember, email: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Role</label>
            <select
              value={newMember.role}
              onChange={e => setNewMember({...newMember, role: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}
            >
              <option>Admin</option>
              <option>Agent</option>
              <option>Viewer</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
