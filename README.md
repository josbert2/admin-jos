# api-jos — Portfolio admin

Monorepo: NestJS API + Drizzle + MySQL, Next.js 15 admin UI.

## Estructura

```
apps/
  api/     NestJS + Drizzle (MySQL)
  admin/   Next.js 15 + Tailwind + shadcn/ui
docker-compose.yml
```

## Setup

```bash
cp .env.example .env
pnpm install
pnpm db:up                # levanta MySQL en :3307
pnpm db:generate          # genera migración desde el schema
pnpm db:migrate           # aplica migraciones
pnpm db:seed              # crea usuario admin
pnpm dev                  # levanta api + admin en paralelo
```

- API: http://localhost:4000
- Admin: http://localhost:5737

## Credenciales por defecto

- Email: el valor de `ADMIN_EMAIL`
- Password: el valor de `ADMIN_PASSWORD`

---

## Deploy en VPS (Ubuntu)

Requisitos: VPS Ubuntu con al menos 2GB RAM, 20GB disco, IP pública y dominio con DNS configurable.

### 1. DNS (Namecheap → Advanced DNS → Add New Record)

| Type | Host  | Value               | TTL  |
|------|-------|---------------------|------|
| A    | api   | `<IP_DEL_VPS>`      | Auto |
| A    | admin | `<IP_DEL_VPS>`      | Auto |

### 2. Setup inicial del VPS (una vez)

```bash
scp -P 22022 scripts/vps-setup.sh root@<IP>:/root/
ssh -p 22022 root@<IP> "bash /root/vps-setup.sh"
```

Esto instala Docker, crea swap de 2GB, abre UFW para 22022/80/443, y prepara `/srv/api-jos`.

### 3. Crear `.env` en el VPS

```bash
ssh -p 22022 root@<IP>
cd /srv/api-jos
# (primero haz deploy desde local para tener .env.production.example)
cp .env.production.example .env
nano .env    # rellena MYSQL_ROOT_PASSWORD, MYSQL_PASSWORD, JWT_SECRET, ADMIN_PASSWORD, R2_SECRET_ACCESS_KEY
```

Genera secretos largos con: `openssl rand -hex 32`.

### 4. Deploy desde local

```bash
VPS_HOST=root@<IP> VPS_PORT=22022 ./scripts/deploy.sh
```

Esto hace rsync del repo, construye las imágenes en el VPS y levanta todos los containers. La primera vez tarda 3-5 minutos (build de imágenes + pull de mysql/caddy).

Caddy pedirá automáticamente certificados TLS a Let's Encrypt para `api.josbert.dev` y `admin.josbert.dev`. Requiere que DNS ya esté propagado.

### 5. Verificar

```
https://api.josbert.dev/api/projects       → [] o lista
https://admin.josbert.dev/login            → panel
```

### Comandos útiles en el VPS

```bash
cd /srv/api-jos
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f caddy
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml restart api
docker compose -f docker-compose.prod.yml down   # parar todo
```

### Actualizar

Haces cambios en local, commit, y vuelves a correr:

```bash
./scripts/deploy.sh
```
