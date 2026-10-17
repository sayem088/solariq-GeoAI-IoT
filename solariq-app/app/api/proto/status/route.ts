import { NextResponse } from "next/server";

const globalStore = globalThis as unknown as {
  __protoCmd?: { plotId: number; durationMin: number; commandId: string; ts: number } | null;
  __protoStatus?: { plotId: number; running: boolean; startedAt: number; durationMin: number } | null;
  __protoEspOnline?: number; // timestamp of last heartbeat
};

// POST /api/proto/status — ESP8266 reports heartbeat / pump state
export async function POST(req: Request) {
  try {
    const body = await req.json();
    globalStore.__protoEspOnline = Date.now();

    const { running, plotId, commandId } = body;

    if (commandId && globalStore.__protoCmd?.commandId === commandId) {
      // ESP acknowledged the command: clear the pending queue
      globalStore.__protoCmd = null;
    }

    if (globalStore.__protoStatus) {
      globalStore.__protoStatus.running = Boolean(running);
    }

    return NextResponse.json({ status: "ok", timestamp: Date.now() });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

// GET /api/proto/status — UI polls for ESP online + pump running state
export async function GET() {
  const lastSeen = globalStore.__protoEspOnline ?? 0;
  const online = Date.now() - lastSeen < 15000; // online if heartbeat within 15s
  const status = globalStore.__protoStatus ?? null;

  return NextResponse.json({
    online,
    lastSeen,
    status: status
      ? {
          running: status.running,
          plotId: status.plotId,
          durationMin: status.durationMin,
          startedAt: status.startedAt,
          remainingSeconds: status.running
            ? Math.max(0, status.durationMin * 60 - Math.floor((Date.now() - status.startedAt) / 1000))
            : 0,
        }
      : null,
  });
}
