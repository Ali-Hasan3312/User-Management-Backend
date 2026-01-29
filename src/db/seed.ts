import { db } from "./index";
import { users } from "./schema/user";
import bcrypt from "bcrypt";
import { InferInsertModel } from "drizzle-orm";

type UserInsert = InferInsertModel<typeof users>;

async function seed() {
  console.log("🌱 Seeding users...");

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const seedUsers: UserInsert[] = [];

  for (let i = 1; i <= 5; i++) {
    seedUsers.push({
      name: `Admin ${i}`,
      email: `admin${i}@example.com`,
      password: hashedPassword,
      role: "ADMIN",
      isBlocked: false,
    });
  }

  for (let i = 1; i <= 20; i++) {
    seedUsers.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: hashedPassword,
      role: "USER",
      isBlocked: i % 5 === 0, 
    });
  }

  await db.insert(users).values(seedUsers);

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
