import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import '../globals.css';

export const metadata: Metadata = {
  title: 'GrowEasy Authentication',
  description: 'Login to GrowEasy CRM',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
            {/* Form Side */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
              <div style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
                  <div style={{ width: '32px', height: '32px', background: 'var(--brand-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>↗</div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>GrowEasy</span>
                </div>
                {children}
              </div>
            </div>
            
            {/* Branding Side */}
            <div style={{ flex: '1', display: 'none', background: 'var(--bg-panel)', borderLeft: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }} className="auth-branding">
              {/* The CSS class auth-branding will display: block on larger screens */}
              <div style={{ position: 'absolute', inset: 0, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px', lineHeight: '1.2' }}>Manage your leads,<br/>effortlessly.</h2>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '400px' }}>
                  The all-in-one CRM built for modern sales teams. Connect your ad accounts, import CSVs, and engage your leads in seconds.
                </p>
                
                {/* Abstract decorative elements */}
                <div style={{ position: 'absolute', right: '-10%', bottom: '-10%', width: '400px', height: '400px', background: 'var(--brand-primary)', opacity: '0.1', borderRadius: '50%', filter: 'blur(40px)' }}></div>
                <div style={{ position: 'absolute', right: '20%', top: '10%', width: '300px', height: '300px', background: '#3b82f6', opacity: '0.1', borderRadius: '50%', filter: 'blur(40px)' }}></div>
              </div>
            </div>
          </div>
          <style>{`
            @media (min-width: 1024px) {
              .auth-branding {
                display: block !important;
              }
            }
          `}</style>
        </ThemeProvider>
      </body>
    </html>
  );
}
