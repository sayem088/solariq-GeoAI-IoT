import { NextResponse } from "next/server";

// In-memory store for proto demo commands (ephemeral, same instance)
const globalStore = globalThis as unknown as {
  __protoCmd?: { plotId: number; durationMin: number; commandId: string; ts: number } | null;
  __protoStatus?: { plotId: number; running: boolean; startedAt: number; durationMin: number } | null;
};

// POST /api/proto/commands — UI enqueues a pump command
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plotId, durationMin } = body;
    if (!plotId || !durationMin) {
      return NextResponse.json({ error: "Missing plotId or durationMin" }, { status: 400 });
    }
    const commandId = "proto-" + Date.now().toString(36);
    const cmd = { plotId: Number(plotId), durationMin: Number(durationMin), commandId, ts: Date.now() };
    globalStore.__protoCmd = cmd;
    globalStore.__protoStatus = { plotId: Number(plotId), running: true, startedAt: Date.now(), durationMin: Number(durationMin) };
    return NextResponse.json({ status: "queued", commandId });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

// GET /api/proto/commands — ESP8266 polls for pending command
export async function GET(req: Request) {
  const cmd = globalStore.__protoCmd;
  if (!cmd) {
    return NextResponse.json({ action: "none" });
  }
  // Auto-expire command after 3 minutes
  if (Date.now() - cmd.ts > 180000) {
    globalStore.__protoCmd = null;
    return NextResponse.json({ action: "none" });
  }
  return NextResponse.json({
    action: "run_pump",
    commandId: cmd.commandId,
    plotId: cmd.plotId,
    durationSeconds: cmd.durationMin * 60,
  });
}
