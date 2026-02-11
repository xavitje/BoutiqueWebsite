import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const bookings = sqliteTable('bookings', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull().references(() => users.id),
    hotelId: text('hotel_id').notNull(),
    hotelName: text('hotel_name').notNull(),
    checkIn: integer('check_in', { mode: 'timestamp' }).notNull(),
    checkOut: integer('check_out', { mode: 'timestamp' }).notNull(),
    status: text('status', { enum: ['pending', 'confirmed', 'cancelled'] }).notNull().default('pending'),
    guests: integer('guests').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const journeyRequests = sqliteTable('journey_requests', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull().references(() => users.id),
    travelStyle: text('travel_style'),
    destination: text('destination'),
    budget: text('budget'),
    duration: text('duration'),
    preferences: text('preferences'),
    status: text('status', { enum: ['pending', 'reviewed', 'contacted'] }).notNull().default('pending'),
    assignedTo: text('assigned_to').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const journeyNotes = sqliteTable('journey_notes', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    journeyId: text('journey_id').notNull().references(() => journeyRequests.id, { onDelete: 'cascade' }),
    adminId: text('admin_id').notNull().references(() => users.id),
    content: text('content').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const journeyFiles = sqliteTable('journey_files', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    journeyId: text('journey_id').notNull().references(() => journeyRequests.id, { onDelete: 'cascade' }),
    adminId: text('admin_id').notNull().references(() => users.id),
    filename: text('filename').notNull(),
    filepath: text('filepath').notNull(),
    fileType: text('file_type').notNull(),
    fileSize: integer('file_size').notNull(),
    uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
