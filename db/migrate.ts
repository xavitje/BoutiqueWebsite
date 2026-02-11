import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const db = new Database('./local.db');

const migration = readFileSync(join(__dirname, 'migrations', '0000_simple_magus.sql'), 'utf-8');

// Split by statement breakpoint and execute each statement
const statements = migration.split('-->').map(s => s.trim()).filter(s => s && !s.startsWith('statement-breakpoint'));

for (const statement of statements) {
    if (statement) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        db.exec(statement);
    }
}

console.log('✓ Database tables created successfully!');
db.close();
