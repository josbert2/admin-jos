import 'dotenv/config';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  const connection = await mysql.createConnection(url);
  const db = drizzle(connection);
  const migrationsFolder = path.join(__dirname, 'migrations');
  await migrate(db, { migrationsFolder });
  await connection.end();
  console.log('✔ migrations applied');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
