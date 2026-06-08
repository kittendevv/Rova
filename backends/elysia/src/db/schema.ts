import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const timestamps = () => ({
  createdAt: int({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),

  updatedAt: int({ mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date())
    .default(sql`(unixepoch())`),
});

export const lists = sqliteTable("lists", {
  id: int().primaryKey({ autoIncrement: true }),

  name: text().notNull(),

  ...timestamps(),
});

export const tasks = sqliteTable("tasks", {
  id: int().primaryKey({ autoIncrement: true }),

  listId: int()
    .notNull()
    .references(() => lists.id, { onDelete: "cascade" }),

  task: text().notNull(),

  done: int({ mode: "boolean" }).notNull().default(false),

  ...timestamps(),
});

export const listsRelations = relations(lists, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  list: one(lists, {
    fields: [tasks.listId],
    references: [lists.id],
  }),
}));
