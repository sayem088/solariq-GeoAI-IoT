// IoT Device State Store for SolariQ Hardware Integration
// Supports both in-memory local caching and Upstash Redis / Vercel KV cloud persistence.
// Maintains pending commands and real-time telemetry from benchtop NodeMCU/ESP8266/ESP32 devices.

export interface IoTCommand {
  commandId: string;
  deviceId: string;
  action: "pump_on" | "pump_off" | "led_on" | "led_off" | "run_motor" | "none";
  grid?: number;
  timestamp: number;
  acknowledged?: boolean;
  result?: string;
}

export interface IoTDeviceStatus {
  deviceId: string;
  pump: boolean;
  led: boolean;
  selectedGrid: number;
  remainingSeconds: number;
  moisture?: number;
  rssi?: number;
  lastSeen: number;
  ip?: string;
}

// In-memory fallback singleton for local development
const globalStore = globalThis as unknown as {
  __iotPendingCommands?: IoTCommand[];
  __iotDeviceStatus?: Record<string, IoTDeviceStatus>;
};

if (!globalStore.__iotPendingCommands) {
  globalStore.__iotPendingCommands = [];
}

if (!globalStore.__iotDeviceStatus) {
  globalStore.__iotDeviceStatus = {};
}

// Detect Upstash Redis or Vercel KV credentials
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

async function redisCommand(args: (string | number)[]): Promise<any> {
  if (!redisUrl || !redisToken) return null;
  try {
    const res = await fetch(redisUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result;
  } catch {
    return null;
  }
}

export const iotStore = {
  // Enqueue a command (from UI or GeoAI)
  async enqueueCommand(cmd: Omit<IoTCommand, "timestamp" | "acknowledged">): Promise<IoTCommand> {
    const fullCmd: IoTCommand = {
      ...cmd,
      timestamp: Date.now(),
      acknowledged: false,
    };

    // 1. In-memory update
    globalStore.__iotPendingCommands = [
      ...(globalStore.__iotPendingCommands || []),
      fullCmd,
    ].slice(-20);

    // 2. Cloud persistence if Upstash/Vercel KV is configured
    if (redisUrl && redisToken) {
      await redisCommand([
        "SET",
        `iot:cmd:${cmd.deviceId}`,
        JSON.stringify(fullCmd),
        "EX",
        180, // Expire after 3 minutes if unpolled
      ]);
    }

    return fullCmd;
  },

  // Get the oldest unacknowledged command for a given device
  async getNextCommand(deviceId: string): Promise<IoTCommand | null> {
    // 1. Try Cloud Redis first if available
    if (redisUrl && redisToken) {
      const raw = await redisCommand(["GET", `iot:cmd:${deviceId}`]);
      if (raw) {
        try {
          const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
          if (parsed && !parsed.acknowledged) {
            return parsed;
          }
        } catch {
          // Fall through to memory
        }
      }
    }

    // 2. Fallback to in-memory store
    const list = globalStore.__iotPendingCommands || [];
    const pending = list.find(
      (c) => c.deviceId === deviceId && !c.acknowledged && Date.now() - c.timestamp < 120000
    );
    return pending || null;
  },

  // Acknowledge execution from the hardware
  async acknowledgeCommand(commandId: string, result: string): Promise<boolean> {
    let found = false;

    // 1. In-memory
    const list = globalStore.__iotPendingCommands || [];
    const target = list.find((c) => c.commandId === commandId);
    if (target) {
      target.acknowledged = true;
      target.result = result;
      found = true;
    }

    // 2. Cloud Redis
    if (redisUrl && redisToken) {
      // Clear pending command key
      const keys = [`iot:cmd:irrigation-01`];
      for (const k of keys) {
        const raw = await redisCommand(["GET", k]);
        if (raw) {
          try {
            const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
            if (parsed && parsed.commandId === commandId) {
              await redisCommand(["DEL", k]);
              found = true;
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    }

    return found || true;
  },

  // Update status heartbeat from device
  async updateStatus(status: Omit<IoTDeviceStatus, "lastSeen">): Promise<IoTDeviceStatus> {
    const fullStatus: IoTDeviceStatus = {
      ...status,
      lastSeen: Date.now(),
    };

    // 1. In-memory
    if (!globalStore.__iotDeviceStatus) {
      globalStore.__iotDeviceStatus = {};
    }
    globalStore.__iotDeviceStatus[status.deviceId] = fullStatus;

    // 2. Cloud Redis (keeps alive for 60 seconds)
    if (redisUrl && redisToken) {
      await redisCommand([
        "SET",
        `iot:status:${status.deviceId}`,
        JSON.stringify(fullStatus),
        "EX",
        60,
      ]);
    }

    return fullStatus;
  },

  // Retrieve current status
  async getStatus(deviceId = "irrigation-01"): Promise<IoTDeviceStatus | null> {
    // 1. Try Cloud Redis first
    if (redisUrl && redisToken) {
      const raw = await redisCommand(["GET", `iot:status:${deviceId}`]);
      if (raw) {
        try {
          const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
          if (parsed) return parsed;
        } catch {
          // Fall through
        }
      }
    }

    // 2. Fallback to in-memory
    return globalStore.__iotDeviceStatus?.[deviceId] || null;
  },

  // Get all active devices
  getAllStatuses(): Record<string, IoTDeviceStatus> {
    return globalStore.__iotDeviceStatus || {};
  },
};
