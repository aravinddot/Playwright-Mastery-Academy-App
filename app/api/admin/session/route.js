import { isAdminAuthenticated } from "../../../../lib/admin-auth";

export async function GET(request) {
  const authenticated = isAdminAuthenticated(request);

  return Response.json(
    {
      ok: true,
      authenticated
    },
    { status: 200 }
  );
}
