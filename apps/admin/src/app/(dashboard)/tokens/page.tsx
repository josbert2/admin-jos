'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost } from '@/lib/api';
import { ApiToken } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Copy, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TokensPage() {
  const [items, setItems] = useState<ApiToken[]>([]);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [justCreated, setJustCreated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function load() {
    setItems(await apiGet<ApiToken[]>('/tokens'));
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await apiPost<{ token: string }>('/tokens', { name });
    setJustCreated(res.token);
    setName('');
    setCreating(false);
    load();
  }

  async function onRevoke(id: number) {
    if (!confirm('¿Revocar este token? No se podrá usar más.')) return;
    await apiPost(`/tokens/${id}/revoke`, {});
    load();
  }

  async function onDelete(id: number) {
    if (!confirm('¿Borrar definitivamente?')) return;
    await apiDelete(`/tokens/${id}`);
    load();
  }

  async function copy() {
    if (!justCreated) return;
    await navigator.clipboard.writeText(justCreated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            {items.length} {items.length === 1 ? 'token' : 'tokens'}
          </p>
          <h1 className="text-3xl font-medium tracking-tight">API tokens</h1>
        </div>
        {!creating && !justCreated && (
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-3.5 w-3.5" /> Nuevo
          </Button>
        )}
      </div>

      {justCreated && (
        <div className="border rounded-lg p-6 mb-8 bg-muted/30 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Token creado · cópialo ahora, no volverá a mostrarse
          </p>
          <div className="flex items-center gap-2 font-mono text-sm bg-background border rounded px-3 py-2">
            <code className="flex-1 break-all">{justCreated}</code>
            <button
              onClick={copy}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t">
            <Button size="sm" onClick={() => setJustCreated(null)}>
              Listo
            </Button>
          </div>
        </div>
      )}

      {creating && (
        <form onSubmit={onCreate} className="border rounded-lg p-6 mb-8 space-y-4 max-w-md">
          <div className="flex flex-col gap-2">
            <Label>Nombre (descripción)</Label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="p.ej. Portfolio público · Next.js"
              required
            />
          </div>
          <div className="flex gap-3 pt-2 border-t">
            <Button type="submit" size="sm">Crear</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setCreating(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="border rounded-lg py-16 text-center">
          <p className="text-sm text-muted-foreground">Sin tokens todavía.</p>
        </div>
      ) : (
        <div className="divide-y border-y">
          {items.map((t) => {
            const revoked = !!t.revokedAt;
            return (
              <div
                key={t.id}
                className={cn(
                  'group flex items-center gap-6 py-4 hover:bg-muted/40 -mx-4 px-4 transition-colors',
                  revoked && 'opacity-50',
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{t.name}</span>
                    {revoked && (
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground border px-1.5 py-0.5 rounded">
                        revocado
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">
                    {t.prefix}…
                  </div>
                </div>
                <div className="text-xs text-muted-foreground tabular-nums w-32 text-right">
                  {t.lastUsedAt
                    ? `usado ${new Date(t.lastUsedAt).toLocaleDateString('es-ES')}`
                    : 'sin uso'}
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                  {!revoked && (
                    <button
                      onClick={() => onRevoke(t.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Revocar
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(t.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
