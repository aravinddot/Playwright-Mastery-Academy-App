export async function GET(request) {
  const mode = request.headers.get("x-intercept-mode") || "live";
  const forceError = request.headers.get("x-force-error") === "true";

  if (forceError) {
    return Response.json(
      {
        mode,
        message: "Forced error from orders endpoint."
      },
      { status: 500 }
    );
  }

  return Response.json(
    {
      mode,
      orders: [
        { id: "ORD-501", status: "Pending", amount: 1520 },
        { id: "ORD-502", status: "Confirmed", amount: 980 },
        { id: "ORD-503", status: "Dispatched", amount: 2100 }
      ],
      message: "Orders loaded from endpoint."
    },
    { status: 200 }
  );
}

