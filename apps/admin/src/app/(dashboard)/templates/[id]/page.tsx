'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { Template } from '@/lib/types';
import { TemplateForm } from '../TemplateForm';

export default function EditTemplatePage() {
  const params = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);

  useEffect(() => {
    apiGet<Template>(`/templates/${params.id}`).then(setTemplate);
  }, [params.id]);

  if (!template) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  return (
    <div>
      <Link
        href="/templates"
        className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground mb-2 inline-block"
      >
        ← Templates
      </Link>
      <h1 className="text-3xl font-medium tracking-tight mb-10">{template.title}</h1>
      <TemplateForm initial={template} />
    </div>
  );
}
