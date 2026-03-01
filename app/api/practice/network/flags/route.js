export async function GET() {
  const delayMs = 900 + Math.floor(Math.random() * 1101);
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  return Response.json(
    {
      source: "live-api",
      delayMs,
      flags: {
        betaDashboard: "disabled",
        aiInsights: true,
        mcpAssist: "pilot-mode",
        smartRetries: false
      },
      message: "Feature flags loaded from endpoint."
    },
    { status: 200 }
  );
}
