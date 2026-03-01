import { createRequire } from "module";

const require = createRequire(import.meta.url);

function resolveDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.PRISMA_DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  );
}

const resolvedDatabaseUrl = resolveDatabaseUrl();

if (!process.env.DATABASE_URL && resolvedDatabaseUrl) {
  process.env.DATABASE_URL = resolvedDatabaseUrl;
}

const { PrismaClient } = require("@prisma/client");

const prismaGlobal = globalThis;

export const prisma =
  prismaGlobal.__pma_prisma__ ||
  new PrismaClient({
    ...(resolvedDatabaseUrl
      ? {
          datasources: {
            db: { url: resolvedDatabaseUrl }
          }
        }
      : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.__pma_prisma__ = prisma;
}

export function getResolvedDatabaseUrl() {
  return resolveDatabaseUrl();
}
