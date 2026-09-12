import os
import google.generativeai as genai
from dotenv import load_dotenv

# Cargar las variables de entorno (tu API Key)
load_dotenv()

# Configurar Gemini con la llave del .env
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("No se encontró la variable GEMINI_API_KEY en el archivo .env")

genai.configure(api_key=api_key)

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
        # gemini-1.5-flash es el modelo ideal por su rapidez y bajo costo en operaciones de texto
        model = genai.GenerativeModel('gemini-3.8-flash')
        respuesta = model.generate_content(prompt)
        return respuesta.text
    except Exception as e:
        return f"Error al consultar al Agente: {str(e)}"

# Bloque de prueba (solo se ejecuta si corres este archivo directamente)
if __name__ == "__main__":
    print("Iniciando simulación de prueba en Monterrey...\n")
    
    # Prueba 1: Un viaje que debería ser rentable
    print("Prueba 1: Viaje corto, buen pago")
    resultado1 = analizar_ruta(3.5, 85.00, "Tráfico ligero en Morones Prieto", "Despejado")
    print(resultado1)
    print("-" * 40)
    
    # Prueba 2: Un viaje que probablemente no vale la pena
    print("Prueba 2: Viaje largo, bajo pago, mal clima")
    resultado2 = analizar_ruta(15.2, 40.00, "Tráfico pesado en Gonzalitos", "Lluvia intensa")
    print(resultado2)
