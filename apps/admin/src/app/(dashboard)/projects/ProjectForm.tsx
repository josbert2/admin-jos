'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPatch, apiPost } from '@/lib/api';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SingleUploader, MultiUploader } from '@/components/Uploader';

type Draft = Partial<Project>;

const toList = (s: string): string[] =>
  s.split(',').map((x) => x.trim()).filter(Boolean);

const fromList = (arr?: string[] | null) => (arr ?? []).join(', ');

export function ProjectForm({ initial }: { initial?: Project }) {
  const router = useRouter();
  const [p, setP] = useState<Draft>(
    initial ?? {
      title: '',
      slug: '',
      summary: '',
      description: '',
      content: '',
      coverImage: '',
      images: [],
      tags: [],
      stack: [],
      linkLive: '',
      linkRepo: '',
      client: '',
      date: '',
      order: 0,
      isBest: false,
      isPublished: true,
    },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setP((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { id, createdAt, updatedAt, ...rest } = p as any;
      const payload = {
        ...rest,
        date: p.date || undefined,
      };
      if (initial?.id) {
        await apiPatch(`/projects/${initial.id}`, payload);
      } else {
        await apiPost('/projects', payload);
      }
      router.push('/projects');
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Error guardando');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4 max-w-4xl">
      <Field label="Título">
        <Input value={p.title ?? ''} onChange={(e) => set('title', e.target.value)} required />
      </Field>
      <Field label="Slug">
        <Input value={p.slug ?? ''} onChange={(e) => set('slug', e.target.value)} required />
      </Field>
      <Field label="Cliente" className="col-span-1">
        <Input value={p.client ?? ''} onChange={(e) => set('client', e.target.value)} />
      </Field>
      <Field label="Fecha" className="col-span-1">
        <Input
          type="date"
          value={p.date ?? ''}
          onChange={(e) => set('date', e.target.value)}
        />
      </Field>
      <Field label="Resumen" className="col-span-2">
        <Input value={p.summary ?? ''} onChange={(e) => set('summary', e.target.value)} />
      </Field>
      <Field label="Descripción" className="col-span-2">
        <Textarea
          value={p.description ?? ''}
          onChange={(e) => set('description', e.target.value)}
          rows={4}
        />
      </Field>
      <Field label="Contenido (markdown)" className="col-span-2">
        <Textarea
          value={p.content ?? ''}
          onChange={(e) => set('content', e.target.value)}
          rows={8}
        />
      </Field>
      <Field label="Cover image" className="col-span-2">
        <SingleUploader
          value={p.coverImage}
          onChange={(url) => set('coverImage', url)}
          folder={p.slug ? `projects/${p.slug}` : 'projects'}
        />
      </Field>
      <Field label="Galería de imágenes" className="col-span-2">
        <MultiUploader
          value={(p.images as string[]) ?? []}
          onChange={(urls) => set('images', urls)}
          folder={p.slug ? `projects/${p.slug}` : 'projects'}
        />
      </Field>
      <Field label="Tags (coma)">
        <Input
          value={fromList(p.tags as string[])}
          onChange={(e) => set('tags', toList(e.target.value))}
        />
      </Field>
      <Field label="Stack (coma)">
        <Input
          value={fromList(p.stack as string[])}
          onChange={(e) => set('stack', toList(e.target.value))}
        />
      </Field>
      <Field label="Link demo">
        <Input value={p.linkLive ?? ''} onChange={(e) => set('linkLive', e.target.value)} />
      </Field>
      <Field label="Link repo">
        <Input value={p.linkRepo ?? ''} onChange={(e) => set('linkRepo', e.target.value)} />
      </Field>
      <Field label="Orden">
        <Input
          type="number"
          value={p.order ?? 0}
          onChange={(e) => set('order', Number(e.target.value))}
        />
      </Field>
      <div className="flex items-center gap-6 col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!p.isBest}
            onChange={(e) => set('isBest', e.target.checked)}
          />
          Destacado (best project)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!p.isPublished}
            onChange={(e) => set('isPublished', e.target.checked)}
          />
          Publicado
        </label>
      </div>

      {error && <p className="col-span-2 text-sm text-destructive">{error}</p>}

      <div className="col-span-2 flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
