import { PrismaClient } from "@prisma/client";

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

if (!process.env.DATABASE_URL) {
  const fallbackUrl = resolveDatabaseUrl();
  if (fallbackUrl) {
    process.env.DATABASE_URL = fallbackUrl;
  }
}

const prismaGlobal = globalThis;

export const prisma =
  prismaGlobal.__pma_prisma__ ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.__pma_prisma__ = prisma;
}

export function getResolvedDatabaseUrl() {
  return resolveDatabaseUrl();
}
