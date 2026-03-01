import { updateLeadById } from "../../../../../lib/postgres-leads";
import { isAdminAuthenticated } from "../../../../../lib/admin-auth";

const goalMaxLength = 220;
const callNotesMaxLength = 1000;
const allowedUpdateFields = new Set([
  "fullName",
  "email",
  "phone",
  "experience",
  "currentRole",
  "goal",
  "callStatus",
  "interestStatus",
  "joinTimeline",
  "joinStatus",
  "nextFollowUp",
  "callNotes",
  "lastContactedAt",
  "action"
]);

function sanitize(value) {
  return String(value || "").trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function resolveLeadId(request, context) {
  let leadId = "";
  const paramsMaybePromise = context?.params;

  if (paramsMaybePromise) {
    const params =
      typeof paramsMaybePromise.then === "function"
        ? await paramsMaybePromise
        : paramsMaybePromise;
    leadId = sanitize(params?.id);
  }

  if (!leadId) {
    const segments = String(request?.nextUrl?.pathname || "").split("/").filter(Boolean);
    leadId = sanitize(segments[segments.length - 1]);
  }

  return leadId;
}

export async function PUT(request, context) {
  if (!isAdminAuthenticated(request)) {
    return Response.json({ error: "Unauthorized. Admin login required." }, { status: 401 });
  }

  const leadId = await resolveLeadId(request, context);
  if (!leadId) {
    return Response.json({ error: "Lead id is required." }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Payload must be an object." }, { status: 400 });
  }

  const updates = {};
  for (const [key, value] of Object.entries(body)) {
    if (!allowedUpdateFields.has(key)) continue;
    updates[key] =
      key === "lastContactedAt"
        ? value
        : sanitize(value);
  }

  if ("email" in updates && sanitize(updates.email) && !isValidEmail(updates.email)) {
    return Response.json({ error: "Invalid email address." }, { status: 400 });
  }

  const goal = "goal" in updates ? sanitize(updates.goal) : undefined;
  if (typeof goal === "string" && goal.length > goalMaxLength) {
    return Response.json(
      { error: `Learning goal must be ${goalMaxLength} characters or fewer.` },
      { status: 400 }
    );
  }

  const callNotes = "callNotes" in updates ? sanitize(updates.callNotes) : undefined;
  if (typeof callNotes === "string" && callNotes.length > callNotesMaxLength) {
    return Response.json(
      { error: `Call notes must be ${callNotesMaxLength} characters or fewer.` },
      { status: 400 }
    );
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "No valid fields provided to update." }, { status: 400 });
  }

  try {
    const updated = await updateLeadById(leadId, {
      ...updates,
      ...(typeof goal === "string" ? { goal } : {}),
      ...(typeof callNotes === "string" ? { callNotes } : {})
    });
    if (!updated) {
      return Response.json({ error: "Lead not found." }, { status: 404 });
    }

    return Response.json(
      {
        ok: true,
        message: "Lead updated successfully.",
        row: updated
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "Failed to update lead.";
    return Response.json({ error: message }, { status: 500 });
  }
}
