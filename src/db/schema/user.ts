import { mysqlTable, int, varchar, timestamp, boolean} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", {length: 255}).notNull(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password", {length: 255}).notNull(),
    role: varchar("role", {length: 20}).$type<"ADMIN" | "USER">().default("USER"),
    isBlocked: boolean("is_blocked").default(false),
    createdAt: timestamp("created_at").defaultNow(),
})