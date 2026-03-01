import { addLead } from "../../../../lib/postgres-leads";

const requiredFields = ["fullName", "email", "phone", "experience"];
const goalMaxLength = 220;

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
  const goal = sanitize(body.goal);

  if (goal.length > goalMaxLength) {
    return Response.json(
      { error: `Learning goal must be ${goalMaxLength} characters or fewer.` },
      { status: 400 }
    );
  }

  const leadRecord = {
    timestamp: new Date().toISOString(),
    fullName: sanitize(body.fullName),
    email: sanitize(body.email),
    phone: sanitize(body.phone),
    experience: sanitize(body.experience),
    currentRole: sanitize(body.currentRole),
    goal,
    utmSummary: sanitize(body.utmSummary),
    sourcePage: "/enroll",
    clientIp,
    userAgent,
    action: "request_callback",
    leadSource: "Meta Ads",
    campaignName: sanitize(body.campaignName),
    callStatus: "Not Called",
    interestStatus: "Not Assessed",
    joinTimeline: "",
    joinStatus: "Pending",
    nextFollowUp: "",
    callNotes: "",
    lastContactedAt: null
  };

  if (!isValidEmail(leadRecord.email)) {
    return Response.json({ error: "Invalid email address." }, { status: 400 });
  }

  try {
    const saved = await addLead(leadRecord);
    return Response.json(
      { ok: true, message: "Lead saved successfully.", leadId: saved.id },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "Failed to save lead data.";
    return Response.json({ error: message }, { status: 500 });
  }
}
