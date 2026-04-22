import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { eq } from 'drizzle-orm';
import { projects, experiences, skills, contactMessages } from './schema';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  const connection = await mysql.createConnection(url);
  const db = drizzle(connection);

  // PROJECTS
  const sampleProjects = [
    {
      title: 'Furgovan',
      slug: 'furgovan',
      summary: 'SaaS de gestión de flotas de furgonetas con tracking en tiempo real.',
      description: 'Plataforma para empresas de logística: gestión de vehículos, rutas, conductores y mantenimiento con dashboards en tiempo real.',
      coverImage: 'https://pub-9ff94ab4fd8b48b686a07b9d1d1c3019.r2.dev/samples/furgovan-cover.jpg',
      images: [],
      tags: ['saas', 'logistics', 'realtime'],
      stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Mapbox'],
      linkLive: 'https://furgovan.com',
      client: 'Furgovan SL',
      date: '2025-09-15',
      order: 1,
      isBest: true,
      isPublished: true,
    },
    {
      title: 'Bookforce Relay',
      slug: 'bookforce-relay',
      summary: 'Pasarela de envíos editoriales a distribuidores.',
      description: 'Sistema de sincronización de catálogos y pedidos entre editoriales y distribuidores, reemplazando procesos manuales.',
      coverImage: 'https://pub-9ff94ab4fd8b48b686a07b9d1d1c3019.r2.dev/samples/relay-cover.jpg',
      images: [],
      tags: ['b2b', 'integrations', 'editorial'],
      stack: ['Go', 'Next.js', 'Postgres', 'Redis'],
      linkLive: 'https://relay.bookforce.io',
      client: 'Bookforce',
      date: '2025-06-02',
      order: 2,
      isBest: true,
      isPublished: true,
    },
    {
      title: 'IronPlan',
      slug: 'ironplan',
      summary: 'Planificación personal de rutinas de fuerza con progresión automática.',
      description: 'App iOS + web que calcula tus cargas según 1RM y genera planes semanales adaptativos.',
      coverImage: 'https://pub-9ff94ab4fd8b48b686a07b9d1d1c3019.r2.dev/samples/ironplan-cover.jpg',
      images: [],
      tags: ['fitness', 'mobile'],
      stack: ['Swift', 'Next.js', 'Supabase'],
      linkLive: null,
      client: null,
      date: '2025-03-20',
      order: 3,
      isBest: false,
      isPublished: true,
    },
    {
      title: 'Crypto Widget',
      slug: 'crypto-widget',
      summary: 'Widget embebible con precios en tiempo real de cripto.',
      description: 'Una librería ligera que permite a sitios financieros mostrar precios, gráficos y conversor con un solo snippet.',
      coverImage: 'https://pub-9ff94ab4fd8b48b686a07b9d1d1c3019.r2.dev/samples/widget-cover.jpg',
      images: [],
      tags: ['web-components', 'finance', 'open-source'],
      stack: ['TypeScript', 'Lit', 'Cloudflare Workers'],
      linkLive: 'https://widget.josbert.dev',
      linkRepo: 'https://github.com/josbert2/crypto-widget',
      date: '2024-11-10',
      order: 4,
      isBest: false,
      isPublished: true,
    },
    {
      title: 'Restro POS',
      slug: 'restro-pos',
      summary: 'POS simplificado para restaurantes pequeños, sin suscripciones.',
      description: 'TPV completo para restaurantes con comanda en tablet, impresión térmica y cierre de caja.',
      coverImage: 'https://pub-9ff94ab4fd8b48b686a07b9d1d1c3019.r2.dev/samples/restro-cover.jpg',
      images: [],
      tags: ['pos', 'restaurants', 'offline-first'],
      stack: ['Electron', 'SQLite', 'React'],
      linkLive: null,
      client: 'Varios',
      date: '2024-08-01',
      order: 5,
      isBest: false,
      isPublished: true,
    },
  ];

  for (const p of sampleProjects) {
    const existing = await db.select().from(projects).where(eq(projects.slug, p.slug));
    if (existing.length) {
      console.log(`↷ project exists: ${p.slug}`);
      continue;
    }
    await db.insert(projects).values(p);
    console.log(`✔ project: ${p.slug}`);
  }

  // EXPERIENCES
  const sampleExperiences = [
    {
      company: 'Bookforce',
      role: 'Full-stack Engineer',
      location: 'Remote',
      description: 'Construcción de infraestructura para la plataforma editorial: pasarelas de datos, portal B2B, e integración con distribuidores.',
      startDate: '2024-09-01',
      endDate: null,
      current: true,
      order: 1,
      isPublished: true,
    },
    {
      company: 'Freelance',
      role: 'Web Developer',
      location: 'Santiago, Chile',
      description: 'Proyectos a medida para startups y pymes: POS, dashboards, landing pages y migraciones a stacks modernos.',
      startDate: '2022-01-01',
      endDate: '2024-08-31',
      current: false,
      order: 2,
      isPublished: true,
    },
    {
      company: 'Agencia Local',
      role: 'Junior Developer',
      location: 'Santiago, Chile',
      description: 'Mantenimiento de sitios WordPress y desarrollo de plugins personalizados.',
      startDate: '2020-06-01',
      endDate: '2021-12-31',
      current: false,
      order: 3,
      isPublished: true,
    },
  ];

  for (const e of sampleExperiences) {
    const existing = await db
      .select()
      .from(experiences)
      .where(eq(experiences.company, e.company));
    if (existing.length) {
      console.log(`↷ experience exists: ${e.company}`);
      continue;
    }
    await db.insert(experiences).values(e);
    console.log(`✔ experience: ${e.company}`);
  }

  // SKILLS
  const sampleSkills = [
    { name: 'TypeScript', category: 'Languages', level: 92, order: 1 },
    { name: 'JavaScript', category: 'Languages', level: 95, order: 2 },
    { name: 'Go', category: 'Languages', level: 70, order: 3 },
    { name: 'Python', category: 'Languages', level: 72, order: 4 },
    { name: 'Next.js', category: 'Frontend', level: 95, order: 1 },
    { name: 'React', category: 'Frontend', level: 94, order: 2 },
    { name: 'Tailwind CSS', category: 'Frontend', level: 92, order: 3 },
    { name: 'NestJS', category: 'Backend', level: 88, order: 1 },
    { name: 'Node.js', category: 'Backend', level: 90, order: 2 },
    { name: 'PostgreSQL', category: 'Database', level: 85, order: 1 },
    { name: 'MySQL', category: 'Database', level: 80, order: 2 },
    { name: 'Redis', category: 'Database', level: 70, order: 3 },
    { name: 'Docker', category: 'DevOps', level: 82, order: 1 },
    { name: 'GitHub Actions', category: 'DevOps', level: 75, order: 2 },
    { name: 'Cloudflare R2', category: 'DevOps', level: 78, order: 3 },
  ];

  for (const s of sampleSkills) {
    const existing = await db.select().from(skills).where(eq(skills.name, s.name));
    if (existing.length) {
      console.log(`↷ skill exists: ${s.name}`);
      continue;
    }
    await db.insert(skills).values({ ...s, isPublished: true });
    console.log(`✔ skill: ${s.name}`);
  }

  // CONTACT MESSAGES (demo)
  const existing = await db.select().from(contactMessages);
  if (existing.length === 0) {
    await db.insert(contactMessages).values([
      {
        name: 'María González',
        email: 'maria@estudio.dev',
        subject: 'Colaboración en proyecto',
        message: 'Hola Josbert, vi tu proyecto Furgovan y estamos buscando alguien con experiencia en logística para un proyecto similar. ¿Podemos hablar?',
        status: 'new',
      },
      {
        name: 'Ignacio Pérez',
        email: 'nacho@bookforce.io',
        subject: 'Feedback Relay',
        message: 'El sistema va excelente, ya estamos con 3 editoriales conectadas. Propongo agregar webhooks para los cambios de inventario.',
        status: 'read',
      },
      {
        name: 'Anon',
        email: 'hire@somewhere.com',
        subject: null,
        message: 'Would you be open to a full-time offer? Remote, Europe-based startup. Stack matches yours perfectly.',
        status: 'archived',
      },
    ]);
    console.log('✔ 3 sample messages inserted');
  } else {
    console.log(`↷ contact_messages has ${existing.length} rows, skipping`);
  }

  await connection.end();
  console.log('✔ seed-data done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
