export async function GET() {
  const delayMs = 5000 + Math.floor(Math.random() * 5001);
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
