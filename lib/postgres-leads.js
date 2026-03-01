import { randomUUID } from "crypto";
import { prisma, getResolvedDatabaseUrl } from "./prisma";

let isTableReady = false;

function sanitize(value) {
  return String(value || "").trim();
}

function mapLeadRow(row) {
  return {
    id: String(row.id || ""),
    timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : String(row.timestamp || ""),
    fullName: String(row.fullName || ""),
    email: String(row.email || ""),
    phone: String(row.phone || ""),
    experience: String(row.experience || ""),
    currentRole: String(row.currentRole || ""),
    goal: String(row.goal || ""),
    utmSummary: String(row.utmSummary || ""),
    sourcePage: String(row.sourcePage || ""),
    clientIp: String(row.clientIp || ""),
    userAgent: String(row.userAgent || ""),
    action: String(row.action || "")
  };
}

async function ensureLeadsTable() {
  if (isTableReady) return;

  const tableSql = `
    CREATE TABLE IF NOT EXISTS "enroll_leads" (
      "id" TEXT PRIMARY KEY,
      "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "fullName" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "experience" TEXT NOT NULL,
      "currentRole" TEXT NOT NULL DEFAULT '',
      "goal" TEXT NOT NULL DEFAULT '',
      "utmSummary" TEXT NOT NULL DEFAULT '',
      "sourcePage" TEXT NOT NULL DEFAULT '/enroll',
      "clientIp" TEXT NOT NULL DEFAULT 'unknown',
      "userAgent" TEXT NOT NULL DEFAULT 'unknown',
      "action" TEXT NOT NULL DEFAULT 'request_callback'
    );
  `;

  const indexSql =
    'CREATE INDEX IF NOT EXISTS "idx_enroll_leads_timestamp" ON "enroll_leads" ("timestamp");';

  await prisma.$executeRawUnsafe(tableSql);
  await prisma.$executeRawUnsafe(indexSql);
  isTableReady = true;
}

export async function addLead(lead) {
  await ensureLeadsTable();

  const created = await prisma.enrollLead.create({
    data: {
      id: randomUUID(),
      timestamp: lead?.timestamp ? new Date(String(lead.timestamp)) : new Date(),
      fullName: sanitize(lead?.fullName),
      email: sanitize(lead?.email),
      phone: sanitize(lead?.phone),
      experience: sanitize(lead?.experience),
      currentRole: sanitize(lead?.currentRole),
      goal: sanitize(lead?.goal),
      utmSummary: sanitize(lead?.utmSummary),
      sourcePage: sanitize(lead?.sourcePage) || "/enroll",
      clientIp: sanitize(lead?.clientIp) || "unknown",
      userAgent: sanitize(lead?.userAgent) || "unknown",
      action: sanitize(lead?.action) || "request_callback"
    }
  });

  return mapLeadRow(created);
}

export async function getAllLeads() {
  await ensureLeadsTable();

  const rows = await prisma.enrollLead.findMany({
    orderBy: { timestamp: "desc" },
    take: 5000
  });

  return rows.map(mapLeadRow);
}

export async function getDatabaseStatus() {
  const connectionString = getResolvedDatabaseUrl();
  if (!connectionString) {
    return {
      configured: false,
      host: "not-configured",
      totalLeads: 0
    };
  }

  let host = "unknown";
  try {
    host = new URL(connectionString).host || "unknown";
  } catch {
    host = "invalid-url";
  }

  await ensureLeadsTable();
  const totalLeads = await prisma.enrollLead.count();

  return {
    configured: true,
    host,
    totalLeads
  };
}
