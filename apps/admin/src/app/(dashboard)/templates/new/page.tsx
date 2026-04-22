import { TemplateForm } from '../TemplateForm';

export default function NewTemplatePage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Nuevo</p>
      <h1 className="text-3xl font-medium tracking-tight mb-10">Guardar template</h1>
      <TemplateForm />
    </div>
  );
}
