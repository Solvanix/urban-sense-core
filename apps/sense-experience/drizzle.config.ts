import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.SENSE_EXPERIENCE_DATABASE_URL ?? "mysql://unconfigured:unconfigured@localhost:3306/sense_experience"
  }
});
