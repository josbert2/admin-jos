# Portfolio API

> Base URL producción: `https://api.josbert.dev/api`
> Base URL local: `http://localhost:4000/api`

Todas las respuestas son JSON. Fechas en ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`). Errores siguen el formato:

```json
{ "statusCode": 400, "message": "...", "error": "Bad Request" }
```

---

## Autenticación

Hay **dos mecanismos** de autenticación, ambos pasan por el header `Authorization: Bearer <token>`:

### 1. JWT (para el panel de administración)

```
POST /api/auth/login
Content-Type: application/json

{ "email": "you@example.com", "password": "secret" }
```

Respuesta:

```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": 1, "email": "you@example.com", "name": "Admin" }
}
```

El JWT expira en **7 días**. Úsalo en la UI admin — no es apto para apps externas.

### 2. API Token (para apps externas — portfolio público, bots, CLIs)

Un **API token** es una clave estática de larga vida, identificable por el prefijo `jos_`.
Se crea desde la UI admin en **Tokens** → **Nuevo**, y se muestra **una sola vez**.

Ejemplo: `jos_7a3b1c4d...` (52 caracteres).

Úsalo igual que el JWT:

```
Authorization: Bearer jos_7a3b1c4d5e6f...
```

Acepta tanto `POST`/`PATCH`/`DELETE` como los endpoints `/admin/all` de lectura. Si quieres restringirlo a un consumidor, puedes **revocar** el token desde la UI sin afectar a los demás.

### Endpoints públicos (sin token)

- `GET /api/projects`
- `GET /api/projects/slug/:slug`
- `GET /api/experiences`
- `GET /api/skills`
- `POST /api/contact`

---

## Recursos

### `GET /api/projects`

Devuelve los proyectos **publicados** ordenados por `order` ascendente. Pensado para el portfolio público.

```bash
curl https://api.josbert.dev/api/projects
```

```json
[
  {
    "id": 1,
    "title": "Furgovan",
    "slug": "furgovan",
    "summary": "SaaS de gestión de flotas…",
    "description": "Plataforma para empresas de logística…",
    "content": null,
    "coverImage": "https://pub-xxx.r2.dev/projects/furgovan/cover.jpg",
    "images": ["https://pub-xxx.r2.dev/…"],
    "tags": ["saas", "logistics", "realtime"],
    "stack": ["Next.js", "NestJS", "PostgreSQL"],
    "linkLive": "https://furgovan.com",
    "linkRepo": null,
    "client": "Furgovan SL",
    "date": "2025-09-15",
    "order": 1,
    "isBest": true,
    "isPublished": true,
    "createdAt": "2026-04-22T10:00:00.000Z",
    "updatedAt": "2026-04-22T10:00:00.000Z"
  }
]
```

### `GET /api/projects/slug/:slug`

Detalle por slug. `404` si no existe.

```bash
curl https://api.josbert.dev/api/projects/slug/furgovan
```

### `GET /api/projects/admin/all` · requiere token

Todos los proyectos, incluyendo borradores. Úsalo desde la UI admin o desde scripts internos.

### `POST /api/projects` · requiere token

```bash
curl -X POST https://api.josbert.dev/api/projects \
  -H "Authorization: Bearer jos_..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nuevo proyecto",
    "slug": "nuevo-proyecto",
    "summary": "...",
    "tags": ["web"],
    "stack": ["Next.js"],
    "date": "2026-04-22",
    "order": 0,
    "isBest": false,
    "isPublished": true
  }'
