import { getAllLeads } from "../../../../lib/postgres-leads";

export async function GET() {
  try {
    const rows = await getAllLeads();

    return Response.json(
      {
        ok: true,
        source: "postgres",
        count: rows.length,
        rows
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "Failed to read leads from database.";
    return Response.json({ error: message }, { status: 500 });
  }
}
