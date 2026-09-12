import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("postgresql://tsdbadmin:Diego-123456789@obyysjbiso.ooxj8jiz1m.tsdb.cloud.timescale.com:34714/tsdb?sslmode=require")

def init_db():
    conn = psycopg2.connect("postgresql://tsdbadmin:Diego-123456789@obyysjbiso.ooxj8jiz1m.tsdb.cloud.timescale.com:34714/tsdb?sslmode=require")
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS telemetry_logs (
            id SERIAL PRIMARY KEY,
            tick INT NOT NULL,
            agent_id VARCHAR(50) NOT NULL,
            lat DOUBLE PRECISION NOT NULL,
            lon DOUBLE PRECISION NOT NULL,
            net_earnings NUMERIC(10, 2) NOT NULL,
            fuel_spent NUMERIC(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    cur.close()
    conn.close()
    print("Tabla 'telemetry_logs' inicializada correctamente.")

if __name__ == "__main__":
    init_db()