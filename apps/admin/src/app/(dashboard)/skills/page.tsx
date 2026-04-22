'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api';
import { Skill } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

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

  const grouped = items.reduce<Record<string, Skill[]>>((acc, s) => {
    const k = s.category ?? 'Otros';
    (acc[k] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            {items.length} skills
          </p>
          <h1 className="text-3xl font-medium tracking-tight">Skills</h1>
        </div>
        <Button size="sm" onClick={() => setEditing({ ...empty })}>
          <Plus className="h-3.5 w-3.5" /> Nuevo
        </Button>
      </div>

      {editing && (
        <form onSubmit={onSave} className="border rounded-lg p-6 mb-8 space-y-5 max-w-2xl">
          <div className="grid grid-cols-3 gap-5">
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
              <Label>Nivel</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={editing.level ?? 0}
                onChange={(e) => setEditing({ ...editing, level: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 flex flex-col gap-2">
              <Label>Icon</Label>
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
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={!!editing.isPublished}
              onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
              className="h-4 w-4"
            />
            Publicado
          </label>
          <div className="flex gap-3 pt-2 border-t">
            <Button type="submit" size="sm">Guardar</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {items.length === 0 && !editing ? (
        <div className="border rounded-lg py-16 text-center">
          <p className="text-sm text-muted-foreground">Sin skills todavía.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, list]) => (
            <div key={cat}>
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{cat}</h2>
              <div className="divide-y border-y">
                {list.map((s) => (
                  <div
                    key={s.id}
                    className="group flex items-center gap-4 py-3 hover:bg-muted/40 -mx-4 px-4 transition-colors"
                  >
                    <span className="font-medium flex-1">{s.name}</span>
                    <div className="w-48 flex items-center gap-3">
                      <div className="flex-1 h-[2px] bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-foreground"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
                        {s.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                      <button onClick={() => setEditing(s)} className="text-muted-foreground hover:text-foreground">
                        Editar
                      </button>
                      <button onClick={() => onDelete(s.id)} className="text-muted-foreground hover:text-destructive">
                        Borrar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
