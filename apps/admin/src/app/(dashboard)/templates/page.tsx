'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiDelete, apiGet, apiPost } from '@/lib/api';
import { Template } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Plus, Search, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TemplatesPage() {
  const [items, setItems] = useState<Template[]>([]);
  const [q, setQ] = useState('');
  const [favOnly, setFavOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (favOnly) params.set('favorite', 'true');
    setItems(await apiGet<Template[]>(`/templates${params.toString() ? `?${params}` : ''}`));
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [q, favOnly]);

  async function onToggleFav(id: number) {
    await apiPost(`/templates/${id}/favorite`, {});
    load();
  }

  async function onDelete(id: number) {
    if (!confirm('¿Borrar este template?')) return;
    await apiDelete(`/templates/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            {items.length} {items.length === 1 ? 'template' : 'templates'}
          </p>
          <h1 className="text-3xl font-medium tracking-tight">Templates</h1>
        </div>
        <Button size="sm" asChild>
          <Link href="/templates/new">
            <Plus className="h-3.5 w-3.5" /> Nuevo
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, descripción, notas…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
        <button
          onClick={() => setFavOnly(!favOnly)}
          className={cn(
            'text-sm px-3 h-9 rounded-md border transition-colors flex items-center gap-2',
            favOnly
              ? 'bg-foreground text-background border-foreground'
              : 'hover:bg-muted text-muted-foreground',
          )}
        >
          <Heart className={cn('h-3.5 w-3.5', favOnly && 'fill-current')} />
          Favoritos
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : items.length === 0 ? (
        <div className="border rounded-lg py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {q || favOnly ? 'Nada con ese filtro.' : 'Aún no tienes templates guardados.'}
          </p>
          {!q && !favOnly && (
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/templates/new">Añadir el primero</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {items.map((t) => (
            <article key={t.id} className="group">
              <Link href={`/templates/${t.id}`} className="block">
                <div className="aspect-[4/3] overflow-hidden rounded-md border bg-muted relative">
                  {t.coverImage ? (
                    <img
                      src={t.coverImage}
                      alt={t.title}
                      className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                      sin imagen
                    </div>
                  )}
                  {t.price && (
                    <span className="absolute top-2 left-2 bg-background/90 border text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded">
                      {t.price}
                    </span>
                  )}
                </div>
              </Link>
              <div className="mt-3">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/templates/${t.id}`}
                    className="font-medium truncate hover:underline underline-offset-2"
                  >
                    {t.title}
                  </Link>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => onToggleFav(t.id)}
                      className={cn(
                        'p-1 rounded hover:bg-muted transition-colors',
                        t.isFavorite ? 'text-foreground' : 'text-muted-foreground',
                      )}
                      title={t.isFavorite ? 'Quitar de favoritos' : 'Marcar favorito'}
                    >
                      <Heart className={cn('h-3.5 w-3.5', t.isFavorite && 'fill-current')} />
                    </button>
                    {t.websiteUrl && (
                      <a
                        href={t.websiteUrl}
                        target="_blank"
                        rel="noopener"
                        className="p-1 rounded hover:bg-muted text-muted-foreground"
                        title="Abrir sitio"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                {t.authorName && (
                  <p className="text-xs text-muted-foreground truncate">by {t.authorName}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.categories.slice(0, 2).map((c) => (
                    <span
                      key={c}
                      className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                    >
                      {c}
                    </span>
                  ))}
                  {t.styles.slice(0, 1).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                  {t.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
