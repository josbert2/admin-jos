'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPatch, apiPost, apiDelete } from '@/lib/api';
import { Template } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SingleUploader, MultiUploader } from '@/components/Uploader';

type Draft = Partial<Template>;

const toList = (s: string): string[] =>
  s.split(',').map((x) => x.trim()).filter(Boolean);
const fromList = (arr?: string[] | null) => (arr ?? []).join(', ');

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function TemplateForm({ initial }: { initial?: Template }) {
  const router = useRouter();
  const [t, setT] = useState<Draft>(
    initial ?? {
      title: '',
      slug: '',
      description: '',
      notes: '',
      websiteUrl: '',
      sourceUrl: '',
      authorName: '',
      authorUrl: '',
      authorImage: '',
      coverImage: '',
      mobileImage: '',
      images: [],
      sections: [],
      features: [],
      categories: [],
      styles: [],
      typefaces: [],
      tags: [],
      colors: [],
      stack: [],
      publishedAt: '',
      price: undefined,
      rating: undefined,
      isFavorite: false,
      order: 0,
    },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setT((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { id, createdAt, updatedAt, ...rest } = t as any;
      const payload = {
        ...rest,
        publishedAt: t.publishedAt || undefined,
        rating: t.rating || undefined,
        price: t.price || undefined,
      };
      if (initial?.id) {
        await apiPatch(`/templates/${initial.id}`, payload);
      } else {
        await apiPost('/templates', payload);
      }
      router.push('/templates');
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Error guardando');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!initial?.id) return;
    if (!confirm('¿Borrar este template?')) return;
    await apiDelete(`/templates/${initial.id}`);
    router.push('/templates');
  }

  const folder = t.slug ? `templates/${t.slug}` : 'templates';

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-10">
      <Section title="Identidad">
        <Row>
          <Field label="Título">
            <Input
              value={t.title ?? ''}
              onChange={(e) => {
                set('title', e.target.value);
                if (!initial?.id && !t.slug) set('slug', slugify(e.target.value));
              }}
              required
            />
          </Field>
          <Field label="Slug">
            <Input value={t.slug ?? ''} onChange={(e) => set('slug', e.target.value)} required />
          </Field>
        </Row>
        <Field label="Descripción corta">
          <Textarea
            rows={2}
            value={t.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
          />
        </Field>
        <Field label="Notas personales (markdown)">
          <Textarea
            rows={4}
            value={t.notes ?? ''}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Por qué lo guardaste, qué quieres replicar, …"
          />
        </Field>
      </Section>

      <Section title="Enlaces">
        <Row>
          <Field label="Website (demo)">
            <Input value={t.websiteUrl ?? ''} onChange={(e) => set('websiteUrl', e.target.value)} />
          </Field>
          <Field label="Source (dónde lo viste)">
            <Input value={t.sourceUrl ?? ''} onChange={(e) => set('sourceUrl', e.target.value)} />
          </Field>
        </Row>
      </Section>

      <Section title="Autor">
        <Row>
          <Field label="Nombre">
            <Input value={t.authorName ?? ''} onChange={(e) => set('authorName', e.target.value)} />
          </Field>
          <Field label="URL">
            <Input value={t.authorUrl ?? ''} onChange={(e) => set('authorUrl', e.target.value)} />
          </Field>
        </Row>
        <Field label="Avatar">
          <Input
            value={t.authorImage ?? ''}
            onChange={(e) => set('authorImage', e.target.value)}
            placeholder="URL externa"
          />
        </Field>
      </Section>

      <Section title="Screenshots">
        <Row>
          <Field label="Desktop">
            <SingleUploader
              value={t.coverImage}
              onChange={(url) => set('coverImage', url)}
              folder={folder}
            />
          </Field>
          <Field label="Mobile">
            <SingleUploader
              value={t.mobileImage}
              onChange={(url) => set('mobileImage', url)}
              folder={folder}
            />
          </Field>
        </Row>
        <Field label="Galería extra">
          <MultiUploader
            value={(t.images as string[]) ?? []}
            onChange={(urls) => set('images', urls)}
            folder={folder}
          />
        </Field>
      </Section>

      <Section title="Clasificación">
        <Row>
          <Field label="Categorías (coma)">
            <Input
              value={fromList(t.categories as string[])}
              onChange={(e) => set('categories', toList(e.target.value))}
              placeholder="SaaS, Landing Page, App"
            />
          </Field>
          <Field label="Estilos (coma)">
            <Input
              value={fromList(t.styles as string[])}
              onChange={(e) => set('styles', toList(e.target.value))}
              placeholder="Gradients, Dark, Minimal"
            />
          </Field>
        </Row>
        <Row>
          <Field label="Secciones (coma)">
            <Input
              value={fromList(t.sections as string[])}
              onChange={(e) => set('sections', toList(e.target.value))}
              placeholder="Hero, Features, Pricing, FAQ"
            />
          </Field>
          <Field label="Features (coma)">
            <Input
              value={fromList(t.features as string[])}
              onChange={(e) => set('features', toList(e.target.value))}
              placeholder="Long Scrolling, Sticky Nav"
            />
          </Field>
        </Row>
        <Row>
          <Field label="Typefaces (coma)">
            <Input
              value={fromList(t.typefaces as string[])}
              onChange={(e) => set('typefaces', toList(e.target.value))}
              placeholder="Instrument Serif, Poppins"
            />
          </Field>
          <Field label="Tags (coma)">
            <Input
              value={fromList(t.tags as string[])}
              onChange={(e) => set('tags', toList(e.target.value))}
              placeholder="dark, modern, animated"
            />
          </Field>
        </Row>
        <Row>
          <Field label="Stack (coma)">
            <Input
              value={fromList(t.stack as string[])}
              onChange={(e) => set('stack', toList(e.target.value))}
              placeholder="Next.js, Framer Motion"
            />
          </Field>
          <Field label="Paleta (hex, coma)">
            <Input
              value={fromList(t.colors as string[])}
              onChange={(e) => set('colors', toList(e.target.value))}
              placeholder="#000000, #ffffff, #ff6b35"
            />
          </Field>
        </Row>
      </Section>

      <Section title="Meta">
        <Row>
          <Field label="Publicado">
            <Input
              type="date"
              value={t.publishedAt ?? ''}
              onChange={(e) => set('publishedAt', e.target.value)}
            />
          </Field>
          <Field label="Precio">
            <select
              value={t.price ?? ''}
              onChange={(e) => set('price', (e.target.value || undefined) as any)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:border-foreground"
            >
              <option value="">—</option>
              <option value="free">free</option>
              <option value="paid">paid</option>
            </select>
          </Field>
        </Row>
        <Row>
          <Field label="Rating (1-5)">
            <Input
              type="number"
              min={1}
              max={5}
              value={t.rating ?? ''}
              onChange={(e) => set('rating', e.target.value ? Number(e.target.value) : undefined)}
            />
          </Field>
          <Field label="Orden">
            <Input
              type="number"
              value={t.order ?? 0}
              onChange={(e) => set('order', Number(e.target.value))}
            />
          </Field>
        </Row>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!t.isFavorite}
            onChange={(e) => set('isFavorite', e.target.checked)}
            className="h-4 w-4"
          />
          Favorito
        </label>
      </Section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
        {initial?.id && (
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Borrar template
          </button>
        )}
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
