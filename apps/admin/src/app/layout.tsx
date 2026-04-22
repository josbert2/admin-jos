import './globals.css';
import type { Metadata } from 'next';
import { euclid } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Admin · Portfolio',
  description: 'Portfolio admin panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={euclid.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
