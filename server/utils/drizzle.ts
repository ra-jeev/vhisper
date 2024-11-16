import { drizzle } from "drizzle-orm/d1";
import * as schema from "../database/schema";

export { sql, eq, and, or, desc } from "drizzle-orm";

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}
