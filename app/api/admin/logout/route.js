import { buildAdminLogoutCookie } from "../../../../lib/admin-auth";

export async function POST() {
  return new Response(JSON.stringify({ ok: true, message: "Admin logout successful." }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": buildAdminLogoutCookie()
    }
  });
}
