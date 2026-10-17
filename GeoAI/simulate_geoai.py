import json
import os
import sys
from datetime import date
from typing import List

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

from geoai_core import (
    CadastralPlot,
    CanalSolarPumpStation,
    DailyAgroWeather,
    GeoCoordinate,
    SolariQGeoAIEngine,
)


def load_parcels_from_geojson(filepath: str) -> List[CadastralPlot]:
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    plots = []
    for feature in data["features"]:
        props = feature["properties"]
        geom = feature["geometry"]["coordinates"][0]

        lons = [pt[0] for pt in geom]
        lats = [pt[1] for pt in geom]
        centroid = GeoCoordinate(
            latitude=sum(lats) / len(lats),
            longitude=sum(lons) / len(lons),
        )

        plot = CadastralPlot(
            plot_id=props["plot_id"],
            farmer_name=props["farmer_name"],
            centroid=centroid,
            boundary_polygon=[(pt[1], pt[0]) for pt in geom],
            area_decimals=props.get("area_decimals", 10.0),
            crop_type=props.get("crop_type", "Boro Rice (BRRI dhan-28)"),
            crop_stage=props.get("crop_stage", "Tillering"),
            kc_coefficient=props.get("kc", 1.15),
            water_level_cm=props.get("initial_water_level_cm", 2.0),
        )
        plots.append(plot)

    return plots


