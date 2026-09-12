import os
from flask import Flask, render_template, jsonify, request
from modules.simulation import ShiftSimulator
from modules.explainer import analizar_y_explicar

app = Flask(__name__)
simulator = ShiftSimulator()

@app.route('/')
def index():
    return render_template('main.html')

@app.route('/api/evaluar', methods=['POST'])
def evaluar_pedido():
    # 1. Recibir los datos del pedido que manda tu mapa
    datos = request.json
    distancia = datos.get("distancia_km")
    tarifa = datos.get("tarifa_mxn")
    trafico = datos.get("trafico", "Moderado") # Moderado por defecto

    # 2. Pasar los datos a tu Agente Gemini
    try:
        resultado_ia = analizar_y_explicar(distancia, tarifa, trafico)
        
        # 3. Enviar la decisión estructurada de vuelta al mapa
        return jsonify({
            "status": "success",
            "decision": resultado_ia["decision"],
            "explicacion": resultado_ia["explicacion"]
        })
    except Exception as e:
        # Por si falla la API de Gemini
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/tick')
def get_tick():
    current_state = simulator.advance_tick()
    return jsonify(current_state.model_dump())


@app.route("/api/pedido/aceptar", methods=["POST"])
def aceptar_pedido():
    datos = request.get_json()
    pedido_id = datos.get("pedido_id")
    lat = datos.get("lat")
    lng = datos.get("lng")

    print("Pedido:", pedido_id)
    print("Latitud:", lat)
    print("Longitud:", lng)

    # Aquí haces lo que necesites:
    # guardar en BD
    # actualizar estado
    # enviar al repartidor, etc.

    return jsonify({
        "ok": True,
        "pedido_id": pedido_id,
        "lat": lat,
        "lng": lng
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


