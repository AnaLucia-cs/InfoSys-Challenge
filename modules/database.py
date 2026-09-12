import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def init_db():
    """Crea la tabla de telemetría si no existe."""
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        return
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS telemetry_logs (
                id SERIAL PRIMARY KEY,
                tick INT NOT NULL,
                agent_id VARCHAR(50) NOT NULL,
                lat FLOAT NOT NULL,
                lon FLOAT NOT NULL,
                gross_earnings FLOAT NOT NULL,
                fuel_spent FLOAT NOT NULL,
                net_earnings FLOAT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Tabla 'telemetry_logs' verificada en TigerData.")
    except Exception as e:
        print(f"⚠️ Error inicializando TigerData: {e}")

def save_telemetry(tick: int, agent_state):
    """Guarda una captura de telemetría del repartidor."""
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        return
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO telemetry_logs (tick, agent_id, lat, lon, gross_earnings, fuel_spent, net_earnings)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """, (
            tick,
            agent_state.agent_id,
            agent_state.coords.lat,
            agent_state.coords.lon,
            agent_state.gross_earnings,
            agent_state.fuel_spent_mxn,
            agent_state.net_earnings
        ))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"⚠️ Error guardando telemetría: {e}")
