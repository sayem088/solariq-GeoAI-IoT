import { create } from "zustand";

export type OperationalStep = 1 | 2 | 3 | 4 | 5;
export type ScenarioMode = "summer-dry" | "kurigram-dry" | "monsoon-rain" | "winter-micro" | "night-standby";
export type DeploymentLocation = "kurigram" | "barind" | "kushtia-gk" | "universal";

export interface LocationProfile {
  id: DeploymentLocation;
  name: string;
  region: string;
  canalSystem: string;
  coordinates: string;
  cropFocus: string;
  waterStress: string;
  depthMeters: number;
}

export const locationProfiles: Record<DeploymentLocation, LocationProfile> = {
  kurigram: {
    id: "kurigram",
    name: "Kurigram Pilot 01",
    region: "Rangpur Division",
    canalSystem: "Teesta-Jamuna Irrigation Reach (BWDB)",
    coordinates: "25.80°N, 89.62°E",
    cropFocus: "Boro Rice (BRRI dhan29) under AWD",
    waterStress: "Severe March Dryness",
    depthMeters: 1.85,
  },
  barind: {
    id: "barind",
    name: "Barind Deployment 02",
    region: "Rajshahi Division",
    canalSystem: "Barind High Drought Canal Reach",
    coordinates: "24.50°N, 88.50°E",
    cropFocus: "Deep Aquifer Protection & Mixed Crops",
    waterStress: "Critical Groundwater Deficit",
    depthMeters: 1.40,
  },
  "kushtia-gk": {
    id: "kushtia-gk",
    name: "Kushtia GK Reach 03",
    region: "Khulna Division",
    canalSystem: "Ganges-Kobodak Main Canal",
    coordinates: "23.90°N, 89.12°E",
    cropFocus: "River Diversion & Rice AWD",
    waterStress: "High Seasonal Evaporation",
    depthMeters: 2.10,
  },
  universal: {
    id: "universal",
    name: "Universal Scalable Reach",
    region: "Modular Canal Grid",
    canalSystem: "Generalized Canal Airspace & Rootzone",
    coordinates: "Standard Basin Model",
    cropFocus: "Universal Rootzone AWD & Net Metering",
    waterStress: "Configurable Hydrology",
    depthMeters: 1.85,
  },
};

export interface PlotData {
  id: number;
  name: string;
  variety: string;
  areaDecimal: number;
  transplantAgeDays: number;
  moisture: number;
  targetMoisture: number;
  awdTubeCm: number;
  cropStage: string;
  isWatering: boolean;
}

interface NexusState {
  // Scenario & Step State
  step: OperationalStep;
  scenarioMode: ScenarioMode;
  
  // Power & Hydraulics
  solarWatts: number;
  pumpWatts: number;
  gridWatts: number;
  flowRateLpm: number;
  canalDepthMeters: number;
  evapReductionPercent: number;
  
  // Active Operation
  activePlotId: number;
  timerSecondsRemaining: number;
  isPumpRunning: boolean;
  isWarningArmed: boolean;
  
  // 6 Agricultural Plots Matrix (Kurigram Testbed)
  plots: PlotData[];

  // Environmental Sensors
  irradianceWm2: number;
  airTempC: number;
  rainDetected: boolean;
  rainMm: number;

  // Impact Tickers
  savedToday: {
    waterLiters: number;
    pumpKwhAvoided: number;
    gridExportKwh: number;
    moneyBdt: number;
    co2Kg: number;
    ch4ReductionPercent: number;
  };
  
  futurePredicted: {
    seasonalWaterLiters: number;
    seasonalGridKwh: number;
    seasonalMoneyBdt: number;
    seasonalCo2Kg: number;
    pilotWaterM3Year: number;
    pilotGridMwhYear: number;
    pilotRevenueBdtYear: number;
    pilotCo2TonsYear: number;
  };

  // Active Inspection Hotspot
  inspectedComponent: "canopy" | "canal" | "pump" | "edge-ai" | "manifold" | "plots" | "grid" | null;
  setInspectedComponent: (comp: "canopy" | "canal" | "pump" | "edge-ai" | "manifold" | "plots" | "grid" | null) => void;

  // Active Deployment Location Profile (Kurigram as active testbed)
  selectedLocation: DeploymentLocation;
  setLocation: (loc: DeploymentLocation) => void;

  // Actions
  setStep: (step: OperationalStep) => void;
  setScenarioMode: (mode: ScenarioMode) => void;
  setActivePlot: (plotId: number) => void;
  startPlot4Irrigation: () => void;
  switchToPlot: (nextPlotId: number) => void;
  triggerSmartShutoff: () => void;
  tickTimer: () => void;
  resetCycle: () => void;
}

