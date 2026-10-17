import { NextResponse } from "next/server";
import { iotStore } from "@/lib/iotDeviceState";

// POST /api/iot/device/commands/ack
// Hardware sends execution confirmation back to Next.js
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { commandId, result } = body;

    if (!commandId) {
      return NextResponse.json({ error: "Missing commandId" }, { status: 400 });
    }

    const success = await iotStore.acknowledgeCommand(commandId, result || "acknowledged");

    return NextResponse.json({
      status: success ? "acknowledged" : "not_found",
      commandId,
      result: result || "ok",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON acknowledgment payload", details: String(error) },
      { status: 400 }
    );
  }
}
