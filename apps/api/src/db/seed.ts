import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users } from './schema';

async function main() {
  const url = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!url || !email || !password) {
    throw new Error('DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD are required');
  }
  const connection = await mysql.createConnection(url);
  const db = drizzle(connection);

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length) {
    console.log(`✔ admin user already exists: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(users).values({ email, passwordHash, name: 'Admin' });
    console.log(`✔ admin user created: ${email}`);
  }

  await connection.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