const initialPlots: PlotData[] = [
  {
    id: 1,
    name: "Plot 1",
    variety: "Boro Rice (BRRI dhan29)",
    areaDecimal: 10,
    transplantAgeDays: 18,
    moisture: 48,
    targetMoisture: 60,
    awdTubeCm: -6,
    cropStage: "Tillering",
    isWatering: false,
  },
  {
    id: 2,
    name: "Plot 2",
    variety: "Boro Rice (BRRI dhan29)",
    areaDecimal: 10,
    transplantAgeDays: 22,
    moisture: 52,
    targetMoisture: 60,
    awdTubeCm: -4,
    cropStage: "Tillering",
    isWatering: false,
  },
  {
    id: 3,
    name: "Plot 3",
    variety: "Boro Rice (BRRI dhan29)",
    areaDecimal: 10,
    transplantAgeDays: 14,
    moisture: 65,
    targetMoisture: 60,
    awdTubeCm: +2,
    cropStage: "Early Vegetative",
    isWatering: false,
  },
  {
    id: 4,
    name: "Plot 4",
    variety: "Boro Rice (BRRI dhan29)",
    areaDecimal: 10,
    transplantAgeDays: 26,
    moisture: 28,
    targetMoisture: 60,
    awdTubeCm: -15, // Critical AWD threshold
    cropStage: "Panicle Initiation",
    isWatering: false,
  },
  {
    id: 5,
    name: "Plot 5",
    variety: "Boro Rice (BRRI dhan29)",
    areaDecimal: 10,
    transplantAgeDays: 20,
    moisture: 34,
    targetMoisture: 60,
    awdTubeCm: -12,
    cropStage: "Tillering",
    isWatering: false,
  },
  {
    id: 6,
    name: "Plot 6",
    variety: "Boro Rice (BRRI dhan29)",
    areaDecimal: 10,
    transplantAgeDays: 16,
    moisture: 58,
    targetMoisture: 60,
    awdTubeCm: -2,
    cropStage: "Vegetative",
    isWatering: false,
  },
];

