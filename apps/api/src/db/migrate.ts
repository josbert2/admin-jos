import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  const connection = await mysql.createConnection(url);
  const db = drizzle(connection);
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  await connection.end();
  console.log('✔ migrations applied');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
