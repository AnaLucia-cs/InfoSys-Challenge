import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_explanation(decision, payout, distance, weather="soleado"):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        Eres la IA de un repartidor en Monterrey. Explica en máximo 20 palabras esta decisión:
        Acción: {decision}
        Pago: ${payout} MXN
        Distancia: {distance} km
        Clima: {weather}
        """
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Decisión {decision}: Rentabilidad evaluada por margen de costo-beneficio."
