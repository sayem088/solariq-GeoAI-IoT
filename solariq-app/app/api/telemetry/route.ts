import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Payload Schema from ESP32:
    // { node: "DIU-01", solar_w: 480, pump_w: 120, active_plot: 4, rain: false, moisture: [48, 52, 65, 28, 34, 58] }
    const validatedData = {
      nodeId: payload.node || "ESP32-DIU-01",
      timestamp: Date.now(),
      solarWatts: Number(payload.solar_w) || 485,
      pumpWatts: Number(payload.pump_w) || 0,
      activePlot: Number(payload.active_plot) || 4,
      rainDetected: Boolean(payload.rain),
      moistureArray: Array.isArray(payload.moisture) ? payload.moisture : [48, 52, 65, 28, 34, 58],
    };

    return NextResponse.json({
      status: "success",
      message: "Telemetry ingested from benchtop hardware node",
      received: validatedData,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid JSON telemetry payload" },
      { status: 400 }
    );
  }
}
