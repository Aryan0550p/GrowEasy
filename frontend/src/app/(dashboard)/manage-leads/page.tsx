'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  date: string;
  owner: string;
}

const initialLeads: Lead[] = [
  { id: 'L-1042', name: 'Sarah Jenkins', email: 'sarah.j@techflow.io', phone: '+1 (555) 019-2834', source: 'CSV Import', status: 'New', date: '2026-07-08', owner: 'VK Test' },
  { id: 'L-1041', name: 'Marcus Rodriguez', email: 'm.rodriguez@buildright.com', phone: '+1 (555) 432-9912', source: 'Google Ads', status: 'Contacted', date: '2026-07-07', owner: 'VK Test' },
  { id: 'L-1040', name: 'Emily Chen', email: 'echen@innovate.co', phone: '+1 (555) 883-1120', source: 'Facebook Ads', status: 'Qualified', date: '2026-07-07', owner: 'Unassigned' },
  { id: 'L-1039', name: 'David Thompson', email: 'david@thompson-wealth.net', phone: '+1 (555) 231-5444', source: 'CSV Import', status: 'Lost', date: '2026-07-06', owner: 'VK Test' },
  { id: 'L-1038', name: 'Jessica Taylor', email: 'jtaylor@marketingpro.io', phone: '+1 (555) 654-3210', source: 'Website Form', status: 'Converted', date: '2026-07-05', owner: 'VK Test' },
  { id: 'L-1037', name: 'Michael Chang', email: 'michael.c@startup.inc', phone: '+1 (555) 998-8877', source: 'Google Ads', status: 'New', date: '2026-07-05', owner: 'Unassigned' },
];

export default function ManageLeads() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', source: 'Manual Entry' });

  // Filtering Logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = search === '' || 
      lead.name.toLowerCase().includes(search.toLowerCase()) || 
      lead.email.toLowerCase().includes(search.toLowerCase()) || 
      lead.phone.includes(search);
    const matchesStatus = statusFilter === 'All Statuses' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'All Sources' || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleAddLead = () => {
    if (!newLead.name || !newLead.email) return alert('Name and Email are required.');
    
    const lead: Lead = {
      id: `L-${1043 + leads.length}`,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone || '-',
      source: newLead.source,
      status: 'New',
      date: new Date().toISOString().split('T')[0],
      owner: 'Unassigned'
    };
    
    setLeads([lead, ...leads]);
    setIsAddModalOpen(false);
    setNewLead({ name: '', email: '', phone: '', source: 'Manual Entry' });
  };

  const handleExport = () => {
    if (filteredLeads.length === 0) return alert('No leads to export.');
    
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Source', 'Status', 'Date', 'Owner'];
    const csvRows = [headers.join(',')];
    
    for (const lead of filteredLeads) {
      const values = [
        lead.id,
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.phone}"`,
        `"${lead.source}"`,
        `"${lead.status}"`,
        lead.date,
        `"${lead.owner}"`
      ];
      csvRows.push(values.join(','));
    }
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Manage Leads</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View, filter, and organize your CRM leads.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleExport}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Lead
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
          <svg style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-tertiary)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search leads by name, email, or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.875rem' }}
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.875rem', background: 'var(--bg-card)' }}
        >
          <option>All Statuses</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Converted</option>
          <option>Lost</option>
        </select>
        <select 
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.875rem', background: 'var(--bg-card)' }}
        >
          <option>All Sources</option>
          <option>CSV Import</option>
          <option>Google Ads</option>
          <option>Facebook Ads</option>
          <option>Website Form</option>
          <option>Manual Entry</option>
        </select>
        <button className="btn btn-secondary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          More Filters
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '12px 16px', width: '40px' }}><input type="checkbox" /></th>
                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Lead Name</th>
                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Source</th>
                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Owner</th>
                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Created</th>
                <th style={{ padding: '12px 16px', width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No leads match your filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, i) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px' }}><input type="checkbox" /></td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{lead.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{lead.email} • {lead.phone}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: lead.status === 'New' ? '#dbeafe' : lead.status === 'Contacted' ? '#fef3c7' : lead.status === 'Qualified' ? '#e0e7ff' : lead.status === 'Converted' ? '#d1fae5' : '#f3f4f6',
                        color: lead.status === 'New' ? '#1e40af' : lead.status === 'Contacted' ? '#b45309' : lead.status === 'Qualified' ? '#4338ca' : lead.status === 'Converted' ? '#047857' : '#374151',
                      }}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{lead.source}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>
                      {lead.owner === 'Unassigned' ? (
                        <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Unassigned</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '20px', height: '20px', background: '#3b82f6', borderRadius: '4px', color: 'white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>VK</div>
                          {lead.owner}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{lead.date}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <div>Showing 1 to {filteredLeads.length} of {filteredLeads.length} results</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" disabled>Previous</button>
            <button className="btn btn-secondary" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Lead"
        maxWidth="500px"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddLead}>Save Lead</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Name *</label>
            <input 
              type="text" 
              value={newLead.name}
              onChange={e => setNewLead({...newLead, name: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Email *</label>
            <input 
              type="email" 
              value={newLead.email}
              onChange={e => setNewLead({...newLead, email: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Phone</label>
            <input 
              type="text" 
              value={newLead.phone}
              onChange={e => setNewLead({...newLead, phone: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }} 
            />
          </div>
        </div>
      </Modal>

    </div>
  );
}
