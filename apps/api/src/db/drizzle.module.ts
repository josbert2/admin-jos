import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

export const DRIZZLE = Symbol('DRIZZLE');
export type DrizzleDB = MySql2Database<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<DrizzleDB> => {
        const url = config.getOrThrow<string>('DATABASE_URL');
        const pool = mysql.createPool({ uri: url, connectionLimit: 10 });
        return drizzle(pool, { schema, mode: 'default' });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
