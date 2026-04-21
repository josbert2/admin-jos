import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '../db/drizzle.module';
import { projects } from '../db/schema';
import { CreateProjectDto, UpdateProjectDto } from './projects.dto';

@Injectable()
export class ProjectsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findAll() {
    return this.db.select().from(projects).orderBy(asc(projects.order), asc(projects.id));
  }

  findPublished() {
    return this.db
      .select()
      .from(projects)
      .where(eq(projects.isPublished, true))
      .orderBy(asc(projects.order), asc(projects.id));
  }

  async findOne(id: number) {
    const [row] = await this.db.select().from(projects).where(eq(projects.id, id));
    if (!row) throw new NotFoundException('Project not found');
    return row;
  }

  async findBySlug(slug: string) {
    const [row] = await this.db.select().from(projects).where(eq(projects.slug, slug));
    if (!row) throw new NotFoundException('Project not found');
    return row;
  }

  async create(dto: CreateProjectDto) {
    const [result] = await this.db.insert(projects).values(dto);
    return this.findOne(result.insertId);
  }

  async update(id: number, dto: UpdateProjectDto) {
    await this.findOne(id);
    await this.db.update(projects).set(dto).where(eq(projects.id, id));
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.delete(projects).where(eq(projects.id, id));
    return { ok: true };
  }
}
