from flask import Flask, render_template, request, jsonify

# 1. Importar los módulos que creaste
from modules.explainer import analizar_y_explicar
from modules.database import init_db, guardar_pedido
from modules.database import guardar_pedido

app = Flask(__name__)


# 2. Inicializar la base de datos al arrancar el servidor
try:
    init_db()
    print("Base de datos conectada y tabla verificada.")
except Exception as e:
    print(f"Advertencia: No se pudo conectar a la base de datos: {e}")

# Ruta principal (Tu página web)
@app.route('/')
def index():
    return render_template('main.html')

@app.route('/perfil')
def perfil():
    return render_template('perfil.html') # O la vista que corresponda

@app.route('/config')
def config():
    return render_template('config.html') # O la vista que corresponda

# 3. Ruta API para que el mapa se comunique con Gemini y TigerData
@app.route('/api/evaluar', methods=['POST'])
def evaluar_pedido():
    try:
        # Extraer los datos enviados por el frontend
        datos = request.json
        distancia = datos.get("distancia_km")
        tarifa = datos.get("tarifa_mxn")
        trafico = datos.get("trafico", "Moderado")

        # Invocar a la IA (Gemini)
        resultado_ia = analizar_y_explicar(distancia, tarifa, trafico)
        decision = resultado_ia["decision"]
        explicacion = resultado_ia["explicacion"]

        # Guardar el registro en PostgreSQL (TigerData)
        guardar_pedido(distancia, tarifa, trafico, decision, explicacion)

        # Enviar la respuesta de vuelta al mapa
        return jsonify({
            "status": "success",
            "decision": decision,
            "explicacion": explicacion
        })

    except Exception as e:
        print(f"Error procesando el pedido: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Usar el puerto 5000 por defecto, accesible desde cualquier IP
    app.run(host='0.0.0.0', port=5000, debug=True)
