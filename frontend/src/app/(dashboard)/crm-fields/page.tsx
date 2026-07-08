'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';

interface Field {
  name: string;
  type: string;
  required: boolean;
  system: boolean;
}

const initialFields: Field[] = [
  { name: 'lead_score', type: 'Number', required: false, system: true },
  { name: 'industry', type: 'Dropdown', required: false, system: false },
  { name: 'company_size', type: 'Dropdown', required: false, system: false },
  { name: 'budget', type: 'Currency', required: false, system: false },
  { name: 'lead_source', type: 'Text', required: true, system: true },
  { name: 'notes', type: 'Text Area', required: false, system: true },
];

export default function CRMFields() {
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newField, setNewField] = useState({ name: '', type: 'Text', required: false });

  const handleAddField = () => {
    if (!newField.name) return alert('Field Key is required');
    
    const formattedName = newField.name.toLowerCase().replace(/\s+/g, '_');
    
    setFields([
      ...fields,
      { name: formattedName, type: newField.type, required: newField.required, system: false }
    ]);
    setIsModalOpen(false);
    setNewField({ name: '', type: 'Text', required: false });
  };

  const handleDeleteField = (index: number) => {
    if (confirm('Are you sure you want to delete this custom field?')) {
      const newFields = [...fields];
      newFields.splice(index, 1);
      setFields(newFields);
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>CRM Fields</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage standard and custom fields for your CRM records.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Custom Field
        </button>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-page)' }}>
            <tr>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Field Key</th>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Data Type</th>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Required</th>
              <th style={{ padding: '12px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Type</th>
              <th style={{ padding: '12px 24px', width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px 24px', fontWeight: 500, fontSize: '0.875rem', fontFamily: 'monospace' }}>{f.name}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{f.type}</td>
                <td style={{ padding: '16px 24px' }}>
                  {f.required ? (
                    <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#fee2e2', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}>Yes</span>
                  ) : (
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>No</span>
                  )}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  {f.system ? (
                    <span style={{ padding: '4px 8px', borderRadius: '12px', background: 'var(--bg-page)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>System</span>
                  ) : (
                    <span style={{ padding: '4px 8px', borderRadius: '12px', background: 'var(--brand-secondary-light)', color: 'var(--brand-secondary)', fontSize: '0.75rem', fontWeight: 500 }}>Custom</span>
                  )}
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-tertiary)' }}>
                  {!f.system && (
                    <button 
                      onClick={() => handleDeleteField(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                      title="Delete Field"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add Custom Field"
        maxWidth="400px"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddField}>Save Field</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Field Key *</label>
            <input 
              type="text" 
              placeholder="e.g. company_size"
              value={newField.name}
              onChange={e => setNewField({...newField, name: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Data Type</label>
            <select
              value={newField.type}
              onChange={e => setNewField({...newField, type: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white' }}
            >
              <option>Text</option>
              <option>Text Area</option>
              <option>Number</option>
              <option>Dropdown</option>
              <option>Date</option>
              <option>Boolean (Yes/No)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 500 }}>
              <input 
                type="checkbox" 
                checked={newField.required}
                onChange={e => setNewField({...newField, required: e.target.checked})}
              />
              Make this field required
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
