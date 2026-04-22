import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, desc, eq, like, or, sql } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '../db/drizzle.module';
import { templates } from '../db/schema';
import { CreateTemplateDto, UpdateTemplateDto } from './templates.dto';

export interface TemplateFilter {
  q?: string;
  category?: string;
  tag?: string;
  favorite?: boolean;
}

@Injectable()
export class TemplatesService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findAll(filter: TemplateFilter = {}) {
    const conds = [] as any[];
    if (filter.favorite) conds.push(eq(templates.isFavorite, true));
    if (filter.q) {
      const like_ = `%${filter.q}%`;
      conds.push(
        or(
          like(templates.title, like_),
          like(templates.description, like_),
          like(templates.notes, like_),
        ),
      );
    }
    if (filter.category) {
      conds.push(sql`JSON_CONTAINS(${templates.categories}, ${JSON.stringify(filter.category)})`);
    }
    if (filter.tag) {
      conds.push(sql`JSON_CONTAINS(${templates.tags}, ${JSON.stringify(filter.tag)})`);
    }

    const q = conds.length
      ? this.db.select().from(templates).where(and(...conds))
      : this.db.select().from(templates);
    return q.orderBy(asc(templates.order), desc(templates.createdAt));
  }

  async findOne(id: number) {
    const [row] = await this.db.select().from(templates).where(eq(templates.id, id));
    if (!row) throw new NotFoundException('Template not found');
    return row;
  }

  async findBySlug(slug: string) {
    const [row] = await this.db.select().from(templates).where(eq(templates.slug, slug));
    if (!row) throw new NotFoundException('Template not found');
    return row;
  }

  async create(dto: CreateTemplateDto) {
    const [result] = await this.db.insert(templates).values(dto);
    return this.findOne(result.insertId);
  }

  async update(id: number, dto: UpdateTemplateDto) {
    await this.findOne(id);
    await this.db.update(templates).set(dto).where(eq(templates.id, id));
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.delete(templates).where(eq(templates.id, id));
    return { ok: true };
  }

  async toggleFavorite(id: number) {
    const row = await this.findOne(id);
    await this.db
      .update(templates)
      .set({ isFavorite: !row.isFavorite })
      .where(eq(templates.id, id));
    return this.findOne(id);
  }
}
