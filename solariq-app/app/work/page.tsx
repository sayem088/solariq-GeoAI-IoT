"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Wifi,
  WifiOff,
  Sun,
  Zap,
  CirclePlay,
  CircleStop,
  Cpu,
  Lightbulb,
  Timer,
  RefreshCw,
  ArrowLeft,
  Activity,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DeviceStatus {
  online: boolean;
  status: {
    pump: boolean;       // motor running
    led: boolean;        // D6 LED state
    remainingSeconds: number;
    rssi?: number;
    lastSeen?: number;
  } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rssiToStrength(rssi: number): { label: string; bars: number; color: string } {
  if (rssi >= -50) return { label: "Excellent", bars: 4, color: "text-emerald-500" };
  if (rssi >= -65) return { label: "Good",      bars: 3, color: "text-emerald-400" };
  if (rssi >= -75) return { label: "Fair",       bars: 2, color: "text-amber-500" };
  return              { label: "Weak",      bars: 1, color: "text-red-500" };
}

// ─── StatusCard ───────────────────────────────────────────────────────────────

function StatusCard({
  icon,
  label,
  value,
  active,
  pulse,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
  pulse?: boolean;
  sub?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl p-5 border transition-all duration-500 ${
        active
          ? "bg-emerald-50 border-emerald-200 shadow-sm shadow-emerald-100"
          : "bg-stone-50 border-stone-200"
      }`}
    >
      {/* status dot */}
      <span
        className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-stone-300"
        } ${pulse && active ? "animate-pulse" : ""}`}
      />
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
          active ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400"
        }`}
      >
        {icon}
      </div>
      <p className="text-[11px] uppercase tracking-widest font-bold text-stone-400 mb-0.5">
        {label}
      </p>
      <p className={`text-xl font-bold ${active ? "text-stone-900" : "text-stone-400"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── LedIndicator ─────────────────────────────────────────────────────────────

function LedIndicator({ on }: { on: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* LED bulb SVG */}
      <div className="relative">
        <svg width="64" height="80" viewBox="0 0 64 80" fill="none">
          {/* glow */}
          {on && (
            <circle cx="32" cy="28" r="24" fill="rgba(52,211,153,0.15)" />
          )}
          {/* bulb body */}
          <ellipse
            cx="32" cy="26" rx="18" ry="18"
            fill={on ? "#6ee7b7" : "#d4d4aa"}
            stroke={on ? "#10b981" : "#a3a3a3"}
            strokeWidth="2"
          />
          {/* filament lines */}
          <path
            d="M27 26 Q29 22 32 26 Q35 30 37 26"
            stroke={on ? "#065f46" : "#737373"}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* neck */}
          <rect
            x="26" y="42" width="12" height="7" rx="2"
            fill={on ? "#a7f3d0" : "#e5e5e5"}
            stroke={on ? "#6ee7b7" : "#d4d4d4"}
            strokeWidth="1.5"
          />
          {/* base */}
          <rect
            x="24" y="48" width="16" height="4" rx="1"
            fill={on ? "#6ee7b7" : "#d4d4d4"}
          />
          <rect
            x="26" y="52" width="12" height="4" rx="1"
            fill={on ? "#34d399" : "#c4c4c4"}
          />
          {/* pins */}
          <line x1="27" y1="56" x2="27" y2="65" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" />
          <line x1="37" y1="56" x2="37" y2="65" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {/* shine rays when on */}
        {on && (
          <div className="absolute inset-0 flex items-start justify-center pt-1 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-emerald-300/20 animate-ping" />
          </div>
        )}
      </div>
      <span
        className={`text-xs font-bold uppercase tracking-wider ${
          on ? "text-emerald-600" : "text-stone-400"
        }`}
      >
        D6 LED — {on ? "ON" : "OFF"}
      </span>
    </div>
  );
}

// ─── MotorButton ──────────────────────────────────────────────────────────────

