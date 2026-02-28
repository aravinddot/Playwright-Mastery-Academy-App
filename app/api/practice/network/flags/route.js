export async function GET() {
  const delayMs = 900 + Math.floor(Math.random() * 1101);
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  return Response.json(
    {
      source: "live-api",
      delayMs,
      flags: {
        betaDashboard: false,
        aiInsights: true,
        mcpAssist: false,
        smartRetries: true
      },
      message: "Feature flags loaded from endpoint."
    },
    { status: 200 }
  );
}
