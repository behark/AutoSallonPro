import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contentSections = pgTable("content_sections", {
  id: serial("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(), // e.g., "hero_title", "about_description"
  title: text("title").notNull(), // Display name for admin
  content: text("content").notNull(), // The actual content
  contentType: text("content_type").notNull().default("text"), // text, html, image_url, list
  page: text("page").notNull(), // home, about, contact, etc.
  category: text("category").notNull(), // hero, features, testimonials, etc.
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertContentSectionSchema = createInsertSchema(contentSections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ContentSection = typeof contentSections.$inferSelect;
export type InsertContentSection = z.infer<typeof insertContentSectionSchema>;