function resolveDelay(requestedDelay) {
  const parsed = Number.parseInt(requestedDelay ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return 5000 + Math.floor(Math.random() * 5001);
  }
  return Math.max(1000, Math.min(parsed, 15000));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const delayMs = resolveDelay(searchParams.get("delay"));
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  return Response.json(
    {
      status: "wait-response-ready",
      delayMs,
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}
