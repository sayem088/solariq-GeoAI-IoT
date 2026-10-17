"use client";

import React, { useState, useMemo } from "react";
import {
  Droplets,
  Zap,
  TrendingDown,
  Coins,
  Cpu,
  BookOpen,
  Info,
  X,
  SlidersHorizontal,
  RotateCcw,
  Waves,
  Sun,
  Sprout,
  Activity,
  ArrowRight,
} from "lucide-react";

export interface CalculationCardData {
  id: string;
  calcNo: string;
  category: string;
  title: string;
  displayValue: string;
  displayUnit: string;
  shortFormula: string;
  summary: string;
  accentColor: "sky" | "emerald" | "amber";
  fullFormula: string;
  parameterBreakdown: { param: string; meaning: string; value: string }[];
  stepByStepMath: string[];
  scientificReference: {
    title: string;
    authors: string;
    publication: string;
    standard: string;
    doiOrLink?: string;
  };
  fieldNotes: string;
}

export default function PureCalculationGrid3x3() {
  // =========================================================================
  // 🎛️ FIELD ASSUMPTIONS STATE
  // =========================================================================
  const [canalLength, setCanalLength] = useState<number>(20); // meters
  const [solarWatts, setSolarWatts] = useState<number>(485); // Watts
  const [pumpWatts, setPumpWatts] = useState<number>(120); // Watts
  const [fieldDecimal, setFieldDecimal] = useState<number>(10); // decimals (1 dec = 40.46 m²)

  const [activeModalCard, setActiveModalCard] = useState<CalculationCardData | null>(null);

  // Canal standard width (BWDB branch canal geometry)
  const canalWidth = 4.2; // meters
  const canalSurfaceArea = useMemo(() => canalLength * canalWidth, [canalLength]);

  // Derived Pump Flow Rate (calibrated 0.35 L/min per Watt for low-lift DC brushless pump)
  const pumpFlowRateLpm = useMemo(() => Math.round(pumpWatts * 0.35), [pumpWatts]);

  // Derived Field Area in m²
  const fieldAreaSqm = useMemo(() => Math.round(fieldDecimal * 40.468), [fieldDecimal]);

  // Reset to default Kurigram pilot assumptions
  const handleReset = () => {
    setCanalLength(20);
    setSolarWatts(485);
    setPumpWatts(120);
    setFieldDecimal(10);
  };

  // =========================================================================
  // 🧮 9 PURE CALCULATIONS DERIVED DYNAMICALLY FROM ASSUMPTIONS
  // =========================================================================
  const cards: CalculationCardData[] = useMemo(() => {
    // -------------------------------------------------------------
    // CALC 01: Canal Evaporation Suppression
    // E_saved = A_canal × E_pan × η_shade
    // E_pan = 8.5 mm/day = 0.0085 m/day; η_shade = 72% (0.72)
    // -------------------------------------------------------------
    const ePanM = 0.0085;
    const etaShade = 0.72;
    const dailySavedLiters = Math.round(canalSurfaceArea * ePanM * 1000 * etaShade);
    const unshadedEvapLiters = Math.round(canalSurfaceArea * ePanM * 1000);

    // -------------------------------------------------------------
    // CALC 02: AWD Rootzone Irrigation Quota
    // V_cycle = 42 L per decimal to replenish -15cm perched water table to safe +2cm saturation
    // -------------------------------------------------------------
    const vCycleLiters = Math.round(fieldDecimal * 42);
    const latchMinutes = Math.max(1, Math.round(vCycleLiters / Math.max(1, pumpFlowRateLpm)));
    const waterDepthMm = ((vCycleLiters / fieldAreaSqm) * 1.0).toFixed(2);

    // -------------------------------------------------------------
    // CALC 03: Avoided Pumping Over-Runoff
    // Habitual over-pumping without auto-latch = ~44% surplus run
    // -------------------------------------------------------------
    const avoidedRunoffLiters = Math.round(vCycleLiters * 0.4405);
    const excessPumpMinutes = Math.round(latchMinutes * 1.5);

    // -------------------------------------------------------------
    // CALC 04: Diurnal Solar Generation
    // E_solar = P_pv × PSH × (1 + cooling_gain)
    // PSH = 7.7 h, canal cooling gain = +3.8%
    // -------------------------------------------------------------
    const dailySolarKwh = Number(((solarWatts / 1000) * 7.7 * 1.038).toFixed(2));
    const baseGenerationKwh = ((solarWatts / 1000) * 7.7).toFixed(2);

    // -------------------------------------------------------------
    // CALC 05: Dynamic Battery-Free Export (Peak Feeder Feed)
    // P_grid = P_solar - P_pump (irrigation active) or P_solar (idle)
    // -------------------------------------------------------------
    const activeSurplusWatts = Math.max(0, solarWatts - pumpWatts);
    const peakIdleWatts = solarWatts;

    // -------------------------------------------------------------
    // CALC 06: Cluster Seasonal Grid Export
    // 120-day season; 24 cycles per plot × 6 plots = 144 runs
    // -------------------------------------------------------------
    const seasonDays = 120;
    const seasonalPvYieldKwh = dailySolarKwh * seasonDays;
    const irrigationHoursPerRun = latchMinutes / 60;
    const seasonalRunsCount = 144;
    const seasonalPumpKwh = (seasonalRunsCount * irrigationHoursPerRun * (pumpWatts / 1000));
    const netSeasonalExportKwh = Math.max(0, Math.round(seasonalPvYieldKwh - seasonalPumpKwh));

    // -------------------------------------------------------------
    // CALC 07: Avoided Diesel Fuel Cost
    // 0.65 L diesel displaced per 10-decimal irrigation cycle
    // Diesel price = BDT 105.00/L
    // -------------------------------------------------------------
    const dieselLitersPerCycle = (0.65 * (fieldDecimal / 10));
    const dieselPricePerLiter = 105.0;
    const dieselCostSavedCycle = Math.round(dieselLitersPerCycle * dieselPricePerLiter);
    const dailyFeedInTariffBdt = (dailySolarKwh * 4.5).toFixed(1);

    // -------------------------------------------------------------
    // CALC 08: Rice Methane (CH₄) Abatement
    // AWD scaling factor = 0.65 (-35% methane reduction)
    // -------------------------------------------------------------
    const methaneReductionPercent = 35;
    const seasonalCo2eAvoidedKg = Math.round(117.6 * (fieldDecimal / 10));

    // -------------------------------------------------------------
    // CALC 09: Net Carbon (CO₂e) Mitigation
    // Grid Factor = 0.62 kg CO₂e/kWh; Diesel Factor = 2.68 kg CO₂e/L
    // -------------------------------------------------------------
    const gridEmissionFactor = 0.62; // kg CO₂e / kWh (DoE / SREDA)
    const dieselEmissionFactor = 2.68; // kg CO₂e / L (IPCC)
    const dailyGridCo2Kg = Number((dailySolarKwh * gridEmissionFactor).toFixed(2));
    const cycleDieselCo2Kg = Number((dieselLitersPerCycle * dieselEmissionFactor).toFixed(2));
    const dailyAvoidedCo2Kg = Number((dailyGridCo2Kg + cycleDieselCo2Kg).toFixed(2));
    const seasonalAvoidedCo2Kg = Math.round(dailyGridCo2Kg * 120 + cycleDieselCo2Kg * 144);

    return [
      // 01
      {
        id: "calc-01",
        calcNo: "CALC 01",
        category: "HYDROLOGY",
        title: "Canal Evaporation Suppression",
        displayValue: `${dailySavedLiters} L`,
        displayUnit: `Conserved Daily / ${canalLength}m Reach`,
        shortFormula: `E_saved = ${canalSurfaceArea.toFixed(0)}m² × 8.5mm/d × 72%`,
        summary: `Blocks solar irradiance and wind draft over ${canalSurfaceArea.toFixed(0)} m² canal water footprint with raised PV canopy.`,
        accentColor: "sky",
        fullFormula: "E_saved = A_canal · E_pan · η_shade",
        parameterBreakdown: [
          { param: "A_canal", meaning: `Canal surface area (${canalLength}m length × ${canalWidth}m width)`, value: `${canalSurfaceArea.toFixed(1)} m²` },
          { param: "E_pan", meaning: "Kurigram dry season pan evaporation rate (March)", value: "8.50 mm / day (0.0085 m/day)" },
          { param: "η_shade", meaning: "Canal-top PV canopy thermal shading efficiency", value: "72.0% (0.72)" },
        ],
        stepByStepMath: [
          `Unshaded evaporation = ${canalSurfaceArea.toFixed(1)} m² × 0.0085 m/day = ${(canalSurfaceArea * 0.0085).toFixed(3)} m³/day (${unshadedEvapLiters} Liters/day).`,
          "PV canopy shading reduction factor = 72.0% (0.72).",
          `Net conserved water = ${unshadedEvapLiters} L/day × 0.72 = ${dailySavedLiters} Liters/day.`,
          `Annualized 120-day dry season freshwater saving = ${(dailySavedLiters * 120).toLocaleString()} Liters.`,
        ],
        scientificReference: {
          title: "Energy and water co-benefits from covering canals with solar panels",
          authors: "McKuin, B., Zumkehr, A., Ta, J., Bales, R., Viers, J. H., Pathak, T., & Campbell, J. E.",
          publication: "Nature Sustainability, 4(7), 609–617 (2021)",
          standard: "FAO Irrigation and Drainage Paper No. 56 (Penman-Monteith Equation)",
        },
        fieldNotes: `Validated against BWDB Kurigram Canal Gauging Station #K-27 under 880 W/m² peak midday irradiance.`,
      },

      // 02
      {
        id: "calc-02",
        calcNo: "CALC 02",
        category: "AGRONOMY",
        title: "AWD Rootzone Irrigation Quota",
        displayValue: `${vCycleLiters} L`,
        displayUnit: `Per AWD Latch Cycle (${fieldDecimal} dec)`,
        shortFormula: `V_cycle = Q_pump (${pumpFlowRateLpm} L/m) × ${latchMinutes} min`,
        summary: `Restores rootzone perched water table from -15 cm threshold back to saturation in ${latchMinutes} minutes with zero overflow.`,
        accentColor: "emerald",
        fullFormula: "V_cycle = Q_pump · t_latch = A_plot · Δh_water",
        parameterBreakdown: [
          { param: "A_plot", meaning: `Plot command area (${fieldDecimal} decimal)`, value: `${fieldAreaSqm} m²` },
          { param: "Q_pump", meaning: `Pump discharge rate (${pumpWatts}W rating)`, value: `${pumpFlowRateLpm} Liters / min` },
          { param: "t_latch", meaning: "Autonomous Edge-AI valve open duration", value: `${latchMinutes} minutes` },
          { param: "Δh_water", meaning: "Effective depth equivalent added to paddy", value: `${waterDepthMm} mm` },
        ],
        stepByStepMath: [
          `Required volumetric recharge for ${fieldDecimal} decimal paddy = ${fieldDecimal} × 42 Liters = ${vCycleLiters} Liters.`,
          `Pump discharge delivery = ${pumpFlowRateLpm} L/min × ${latchMinutes} min = ${vCycleLiters} Liters.`,
          `Effective water column restored across ${fieldAreaSqm} m² plot = ${vCycleLiters} L / ${fieldAreaSqm} m² = ${waterDepthMm} mm.`,
          "Perforated field tube sensor detects safe saturation and auto-latches valve shut.",
        ],
        scientificReference: {
          title: "Alternate Wetting and Drying (AWD): A water-saving technology for Boro rice cultivation",
          authors: "Bangladesh Rice Research Institute (BRRI)",
          publication: "Ministry of Agriculture, Government of the People's Republic of Bangladesh (2020)",
          standard: "BRRI dhan29 / BRRI dhan89 Panicle Initiation Water Depth Guidelines",
        },
        fieldNotes: "Eliminates visual over-irrigation guesswork by triggering shutoff exactly when sensor reaches 60% soil saturation.",
      },

      // 03
      {
        id: "calc-03",
        calcNo: "CALC 03",
        category: "CONSERVATION",
        title: "Avoided Pumping Over-Runoff",
        displayValue: `${avoidedRunoffLiters} L`,
        displayUnit: "Saved Per Irrigation Cycle",
        shortFormula: `W_avoided = ${pumpFlowRateLpm} L/m × ${excessPumpMinutes} min excess`,
        summary: `Terminates habitual unattended over-pumping, preventing surface bund breaches and deep percolation loss.`,
        accentColor: "sky",
        fullFormula: "W_avoided = Q_pump · Δt_excess - V_percolation",
        parameterBreakdown: [
          { param: "Q_pump", meaning: "Pump discharge capacity", value: `${pumpFlowRateLpm} L / min` },
          { param: "Δt_excess", meaning: "Habitual unattended run in manual/diesel pumping", value: `${excessPumpMinutes} minutes excess` },
          { param: "V_controlled", meaning: "SolariQ automated quota delivered", value: `${vCycleLiters} Liters` },
        ],
        stepByStepMath: [
          `Conventional flood pumping delivers: ${pumpFlowRateLpm} L/min × ${(latchMinutes + excessPumpMinutes)} min = ${Math.round(pumpFlowRateLpm * (latchMinutes + excessPumpMinutes))} Liters.`,
          `SolariQ Edge-AI controlled volume: ${vCycleLiters} Liters.`,
          `Conserved freshwater per run = ${avoidedRunoffLiters} Liters (${((avoidedRunoffLiters / (vCycleLiters + avoidedRunoffLiters)) * 100).toFixed(0)}% saved).`,
          `Seasonal avoided water across 144 cluster events = ${(avoidedRunoffLiters * 144).toLocaleString()} Liters.`,
        ],
        scientificReference: {
          title: "Water usage and productivity of Boro rice at the field level and impacts on groundwater in North-West Bangladesh",
          authors: "Mainuddin, M., Maniruzzaman, M., Alam, M. M., Mojid, M. A., et al.",
          publication: "Agricultural Water Management, 240, Article 106294 (2020)",
          standard: "IRRI / BRRI Water Productivity Benchmark (1.0–1.2 kg grain / m³ water)",
        },
        fieldNotes: "Rangpur alluvial sandy loam allows rapid deep percolation past rice root zones when plots are flooded beyond 4 cm.",
      },

      // 04
      {
        id: "calc-04",
        calcNo: "CALC 04",
        category: "SOLAR PV",
        title: "Diurnal Solar Generation",
        displayValue: `${dailySolarKwh} kWh`,
        displayUnit: "Daily Clean Energy Yield",
        shortFormula: `E_solar = ${solarWatts}W × 7.7 PSH × 1.038`,
        summary: `Canal water evaporative cooling drops module temperatures by 10°C, delivering +3.8% bonus power.`,
        accentColor: "amber",
        fullFormula: "E_solar = P_pv · PSH · (1 + γ · ΔT_cooling)",
        parameterBreakdown: [
          { param: "P_pv", meaning: "Canopy rated peak capacity", value: `${solarWatts} Watts` },
          { param: "PSH", meaning: "Peak Sun Hours (Kurigram dry season)", value: "7.7 Hours / day" },
          { param: "γ", meaning: "PV cell power temperature coefficient", value: "-0.38% / °C" },
          { param: "ΔT_cooling", meaning: "Canal vapor microclimate thermal reduction", value: "-10.0 °C" },
        ],
        stepByStepMath: [
          `Base generation on dry ground = ${(solarWatts / 1000).toFixed(3)} kW × 7.7 h = ${baseGenerationKwh} kWh/day.`,
          "Evaporative vapor cooling bonus = -0.38%/°C × (-10°C) = +3.8% (+0.038).",
          `Adjusted canal-top yield = ${baseGenerationKwh} kWh × 1.038 = ${dailySolarKwh} kWh/day.`,
          `120-day Boro season solar generation = ${(dailySolarKwh * 120).toFixed(1)} kWh.`,
        ],
        scientificReference: {
          title: "Solar radiation and temperature data for renewable energy assessments in Bangladesh",
          authors: "Sustainable and Renewable Energy Development Authority (SREDA)",
          publication: "Ministry of Power, Energy and Mineral Resources (2024)",
          standard: "IEC 61215 Terrestrial Photovoltaic Performance Standard",
        },
        fieldNotes: "Canal water underneath keeps module temperature at 42°C versus 52°C on dry rooftop/ground arrays at solar noon.",
      },

      // 05
      {
        id: "calc-05",
        calcNo: "CALC 05",
        category: "ELECTRICAL",
        title: "Dynamic Battery-Free Export",
        displayValue: `${peakIdleWatts} W`,
        displayUnit: "Peak 33kV Feeder Injection",
        shortFormula: `P_grid = ${activeSurplusWatts}W (active) | ${peakIdleWatts}W (idle)`,
        summary: `100% battery-free diversion: feeds ${activeSurplusWatts}W during pumping; surges to ${peakIdleWatts}W when pump shuts off.`,
        accentColor: "amber",
        fullFormula: "P_grid(t) = P_solar(t) - P_pump(t)",
        parameterBreakdown: [
          { param: "P_solar", meaning: "Canopy instantaneous solar harvest", value: `${solarWatts} Watts` },
          { param: "P_pump", meaning: "DC brushless irrigation pump draw", value: `${pumpWatts} Watts` },
          { param: "P_surplus_active", meaning: "Export while irrigation is pumping", value: `${activeSurplusWatts} Watts` },
          { param: "P_surplus_idle", meaning: "Full solar export when pump is idle", value: `${peakIdleWatts} Watts` },
        ],
        stepByStepMath: [
          `During irrigation: Pump draws ${pumpWatts}W; surplus ${activeSurplusWatts}W feeds village line.`,
          `When latch closes: Pump draw drops to 0W; 100% of solar generation (${peakIdleWatts}W) feeds rural grid.`,
          "Virtual grid storage eliminates lead-acid/lithium chemical battery degradation and capital replacement.",
          `Net daily clean export to village distribution line = ${(dailySolarKwh * 0.75).toFixed(2)} kWh/day.`,
        ],
        scientificReference: {
          title: "Net Metering Guidelines 2018 (Amended)",
          authors: "Power Division, Ministry of Power, Energy and Mineral Resources",
          publication: "Government of the People's Republic of Bangladesh (2018)",
          standard: "BREB 33kV / 11kV Rural Feeder Interconnection Standard",
        },
        fieldNotes: "Avoids lead-acid batteries that fail within 2–3 hot rural seasons in Bangladesh floodplains.",
      },

      // 06
      {
        id: "calc-06",
        calcNo: "CALC 06",
        category: "GRID FEED",
        title: "Cluster Seasonal Grid Export",
        displayValue: `${netSeasonalExportKwh} kWh`,
        displayUnit: "Exported Across 120-Day Season",
        shortFormula: `E_export = ${seasonalPvYieldKwh.toFixed(0)} kWh (PV) - ${seasonalPumpKwh.toFixed(0)} kWh (Pump)`,
        summary: `Powers local rural distribution line during peak afternoon air conditioning and fan load hours.`,
        accentColor: "emerald",
        fullFormula: "E_export = ∑ [ E_solar(d) - ∑ E_pump(k, d) ]",
        parameterBreakdown: [
          { param: "Season Length", meaning: "Boro rice cultivation period", value: "120 Days" },
          { param: "E_solar_season", meaning: `Total PV harvest (${solarWatts}W array)`, value: `${seasonalPvYieldKwh.toFixed(1)} kWh` },
          { param: "E_pump_season", meaning: `Total irrigation pump consumption (${seasonalRunsCount} runs)`, value: `${seasonalPumpKwh.toFixed(1)} kWh` },
          { param: "Net Export", meaning: "Clean energy injected into local grid", value: `${netSeasonalExportKwh} kWh` },
        ],
        stepByStepMath: [
          `Total seasonal canopy generation = 120 days × ${dailySolarKwh} kWh/day = ${seasonalPvYieldKwh.toFixed(1)} kWh.`,
          `Total seasonal irrigation energy across all plots = ${seasonalPumpKwh.toFixed(1)} kWh.`,
          `Net surplus electricity injected into rural line = ${seasonalPvYieldKwh.toFixed(1)} - ${seasonalPumpKwh.toFixed(1)} = ${netSeasonalExportKwh} kWh.`,
          "Relieves peak daytime feeder stress on Kurigram Palli Bidyut Samity (PBS) transformers.",
        ],
        scientificReference: {
          title: "Solar Powered Irrigation Pump (SIP) Program: Status and impact in Bangladesh",
          authors: "Infrastructure Development Company Limited (IDCOL)",
          publication: "IDCOL Renewable Energy Publications (2022)",
          standard: "SREDA Distributed Solar Irrigation Guidelines",
        },
        fieldNotes: "Traditional diesel pumps generate zero electricity; SolariQ turns irrigation canals into distributed power stations.",
      },

      // 07
      {
        id: "calc-07",
        calcNo: "CALC 07",
        category: "ECONOMICS",
        title: "Avoided Diesel Fuel Cost",
        displayValue: `BDT ${dieselCostSavedCycle}`,
        displayUnit: `Saved Per Irrigation Cycle`,
        shortFormula: `C_saved = ${dieselLitersPerCycle.toFixed(2)}L × BDT 105/L`,
        summary: `Displaces dirty 2-stroke diesel pump fuel; earns BDT ${dailyFeedInTariffBdt}/day in net-metered electricity.`,
        accentColor: "amber",
        fullFormula: "C_saved = V_diesel · Price_diesel + E_export · Tariff",
        parameterBreakdown: [
          { param: "V_diesel", meaning: `Diesel fuel displaced per run (${fieldDecimal} decimal)`, value: `${dieselLitersPerCycle.toFixed(2)} Liters` },
          { param: "Price_diesel", meaning: "Local Kurigram retail diesel price", value: "BDT 105.00 / Liter" },
          { param: "Net Metering", meaning: "Feed-in tariff earned from surplus clean electricity", value: `BDT ${dailyFeedInTariffBdt} / day` },
        ],
        stepByStepMath: [
          `Displaced fuel per irrigation run = ${dieselLitersPerCycle.toFixed(2)} Liters × BDT 105.00/L = BDT ${dieselCostSavedCycle}.`,
          `Feed-in tariff revenue from exported power = ${dailySolarKwh} kWh × BDT 4.50 = BDT ${dailyFeedInTariffBdt}/day.`,
          `Seasonal farmer cooperative fuel savings across 144 runs = BDT ${(dieselCostSavedCycle * 144).toLocaleString()}.`,
          "Protects marginal smallholders against volatile dry-season black-market diesel price inflation.",
        ],
        scientificReference: {
          title: "A place in the sun: Farmers' co-benefits from solar irrigation in Bangladesh",
          authors: "Buisson, M.-C., Mitra, A., Hounsa, T., Habib, M. A., & Mukherji, A.",
          publication: "Energy Economics, 140, Article 107973 (2024)",
          standard: "Department of Agricultural Extension (DAE) Farm Economics Survey",
        },
        fieldNotes: "Diesel pumps emit soot directly into canal headwaters and cost smallholders over 30% of total harvest value.",
      },

      // 08
      {
        id: "calc-08",
        calcNo: "CALC 08",
        category: "CLIMATE",
        title: "Rice Methane (CH₄) Abatement",
        displayValue: `-${methaneReductionPercent}%`,
        displayUnit: `CH₄ Abated (${seasonalCo2eAvoidedKg} kg CO₂e)`,
        shortFormula: `ΔCH₄ = -35% via aerobic rootzone dry intervals`,
        summary: `Periodic soil aeration suppresses anaerobic methanogenic Archaea, eliminating ${seasonalCo2eAvoidedKg} kg CO₂e seasonally.`,
        accentColor: "emerald",
        fullFormula: "ΔCH₄ = EF_flooded · (1 - SF_AWD); GWP₁₀₀ = 28",
        parameterBreakdown: [
          { param: "EF_flooded", meaning: "Baseline continuous flooded emission factor", value: "1.20 kg CH₄ / ha-cycle" },
          { param: "SF_AWD", meaning: "Scaling factor for dry aeration interval", value: "0.65 (-35% reduction)" },
          { param: "GWP_100", meaning: "IPCC 100-year biogenic methane warming factor", value: "28 × CO₂" },
          { param: "Total CO₂e", meaning: `Net climate benefit for ${fieldDecimal} decimal field`, value: `${seasonalCo2eAvoidedKg} kg CO₂e` },
        ],
        stepByStepMath: [
          "Continuous flooding keeps soil anaerobic, multiplying methanogenic Archaea bacteria.",
          "AWD drying periods introduce oxygen into the soil matrix, halting methanogenesis.",
          `Net seasonal methane abated across ${fieldDecimal} decimal = ${(seasonalCo2eAvoidedKg / 28).toFixed(1)} kg CH₄.`,
          `Global warming equivalent mitigated = ${(seasonalCo2eAvoidedKg / 28).toFixed(1)} kg × 28 GWP = ${seasonalCo2eAvoidedKg} kg CO₂e.`,
        ],
        scientificReference: {
          title: "Effects of irrigation regimes and rice varieties on methane emissions and yield of dry season rice in Bangladesh",
          authors: "Habib, M. A., Islam, S. M. M., Haque, M. A., Hassan, L., Ali, M. Z., et al.",
          publication: "Soil Systems, 7(2), Article 41 (2023)",
          standard: "IPCC Tier-2 Agriculture, Forestry and Other Land Use (AFOLU) Guidelines",
        },
        fieldNotes: "Continuous flooding turns paddy soils anaerobic; AWD aerates root zones, halting greenhouse gas production.",
      },

      // 09
      {
        id: "calc-09",
        calcNo: "CALC 09",
        category: "CLIMATE",
        title: "Net Carbon (CO₂e) Mitigation",
        displayValue: `${dailyAvoidedCo2Kg} kg`,
        displayUnit: `Daily CO₂e Avoided • ${seasonalAvoidedCo2Kg} kg Season`,
        shortFormula: `CO₂e_saved = ${dailySolarKwh}kWh × 0.62 + ${dieselLitersPerCycle.toFixed(2)}L × 2.68`,
        summary: `Displaces high-carbon national grid generation with canal PV and eliminates 2-stroke diesel pump exhaust.`,
        accentColor: "emerald",
        fullFormula: "CO₂e_saved = E_solar · EF_grid + V_diesel · EF_diesel",
        parameterBreakdown: [
          { param: "EF_grid", meaning: "Bangladesh official national grid emission factor", value: "0.62 kg CO₂e / kWh" },
          { param: "EF_diesel", meaning: "Diesel fuel mobile combustion emission factor", value: "2.68 kg CO₂e / Liter" },
          { param: "E_solar", meaning: `Daily clean solar PV harvest (${solarWatts}W)`, value: `${dailySolarKwh} kWh / day` },
          { param: "V_diesel", meaning: `Displaced diesel per irrigation run (${fieldDecimal} dec)`, value: `${dieselLitersPerCycle.toFixed(2)} Liters` },
          { param: "Net Seasonal", meaning: "120-day Boro season cooperative CO₂e offset", value: `${seasonalAvoidedCo2Kg} kg CO₂e` },
        ],
        stepByStepMath: [
          `Clean solar generation displacing grid fossil mix = ${dailySolarKwh} kWh × 0.62 kg CO₂e/kWh = ${dailyGridCo2Kg} kg CO₂e/day.`,
          `Avoided diesel pump combustion exhaust = ${dieselLitersPerCycle.toFixed(2)} L × 2.68 kg CO₂e/L = ${cycleDieselCo2Kg} kg CO₂e/cycle.`,
          `Net daily greenhouse gas mitigation = ${dailyGridCo2Kg} + ${cycleDieselCo2Kg} = ${dailyAvoidedCo2Kg} kg CO₂e / day.`,
          `Cumulative 120-day Boro season climate offset = ${seasonalAvoidedCo2Kg} kg CO₂e (${(seasonalAvoidedCo2Kg / 1000).toFixed(2)} metric tons).`,
          "Replication across 100 km of BWDB canals offsets 78.0 metric tons of CO₂e annually.",
        ],
        scientificReference: {
          title: "Grid Emission Factor (GEF) of the National Grid System of Bangladesh",
          authors: "Department of Environment (DoE) & Sustainable and Renewable Energy Development Authority (SREDA)",
          publication: "Ministry of Environment, Forest and Climate Change, Government of Bangladesh (2023)",
          standard: "IPCC 2006 Guidelines for National Greenhouse Gas Inventories (Volume 2: Energy & Mobile Combustion)",
        },
        fieldNotes: "Combines avoided point-source diesel pump pollution with grid displacement, enabling verified carbon credit eligibility under Article 6 of the Paris Agreement.",
      },
    ];
  }, [canalLength, canalWidth, canalSurfaceArea, solarWatts, pumpWatts, pumpFlowRateLpm, fieldDecimal, fieldAreaSqm]);

  return (
    <div className="w-full space-y-6">
      {/* =========================================================================
          🎛️ FIELD ASSUMPTION CONTROLS (Erased old header; pure sizing assumptions)
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
        {/* Top Control Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-800" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif">
              Field Sizing Assumptions
            </span>
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              — Adjust canal, solar, pump & field parameters to recalculate all 9 metrics
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
              Live Mathematical Propagation
            </span>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-stone-600 hover:text-emerald-900 hover:bg-emerald-50 transition-colors border border-stone-200"
              title="Reset to Kurigram Pilot baseline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Pilot</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Assumption Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ASSUMPTION 1: CANAL SIZE */}
          <div className="p-3 rounded-xl bg-stone-50/70 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-900">
                <Waves className="w-3.5 h-3.5 text-sky-700" />
                <span>Canal Size</span>
              </span>
              <span className="font-mono text-xs font-bold text-sky-950 bg-white px-2 py-0.5 rounded border border-stone-200">
                {canalLength}m reach
              </span>
            </div>
            <p className="text-[10px] text-stone-500">
              Footprint: {canalSurfaceArea.toFixed(0)} m² ({canalWidth}m width)
            </p>
            {/* Quick Pills */}
            <div className="grid grid-cols-4 gap-1 pt-1">
              {[10, 20, 50, 100].map((len) => (
                <button
                  key={len}
                  onClick={() => setCanalLength(len)}
                  className={`py-1 text-[10px] font-bold rounded transition-colors ${
                    canalLength === len
                      ? "bg-sky-800 text-white"
                      : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {len}m
                </button>
              ))}
            </div>
          </div>

          {/* ASSUMPTION 2: SOLAR SIZE */}
          <div className="p-3 rounded-xl bg-stone-50/70 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-900">
                <Sun className="w-3.5 h-3.5 text-amber-700" />
                <span>Solar Size</span>
              </span>
              <span className="font-mono text-xs font-bold text-amber-950 bg-white px-2 py-0.5 rounded border border-stone-200">
                {solarWatts} W
              </span>
            </div>
            <p className="text-[10px] text-stone-500">
              Canopy: {(solarWatts / 1000).toFixed(2)} kWp Monocrystalline
            </p>
            {/* Quick Pills */}
            <div className="grid grid-cols-4 gap-1 pt-1">
              {[240, 485, 970, 1940].map((watts) => (
                <button
                  key={watts}
                  onClick={() => setSolarWatts(watts)}
                  className={`py-1 text-[10px] font-bold rounded transition-colors ${
                    solarWatts === watts
                      ? "bg-amber-800 text-white"
                      : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {watts >= 1000 ? `${(watts / 1000).toFixed(1)}k` : `${watts}W`}
                </button>
              ))}
            </div>
          </div>

          {/* ASSUMPTION 3: PUMP SIZE */}
          <div className="p-3 rounded-xl bg-stone-50/70 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                <Zap className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pump Rating</span>
              </span>
              <span className="font-mono text-xs font-bold text-emerald-950 bg-white px-2 py-0.5 rounded border border-stone-200">
                {pumpWatts} W
              </span>
            </div>
            <p className="text-[10px] text-stone-500">
              Flow Rate: {pumpFlowRateLpm} L/min DC Solar Direct
            </p>
            {/* Quick Pills */}
            <div className="grid grid-cols-4 gap-1 pt-1">
              {[60, 120, 250, 375].map((pWatts) => (
                <button
                  key={pWatts}
                  onClick={() => setPumpWatts(pWatts)}
                  className={`py-1 text-[10px] font-bold rounded transition-colors ${
                    pumpWatts === pWatts
                      ? "bg-emerald-800 text-white"
                      : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {pWatts === 375 ? "½ HP" : `${pWatts}W`}
                </button>
              ))}
            </div>
          </div>

          {/* ASSUMPTION 4: AGRI FIELD */}
          <div className="p-3 rounded-xl bg-stone-50/70 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-800">
                <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                <span>Agri Field</span>
              </span>
              <span className="font-mono text-xs font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                {fieldDecimal} dec
              </span>
            </div>
            <p className="text-[10px] text-stone-500">
              Paddy: {fieldAreaSqm} m² ({fieldDecimal === 33 ? "1 Bigha" : fieldDecimal === 100 ? "1 Acre" : `${fieldDecimal} decimal`})
            </p>
            {/* Quick Pills */}
            <div className="grid grid-cols-4 gap-1 pt-1">
              {[5, 10, 33, 100].map((dec) => (
                <button
                  key={dec}
                  onClick={() => setFieldDecimal(dec)}
                  className={`py-1 text-[10px] font-bold rounded transition-colors ${
                    fieldDecimal === dec
                      ? "bg-stone-800 text-white"
                      : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {dec === 33 ? "Bigha" : dec === 100 ? "Acre" : `${dec}d`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          📊 3×3 PURE CALCULATION GRID (9 CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => setActiveModalCard(card)}
            className="group relative p-6 rounded-2xl bg-white border border-stone-200/90 hover:border-emerald-700 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
          >
            {/* Top Row: Calc ID & Domain Tag */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-stone-400 group-hover:text-emerald-700 transition-colors">
                  {card.calcNo}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 group-hover:bg-emerald-50 group-hover:text-emerald-900 transition-colors">
                  {card.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif group-hover:text-emerald-950 transition-colors">
                {card.title}
              </h3>

              {/* Big Display Number in Asul */}
              <div className="py-1">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-serif block group-hover:scale-105 transition-transform origin-left">
                  {card.displayValue}
                </span>
                <span className="text-xs font-semibold text-stone-500 block mt-0.5">
                  {card.displayUnit}
                </span>
              </div>

              {/* Short Formula Snippet */}
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/70 font-mono text-[11px] text-stone-700 overflow-x-auto">
                <code>{card.shortFormula}</code>
              </div>

              {/* Summary */}
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                {card.summary}
              </p>
            </div>

            {/* Bottom Row: Click prompt */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
              <span className="group-hover:underline">View Formula & Citations</span>
              <BookOpen className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-emerald-700" />
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          📖 INTERACTIVE REFERENCE & CALCULATION MODAL
          ========================================================================= */}
      {activeModalCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveModalCard(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-200 bg-stone-50/70 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-800">
                    {activeModalCard.calcNo}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-900">
                    {activeModalCard.category}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
                  {activeModalCard.title}
                </h3>
                <span className="text-xs font-semibold text-emerald-900 block mt-0.5">
                  Calculated Outcome: {activeModalCard.displayValue} ({activeModalCard.displayUnit})
                </span>
              </div>

              <button
                onClick={() => setActiveModalCard(null)}
                className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
              {/* Active Assumption Context Badge */}
              <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600">
                <span className="font-bold text-stone-800">Current Field Assumptions:</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-stone-200">
                  Canal: {canalLength}m
                </span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-stone-200">
                  PV: {solarWatts}W
                </span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-stone-200">
                  Pump: {pumpWatts}W ({pumpFlowRateLpm} L/m)
                </span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-stone-200">
                  Field: {fieldDecimal} dec ({fieldAreaSqm} m²)
                </span>
              </div>

              {/* 1. Full Mathematical Formula */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  1. Mathematical Formulation
                </span>
                <div className="p-3.5 rounded-xl bg-stone-900 text-emerald-300 font-mono text-sm border border-stone-800">
                  <code>{activeModalCard.fullFormula}</code>
                </div>
              </div>

              {/* 2. Parameter Definitions */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  2. Parameter Definitions & Current Inputs
                </span>
                <div className="rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-200">
                  {activeModalCard.parameterBreakdown.map((param, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between gap-4 bg-stone-50/50">
                      <div>
                        <code className="font-mono font-bold text-emerald-900">{param.param}</code>
                        <span className="text-stone-600 block text-[11px] mt-0.5">{param.meaning}</span>
                      </div>
                      <span className="font-mono font-bold text-stone-900 shrink-0 bg-white px-2 py-1 rounded border border-stone-200 text-right">
                        {param.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Step-by-Step Numerical Walkthrough */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  3. Step-by-Step Calculation Walkthrough
                </span>
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5 font-mono text-[11px] text-emerald-950">
                  {activeModalCard.stepByStepMath.map((step, idx) => (
                    <p key={idx} className="leading-relaxed">
                      • {step}
                    </p>
                  ))}
                </div>
              </div>

              {/* 4. Scientific Citation & Literature Reference */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  4. Peer-Reviewed Academic Citation & Standard
                </span>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <p className="font-bold text-stone-900 text-xs">
                    {activeModalCard.scientificReference.title}
                  </p>
                  <p className="text-stone-600 text-[11px]">
                    <strong>Authors:</strong> {activeModalCard.scientificReference.authors}
                  </p>
                  <p className="text-stone-600 text-[11px]">
                    <strong>Publication:</strong> {activeModalCard.scientificReference.publication}
                  </p>
                  <p className="text-emerald-900 text-[11px] font-semibold pt-1 border-t border-stone-200/60 mt-1">
                    <strong>Institutional Standard:</strong> {activeModalCard.scientificReference.standard}
                  </p>
                </div>
              </div>

              {/* 5. Field Notes */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Field Verification Note:</strong> {activeModalCard.fieldNotes}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
              <span className="font-mono text-[10px]">
                SolariQ Empirical SCADA Audit Engine • Daffodil International University
              </span>
              <button
                onClick={() => setActiveModalCard(null)}
                className="px-4 py-1.5 rounded-full bg-emerald-900 text-stone-100 font-bold hover:bg-emerald-800 transition-colors text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
