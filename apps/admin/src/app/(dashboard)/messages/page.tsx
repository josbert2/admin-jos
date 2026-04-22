'use client';

import { useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPatch } from '@/lib/api';
import { ContactMessage } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  async function load() {
    setItems(await apiGet<ContactMessage[]>('/contact'));
  }
  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: number, status: ContactMessage['status']) {
    await apiPatch(`/contact/${id}/status`, { status });
    load();
    if (selected?.id === id) setSelected({ ...selected, status });
  }

  async function onDelete(id: number) {
    if (!confirm('¿Borrar?')) return;
    await apiDelete(`/contact/${id}`);
    if (selected?.id === id) setSelected(null);
    load();
  }

  async function openMessage(m: ContactMessage) {
    setSelected(m);
    if (m.status === 'new') await setStatus(m.id, 'read');
  }

  const unread = items.filter((m) => m.status === 'new').length;

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          {items.length} mensajes {unread > 0 && `· ${unread} sin leer`}
        </p>
        <h1 className="text-3xl font-medium tracking-tight">Messages</h1>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-10 min-h-[500px]">
        <div>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin mensajes.</p>
          ) : (
            <div className="divide-y border-y">
              {items.map((m) => (
                <button
                  key={m.id}
                  onClick={() => openMessage(m)}
                  className={cn(
                    'w-full text-left py-3 -mx-2 px-2 hover:bg-muted/40 transition-colors block',
                    selected?.id === m.id && 'bg-muted/60',
                  )}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    {m.status === 'new' && (
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    )}
                    <span className={cn('flex-1 text-sm truncate', m.status === 'new' && 'font-medium')}>
                      {m.name}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {new Date(m.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate pl-3.5">
                    {m.subject ?? m.message.slice(0, 80)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {selected ? (
            <article>
              <header className="pb-6 mb-6 border-b">
                <h2 className="text-xl font-medium tracking-tight mb-2">
                  {selected.subject ?? '(sin asunto)'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selected.name} &lt;{selected.email}&gt;
                </p>
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                  {new Date(selected.createdAt).toLocaleString('es-ES')}
                </p>
              </header>
              <div className="whitespace-pre-wrap text-sm leading-relaxed mb-8">
                {selected.message}
              </div>
              <div className="flex gap-4 pt-4 border-t text-xs">
                <button
                  onClick={() => setStatus(selected.id, 'archived')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Archivar
                </button>
                <button
                  onClick={() => onDelete(selected.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  Borrar
                </button>
              </div>
            </article>
          ) : (
            <p className="text-sm text-muted-foreground">Selecciona un mensaje.</p>
          )}
        </div>
      </div>
    </div>
  );
}
