import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { DRIZZLE, DrizzleDB } from '../db/drizzle.module';
import { users } from '../db/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async findById(id: number) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user ?? null;
  }
}
