'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiDelete, apiGet } from '@/lib/api';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Star, Plus } from 'lucide-react';

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
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            {items.length} {items.length === 1 ? 'proyecto' : 'proyectos'}
          </p>
          <h1 className="text-3xl font-medium tracking-tight">Projects</h1>
        </div>
        <Button asChild size="sm">
          <Link href="/projects/new">
            <Plus className="h-3.5 w-3.5" /> Nuevo
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : items.length === 0 ? (
        <div className="border rounded-lg py-16 text-center">
          <p className="text-sm text-muted-foreground">No hay proyectos todavía.</p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/projects/new">Crea el primero</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y border-y">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="group flex items-center gap-6 py-4 hover:bg-muted/40 -mx-4 px-4 transition-colors"
            >
              {p.coverImage ? (
                <img
                  src={p.coverImage}
                  alt=""
                  className="h-14 w-20 rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-14 w-20 rounded bg-muted flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {p.isBest && <Star className="h-3 w-3 fill-foreground text-foreground" />}
                  <span className="font-medium truncate">{p.title}</span>
                  {!p.isPublished && (
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground border px-1.5 py-0.5 rounded">
                      borrador
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {p.summary ?? p.slug}
                </p>
              </div>
              <div className="hidden md:flex flex-wrap gap-1.5 max-w-[30%]">
                {(p.tags ?? []).slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="text-xs text-muted-foreground tabular-nums w-20 text-right">
                {p.date ?? '—'}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(p.id);
                }}
                className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
              >
                Borrar
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
