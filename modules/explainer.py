import os
import json
from google import generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def analizar_y_explicar(distancia_km, tarifa_mxn, trafico):
    prompt = f"""
    Eres 'The Courier'. Evalúa este pedido: {distancia_km} km por ${tarifa_mxn} MXN. Tráfico: {trafico}.
    Responde estrictamente en formato JSON con dos claves:
    "decision": "ACEPTAR" o "RECHAZAR"
    "explicacion": "Una justificación de máximo 2 líneas sobre la rentabilidad."
    """
    
    model = genai.GenerativeModel('gemini-3.8-flash')
    respuesta = model.generate_content(prompt)
    
    # Limpiar la respuesta por si Gemini añade formato markdown de código (```json)
    texto_limpio = respuesta.text.replace("```json", "").replace("```", "").strip()
    return json.loads(texto_limpio)
