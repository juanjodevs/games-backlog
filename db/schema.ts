import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable('users_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  picture: text().notNull(),
})

export const gamesTable = sqliteTable("games_table", {
  id: int().primaryKey({ autoIncrement: true }),
  hltbId: int().notNull(),
  title: text().notNull(),
  cover: text().notNull(),
  platform: text().notNull(),
  timeToComplete: int().notNull(),
  status: text({ enum: ["Playing", "Completed", "Backlog"] }).notNull(),
  ownerEmail: text("owner_email").references(() => usersTable.email),
});
