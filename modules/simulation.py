import random
from modules.contract import Coordinates, OrderContract, AgentStateContract, TickResponse
from modules.optimizer import MONTERREY_POIS, haversine_distance_km, move_towards

class ShiftSimulator:
    def __init__(self, shift_duration_minutes=360):
        self.tick_count = 0
        self.tick_seconds = 30 # Cada tick simula 30 segundos
        self.shift_duration_minutes = shift_duration_minutes
        
        # Posición inicial del repartidor Baseline (Centro de Monterrey)
        self.baseline_pos = Coordinates(lat=25.6866, lon=-100.3161)
        self.baseline_gross = 0.0
        self.baseline_fuel = 0.0
        self.baseline_status = "IDLE" # IDLE | TO_PICKUP | TO_DROPOFF
        self.baseline_active_order = None
        
        self.available_orders = []
        self._generate_initial_orders(count=20)

    def _generate_initial_orders(self, count=20):
        for i in range(count):
            p1, p2 = random.sample(MONTERREY_POIS, 2)
            dist = haversine_distance_km(p1["lat"], p1["lon"], p2["lat"], p2["lon"])
            payout = round(35.0 + (dist * 12.0) + random.uniform(5, 20), 2)
            
            self.available_orders.append(OrderContract(
                id=f"ORD-{100 + i}",
                pickup=Coordinates(lat=p1["lat"], lon=p1["lon"]),
                dropoff=Coordinates(lat=p2["lat"], lon=p2["lon"]),
                payout_mxn=payout,
                prep_time_minutes=random.randint(3, 10),
                time_limit_minutes=45
            ))

    def step(self) -> TickResponse:
        self.tick_count += 1
        elapsed_minutes = int((self.tick_count * self.tick_seconds) / 60)
        remaining_minutes = max(0, self.shift_duration_minutes - elapsed_minutes)

        # LÓGICA DEL AGENTE BASELINE (FIFO - Toma el primer pedido disponible)
        if self.baseline_status == "IDLE" and self.available_orders:
            self.baseline_active_order = self.available_orders.pop(0)
            self.baseline_status = "TO_PICKUP"

        if self.baseline_active_order:
            order = self.baseline_active_order
            if self.baseline_status == "TO_PICKUP":
                target = order.pickup
                new_lat, new_lon = move_towards(self.baseline_pos.lat, self.baseline_pos.lon, target.lat, target.lon, speed_kmh=30, tick_seconds=self.tick_seconds)
                
                # Consumo de combustible (35 km/L, $24.50 MXN/L)
                dist_moved = haversine_distance_km(self.baseline_pos.lat, self.baseline_pos.lon, new_lat, new_lon)
                self.baseline_fuel += (dist_moved / 35.0) * 24.50
                
                self.baseline_pos = Coordinates(lat=new_lat, lon=new_lon)
                if new_lat == target.lat and new_lon == target.lon:
                    self.baseline_status = "TO_DROPOFF"

            elif self.baseline_status == "TO_DROPOFF":
                target = order.dropoff
                new_lat, new_lon = move_towards(self.baseline_pos.lat, self.baseline_pos.lon, target.lat, target.lon, speed_kmh=30, tick_seconds=self.tick_seconds)
                
                dist_moved = haversine_distance_km(self.baseline_pos.lat, self.baseline_pos.lon, new_lat, new_lon)
                self.baseline_fuel += (dist_moved / 35.0) * 24.50
                
                self.baseline_pos = Coordinates(lat=new_lat, lon=new_lon)
                if new_lat == target.lat and new_lon == target.lon:
                    self.baseline_gross += order.payout_mxn
                    self.baseline_status = "IDLE"
                    self.baseline_active_order = None

        # Por ahora el Smart Agent clona la estructura mientras se desarrolla en la Fase 2
        agent_baseline = AgentStateContract(
            agent_id="baseline_courier",
            coords=self.baseline_pos,
            status=self.baseline_status,
            active_orders=[self.baseline_active_order.id] if self.baseline_active_order else [],
            gross_earnings=round(self.baseline_gross, 2),
            fuel_spent_mxn=round(self.baseline_fuel, 2),
            net_earnings=round(self.baseline_gross - self.baseline_fuel, 2),
            current_path=[]
        )

        return TickResponse(
            tick=self.tick_count,
            shift_elapsed_minutes=elapsed_minutes,
            shift_remaining_minutes=remaining_minutes,
            baseline_agent=agent_baseline,
            smart_agent=agent_baseline, # Temporal
            available_orders=self.available_orders[:5],
            latest_explanation="Agente Baseline ejecutando estrategia por orden de llegada (FIFO)."
        )