```

### `PATCH /api/projects/:id` · requiere token

Envía solo los campos que quieras cambiar. Nunca incluyas `id`, `createdAt`, `updatedAt`.

### `DELETE /api/projects/:id` · requiere token

---

### Experiences (`/api/experiences`)

Misma forma que projects: `GET` público, `POST|PATCH|DELETE` con token, `GET /admin/all` con token.

Campos: `company`, `role`, `location`, `description`, `startDate` (date, obligatorio), `endDate` (date, nullable), `current` (bool), `order`, `isPublished`.

### Skills (`/api/skills`)

Igual. Campos: `name`, `category`, `level` (0-100), `icon`, `order`, `isPublished`.

### Contact (`/api/contact`)

- `POST /api/contact` — **público**, recibe mensajes del form público:
  ```json
  { "name": "...", "email": "...", "subject": "...", "message": "..." }
  ```
- `GET /api/contact` — lista completa (token)
- `GET /api/contact/:id` — detalle (token)
- `PATCH /api/contact/:id/status` — `{ "status": "new" | "read" | "archived" }` (token)
- `DELETE /api/contact/:id` — (token)

---

### Upload a R2 (`/api/upload`)

- `POST /api/upload?folder=projects/mi-slug` · requiere token
  - Body: `multipart/form-data` con el campo `file`
  - Límite: 10 MB, tipos `image/*` y `application/pdf`
  - Respuesta: `{ key, url, size, mimeType }` — la `url` ya es pública via Cloudflare R2
- `DELETE /api/upload` · body `{ "key": "..." }` · requiere token

```bash
curl -X POST "https://api.josbert.dev/api/upload?folder=projects/nuevo" \
  -H "Authorization: Bearer jos_..." \
  -F "file=@./cover.jpg"
```

---

### Tokens (`/api/tokens`) · solo JWT (UI admin)

Este recurso se gestiona **solo con JWT de administrador**, no con API tokens (para evitar que un token pueda fabricar otros).

- `GET /api/tokens` — lista (sin el token raw, solo prefix + metadata)
- `POST /api/tokens` — body `{ "name": "..." }` → devuelve `{ token: "jos_..." }` **una sola vez**
- `POST /api/tokens/:id/revoke`
- `DELETE /api/tokens/:id`

---

## Consumir desde otra app (Next.js 15)

Crea `.env.local`:

```
PORTFOLIO_API=https://api.josbert.dev
PORTFOLIO_TOKEN=jos_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Cliente tipado mínimo (`lib/portfolio.ts`):

```ts
const BASE = process.env.PORTFOLIO_API!;
const TOKEN = process.env.PORTFOLIO_TOKEN;

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN && { Authorization: `Bearer ${TOKEN}` }),
      ...init.headers,
    },
    next: { revalidate: 60, ...(init as any).next },
  });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  coverImage: string | null;
  images: string[];
  tags: string[];
  stack: string[];
  linkLive: string | null;
  linkRepo: string | null;
  date: string | null;
  isBest: boolean;
}

export const getProjects   = ()            => req<Project[]>('/projects');
export const getProject    = (slug: string)=> req<Project>(`/projects/slug/${slug}`);
export const getExperiences= ()            => req<any[]>('/experiences');
export const getSkills     = ()            => req<any[]>('/skills');
export const sendContact   = (body: { name:string; email:string; subject?:string; message:string }) =>
  req('/contact', { method: 'POST', body: JSON.stringify(body) });
```

Uso en un Server Component:

```tsx
// app/page.tsx
import { getProjects } from '@/lib/portfolio';

export default async function Home() {
  const projects = await getProjects();
  const best = projects.filter((p) => p.isBest);
  return (
    <section>
      {best.map((p) => (
        <article key={p.id}>
          <img src={p.coverImage ?? ''} alt={p.title} />
          <h3>{p.title}</h3>
          <p>{p.summary}</p>
        </article>
      ))}
    </section>
  );
}
```

Formulario de contacto (Client Component):

```tsx
'use client';
import { useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const fd = new FormData(e.currentTarget);
    const res = await fetch('https://api.josbert.dev/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(fd)),
    });
    setStatus(res.ok ? 'ok' : 'error');
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <input name="subject" />
      <textarea name="message" required />
      <button disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : status === 'ok' ? '¡Enviado!' : 'Enviar'}
      </button>
      {status === 'error' && <p>Error al enviar.</p>}
    </form>
  );
}
```

---

## Códigos de error

| HTTP | Cuándo |
|------|--------|
| 400  | Body inválido (class-validator rechazó un campo, o propiedades extra) |
| 401  | Token ausente, inválido o revocado |
| 404  | Recurso no encontrado |
| 413  | Archivo de upload > 10 MB |
| 500  | Error interno |

Como el API rechaza propiedades desconocidas (`forbidNonWhitelisted`), **nunca envíes `id`, `createdAt` o `updatedAt`** en un `POST`/`PATCH` — devolverá 400. Si reutilizas un objeto completo (p.ej. al editar), bórralos antes:

```ts
const { id, createdAt, updatedAt, ...payload } = existing;
await req(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
```

---

## CORS

El API permite los orígenes listados en la env `CORS_ORIGIN` (coma-separados). Si vas a llamar desde un navegador, añade el dominio:

```
CORS_ORIGIN=https://josbert.dev,https://admin.josbert.dev,https://otra-app.com
```

Desde el servidor (SSR / API routes / scripts) no hay restricción CORS.

---

## Buenas prácticas con tokens

- **Un token por consumidor** (p.ej. `portfolio-nextjs`, `cli-local`) — facilita revocar sin afectar otros.
- Guárdalos en variables de entorno, **nunca** los pongas en código versionado.
- Si sospechas de una filtración, revoca desde la UI — revocación es instantánea.
- No los uses en código cliente (browser). Si el navegador va a llamar al API:
  - Endpoints públicos (GET projects/experiences/skills, POST contact) → sin token
  - Endpoints de escritura → llamar desde tu servidor con el token, y exponer un proxy
