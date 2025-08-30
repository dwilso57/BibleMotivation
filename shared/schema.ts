import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const verses = pgTable("verses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  reference: text("reference").notNull(),
  book: text("book").notNull(),
  chapter: text("chapter").notNull(),
  verse: text("verse").notNull(),
  version: text("version").notNull().default("NIV"),
  categories: text("categories").array().notNull().default(sql`'{}'::text[]`),
});

export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  verseId: varchar("verse_id").notNull(),
  verseText: text("verse_text").notNull(),
  verseReference: text("verse_reference").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const dailyVerses = pgTable("daily_verses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull().unique(),
  verseId: varchar("verse_id").notNull(),
  verseText: text("verse_text").notNull(),
  verseReference: text("verse_reference").notNull(),
});

export const insertVerseSchema = createInsertSchema(verses).omit({
  id: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertDailyVerseSchema = createInsertSchema(dailyVerses).omit({
  id: true,
});

export type InsertVerse = z.infer<typeof insertVerseSchema>;
export type Verse = typeof verses.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertDailyVerse = z.infer<typeof insertDailyVerseSchema>;
export type DailyVerse = typeof dailyVerses.$inferSelect;

export const VERSE_CATEGORIES = [
  "hope",
  "strength", 
  "peace",
  "love",
  "faith",
  "courage",
  "wisdom",
  "forgiveness",
  "comfort",
  "guidance",
  "perseverance",
  "gratitude"
] as const;

export type VerseCategory = typeof VERSE_CATEGORIES[number];
