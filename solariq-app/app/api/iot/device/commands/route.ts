import { NextResponse } from "next/server";
import { iotStore } from "@/lib/iotDeviceState";

// GET /api/iot/device/commands
// Polled by ESP8266/ESP32 every ~3 seconds
export async function GET(req: Request) {
  try {
    const deviceId = req.headers.get("X-Device-ID") || "irrigation-01";
    const pending = await iotStore.getNextCommand(deviceId);

    if (pending) {
      return NextResponse.json({
        commandId: pending.commandId,
        action: pending.action,
        grid: pending.grid || 1,
      });
    }

    // No pending command
    return NextResponse.json({
      action: "none",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to poll commands", details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/iot/device/commands
// Trigger a command from the Web UI or GeoAI scheduler
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId = "irrigation-01", action, grid = 1 } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing action field" }, { status: 400 });
    }

    const commandId = "cmd-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6);

    const queued = await iotStore.enqueueCommand({
      commandId,
      deviceId,
      action,
      grid: Number(grid),
    });

    return NextResponse.json({
      status: "queued",
      command: queued,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON command payload", details: String(error) },
      { status: 400 }
    );
  }
}
