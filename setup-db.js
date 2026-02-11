const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('./local.db');

const migrationSQL = `
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  is_admin integer DEFAULT 0 NOT NULL,
  created_at integer
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email);

CREATE TABLE IF NOT EXISTS bookings (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  hotel_id text NOT NULL,
  hotel_name text NOT NULL,
  check_in integer NOT NULL,
  check_out integer NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  guests integer NOT NULL,
  created_at integer,
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE no action
);

CREATE TABLE IF NOT EXISTS journey_requests (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  travel_style text,
  destination text,
  budget text,
  duration text,
  preferences text,
  status text DEFAULT 'pending' NOT NULL,
  assigned_to text,
  created_at integer,
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON UPDATE no action ON DELETE no action
);

CREATE TABLE IF NOT EXISTS journey_notes (
  id text PRIMARY KEY NOT NULL,
  journey_id text NOT NULL,
  admin_id text NOT NULL,
  content text NOT NULL,
  created_at integer,
  updated_at integer,
  FOREIGN KEY (journey_id) REFERENCES journey_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS journey_files (
  id text PRIMARY KEY NOT NULL,
  journey_id text NOT NULL,
  admin_id text NOT NULL,
  filename text NOT NULL,
  filepath text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  uploaded_at integer,
  FOREIGN KEY (journey_id) REFERENCES journey_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id)
);
`;

console.log('Creating database tables...');
db.exec(migrationSQL);
console.log('✓ Database tables created successfully!');

// Verify tables exist
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables in database:', tables.map(t => t.name).join(', '));

db.close();
console.log('✓ Database setup complete!');
