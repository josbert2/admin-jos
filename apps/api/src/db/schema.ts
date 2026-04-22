import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  timestamp,
  json,
  date,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  email: varchar('email', { length: 190 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 120 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const projects = mysqlTable('projects', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  summary: varchar('summary', { length: 500 }),
  description: text('description'),
  content: text('content'),
  coverImage: varchar('cover_image', { length: 500 }),
  images: json('images').$type<string[]>().default([]),
  tags: json('tags').$type<string[]>().default([]),
  stack: json('stack').$type<string[]>().default([]),
  linkLive: varchar('link_live', { length: 500 }),
  linkRepo: varchar('link_repo', { length: 500 }),
  client: varchar('client', { length: 200 }),
  date: date('date', { mode: 'string' }),
  order: int('order').default(0).notNull(),
  isBest: boolean('is_best').default(false).notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const experiences = mysqlTable('experiences', {
  id: int('id').autoincrement().primaryKey(),
  company: varchar('company', { length: 200 }).notNull(),
  role: varchar('role', { length: 200 }).notNull(),
  location: varchar('location', { length: 200 }),
  description: text('description'),
  startDate: date('start_date', { mode: 'string' }).notNull(),
  endDate: date('end_date', { mode: 'string' }),
  current: boolean('current').default(false).notNull(),
  order: int('order').default(0).notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const skills = mysqlTable('skills', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  category: varchar('category', { length: 120 }),
  level: int('level').default(0).notNull(),
  icon: varchar('icon', { length: 500 }),
  order: int('order').default(0).notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const apiTokens = mysqlTable('api_tokens', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  prefix: varchar('prefix', { length: 16 }).notNull(),
  tokenHash: varchar('token_hash', { length: 64 }).notNull().unique(),
  lastUsedAt: timestamp('last_used_at'),
  revokedAt: timestamp('revoked_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contactMessages = mysqlTable('contact_messages', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 200 }).notNull(),
  subject: varchar('subject', { length: 300 }),
  message: text('message').notNull(),
  status: mysqlEnum('status', ['new', 'read', 'archived']).default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type ApiToken = typeof apiTokens.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
