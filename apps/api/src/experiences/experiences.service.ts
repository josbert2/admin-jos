import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { asc, desc, eq } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '../db/drizzle.module';
import { experiences } from '../db/schema';
import { CreateExperienceDto, UpdateExperienceDto } from './experiences.dto';

@Injectable()
export class ExperiencesService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findAll() {
    return this.db
      .select()
      .from(experiences)
      .orderBy(asc(experiences.order), desc(experiences.startDate));
  }

  findPublished() {
    return this.db
      .select()
      .from(experiences)
      .where(eq(experiences.isPublished, true))
      .orderBy(asc(experiences.order), desc(experiences.startDate));
  }

  async findOne(id: number) {
    const [row] = await this.db.select().from(experiences).where(eq(experiences.id, id));
    if (!row) throw new NotFoundException('Experience not found');
    return row;
  }

  async create(dto: CreateExperienceDto) {
    const [result] = await this.db.insert(experiences).values(dto);
    return this.findOne(result.insertId);
  }

  async update(id: number, dto: UpdateExperienceDto) {
    await this.findOne(id);
    await this.db.update(experiences).set(dto).where(eq(experiences.id, id));
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.delete(experiences).where(eq(experiences.id, id));
    return { ok: true };
  }
}
