import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { createHash, randomBytes } from 'crypto';
import { DRIZZLE, DrizzleDB } from '../db/drizzle.module';
import { apiTokens } from '../db/schema';

export const TOKEN_PREFIX = 'jos_';

function sha256(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

@Injectable()
export class TokensService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findAll() {
    return this.db
      .select({
        id: apiTokens.id,
        name: apiTokens.name,
        prefix: apiTokens.prefix,
        lastUsedAt: apiTokens.lastUsedAt,
        revokedAt: apiTokens.revokedAt,
        createdAt: apiTokens.createdAt,
      })
      .from(apiTokens)
      .orderBy(desc(apiTokens.createdAt));
  }

  async create(name: string) {
    const raw = TOKEN_PREFIX + randomBytes(24).toString('hex');
    const tokenHash = sha256(raw);
    const prefix = raw.slice(0, 12);
    const [result] = await this.db.insert(apiTokens).values({ name, prefix, tokenHash });
    return { id: result.insertId, name, prefix, token: raw };
  }

  async revoke(id: number) {
    const [row] = await this.db.select().from(apiTokens).where(eq(apiTokens.id, id));
    if (!row) throw new NotFoundException('Token not found');
    await this.db
      .update(apiTokens)
      .set({ revokedAt: new Date() })
      .where(eq(apiTokens.id, id));
    return { ok: true };
  }

  async remove(id: number) {
    await this.db.delete(apiTokens).where(eq(apiTokens.id, id));
    return { ok: true };
  }

  async validate(raw: string): Promise<boolean> {
    if (!raw.startsWith(TOKEN_PREFIX)) return false;
    const tokenHash = sha256(raw);
    const [row] = await this.db
      .select()
      .from(apiTokens)
      .where(and(eq(apiTokens.tokenHash, tokenHash), isNull(apiTokens.revokedAt)));
    if (!row) return false;
    // fire-and-forget lastUsedAt update
    this.db
      .update(apiTokens)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiTokens.id, row.id))
      .catch(() => {});
    return true;
  }
}
