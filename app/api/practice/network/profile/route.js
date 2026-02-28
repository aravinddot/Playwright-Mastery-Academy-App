export async function GET(request) {
  const sourceHeader = request.headers.get("x-intercept-source") || "direct-request";

  return Response.json(
    {
      source: "live-api",
      interceptSource: sourceHeader,
      profile: {
        id: "USR-120",
        name: "Arun Kumar",
        role: "QA Engineer",
        track: "Playwright Core"
      },
      message: "Profile loaded from live endpoint."
    },
    { status: 200 }
  );
}

