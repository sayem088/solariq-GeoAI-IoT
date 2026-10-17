import math
from dataclasses import dataclass, field
from datetime import date
from typing import Dict, List, Optional, Tuple


@dataclass
class GeoCoordinate:
    latitude: float
    longitude: float
    elevation_m: float = 24.0

    def distance_to(self, other: "GeoCoordinate") -> float:
        r_earth = 6371000.0
        phi1 = math.radians(self.latitude)
        phi2 = math.radians(other.latitude)
        delta_phi = math.radians(other.latitude - self.latitude)
        delta_lambda = math.radians(other.longitude - self.longitude)

        a = (
            math.sin(delta_phi / 2.0) ** 2
            + math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2)
        )
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return r_earth * c


@dataclass
class DailyAgroWeather:
    date_recorded: str
    temp_max_c: float
    temp_min_c: float
    temp_mean_c: float
    solar_radiation_wm2: float
    relative_humidity_pct: float
    wind_speed_ms: float
    rainfall_mm: float


@dataclass
class CadastralPlot:
    plot_id: str
    farmer_name: str
    centroid: GeoCoordinate
    boundary_polygon: List[Tuple[float, float]]
    area_decimals: float = 10.0
    crop_type: str = "Boro Rice (BRRI dhan-28)"
    crop_stage: str = "Panicle Initiation"
    kc_coefficient: float = 1.28
    percolation_rate_mm_day: float = 2.5
    water_level_cm: float = 2.0
    awd_threshold_cm: float = -15.0
    irrigation_target_cm: float = 4.0

    @property
    def area_sq_meters(self) -> float:
        return self.area_decimals * 40.4686

    def compute_water_deficit_liters(self) -> float:
        if self.water_level_cm >= self.irrigation_target_cm:
            return 0.0
        depth_deficit_mm = (self.irrigation_target_cm - self.water_level_cm) * 10.0
        return depth_deficit_mm * self.area_sq_meters


@dataclass
class CanalSolarPumpStation:
    station_id: str
    location: GeoCoordinate
    pv_capacity_kwp: float = 10.0
    pump_rated_power_kw: float = 3.75
    discharge_rate_lps: float = 18.0
    pipe_internal_diameter_mm: float = 100.0
    pipe_roughness_c: float = 140.0


class SolariQGeoAIEngine:
    def __init__(self, pump_station: CanalSolarPumpStation):
        self.pump_station = pump_station

    def calculate_extraterrestrial_radiation(self, latitude_deg: float, day_of_year: int) -> float:
        phi = math.radians(latitude_deg)
        dr = 1.0 + 0.033 * math.cos(2.0 * math.pi * day_of_year / 365.0)
        delta = 0.409 * math.sin(2.0 * math.pi * day_of_year / 365.0 - 1.39)
        ws = math.acos(-math.tan(phi) * math.tan(delta))

        ra = (
            (24.0 * 60.0 / math.pi)
            * 0.0820
            * dr
            * (ws * math.sin(phi) * math.sin(delta) + math.cos(phi) * math.cos(delta) * math.sin(ws))
        )
        return max(0.0, ra)

    def calculate_fao56_penman_et0(
        self, coord: GeoCoordinate, weather: DailyAgroWeather, day_of_year: int
    ) -> float:
        temp_mean = weather.temp_mean_c
        u2 = weather.wind_speed_ms
        rh = weather.relative_humidity_pct

        p_kpa = 101.3 * math.pow((293.0 - 0.0065 * coord.elevation_m) / 293.0, 5.26)
        gamma = 0.000665 * p_kpa

        e0_max = 0.6108 * math.exp(17.27 * weather.temp_max_c / (weather.temp_max_c + 237.3))
        e0_min = 0.6108 * math.exp(17.27 * weather.temp_min_c / (weather.temp_min_c + 237.3))
        es = (e0_max + e0_min) / 2.0
        ea = es * (rh / 100.0)

        delta = 4098.0 * (0.6108 * math.exp(17.27 * temp_mean / (temp_mean + 237.3))) / math.pow(temp_mean + 237.3, 2)

        rs_mj = weather.solar_radiation_wm2 * 0.0864
        rns = (1.0 - 0.23) * rs_mj
        rn = rns * 0.7

        numerator = 0.408 * delta * rn + gamma * (900.0 / (temp_mean + 273.0)) * u2 * (es - ea)
        denominator = delta + gamma * (1.0 + 0.34 * u2)

        et0 = numerator / denominator
        return max(1.5, min(8.0, et0))

    def calculate_hydraulic_friction_loss(self, plot: CadastralPlot) -> Tuple[float, float]:
        distance_m = self.pump_station.location.distance_to(plot.centroid)
        q_m3s = self.pump_station.discharge_rate_lps / 1000.0
        d_m = self.pump_station.pipe_internal_diameter_mm / 1000.0
        c = self.pump_station.pipe_roughness_c

        head_loss_m = 10.67 * math.pow(q_m3s / c, 1.852) * (distance_m / math.pow(d_m, 4.87))
        return distance_m, head_loss_m

    def update_soil_water_balance(self, plot: CadastralPlot, weather: DailyAgroWeather, day_of_year: int) -> float:
        et0_mm = self.calculate_fao56_penman_et0(plot.centroid, weather, day_of_year)
        etc_mm = et0_mm * plot.kc_coefficient
        total_daily_loss_mm = etc_mm + plot.percolation_rate_mm_day

        net_water_change_mm = weather.rainfall_mm - total_daily_loss_mm
        plot.water_level_cm += (net_water_change_mm / 10.0)
        return et0_mm

    def evaluate_awd_dispatch(self, plot: CadastralPlot) -> Optional[Dict]:
        if plot.water_level_cm > plot.awd_threshold_cm:
            return None

        water_needed_liters = plot.compute_water_deficit_liters()
        distance_m, head_loss_m = self.calculate_hydraulic_friction_loss(plot)

        runtime_seconds = math.ceil(water_needed_liters / self.pump_station.discharge_rate_lps)

        return {
            "plot_id": plot.plot_id,
            "farmer_name": plot.farmer_name,
            "centroid": {
                "lat": plot.centroid.latitude,
                "lon": plot.centroid.longitude,
            },
            "hydraulic_distance_m": round(distance_m, 1),
            "friction_head_loss_m": round(head_loss_m, 2),
            "water_level_cm": round(plot.water_level_cm, 2),
            "water_deficit_liters": round(water_needed_liters, 1),
            "runtime_seconds": runtime_seconds,
            "iot_payload": {
                "deviceId": "work-demo-01",
                "action": "run_motor",
                "grid": int(plot.plot_id.replace("PLOT-", "")),
                "durationSeconds": runtime_seconds,
                "targetLandCentroid": f"{plot.centroid.latitude},{plot.centroid.longitude}",
                "awdEvent": "REFLOOD_TO_TARGET",
            },
        }
