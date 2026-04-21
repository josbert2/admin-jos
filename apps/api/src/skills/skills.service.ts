import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '../db/drizzle.module';
import { skills } from '../db/schema';
import { CreateSkillDto, UpdateSkillDto } from './skills.dto';

@Injectable()
export class SkillsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findAll() {
    return this.db.select().from(skills).orderBy(asc(skills.order), asc(skills.id));
  }

  findPublished() {
    return this.db
      .select()
      .from(skills)
      .where(eq(skills.isPublished, true))
      .orderBy(asc(skills.order), asc(skills.id));
  }

  async findOne(id: number) {
    const [row] = await this.db.select().from(skills).where(eq(skills.id, id));
    if (!row) throw new NotFoundException('Skill not found');
    return row;
  }

  async create(dto: CreateSkillDto) {
    const [result] = await this.db.insert(skills).values(dto);
    return this.findOne(result.insertId);
  }

  async update(id: number, dto: UpdateSkillDto) {
    await this.findOne(id);
    await this.db.update(skills).set(dto).where(eq(skills.id, id));
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.delete(skills).where(eq(skills.id, id));
    return { ok: true };
  }
}
