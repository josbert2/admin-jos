'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api';
import { Experience } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Plus } from 'lucide-react';

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
      const payload = {
        ...rest,
        endDate: editing.endDate || undefined,
      };
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Experience</h1>
        <Button onClick={() => setEditing({ ...empty })}>
          <Plus className="h-4 w-4" /> Nuevo
        </Button>
      </div>

      {editing && (
        <form onSubmit={onSave} className="grid grid-cols-2 gap-4 max-w-3xl mb-8 p-4 border rounded-lg">
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
          <div className="flex flex-col gap-2 col-span-2">
            <Label>Descripción</Label>
            <Textarea
              rows={4}
              value={editing.description ?? ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </div>
          <div className="flex gap-6 col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!editing.current}
                onChange={(e) => setEditing({ ...editing, current: e.target.checked })}
              />
              Actual
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!editing.isPublished}
                onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
              />
              Publicado
            </label>
          </div>
          {error && <p className="col-span-2 text-sm text-destructive">{error}</p>}
          <div className="col-span-2 flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-2">Empresa</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Desde</th>
              <th className="px-4 py-2">Hasta</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id} className="border-t">
                <td className="px-4 py-2 font-medium">{x.company}</td>
                <td className="px-4 py-2">{x.role}</td>
                <td className="px-4 py-2 text-muted-foreground">{x.startDate}</td>
                <td className="px-4 py-2 text-muted-foreground">
                  {x.current ? 'Actual' : x.endDate ?? '—'}
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(x)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(x.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
