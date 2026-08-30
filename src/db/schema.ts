import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const PLOT_STATUSES = ['available', 'under_negotiation', 'sold'] as const;
export type PlotStatus = (typeof PLOT_STATUSES)[number];

export const BUYER_STATUSES = ['new', 'active', 'closed', 'lost'] as const;
export type BuyerStatus = (typeof BUYER_STATUSES)[number];

export const SIZE_UNITS = ['acres', 'cents', 'guntas', 'sq ft', 'sq yards'] as const;

export const plots = sqliteTable('plots', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  location: text('location').notNull(),
  sizeValue: real('size_value').notNull(),
  sizeUnit: text('size_unit').notNull().default('acres'),
  askingPrice: real('asking_price').notNull(),
  ownerName: text('owner_name').notNull(),
  ownerPhone: text('owner_phone').notNull(),
  status: text('status', { enum: PLOT_STATUSES }).notNull().default('available'),
  notes: text('notes'),
  /** Set when the plot is marked sold, cleared if it comes back on the market.
   *  Kept separate from updatedAt so "sold this month" survives later edits. */
  soldAt: integer('sold_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const buyers = sqliteTable('buyers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  budgetMin: real('budget_min').notNull(),
  budgetMax: real('budget_max').notNull(),
  areaPreference: text('area_preference').notNull(),
  sizePreference: text('size_preference'),
  status: text('status', { enum: BUYER_STATUSES }).notNull().default('new'),
  lastContactedAt: integer('last_contacted_at', { mode: 'timestamp' }),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Plot = typeof plots.$inferSelect;
export type NewPlot = typeof plots.$inferInsert;
export type Buyer = typeof buyers.$inferSelect;
export type NewBuyer = typeof buyers.$inferInsert;
