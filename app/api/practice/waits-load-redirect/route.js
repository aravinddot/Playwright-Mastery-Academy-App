function clampDelay(value) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) return 6000;
  return Math.max(1000, Math.min(parsed, 15000));
}

function resolveTarget(rawTarget) {
  if (!rawTarget || typeof rawTarget !== "string") return "/practice/sandbox-advanced";
  // Restrict redirects to same-site relative paths only.
  if (!rawTarget.startsWith("/")) return "/practice/sandbox-advanced";
  return rawTarget;
}

export async function GET(request) {
  const url = new URL(request.url);
  const delayMs = clampDelay(url.searchParams.get("delay"));
  const target = resolveTarget(url.searchParams.get("to"));

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  return Response.redirect(new URL(target, request.url), 307);
}

