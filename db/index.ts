
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleLibSQL } from 'drizzle-orm/libsql';
import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';
import * as schema from './schema';

let db: any;

if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    const client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });
    db = drizzleLibSQL(client, { schema });
} else {
    const sqlite = new Database('local.db');
    db = drizzle(sqlite, { schema });
}

export { db };
