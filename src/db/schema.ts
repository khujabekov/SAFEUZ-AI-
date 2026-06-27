import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, uuid, jsonb } from 'drizzle-orm/pg-core';

// Administrators and Web Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  role: text('role').notNull().default('ADMIN'), // ADMIN, INSPECTOR
  createdAt: timestamp('created_at').defaultNow(),
});

// Telegram Bot Users
export const botUsers = pgTable('bot_users', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(), // SAFEUZ-XXXXXX
  telegramId: text('telegram_id').notNull().unique(),
  username: text('username'),
  fullName: text('full_name'),
  phone: text('phone'),
  region: text('region'),
  district: text('district'),
  mahalla: text('mahalla'),
  latitude: text('latitude'),
  longitude: text('longitude'),
  status: text('status').default('REGISTERED'),
  reportsSubmitted: integer('reports_submitted').default(0),
  lastActive: timestamp('last_active').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Incidents / Reports
export const incidents = pgTable('incidents', {
  id: serial('id').primaryKey(),
  incidentId: text('incident_id').notNull().unique(), // E.g., INC-2026-XXXX
  botUserId: integer('bot_user_id').references(() => botUsers.id),
  type: text('type'), // MATN, RASM, VIDEO, AUDIO, HUJJAT, APK, KANAL, GURUH, SAYT
  content: text('content'),
  description: text('description'),
  region: text('region'),
  district: text('district'),
  mahalla: text('mahalla'),
  latitude: text('latitude'),
  longitude: text('longitude'),
  status: text('status').default('NEW'), // NEW, AI_PROCESSED, ADMIN_REVIEW, ASSIGNED, INVESTIGATION, CLOSED
  assignedTo: integer('assigned_to').references(() => users.id),
  inspector: text('inspector'),
  aiRiskScore: integer('ai_risk_score'),
  aiConfidence: integer('ai_confidence'),
  aiDetectedKeywords: jsonb('ai_detected_keywords'),
  aiRecommendation: text('ai_recommendation'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const inspectors = pgTable('inspectors', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  login: text('login').notNull().unique(),
  password: text('password').notNull(),
  district: text('district'),
  status: text('status').default('ONLINE'),
  solved: integer('solved').default(0),
  active: integer('active').default(0),
  responseTime: text('response_time').default('0.0 m'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  assignedIncidents: many(incidents),
  logs: many(auditLogs),
}));

export const botUsersRelations = relations(botUsers, ({ many }) => ({
  incidents: many(incidents),
}));

export const incidentsRelations = relations(incidents, ({ one }) => ({
  reporter: one(botUsers, {
    fields: [incidents.botUserId],
    references: [botUsers.id],
  }),
  assignee: one(users, {
    fields: [incidents.assignedTo],
    references: [users.id],
  }),
}));
