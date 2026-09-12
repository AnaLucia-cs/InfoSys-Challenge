from pydantic import BaseModel
from typing import List

class Coordinates(BaseModel):
    lat: float
    lon: float

class AgentState(BaseModel):
    agent_id: str
    coords: Coordinates
    net_earnings: float
    fuel_spent: float

class TickResponse(BaseModel):
    tick: int
    shift_remaining_minutes: int
    baseline_agent: AgentState
    smart_agent: AgentState