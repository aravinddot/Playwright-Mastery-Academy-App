const requiredFields = ["fullName", "email", "phone", "experience"];
const webhookTimeoutMs = 12000;

function sanitize(value) {
  return String(value || "").trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPayload(payload) {
  if (!payload || typeof payload !== "object") return false;
  return requiredFields.every((field) => sanitize(payload[field]).length > 0);
}

export async function POST(request) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return Response.json(
      { error: "Google Sheets webhook is not configured." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return Response.json(
      { error: "Missing required fields: fullName, email, phone, experience." },
      { status: 400 }
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const clientIp = forwardedFor.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const webhookToken = process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN;

  const leadRecord = {
    timestamp: new Date().toISOString(),
    fullName: sanitize(body.fullName),
    email: sanitize(body.email),
    phone: sanitize(body.phone),
    experience: sanitize(body.experience),
    currentRole: sanitize(body.currentRole),
    goal: sanitize(body.goal),
    utmSummary: sanitize(body.utmSummary),
    sourcePage: "/enroll",
    clientIp,
    userAgent
  };

  if (!isValidEmail(leadRecord.email)) {
    return Response.json({ error: "Invalid email address." }, { status: 400 });
  }

  let requestUrl;
  try {
    requestUrl = new URL(webhookUrl);
  } catch {
    return Response.json(
      { error: "Google Sheets webhook URL is invalid." },
      { status: 500 }
    );
  }

  if (webhookToken) {
    requestUrl.searchParams.set("token", webhookToken);
  }

  const payload = {
    ...leadRecord,
    ...(webhookToken ? { token: webhookToken } : {})
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), webhookTimeoutMs);

    const response = await fetch(requestUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(webhookToken ? { "x-webhook-token": webhookToken } : {})
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal
    }).finally(() => {
      clearTimeout(timeoutId);
    });

    if (!response.ok) {
      const text = await response.text();
      return Response.json(
        { error: `Webhook rejected lead. Status ${response.status}. ${text}` },
        { status: 502 }
      );
    }

    return Response.json({ ok: true, message: "Lead saved to Google Sheets." }, { status: 200 });
  } catch (error) {
    const isAbortError = error && typeof error === "object" && error.name === "AbortError";

    return Response.json(
      {
        error: isAbortError
          ? "Google Sheets webhook timed out. Please try again."
          : "Failed to connect to Google Sheets webhook."
      },
      { status: 502 }
    );
  }
}
