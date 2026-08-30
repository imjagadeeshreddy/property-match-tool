import type { Metadata, Viewport } from 'next';

import { BottomNav } from '@/components/BottomNav';

import './globals.css';

export const metadata: Metadata = {
  title: 'Plot Match',
  description: 'Plots, buyers and follow-ups in one place.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2b6cb0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* One phone-width column, centred so it still looks fine on a laptop. */}
        <div className="mx-auto min-h-screen w-full max-w-lg pb-24">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
