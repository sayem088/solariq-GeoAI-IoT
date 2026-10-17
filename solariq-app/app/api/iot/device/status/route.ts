import { NextResponse } from "next/server";
import { iotStore } from "@/lib/iotDeviceState";

// POST /api/iot/device/status
// ESP8266/ESP32 reports real-time actuator state & sensor readings every ~10s
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      deviceId = "irrigation-01",
      pump = false,
      led = false,
      selectedGrid = 0,
      remainingSeconds = 0,
      moisture = 0,
      rssi = 0,
    } = body;

    const updated = await iotStore.updateStatus({
      deviceId,
      pump: Boolean(pump),
      led: Boolean(led),
      selectedGrid: Number(selectedGrid),
      remainingSeconds: Number(remainingSeconds),
      moisture: Number(moisture),
      rssi: Number(rssi),
    });

    return NextResponse.json({
      status: "received",
      timestamp: updated.lastSeen,
      device: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON status payload", details: String(error) },
      { status: 400 }
    );
  }
}

// GET /api/iot/device/status
// Web UI or SCADA dashboard checks if real hardware is online and active
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId") || "irrigation-01";

  const status = await iotStore.getStatus(deviceId);
  const isOnline = status ? Date.now() - status.lastSeen < 25000 : false;

  return NextResponse.json({
    online: isOnline,
    status: status || {
      deviceId,
      pump: false,
      led: false,
      selectedGrid: 0,
      remainingSeconds: 0,
      moisture: 0,
      rssi: 0,
      lastSeen: 0,
    },
  });
}
