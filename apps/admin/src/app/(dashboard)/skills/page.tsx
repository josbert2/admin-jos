'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api';
import { Skill } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';

type Draft = Partial<Skill>;

const empty: Draft = { name: '', category: '', level: 80, icon: '', order: 0, isPublished: true };

export default function SkillsPage() {
  const [items, setItems] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);

  async function load() {
    setItems(await apiGet<Skill[]>('/skills/admin/all'));
  }
  useEffect(() => {
    load();
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const { id, createdAt, updatedAt, ...payload } = editing as any;
    if (editing.id) {
      await apiPatch(`/skills/${editing.id}`, payload);
    } else {
      await apiPost('/skills', payload);
    }
    setEditing(null);
    load();
  }

  async function onDelete(id: number) {
    if (!confirm('¿Borrar?')) return;
    await apiDelete(`/skills/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <Button onClick={() => setEditing({ ...empty })}>
          <Plus className="h-4 w-4" /> Nuevo
        </Button>
      </div>

      {editing && (
        <form onSubmit={onSave} className="grid grid-cols-3 gap-4 max-w-3xl mb-8 p-4 border rounded-lg">
          <div className="flex flex-col gap-2">
            <Label>Nombre</Label>
            <Input
              value={editing.name ?? ''}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Categoría</Label>
            <Input
              value={editing.category ?? ''}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Nivel (0-100)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={editing.level ?? 0}
              onChange={(e) => setEditing({ ...editing, level: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <Label>Icon (url o nombre)</Label>
            <Input
              value={editing.icon ?? ''}
              onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
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
          <label className="flex items-center gap-2 text-sm col-span-3">
            <input
              type="checkbox"
              checked={!!editing.isPublished}
              onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
            />
            Publicado
          </label>
          <div className="col-span-3 flex gap-2">
            <Button type="submit">Guardar</Button>
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
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Nivel</th>
              <th className="px-4 py-2">Orden</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-2 font-medium">{s.name}</td>
                <td className="px-4 py-2 text-muted-foreground">{s.category ?? '—'}</td>
                <td className="px-4 py-2">{s.level}%</td>
                <td className="px-4 py-2">{s.order}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(s)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(s.id)}>
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
