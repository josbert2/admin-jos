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

  if (!project) return <p className="text-muted-foreground">Cargando…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Editar: {project.title}</h1>
      <ProjectForm initial={project} />
    </div>
  );
}
