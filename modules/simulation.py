import random
import uuid
from modules.contract import TickResponse, AgentState, Coordinates, OrderContract

class ShiftSimulator:
    def __init__(self):
        self.tick_count = 0
        self.base_lat, self.base_lon = 25.6866, -100.3161
        self.smart_lat, self.smart_lon = 25.6866, -100.3161
        self.target_base = self._random_mty_coord()
        self.target_smart = self._random_mty_coord()

    def _random_mty_coord(self):
        return Coordinates(
            lat=random.uniform(25.6400, 25.7200),
            lon=random.uniform(-100.3800, -100.2800)
        )

    def _move_towards(self, current: float, target: float, step=0.001):
        if abs(current - target) < step: return target
        return current + step if current < target else current - step

    def advance_tick(self) -> TickResponse:
        self.tick_count += 1
        
        self.base_lat = self._move_towards(self.base_lat, self.target_base.lat)
        self.base_lon = self._move_towards(self.base_lon, self.target_base.lon)
        
        self.smart_lat = self._move_towards(self.smart_lat, self.target_smart.lat, step=0.0015)
        self.smart_lon = self._move_towards(self.smart_lon, self.target_smart.lon, step=0.0015)

        if self.base_lat == self.target_base.lat and self.base_lon == self.target_base.lon:
            self.target_base = self._random_mty_coord()
        if self.smart_lat == self.target_smart.lat and self.smart_lon == self.target_smart.lon:
            self.target_smart = self._random_mty_coord()

        return TickResponse(
            tick=self.tick_count,
            shift_remaining_minutes=max(0, 360 - self.tick_count),
            baseline_agent=AgentState(
                agent_id="baseline", coords=Coordinates(lat=self.base_lat, lon=self.base_lon),
                net_earnings=self.tick_count * 2.5, fuel_spent=self.tick_count * 0.5
            ),
            smart_agent=AgentState(
                agent_id="smart", coords=Coordinates(lat=self.smart_lat, lon=self.smart_lon),
                net_earnings=self.tick_count * 4.0, fuel_spent=self.tick_count * 0.3
            )
        )

def generate_batch_of_orders(num_orders=50):
    orders = []
    for _ in range(num_orders):
        pick_lat = random.uniform(25.6400, 25.7200)
        pick_lon = random.uniform(-100.3800, -100.2800)
        drop_lat = pick_lat + random.uniform(-0.02, 0.02)
        drop_lon = pick_lon + random.uniform(-0.02, 0.02)
        payout = round(20.0 + random.uniform(15.0, 60.0), 2)
        
        orders.append(OrderContract(
            id=f"ORD-{uuid.uuid4().hex[:6].upper()}",
            pickup=Coordinates(lat=pick_lat, lon=pick_lon),
            dropoff=Coordinates(lat=drop_lat, lon=drop_lon),
            payout_mxn=payout,
            prep_time_minutes=random.randint(5, 15),
            time_limit_minutes=random.randint(30, 45),
            status="PENDING"
        ))
    return orders
