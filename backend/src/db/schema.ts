import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// USERS
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// PRODUCTS
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// COMMENTS
export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// RELATIONS
export const userRelations = relations(users, ({ many }) => ({
  products: many(products),
  comments: many(comments),
}));

export const productRelations = relations(products, ({ many, one }) => ({
  comments: many(comments),
  user: one(users, { fields: [products.userId], references: [users.id] }),
}));

export const commentRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  product: one(products, { fields: [comments.productId], references: [products.id] }),
}));
export type User = typeof users.$inferSelect;
export type newUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type newProduct = typeof products.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type newComment = typeof comments.$inferInsert;