function MotorButton({
  motorRunning,
  espOnline,
  countdown,
  onRun,
  loading,
}: {
  motorRunning: boolean;
  espOnline: boolean;
  countdown: number;
  onRun: () => void;
  loading: boolean;
}) {
  const disabled = !espOnline || motorRunning || loading;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        id="run-motor-btn"
        onClick={onRun}
        disabled={disabled}
        className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 font-bold text-sm transition-all duration-300 border-4 shadow-lg
          ${
            motorRunning
              ? "bg-amber-50 border-amber-400 text-amber-700 cursor-default"
              : disabled
              ? "bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed"
              : "bg-emerald-900 border-emerald-700 text-white hover:bg-emerald-800 hover:scale-105 active:scale-95 cursor-pointer shadow-emerald-900/20"
          }
        `}
      >
        {loading ? (
          <RefreshCw className="w-8 h-8 animate-spin" />
        ) : motorRunning ? (
          <>
            <CircleStop className="w-8 h-8" />
            <span>Running…</span>
            <span className="text-2xl font-mono font-black">{countdown}s</span>
          </>
        ) : (
          <>
            <CirclePlay className="w-8 h-8" />
            <span>Run Motor</span>
            <span className="text-xs opacity-70">10 seconds</span>
          </>
        )}

        {/* pulse ring when running */}
        {motorRunning && (
          <span className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping opacity-30" />
        )}
      </button>

      <p className="text-xs text-stone-400 text-center max-w-[160px]">
        {!espOnline
          ? "ESP8266 offline — connect hardware first"
          : motorRunning
          ? "Motor active — D6 LED is OFF"
          : "Click to run motor for 10 seconds"}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkPage() {
  const [deviceData, setDeviceData] = useState<DeviceStatus>({ online: false, status: null });
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [localMotorRunning, setLocalMotorRunning] = useState(false);
  const [localCountdown, setLocalCountdown] = useState(0);

  // ── Poll device status every 3s ──
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/iot/device/status?deviceId=work-demo-01", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setDeviceData(data);
        setLastUpdated(new Date());
        // Sync motor state from hardware telemetry
        if (data.status?.pump) {
          setLocalMotorRunning(true);
          setLocalCountdown(data.status.remainingSeconds ?? 10);
        } else {
          setLocalMotorRunning(false);
        }
      }
    } catch {
      // Silently fail — device may be offline
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 3000);
    return () => clearInterval(id);
  }, [fetchStatus]);

  // ── Local countdown ticker ──
  useEffect(() => {
    if (!localMotorRunning) {
      setLocalCountdown(0);
      return;
    }
    if (localCountdown <= 0) {
      setLocalMotorRunning(false);
      return;
    }
    const t = setTimeout(() => setLocalCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [localMotorRunning, localCountdown]);

  // ── Send run_motor command ──
  const handleRunMotor = async () => {
    if (loading || localMotorRunning) return;
    setLoading(true);
    try {
      const res = await fetch("/api/iot/device/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: "work-demo-01",
          action: "run_motor",
          grid: 1,
        }),
      });
      if (res.ok) {
        // Optimistic local update
        setLocalMotorRunning(true);
        setLocalCountdown(10);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  // ── Derived state ──
  const espOnline = deviceData.online;
  const status    = deviceData.status;
  const motorRunning = localMotorRunning || (status?.pump ?? false);
  const d6LedOn   = espOnline && !motorRunning;   // LED ON when connected & motor idle
  const rssi      = status?.rssi ?? -99;
  const signal    = rssiToStrength(rssi);

  const timeSince = lastUpdated
    ? Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
    : null;

  return (
    <div className="min-h-screen bg-[#f8f8f7] text-stone-900 font-sans">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#f8f8f7]/90 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center gap-4">
          <Link href="/" className="text-stone-400 hover:text-stone-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-900 text-white text-[10px] font-black flex items-center justify-center">
              SQ
            </div>
            <span className="font-bold text-sm text-stone-900">SolariQ</span>
            <span className="text-stone-300 text-sm">/</span>
            <span className="text-sm text-stone-500">Live Hardware Demo</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                espOnline
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  espOnline ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
                }`}
              />
              {espOnline ? "Hardware Online" : "Hardware Offline"}
            </span>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-5 py-8 space-y-8">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            IoT Live Prototype Control
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            NodeMCU ESP8266 · L298N Motor Driver · 3V Pump · LED D6
            {timeSince !== null && (
              <span className="ml-2 text-stone-400">
                · Last sync {timeSince}s ago
              </span>
            )}
          </p>
        </div>

        {/* ── Status Grid ─────────────────────────────────────────── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatusCard
            icon={<Cpu className="w-5 h-5" />}
            label="ESP8266"
            value={espOnline ? "Connected" : "Offline"}
            active={espOnline}
            pulse
            sub={espOnline ? `Node IP active` : "Polling…"}
          />
          <StatusCard
            icon={<Sun className="w-5 h-5" />}
            label="Solar"
            value={espOnline ? "Connected" : "—"}
            active={espOnline}
            sub="485W Canal-Top Array"
          />
          <StatusCard
            icon={<Wifi className="w-5 h-5" />}
            label="Wi-Fi Signal"
            value={espOnline ? signal.label : "—"}
            active={espOnline}
            sub={espOnline ? `${rssi} dBm` : ""}
          />
          <StatusCard
            icon={<Activity className="w-5 h-5" />}
            label="Motor"
            value={motorRunning ? "Running" : "Idle"}
            active={motorRunning}
            pulse={motorRunning}
            sub={motorRunning ? `${localCountdown}s remaining` : "Awaiting command"}
          />
        </section>

        {/* ── Main Demo Panel ──────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12 justify-center">

            {/* LED indicator */}
            <div className="flex flex-col items-center gap-1">
              <LedIndicator on={d6LedOn} />
              <span className="text-[10px] text-stone-400 mt-1">GPIO 12 (Pin D6)</span>
            </div>

            {/* Divider */}
            <div className="hidden sm:flex flex-col items-center gap-1 text-stone-200">
              <Zap className="w-5 h-5 text-stone-300" />
              <div className="w-px h-16 bg-stone-100" />
            </div>

            {/* Run button */}
            <MotorButton
              motorRunning={motorRunning}
              espOnline={espOnline}
              countdown={localCountdown}
              onRun={handleRunMotor}
              loading={loading}
            />

          </div>

          {/* Behaviour explanation */}
          <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-500">
            <div className="flex gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong className="text-stone-700">Idle:</strong> D6 LED stays ON — shows ESP is alive and connected.</span>
            </div>
            <div className="flex gap-2">
              <CirclePlay className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong className="text-stone-700">Motor ON:</strong> D6 LED turns OFF — motor draws power for 10 seconds.</span>
            </div>
            <div className="flex gap-2">
              <Timer className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong className="text-stone-700">Auto-Stop:</strong> After 10s, motor stops and D6 LED turns back ON.</span>
            </div>
          </div>
        </section>

        {/* ── Connection Chain ─────────────────────────────────────── */}
        <section className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <p className="text-[11px] uppercase tracking-widest text-stone-400 font-bold mb-3">
            Signal Chain
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {[
              { label: "Browser", active: true },
              { label: "→" },
              { label: "Vercel API", active: true },
              { label: "→" },
              { label: "Hotspot", active: espOnline },
              { label: "→" },
              { label: "ESP8266 (D1/D6)", active: espOnline },
              { label: "→" },
              { label: "L298N IN1", active: motorRunning },
              { label: "→" },
              { label: "Motor", active: motorRunning },
            ].map((node, i) =>
              node.label === "→" ? (
                <span key={i} className="text-stone-300">→</span>
              ) : (
                <span
                  key={i}
                  className={`px-2.5 py-1 rounded-full border font-semibold transition-all ${
                    node.active
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-white border-stone-200 text-stone-400"
                  }`}
                >
                  {node.label}
                </span>
              )
            )}
          </div>
        </section>

        {/* ── Offline Banner ───────────────────────────────────────── */}
        {!espOnline && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
            <WifiOff className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900">Hardware Not Detected</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Flash <code className="bg-amber-100 px-1 rounded">work-project.ino</code> to your
                NodeMCU ESP8266, connect it to Wi-Fi network <strong>Labonno</strong>, and make
                sure the Next.js server is reachable at the configured <code>API_BASE_URL</code>.
                The LED will turn solid green once connected.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
