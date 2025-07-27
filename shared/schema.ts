import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  status: text("status").notNull().default("active"), // active, escalated, completed
  messages: jsonb("messages").notNull().default([]),
  sentiment: text("sentiment").default("neutral"), // positive, neutral, negative, frustrated
  duration: integer("duration").default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id),
  transcription: text("transcription"),
  audioData: text("audio_data"), // base64 encoded audio
  aiResponse: text("ai_response"),
  confidence: integer("confidence").default(0), // 0-100
  latency: integer("latency").default(0), // in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tier: text("tier").default("standard"), // standard, premium, enterprise
  accountAge: text("account_age"),
  lastContact: timestamp("last_contact"),
  sentimentHistory: text("sentiment_history").default("positive"),
  language: text("language").default("English"),
  previousIssues: jsonb("previous_issues").default([]),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Customer = typeof customers.$inferSelect;
