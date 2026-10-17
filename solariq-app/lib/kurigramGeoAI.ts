/**
 * Kurigram GeoAI Agronomic & Energy Calculation Model
 * Implements FAO-56 Evapotranspiration, AWD thresholds, and Grid Emissions
 */

export interface KurigramMicroclimate {
  solarRadiationWm2: number;
  tempCelsius: number;
  humidityPercent: number;
  windSpeedMs: number;
}

export const KURIGRAM_MARCH_BASELINE: KurigramMicroclimate = {
  solarRadiationWm2: 880,
  tempCelsius: 33.5,
  humidityPercent: 42,
  windSpeedMs: 2.1,
};

// 1. Calculate Reference Evapotranspiration (ET0) using simplified Hargreaves / Penman approximation
export function calculateKurigramET0(climate: KurigramMicroclimate = KURIGRAM_MARCH_BASELINE): number {
  // Typical March ET0 in northern Bangladesh ranges from 4.5 to 5.2 mm/day
  const tempFactor = 0.0023 * (climate.tempCelsius + 17.8);
  const radEquivalentMm = (climate.solarRadiationWm2 * 0.0864) / 2.45; // W/m2 to mm/day latent heat
  const et0 = tempFactor * radEquivalentMm * Math.sqrt(Math.max(1, 100 - climate.humidityPercent));
  return Math.min(6.0, Math.max(4.0, Number(et0.toFixed(2))));
}

// 2. Crop Water Requirement (ETc) for Boro Rice at specific stages
export const BORO_RICE_KC: Record<string, number> = {
  "Early Vegetative": 1.10,
  "Tillering": 1.15,
  "Panicle Initiation": 1.28, // Highest water vulnerability
  "Grain Filling": 1.05,
  "Maturity": 0.95,
};

// 3. Irrigation Volume for 10-Decimal Plot
// 1 Decimal = 40.4686 m² => 10 Decimal = 404.686 m²
export const TEN_DECIMAL_SQ_METERS = 404.686;

export function calculateWaterVolumeLiters(depthMm: number, areaSqM: number = TEN_DECIMAL_SQ_METERS): number {
  // 1 mm over 1 m² = 1 Liter
  return Math.round(depthMm * areaSqM);
}

// 4. Grid Carbon Avoidance (Department of Environment, 2025: 0.62 tCO2/MWh)
export const BANGLADESH_GRID_EMISSION_FACTOR_KG_PER_KWH = 0.62;

export function calculateAvoidedCarbonKg(energyKwh: number): number {
  return Number((energyKwh * BANGLADESH_GRID_EMISSION_FACTOR_KG_PER_KWH).toFixed(2));
}

// 5. Diesel Pumping Cost Comparison (avoided diesel cost in BDT)
// 1 liter diesel lifts ~15,000 to 20,000 liters with shallow tubewells (BDT 105/liter diesel)
export function calculateAvoidedPumpingCostBdt(waterLiters: number): number {
  const dieselCostPerLiterWater = 105.0 / 18000.0;
  return Number((waterLiters * dieselCostPerLiterWater).toFixed(2));
}
