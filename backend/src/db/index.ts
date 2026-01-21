import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import "dotenv/config";

// 1️⃣ Vérification immédiate des variables d'environnement
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// 2️⃣ Configuration du pool (optimisée)
export const pool = new Pool({
  connectionString: DATABASE_URL,
});

// 3️⃣ Logs contrôlés (pas en prod)
if (process.env.NODE_ENV !== "production") {
  pool.on("connect", () => {
    console.log("✅ PostgreSQL connected");
  });
}

// 4️⃣ Gestion des erreurs du pool
pool.on("error", (err) => {
  console.error("❌ Unexpected PG pool error", err);
  process.exit(1);
});

// 5️⃣ Instance Drizzle typée
export const db = drizzle({client:pool, schema });
