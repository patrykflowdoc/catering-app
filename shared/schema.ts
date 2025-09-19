import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").notNull(),
  deliveryDays: jsonb("delivery_days").notNull(),
  specialInstructions: text("special_instructions"),
  subtotal: integer("subtotal").notNull(),
  deliveryFee: integer("delivery_fee").notNull(),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Menu item types for frontend
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'soup' | 'main' | 'dessert';
}

export interface SelectedItem {
  id: string;
  name: string;
  price: number;
  category: 'soup' | 'main' | 'dessert';
}

export interface DeliveryDay {
  date: string;
  numberOfPeople: number;
  selectedItems: SelectedItem[];
}

export interface MultiDayOrder {
  numberOfDays: number;
  deliveryDays: DeliveryDay[];
}
