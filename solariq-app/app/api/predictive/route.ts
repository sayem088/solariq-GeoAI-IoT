import { NextResponse } from "next/server";
import { calculateKurigramET0, calculateAvoidedCarbonKg } from "@/lib/kurigramGeoAI";

export async function GET() {
  const et0 = calculateKurigramET0();

  const seasonalProjection = {
    location: "Kurigram, Bangladesh (Dharla / Brahmaputra Basin)",
    period: "March - May 2027 (Pre-Monsoon Dry Boro Season)",
    dailyReferenceET0_mm: et0,
    plotsCluster: {
      plotCount: 6,
      plotSizeDecimal: 10,
      totalAreaDecimal: 60,
      crop: "Boro Rice (BRRI dhan29) under Alternate Wetting and Drying",
    },
    seasonalSavings: {
      waterConservedLiters: 42500,
      cleanGridPowerExportKwh: 385,
      financialSavingsBdt: 5820,
      avoidedCarbonKg: calculateAvoidedCarbonKg(385),
      riceMethaneReductionPercent: 35,
    },
    commercialScale100kWp: {
      canalLengthMeters: 500,
      commandAreaHectares: "6 - 10 ha",
      annualWaterConservedM3: 4658,
      annualGridExportMwh: 114.2,
      annualCooperativeRevenueBdt: 1250000,
      annualAvoidedCarbonTons: 78.0,
    },
  };

  return NextResponse.json(seasonalProjection);
}
