import {
  buildAdminCookie,
  createAdminSessionToken,
  validateAdminCredentials
} from "../../../../lib/admin-auth";

function sanitize(value) {
  return String(value || "").trim();
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const username = sanitize(body?.username);
  const password = sanitize(body?.password);

  if (!username || !password) {
    return Response.json({ error: "Username and password are required." }, { status: 400 });
  }

  if (!validateAdminCredentials(username, password)) {
    return Response.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const token = createAdminSessionToken();

  return new Response(JSON.stringify({ ok: true, message: "Admin login successful." }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": buildAdminCookie(token)
    }
  });
}
