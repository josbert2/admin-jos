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
      const payload = { ...rest, date: p.date || undefined };
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
    <form onSubmit={onSubmit} className="max-w-3xl space-y-10">
      <Section title="Info básica">
        <Row>
          <Field label="Título">
            <Input value={p.title ?? ''} onChange={(e) => set('title', e.target.value)} required />
          </Field>
          <Field label="Slug">
            <Input value={p.slug ?? ''} onChange={(e) => set('slug', e.target.value)} required />
          </Field>
        </Row>
        <Row>
          <Field label="Cliente">
            <Input value={p.client ?? ''} onChange={(e) => set('client', e.target.value)} />
          </Field>
          <Field label="Fecha">
            <Input type="date" value={p.date ?? ''} onChange={(e) => set('date', e.target.value)} />
          </Field>
        </Row>
        <Field label="Resumen">
          <Input value={p.summary ?? ''} onChange={(e) => set('summary', e.target.value)} />
        </Field>
        <Field label="Descripción">
          <Textarea
            rows={3}
            value={p.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
          />
        </Field>
        <Field label="Contenido (markdown)">
          <Textarea
            rows={8}
            value={p.content ?? ''}
            onChange={(e) => set('content', e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Media">
        <Field label="Portada">
          <SingleUploader
            value={p.coverImage}
            onChange={(url) => set('coverImage', url)}
            folder={p.slug ? `projects/${p.slug}` : 'projects'}
          />
        </Field>
        <Field label="Galería">
          <MultiUploader
            value={(p.images as string[]) ?? []}
            onChange={(urls) => set('images', urls)}
            folder={p.slug ? `projects/${p.slug}` : 'projects'}
          />
        </Field>
      </Section>

      <Section title="Metadata">
        <Row>
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
        </Row>
        <Row>
          <Field label="Link demo">
            <Input value={p.linkLive ?? ''} onChange={(e) => set('linkLive', e.target.value)} />
          </Field>
          <Field label="Link repo">
            <Input value={p.linkRepo ?? ''} onChange={(e) => set('linkRepo', e.target.value)} />
          </Field>
        </Row>
        <Field label="Orden">
          <Input
            type="number"
            value={p.order ?? 0}
            onChange={(e) => set('order', Number(e.target.value))}
            className="max-w-[120px]"
          />
        </Field>
        <div className="flex items-center gap-6 pt-2">
          <Toggle
            checked={!!p.isBest}
            onChange={(v) => set('isBest', v)}
            label="Destacado"
          />
          <Toggle
            checked={!!p.isPublished}
            onChange={(v) => set('isPublished', v)}
            label="Publicado"
          />
        </div>
      </Section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-5">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-input"
      />
      {label}
    </label>
  );
}
