import { getAllLeads } from "../../../../lib/postgres-leads";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  if (!isAdminAuthenticated(request)) {
    return Response.json({ error: "Unauthorized. Admin login required." }, { status: 401 });
  }

  try {
    const rows = await getAllLeads();

    return Response.json(
      {
        ok: true,
        source: "postgres",
        count: rows.length,
        rows
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
        }
      }
    );
  } catch (error) {
    const message =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "Failed to read leads from database.";
    return Response.json({ error: message }, { status: 500 });
  }
}
