import os
from google import genai
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("No se encontró la variable GEMINI_API_KEY en el archivo .env")

# Crear cliente de Gemini
client = genai.Client(api_key=api_key)

def analizar_ruta(distancia_km, tarifa_mxn, trafico, clima):
    """
    Usa Gemini para evaluar si un pedido de entrega es rentable.
    """
    prompt = f"""
    Eres 'The Courier', un asistente de IA experto en logística y optimización de ganancias para repartidores en Monterrey, Nuevo León.
    
    Evalúa la rentabilidad del siguiente pedido para un repartidor en motocicleta:
    - Distancia total: {distancia_km} km
    - Pago ofrecido: ${tarifa_mxn} MXN
    - Tráfico actual: {trafico}
    - Clima actual: {clima}
    
    Toma en cuenta el costo aproximado de la gasolina, el desgaste del vehículo y el tiempo invertido considerando el tráfico y clima de Monterrey.
    
    Responde ÚNICAMENTE con la siguiente estructura:
    VEREDICTO: [ACEPTAR o RECHAZAR]
    RAZÓN: [Justificación breve de máximo 2 líneas]
    """

    try:
        response = client.models.generate_text(
            model="gemini-2.0-flash",
            prompt=prompt
        )
        return response.text
    except Exception as e:
        return f"Error al consultar al Agente: {str(e)}"


# Bloque de prueba
if __name__ == "__main__":
    print("Iniciando simulación de prueba en Monterrey...\n")
    
    print("Prueba 1: Viaje corto, buen pago")
    resultado1 = analizar_ruta(3.5, 85.00, "Tráfico ligero en Morones Prieto", "Despejado")
    print(resultado1)
    print("-" * 40)
    
    print("Prueba 2: Viaje largo, bajo pago, mal clima")
    resultado2 = analizar_ruta(15.2, 40.00, "Tráfico pesado en Gonzalitos", "Lluvia intensa")
    print(resultado2)
