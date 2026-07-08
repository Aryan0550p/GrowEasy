const fs = require('fs');
const pages = [
  { path: 'generate-leads', title: 'Generate Leads', desc: 'Create and manage lead generation campaigns.' },
  { path: 'manage-leads', title: 'Manage Leads', desc: 'View and organize your imported leads.' },
  { path: 'engage-leads', title: 'Engage Leads', desc: 'Communicate with your leads via email and SMS.' },
  { path: 'team-members', title: 'Team Members', desc: 'Manage your team access and roles.' },
  { path: 'ad-accounts', title: 'Ad Accounts', desc: 'Connect your Facebook and Google Ad accounts.' },
  { path: 'whatsapp', title: 'WhatsApp Account', desc: 'Configure WhatsApp Business API integration.' },
  { path: 'tele-calling', title: 'Tele Calling', desc: 'Set up telephony and call routing.' },
  { path: 'crm-fields', title: 'CRM Fields', desc: 'Manage custom fields for your CRM records.' }
];

pages.forEach(p => {
  fs.mkdirSync(`frontend/src/app/${p.path}`, { recursive: true });
  const content = `export default function Page() {
  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>${p.title}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>${p.desc}</p>
      <div style={{ padding: '48px', textAlign: 'center', background: 'white', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-tertiary)' }}>
        This module is currently under development.
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(`frontend/src/app/${p.path}/page.tsx`, content);
});
console.log('Pages created successfully.');
