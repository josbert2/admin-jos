import { ProjectForm } from '../ProjectForm';

export default function NewProjectPage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Nuevo</p>
      <h1 className="text-3xl font-medium tracking-tight mb-10">Crear proyecto</h1>
      <ProjectForm />
    </div>
  );
}
