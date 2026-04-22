'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiGet } from '@/lib/api';
import { Project } from '@/lib/types';
import { ProjectForm } from '../ProjectForm';

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    apiGet<Project>(`/projects/${params.id}`).then(setProject);
  }, [params.id]);

  if (!project) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Editar</p>
      <h1 className="text-3xl font-medium tracking-tight mb-10">{project.title}</h1>
      <ProjectForm initial={project} />
    </div>
  );
}
