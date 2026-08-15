import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema.js";

function createDatabase(connectionString: string) {
  return drizzle(connectionString, { schema, mode: "default" });
}

let database: ReturnType<typeof createDatabase> | undefined;

export function getSenseExperienceDb() {
  const connectionString = process.env.SENSE_EXPERIENCE_DATABASE_URL;
  if (!connectionString) {
    throw new Error("SENSE_EXPERIENCE_DATABASE_URL is required. Urban-Sense database settings are intentionally not used.");
  }
  if (!database) database = createDatabase(connectionString);
  return database;
}
