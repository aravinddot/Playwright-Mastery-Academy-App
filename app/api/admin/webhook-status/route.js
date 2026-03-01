import { getDatabaseStatus } from "../../../../lib/postgres-leads";

export async function GET() {
  try {
    const status = await getDatabaseStatus();

    return Response.json(
      {
        ok: true,
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
        databaseConfigured: status.configured,
        databaseHost: status.host,
        totalLeads: status.totalLeads
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "Failed to read database status.";
    return Response.json({ error: message }, { status: 500 });
  }
}
