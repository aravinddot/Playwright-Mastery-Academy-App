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
    action: String(row.action || ""),
    leadSource: String(row.leadSource || "Meta Ads"),
    campaignName: String(row.campaignName || ""),
    callStatus: String(row.callStatus || "Not Called"),
    interestStatus: String(row.interestStatus || "Not Assessed"),
    joinTimeline: String(row.joinTimeline || ""),
    joinStatus: String(row.joinStatus || "Pending"),
    nextFollowUp: String(row.nextFollowUp || ""),
    callNotes: String(row.callNotes || ""),
    lastContactedAt:
      row.lastContactedAt instanceof Date
        ? row.lastContactedAt.toISOString()
        : String(row.lastContactedAt || ""),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt || "")
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
      "action" TEXT NOT NULL DEFAULT 'request_callback',
      "leadSource" TEXT NOT NULL DEFAULT 'Meta Ads',
      "campaignName" TEXT NOT NULL DEFAULT '',
      "callStatus" TEXT NOT NULL DEFAULT 'Not Called',
      "interestStatus" TEXT NOT NULL DEFAULT 'Not Assessed',
      "joinTimeline" TEXT NOT NULL DEFAULT '',
      "joinStatus" TEXT NOT NULL DEFAULT 'Pending',
      "nextFollowUp" TEXT NOT NULL DEFAULT '',
      "callNotes" TEXT NOT NULL DEFAULT '',
      "lastContactedAt" TIMESTAMPTZ NULL,
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  const indexSql =
    'CREATE INDEX IF NOT EXISTS "idx_enroll_leads_timestamp" ON "enroll_leads" ("timestamp");';

  await prisma.$executeRawUnsafe(tableSql);
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "enroll_leads" ADD COLUMN IF NOT EXISTS "leadSource" TEXT NOT NULL DEFAULT \'Meta Ads\';'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "enroll_leads" ADD COLUMN IF NOT EXISTS "campaignName" TEXT NOT NULL DEFAULT \'\';'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "enroll_leads" ADD COLUMN IF NOT EXISTS "callStatus" TEXT NOT NULL DEFAULT \'Not Called\';'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "enroll_leads" ADD COLUMN IF NOT EXISTS "interestStatus" TEXT NOT NULL DEFAULT \'Not Assessed\';'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "enroll_leads" ADD COLUMN IF NOT EXISTS "joinTimeline" TEXT NOT NULL DEFAULT \'\';'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "enroll_leads" ADD COLUMN IF NOT EXISTS "joinStatus" TEXT NOT NULL DEFAULT \'Pending\';'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "enroll_leads" ADD COLUMN IF NOT EXISTS "nextFollowUp" TEXT NOT NULL DEFAULT \'\';'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "enroll_leads" ADD COLUMN IF NOT EXISTS "callNotes" TEXT NOT NULL DEFAULT \'\';'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "enroll_leads" ADD COLUMN IF NOT EXISTS "lastContactedAt" TIMESTAMPTZ NULL;'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "enroll_leads" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();'
  );
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
      action: sanitize(lead?.action) || "request_callback",
      leadSource: sanitize(lead?.leadSource) || "Meta Ads",
      campaignName: sanitize(lead?.campaignName),
      callStatus: sanitize(lead?.callStatus) || "Not Called",
      interestStatus: sanitize(lead?.interestStatus) || "Not Assessed",
      joinTimeline: sanitize(lead?.joinTimeline),
      joinStatus: sanitize(lead?.joinStatus) || "Pending",
      nextFollowUp: sanitize(lead?.nextFollowUp),
      callNotes: sanitize(lead?.callNotes),
      lastContactedAt: lead?.lastContactedAt ? new Date(String(lead.lastContactedAt)) : null,
      updatedAt: new Date()
    }
  });

  return mapLeadRow(created);
}

export async function getAllLeads() {
  await ensureLeadsTable();

  const rows = await prisma.$queryRawUnsafe(
    'SELECT * FROM "enroll_leads" ORDER BY "timestamp" DESC LIMIT 5000'
  );

  return rows.map(mapLeadRow);
}

export async function updateLeadById(id, updates) {
  await ensureLeadsTable();

  const leadId = sanitize(id);
  if (!leadId) {
    throw new Error("Lead id is required.");
  }

  const existingRows = await prisma.$queryRaw`SELECT * FROM "enroll_leads" WHERE "id" = ${leadId} LIMIT 1`;
  const existing = Array.isArray(existingRows) ? existingRows[0] : null;

  if (!existing) {
    return null;
  }

  const hasField = (field) =>
    Object.prototype.hasOwnProperty.call(updates || {}, field);

  const assignments = [];
  const values = [];
  const push = (column, value) => {
    values.push(value);
    assignments.push(`"${column}" = $${values.length}`);
  };

  if (hasField("fullName")) push("fullName", sanitize(updates?.fullName) || existing.fullName);
  if (hasField("email")) push("email", sanitize(updates?.email) || existing.email);
  if (hasField("phone")) push("phone", sanitize(updates?.phone) || existing.phone);
  if (hasField("experience")) push("experience", sanitize(updates?.experience) || existing.experience);
  if (hasField("currentRole")) push("currentRole", sanitize(updates?.currentRole));
  if (hasField("goal")) push("goal", sanitize(updates?.goal));
  if (hasField("action")) push("action", sanitize(updates?.action) || existing.action);
  if (hasField("callStatus")) push("callStatus", sanitize(updates?.callStatus));
  if (hasField("interestStatus")) push("interestStatus", sanitize(updates?.interestStatus));
  if (hasField("joinTimeline")) push("joinTimeline", sanitize(updates?.joinTimeline));
  if (hasField("joinStatus")) push("joinStatus", sanitize(updates?.joinStatus));
  if (hasField("nextFollowUp")) push("nextFollowUp", sanitize(updates?.nextFollowUp));
  if (hasField("callNotes")) push("callNotes", sanitize(updates?.callNotes));
  if (hasField("lastContactedAt")) {
    push(
      "lastContactedAt",
      updates?.lastContactedAt ? new Date(String(updates.lastContactedAt)) : null
    );
  }

  push("updatedAt", new Date());
  values.push(leadId);
  const idParam = `$${values.length}`;

  const updateSql = `UPDATE "enroll_leads" SET ${assignments.join(", ")} WHERE "id" = ${idParam}`;
  await prisma.$executeRawUnsafe(updateSql, ...values);

  const updatedRows = await prisma.$queryRaw`SELECT * FROM "enroll_leads" WHERE "id" = ${leadId} LIMIT 1`;
  const updated = Array.isArray(updatedRows) ? updatedRows[0] : null;
  return updated ? mapLeadRow(updated) : null;
}

export async function deleteLeadById(id) {
  await ensureLeadsTable();

  const leadId = sanitize(id);
  if (!leadId) {
    throw new Error("Lead id is required.");
  }

  const existing = await prisma.enrollLead.findUnique({
    where: { id: leadId }
  });

  if (!existing) {
    return false;
  }

  await prisma.enrollLead.delete({
    where: { id: leadId }
  });

  return true;
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
