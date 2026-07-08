import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';
import '../globals.css';

export const metadata: Metadata = {
  title: 'GrowEasy Dashboard',
  description: 'GrowEasy Lead Sources Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="app-layout">
            <Sidebar />
            {/* Main Content */}
            <main className="main-content">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
