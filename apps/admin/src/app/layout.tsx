import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin · Portfolio',
  description: 'Portfolio admin panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-background antialiased">{children}</body>
    </html>
  );
}
