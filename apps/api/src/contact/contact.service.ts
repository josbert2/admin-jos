import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '../db/drizzle.module';
import { contactMessages } from '../db/schema';
import { CreateContactDto, UpdateContactStatusDto } from './contact.dto';

@Injectable()
export class ContactService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findAll() {
    return this.db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async findOne(id: number) {
    const [row] = await this.db.select().from(contactMessages).where(eq(contactMessages.id, id));
    if (!row) throw new NotFoundException('Message not found');
    return row;
  }

  async create(dto: CreateContactDto) {
    const [result] = await this.db.insert(contactMessages).values(dto);
    return this.findOne(result.insertId);
  }

  async updateStatus(id: number, dto: UpdateContactStatusDto) {
    await this.findOne(id);
    await this.db
      .update(contactMessages)
      .set({ status: dto.status })
      .where(eq(contactMessages.id, id));
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.delete(contactMessages).where(eq(contactMessages.id, id));
    return { ok: true };
  }
}