export const useNexusStore = create<NexusState>((set, get) => ({
  step: 1,
  scenarioMode: "summer-dry",
  selectedLocation: "kurigram",
  setLocation: (loc) => set({ selectedLocation: loc, canalDepthMeters: locationProfiles[loc].depthMeters }),
  
  solarWatts: 485,
  pumpWatts: 0,
  gridWatts: 485,
  flowRateLpm: 0,
  canalDepthMeters: 1.85,
  evapReductionPercent: 72,

  activePlotId: 4,
  timerSecondsRemaining: 600, // 10 minutes total
  isPumpRunning: false,
  isWarningArmed: false,

  plots: initialPlots,

  inspectedComponent: "plots",
  setInspectedComponent: (comp) => set({ inspectedComponent: comp }),

  irradianceWm2: 880,
  airTempC: 33.5,
  rainDetected: false,
  rainMm: 0,

  savedToday: {
    waterLiters: 185,
    pumpKwhAvoided: 0.12,
    gridExportKwh: 2.85,
    moneyBdt: 48.5,
    co2Kg: 1.77,
    ch4ReductionPercent: 35,
  },

  futurePredicted: {
    seasonalWaterLiters: 42500,
    seasonalGridKwh: 385,
    seasonalMoneyBdt: 5820,
    seasonalCo2Kg: 238.7,
    pilotWaterM3Year: 4658,
    pilotGridMwhYear: 114.2,
    pilotRevenueBdtYear: 1250000,
    pilotCo2TonsYear: 78.0,
  },

  setStep: (step) => {
    if (step === 1) {
      set({
        step: 1,
        isPumpRunning: false,
        pumpWatts: 0,
        gridWatts: 485,
        flowRateLpm: 0,
        timerSecondsRemaining: 600,
        isWarningArmed: false,
        plots: get().plots.map((p) => ({ ...p, isWatering: false })),
      });
    } else if (step === 2) {
      get().startPlot4Irrigation();
    } else if (step === 3) {
      set({
        step: 3,
        isPumpRunning: true,
        pumpWatts: 120,
        gridWatts: 365,
        flowRateLpm: 42.0,
        timerSecondsRemaining: 300, // midway (5 min)
        isWarningArmed: false,
        plots: get().plots.map((p) => ({
          ...p,
          isWatering: p.id === get().activePlotId,
          moisture: p.id === 4 ? 44 : p.moisture,
        })),
      });
    } else if (step === 4) {
      set({
        step: 4,
        isPumpRunning: true,
        pumpWatts: 120,
        gridWatts: 365,
        flowRateLpm: 42.0,
        timerSecondsRemaining: 60, // 1 min left (minute 9 elapsed)
        isWarningArmed: true,
        plots: get().plots.map((p) => ({
          ...p,
          isWatering: p.id === get().activePlotId,
          moisture: p.id === 4 ? 56 : p.moisture,
        })),
      });
    } else if (step === 5) {
      get().triggerSmartShutoff();
    }
  },

  setScenarioMode: (mode) => {
    if (mode === "monsoon-rain") {
      set({
        scenarioMode: mode,
        rainDetected: true,
        rainMm: 42,
        solarWatts: 215,
        pumpWatts: 0,
        gridWatts: 215, // 100% bypassed to grid
        flowRateLpm: 0,
        isPumpRunning: false,
        isWarningArmed: false,
        plots: get().plots.map((p) => ({ ...p, isWatering: false })),
      });
    } else if (mode === "winter-micro") {
      set({
        scenarioMode: mode,
        rainDetected: false,
        rainMm: 0,
        solarWatts: 390,
        pumpWatts: 60,
        gridWatts: 330,
        flowRateLpm: 20.0,
        isPumpRunning: true,
        plots: get().plots.map((p) => ({ ...p, isWatering: p.id === 1 })),
      });
    } else if (mode === "night-standby") {
      set({
        scenarioMode: mode,
        solarWatts: 0,
        pumpWatts: 0,
        gridWatts: 0,
        flowRateLpm: 0,
        isPumpRunning: false,
        isWarningArmed: false,
        plots: get().plots.map((p) => ({ ...p, isWatering: false })),
      });
    } else {
      // kurigram-dry (default)
      set({
        scenarioMode: "kurigram-dry",
        rainDetected: false,
        rainMm: 0,
        solarWatts: 485,
        pumpWatts: 0,
        gridWatts: 485,
        flowRateLpm: 0,
        step: 1,
      });
    }
  },

  setActivePlot: (plotId) => {
    set({
      activePlotId: plotId,
      plots: get().plots.map((p) => ({
        ...p,
        isWatering: p.id === plotId && get().isPumpRunning,
      })),
    });
  },

  startPlot4Irrigation: () => {
    set({
      step: 2,
      activePlotId: 4,
      isPumpRunning: true,
      pumpWatts: 120,
      gridWatts: 365, // X = 365W exported
      flowRateLpm: 42.0,
      timerSecondsRemaining: 600,
      isWarningArmed: false,
      plots: get().plots.map((p) => ({
        ...p,
        isWatering: p.id === 4,
      })),
    });

    // Auto-dispatch command to physical ESP8266 IoT device
    if (typeof window !== "undefined") {
      fetch("/api/iot/device/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: "irrigation-01",
          action: "pump_on",
          grid: 4,
        }),
      }).catch(() => {});
    }
  },

  switchToPlot: (nextPlotId) => {
    set({
      activePlotId: nextPlotId,
      isWarningArmed: false,
      timerSecondsRemaining: 600,
      plots: get().plots.map((p) => ({
        ...p,
        isWatering: p.id === nextPlotId,
        moisture: p.id === 4 ? 60 : p.moisture, // Plot 4 satisfied
        awdTubeCm: p.id === 4 ? 3 : p.awdTubeCm,
      })),
    });
  },

  triggerSmartShutoff: () => {
    set({
      step: 5,
      isPumpRunning: false,
      pumpWatts: 0,
      gridWatts: 485, // X + Y Dynamic Grid Bypass: 365W + 120W = 485W
      flowRateLpm: 0,
      timerSecondsRemaining: 0,
      isWarningArmed: false,
      plots: get().plots.map((p) => ({
        ...p,
        isWatering: false,
        moisture: p.id === 4 ? 60 : p.moisture,
        awdTubeCm: p.id === 4 ? 3 : p.awdTubeCm,
      })),
    });

    // Auto-dispatch shutoff command to physical ESP8266 IoT device
    if (typeof window !== "undefined") {
      fetch("/api/iot/device/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: "irrigation-01",
          action: "pump_off",
        }),
      }).catch(() => {});
    }
  },

  tickTimer: () => {
    const { timerSecondsRemaining, isPumpRunning, step } = get();
    if (!isPumpRunning || timerSecondsRemaining <= 0) return;

    const nextSec = timerSecondsRemaining - 1;
    if (nextSec === 60 && step < 4) {
      // Reached minute 9 (60 seconds left) -> trigger warning!
      set({ step: 4, isWarningArmed: true, timerSecondsRemaining: nextSec });
    } else if (nextSec <= 0) {
      // Reached 10 minutes -> auto shutoff!
      get().triggerSmartShutoff();
    } else {
      set({ timerSecondsRemaining: nextSec });
    }
  },

  resetCycle: () => {
    set({
      step: 1,
      isPumpRunning: false,
      pumpWatts: 0,
      gridWatts: 485,
      flowRateLpm: 0,
      timerSecondsRemaining: 600,
      isWarningArmed: false,
      activePlotId: 4,
      plots: initialPlots,
    });
  },
}));
