'use client';

import { useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPatch } from '@/lib/api';
import { ContactMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2, Archive, Mail, MailOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  async function load() {
    const data = await apiGet<ContactMessage[]>('/contact');
    setItems(data);
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

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Messages</h1>
      <div className="grid grid-cols-[1fr_2fr] gap-6">
        <div className="rounded-lg border overflow-hidden">
          {items.length === 0 ? (
            <p className="p-4 text-muted-foreground text-sm">Sin mensajes.</p>
          ) : (
            items.map((m) => (
              <button
                key={m.id}
                onClick={() => openMessage(m)}
                className={cn(
                  'w-full text-left px-4 py-3 border-b last:border-0 hover:bg-muted/50 flex flex-col gap-1',
                  selected?.id === m.id && 'bg-muted',
                  m.status === 'new' && 'font-medium',
                )}
              >
                <div className="flex items-center gap-2 text-sm">
                  {m.status === 'new' ? (
                    <Mail className="h-3.5 w-3.5" />
                  ) : (
                    <MailOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className="flex-1 truncate">{m.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {m.subject ?? m.message.slice(0, 60)}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="rounded-lg border p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selected.subject ?? '(sin asunto)'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selected.name} &lt;{selected.email}&gt;
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setStatus(selected.id, 'archived')}
                  >
                    <Archive className="h-4 w-4" /> Archivar
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(selected.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-sm">{selected.message}</div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Selecciona un mensaje.</p>
          )}
        </div>
      </div>
    </div>
  );
}
