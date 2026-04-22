'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api';
import { Experience } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

type Draft = Partial<Experience>;

const empty: Draft = {
  company: '',
  role: '',
  location: '',
  description: '',
  startDate: '',
  endDate: '',
  current: false,
  order: 0,
  isPublished: true,
};

export default function ExperiencesPage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setItems(await apiGet<Experience[]>('/experiences/admin/all'));
  }
  useEffect(() => {
    load();
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const { id, createdAt, updatedAt, ...rest } = editing as any;
      const payload = { ...rest, endDate: editing.endDate || undefined };
      if (editing.id) {
        await apiPatch(`/experiences/${editing.id}`, payload);
      } else {
        await apiPost('/experiences', payload);
      }
      setEditing(null);
      load();
    } catch (err: any) {
      setError(err?.message ?? 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm('¿Borrar?')) return;
    await apiDelete(`/experiences/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            {items.length} {items.length === 1 ? 'entrada' : 'entradas'}
          </p>
          <h1 className="text-3xl font-medium tracking-tight">Experience</h1>
        </div>
        <Button size="sm" onClick={() => setEditing({ ...empty })}>
          <Plus className="h-3.5 w-3.5" /> Nuevo
        </Button>
      </div>

      {editing && (
        <form onSubmit={onSave} className="border rounded-lg p-6 mb-8 space-y-5 max-w-3xl">
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <Label>Empresa</Label>
              <Input
                value={editing.company ?? ''}
                onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Rol</Label>
              <Input
                value={editing.role ?? ''}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Ubicación</Label>
              <Input
                value={editing.location ?? ''}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Orden</Label>
              <Input
                type="number"
                value={editing.order ?? 0}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Start date</Label>
              <Input
                type="date"
                value={editing.startDate ?? ''}
                onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>End date</Label>
              <Input
                type="date"
                value={editing.endDate ?? ''}
                onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
                disabled={editing.current}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Descripción</Label>
            <Textarea
              rows={4}
              value={editing.description ?? ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!editing.current}
                onChange={(e) => setEditing({ ...editing, current: e.target.checked })}
                className="h-4 w-4"
              />
              Actual
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!editing.isPublished}
                onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
                className="h-4 w-4"
              />
              Publicado
            </label>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3 pt-2 border-t">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {items.length === 0 && !editing ? (
        <div className="border rounded-lg py-16 text-center">
          <p className="text-sm text-muted-foreground">Sin experiencias todavía.</p>
        </div>
      ) : (
        <div className="divide-y border-y">
          {items.map((x) => (
            <div
              key={x.id}
              className="group flex items-start gap-6 py-4 hover:bg-muted/40 -mx-4 px-4 transition-colors"
            >
              <div className="w-32 text-xs text-muted-foreground tabular-nums flex-shrink-0 pt-0.5">
                {x.startDate}
                <br />
                {x.current ? 'actual' : x.endDate ?? '—'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{x.role}</div>
                <div className="text-sm text-muted-foreground">
                  {x.company}
                  {x.location && <> · {x.location}</>}
                </div>
                {x.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{x.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                <button onClick={() => setEditing(x)} className="text-muted-foreground hover:text-foreground">
                  Editar
                </button>
                <button onClick={() => onDelete(x.id)} className="text-muted-foreground hover:text-destructive">
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