def main():
    print("=" * 76)
    print("  SolariQ GeoAI Engine: Coordinate-Driven Agronomic & Hydraulic Simulation")
    print("  Canal Location: Dharla River Irrigation Reach, Kurigram (25.815°N, 89.642°E)")
    print("=" * 76)

    canal_station = CanalSolarPumpStation(
        station_id="CTPV-KURIGRAM-01",
        location=GeoCoordinate(latitude=25.81530, longitude=89.64150, elevation_m=24.0),
        pv_capacity_kwp=10.0,
        pump_rated_power_kw=3.75,
        discharge_rate_lps=18.0,
    )
    print(f"\n[CANAL PUMP STATION] ID: {canal_station.station_id}")
    print(f"  • Coordinate: Lat {canal_station.location.latitude:.5f}° N, Lon {canal_station.location.longitude:.5f}° E")
    print(f"  • Solar Array: {canal_station.pv_capacity_kwp} kWp Canal-Top Dual-Axis Bifacial")
    print(f"  • Pump Discharge: {canal_station.discharge_rate_lps} L/s ({canal_station.pump_rated_power_kw} kW Submersible)")

    current_dir = os.path.dirname(os.path.abspath(__file__))
    parcels_file = os.path.join(current_dir, "kurigram_parcels.json")
    plots = load_parcels_from_geojson(parcels_file)

    engine = SolariQGeoAIEngine(canal_station)

    print("\n" + "-" * 76)
    print("STEP 1: SPATIAL COORDINATE & HYDRAULIC TOPOLOGY ANALYSIS")
    print("-" * 76)
    print(f"{'Plot ID':<8} | {'Farmer Name':<15} | {'Centroid (Lat, Lon)':<23} | {'Distance':<10} | {'Head Loss'}")
    print("-" * 76)
    for plot in plots:
        dist_m, hf_m = engine.calculate_hydraulic_friction_loss(plot)
        coord_str = f"{plot.centroid.latitude:.5f}, {plot.centroid.longitude:.5f}"
        print(f"{plot.plot_id:<8} | {plot.farmer_name:<15} | {coord_str:<23} | {dist_m:>7.1f} m  | {hf_m:>6.2f} m")

    march_daily_weather = [
        DailyAgroWeather(
            date_recorded="2026-03-24",
            temp_max_c=34.2,
            temp_min_c=22.1,
            temp_mean_c=28.1,
            solar_radiation_wm2=885.0,
            relative_humidity_pct=42.0,
            wind_speed_ms=2.1,
            rainfall_mm=0.0,
        ),
        DailyAgroWeather(
            date_recorded="2026-03-25",
            temp_max_c=35.0,
            temp_min_c=22.8,
            temp_mean_c=28.9,
            solar_radiation_wm2=910.0,
            relative_humidity_pct=39.0,
            wind_speed_ms=2.4,
            rainfall_mm=0.0,
        ),
        DailyAgroWeather(
            date_recorded="2026-03-26",
            temp_max_c=35.8,
            temp_min_c=23.4,
            temp_mean_c=29.6,
            solar_radiation_wm2=925.0,
            relative_humidity_pct=37.0,
            wind_speed_ms=2.6,
            rainfall_mm=0.0,
        ),
    ]

    print("\n" + "-" * 76)
    print("STEP 2: COORDINATE-DERIVED FAO-56 PENMAN-MONTEITH EVAPOTRANSPIRATION")
    print("-" * 76)
    day_of_year = 84
    ra_mj = engine.calculate_extraterrestrial_radiation(canal_station.location.latitude, day_of_year)
    et0_sample = engine.calculate_fao56_penman_et0(canal_station.location, march_daily_weather[1], day_of_year)
    print(f"  • Extraterrestrial Solar Radiation (Ra at 25.815°N): {ra_mj:.2f} MJ/m²/day")
    print(f"  • Computed Reference Evapotranspiration (ET0):      {et0_sample:.2f} mm/day")
    print(f"  • Sandy-Loam Soil Infiltration/Percolation Loss:    2.50 mm/day")

    print("\n" + "-" * 76)
    print("STEP 3: MULTI-DAY SOIL WATER BALANCE & AWD DEFICIT TRACKING")
    print("-" * 76)

    dispatched_events = []
    for day_idx, weather in enumerate(march_daily_weather, start=1):
        print(f"\n[DAY {day_idx} — {weather.date_recorded}] Temp: {weather.temp_max_c}°C / {weather.temp_min_c}°C | Solar: {weather.solar_radiation_wm2} W/m²")
        for plot in plots:
            old_level = plot.water_level_cm
            engine.update_soil_water_balance(plot, weather, day_of_year + day_idx)
            delta = plot.water_level_cm - old_level
            status = "AEROBIC DRYING" if plot.water_level_cm > plot.awd_threshold_cm else "CRITICAL DEFICIT!"
            print(f"   {plot.plot_id} ({plot.farmer_name}): {old_level:+5.2f} cm → {plot.water_level_cm:+5.2f} cm (Δ {delta:+.2f} cm) | [{status}]")

            dispatch = engine.evaluate_awd_dispatch(plot)
            if dispatch and plot.plot_id not in [d["plot_id"] for d in dispatched_events]:
                dispatched_events.append(dispatch)

    print("\n" + "=" * 76)
    print("STEP 4: AUTOMATED EDGE-IOT IRRIGATION DISPATCH")
    print("=" * 76)
    if not dispatched_events:
        print("  All parcels currently remain within safe aerobic root aeration thresholds.")
        return

    for event in dispatched_events:
        print(f"\n🚨 [AWD THRESHOLD REACHED: {event['plot_id']} - {event['farmer_name']}]")
        print(f"  • Coordinates:           Lat {event['centroid']['lat']:.5f}° N, Lon {event['centroid']['lon']:.5f}° E")
        print(f"  • Water Table Level:     {event['water_level_cm']} cm (Breached -15.0 cm AWD threshold)")
        print(f"  • Hydraulic Distance:    {event['hydraulic_distance_m']} m from Canal Pump Station")
        print(f"  • Pipeline Head Loss:    {event['friction_head_loss_m']} m friction head")
        print(f"  • Required Water Volume: {event['water_deficit_liters']} Liters (Reflood to +4 cm)")
        print(f"  • Computed Pump Runtime: {event['runtime_seconds']} seconds @ 18 L/s pump discharge")
        print("\n  📦 [SYNTHESIZED REST API PAYLOAD FOR /api/iot/device/commands]:")
        print(json.dumps(event["iot_payload"], indent=4))
        print(f"\n  → Dispatched to Hardware NodeMCU ESP8266 (Device: '{event['iot_payload']['deviceId']}')")
        print(f"  → Arduino Nano D2 pin triggers Servo on D9 to close switch for irrigation cycle.")


if __name__ == "__main__":
    main()
