'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiDelete, apiGet } from '@/lib/api';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Star, Pencil, Trash2, Plus } from 'lucide-react';

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await apiGet<Project[]>('/projects/admin/all');
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: number) {
    if (!confirm('¿Borrar este proyecto?')) return;
    await apiDelete(`/projects/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="h-4 w-4" /> Nuevo
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No hay proyectos todavía.</p>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Título</th>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Orden</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2 text-muted-foreground">{p.id}</td>
                  <td className="px-4 py-2 font-medium">
                    <span className="flex items-center gap-2">
                      {p.isBest && <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />}
                      {p.title}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{p.slug}</td>
                  <td className="px-4 py-2 text-muted-foreground">{p.date ?? '—'}</td>
                  <td className="px-4 py-2">{p.order}</td>
                  <td className="px-4 py-2">
                    <span className={p.isPublished ? 'text-green-500' : 'text-muted-foreground'}>
                      {p.isPublished ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" asChild>
                        <Link href={`/projects/${p.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(p.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
