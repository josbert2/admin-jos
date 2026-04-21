'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Briefcase, FolderKanban, Wrench, Mail, LogOut } from 'lucide-react';
import { clearToken, getToken } from '@/lib/api';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/experiences', label: 'Experience', icon: Briefcase },
  { href: '/skills', label: 'Skills', icon: Wrench },
  { href: '/messages', label: 'Messages', icon: Mail },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  function logout() {
    clearToken();
    router.replace('/login');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r bg-card p-4 flex flex-col">
        <div className="mb-6 px-2">
          <p className="text-sm uppercase tracking-wider text-muted-foreground">Portfolio</p>
          <h1 className="text-lg font-semibold">Admin</h1>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {nav.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                  active ? 'bg-muted font-medium' : 'hover:bg-muted/50',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
